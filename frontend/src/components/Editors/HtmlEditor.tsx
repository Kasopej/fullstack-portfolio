'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useImmer } from 'use-immer'
import Quill from 'quill'
import type { Delta, Op } from 'quill/core'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.min.css'
import 'quill/dist/quill.snow.css'
import './styles/index.css'
import { Loader2Icon } from 'lucide-react'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { dataUriToBlob, deleteFiles, uploadFile } from '@/lib/utils/files/upload'
import { notifyError } from '@/lib/utils/client/errors.utils'

export function deltaToHtml(ops: Delta['ops']) {
  const converter = new QuillDeltaToHtmlConverter(ops, {
    encodeHtml: true,
  })

  return converter.convert()
}

interface PendingFile {
  tempId: string
  file: File
}

interface UploadedFile {
  fileId: string
  tempId: string
  fileUrl: string
  file: File
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: ['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ header: 1 }, { header: 2 }],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ align: [] }],
  ['link', 'image', 'formula'],
  ['clean'],
]

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

const extractFileSrcListFromDelta = (delta: Delta): string[] => {
  const urls: string[] = []
  if (delta && delta.ops) {
    delta.ops.forEach((op: Op) => {
      if (
        op.insert
        && typeof op.insert === 'object'
        && 'image' in op.insert
        && op.insert.image
      ) {
        const fileSrc = op.insert.image
        if (typeof fileSrc === 'string' && fileSrc.startsWith('data')) {
          urls.push(fileSrc)
        }
      }
    })
  }

  return urls
}

let previousFileSourceList: { src: string, tempId: string }[] = []
type Props = {
  onProcessEnd?: (content: string) => void
  presetContent?: string
}
export default function HtmlEditor({ onProcessEnd, presetContent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const [rawDelta, setRawDelta] = useState<Delta | null>(null)

  const [pendingFiles, setPendingFiles] = useImmer<PendingFile[]>([])
  const [uploadedFiles, setUploadedFiles] = useImmer<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadQueueRef = useRef<PendingFile[]>([])

  const processUploadQueue = useDebouncedCallback(async () => {
    if (isUploading || uploadQueueRef.current.length === 0) {
      return
    }

    const aborter = new AbortController()
    setIsUploading(true)

    while (uploadQueueRef.current.length > 0) {
      const batch = uploadQueueRef.current.splice(0, 3)
      setPendingFiles((draft) => {
        batch.forEach((img) => {
          const index = draft.findIndex(p => p.tempId === img.tempId)
          if (index !== -1) {
            draft.splice(index, 1)
          }
        })
      })

      const uploadPromises = batch.map(async (pendingFile) => {
        try {
          const result = await uploadFile(pendingFile.file, aborter.signal)
          return {
            status: 'fulfilled' as const,
            value: { ...result, originalFile: pendingFile.file },
            tempId: pendingFile.tempId,
          }
        }
        catch (error) {
          return {
            status: 'rejected' as const,
            reason: error,
            tempId: pendingFile.tempId,
          }
        }
      })

      Promise.allSettled(uploadPromises).then((results) => {
        setUploadedFiles((draft) => {
          results.forEach((result) => {
            if (
              result.status === 'fulfilled'
              && result.value.status === 'fulfilled'
            ) {
              draft.push({
                fileId: result.value.value.fileId,
                tempId: result.value.tempId,
                fileUrl: result.value.value.fileUrl,
                file: result.value.value.originalFile,
              })
            }
          })
        })
        setIsUploading(false)
      })
    }
  }, 2000)

  const handleFileAdded = useCallback(
    ({ file, tempId }: { file: File, tempId: string }) => {
      const pendingFile: PendingFile = {
        tempId,
        file,
      }

      setPendingFiles((draft) => {
        draft.push(pendingFile)
      })

      uploadQueueRef.current.push(pendingFile)

      processUploadQueue()
    },
    [setPendingFiles, processUploadQueue],
  )

  const handleFilesRemoved = useDebouncedCallback(
    async (removedFileIds: string[]) => {
      if (removedFileIds.length === 0) return

      const filesToDelete = uploadedFiles.filter(f =>
        removedFileIds.includes(f.fileId),
      )

      if (filesToDelete.length === 0) return

      const fileIdsToDelete = filesToDelete.map(f => f.fileId)

      setUploadedFiles((draft) => {
        return draft.filter(f => !removedFileIds.includes(f.fileId))
      })

      try {
        const aborter = new AbortController()
        await deleteFiles(fileIdsToDelete, aborter.signal)
      }
      catch (error) {
        notifyError(error)
      }
    },
    2000,
  )

  useEffect(() => {
    if (!containerRef.current) return

    const quill = quillRef.current || new Quill(containerRef.current, {
      theme: 'snow',
      modules: {
        syntax: {
          hljs,
        },
        toolbar: TOOLBAR_OPTIONS,
      },
      placeholder: 'Start writing...',
    })
    quillRef.current = quill

    quill.on('text-change', (delta: Delta, _oldDelta: Delta, source: string) => {
      if (source !== 'user') return

      const currentContents = quill.getContents()
      const currentFileSourceList = extractFileSrcListFromDelta(currentContents).map((src) => {
        const existing = previousFileSourceList.find(f => f.src === src)
        return {
          src,
          tempId: existing ? existing.tempId : generateId(),
        }
      })

      const removedFileSourceList: { src: string, tempId: string }[] = []
      previousFileSourceList.forEach((prev) => {
        if (!currentFileSourceList.some(f => f.src === prev.src)) {
          removedFileSourceList.push(prev)
        }
      })

      const removedFileIds: string[] = []
      if (removedFileSourceList.length > 0) {
        removedFileSourceList.forEach((fileSrc) => {
          const uploadedFile = uploadedFiles.find(f => f.tempId === fileSrc.tempId)
          if (uploadedFile) {
            removedFileIds.push(uploadedFile.fileId)
          }
        })
        handleFilesRemoved(removedFileIds)
      }

      currentFileSourceList.forEach((fileSrc) => {
        if (previousFileSourceList.some(f => f.src === fileSrc.src)) {
          return
        }
        if (fileSrc.src.startsWith('data:')) {
          const mimeType = fileSrc.src.split(';')[0].split(':')[1] || 'image/png'
          const blob = dataUriToBlob(fileSrc.src)
          const file = new File([blob], `file-${fileSrc.tempId}.${mimeType.split('/')[1]}`, {
            type: mimeType,
          })
          handleFileAdded({ file, tempId: fileSrc.tempId })
        }
      })
      previousFileSourceList = currentFileSourceList
      setRawDelta(currentContents)
    })
    return () => {
      quillRef.current?.off('text-change')
    }
  }, [
    handleFileAdded,
    handleFilesRemoved,
    uploadedFiles,
    presetContent,
  ])

  useEffect(() => {
    if (presetContent) {
      quillRef.current?.setContents(quillRef.current.clipboard.convert({ html: presetContent }))
    }
  }, [presetContent])

  const processContentForOutput = useCallback((delta: Delta) => {
    const updatedOps: Op[] = []
    if (delta && delta.ops) {
      delta.ops.forEach((op: Op) => {
        if (
          op.insert
          && typeof op.insert === 'object'
          && 'image' in op.insert
          && op.insert.image
          && typeof op.insert.image === 'string'
          && op.insert.image.startsWith('data:')
        ) {
          const match = previousFileSourceList.find(f => f.src === (op.insert as { image: string })?.image)
          if (match) {
            const uploaded = uploadedFiles.find(f => f.tempId === match.tempId)
            if (uploaded) {
              op.insert = {
                ...op.insert,
                image: uploaded.fileUrl,
              }
            }
          }
        }
        updatedOps.push(op)
      })
    }
    return deltaToHtml(updatedOps)
  }, [uploadedFiles])

  useEffect(() => {
    if (!isUploading && !pendingFiles.length && rawDelta) {
      const content = processContentForOutput(rawDelta)
      onProcessEnd?.(content)
    }
  }, [isUploading, pendingFiles.length, onProcessEnd, processContentForOutput, rawDelta])

  return (
    <div className="html-editor relative min-h-[300px] max-h-full overflow-auto">
      <div ref={containerRef} className="" />
      {isUploading && <Loader2Icon className="text-primary animate-spin absolute bottom-4 right-4" />}
    </div>
  )
}
