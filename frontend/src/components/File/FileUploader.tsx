import React, { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckIcon, FileIcon, Loader2Icon } from 'lucide-react'
import { cloneDeep, omit } from 'lodash-es'
import { httpClient } from '@/lib/http/http.client'
import { notifyError } from '@/lib/utils/client/errors.utils'
import { FileDropzone } from './FileDropzone'
import { uploadFile } from '@/lib/utils/files/upload'

type Props = {
  children?: React.ReactNode
  maxSize?: number
  minSize?: number
  accept?: string
  multiple?: boolean
  hidden?: boolean
  noContent?: boolean
  suffix?: React.ReactNode
  onFilesChange?: (files: File[]) => void
  onErrorChange?: (error: string) => void
  canDrop?: boolean
  triggerEl?: (opts: { trigger?: () => void }) => React.ReactNode // Optional trigger
  shouldUpload?: boolean
  fileUrls?: string[]
  value?: File[]
  onUrlChange?: (urls: string[]) => void
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'type' | 'className' | 'onChange' | 'value'>
export function FileUploader({ value, children, maxSize, minSize, accept, multiple = false, hidden = true, noContent, onFilesChange, onErrorChange, canDrop, triggerEl, shouldUpload, fileUrls, onUrlChange, placeholder, suffix, ...props }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(fileUrls || [])
  useEffect(() => {
    if (fileUrls?.length) {
      setUploadedUrls(cloneDeep(fileUrls))
    }
  }, [fileUrls])
  useEffect(() => {
    if (error) {
      onErrorChange?.(error)
    }
  }, [error, onErrorChange])

  function isAcceptedFileType(fileType: string, acceptList: string[]): boolean {
    if (!acceptList.length) return true
    return acceptList.some((accept) => {
      if (accept.endsWith('/*')) {
        const baseType = accept.split('/')[0]
        return fileType.startsWith(`${baseType}/`)
      }
      return fileType === accept
    })
  }
  function validate(files: FileList | null): boolean {
    if (!files || files.length === 0) return false
    if (!multiple && files.length > 1) {
      setError('Only one file can be uploaded at a time.')
      return false
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (maxSize && file.size > maxSize) {
        setError(`File ${file.name} exceeds maximum size of ${maxSize} bytes.`)
        return false
      }
      if (minSize && file.size < minSize) {
        setError(`File ${file.name} is smaller than minimum size of ${minSize} bytes.`)
        return false
      }
      if (!isAcceptedFileType(file.type, accept ? accept.split(',') : [])) {
        setError(`File ${file.name} does not match accepted types: ${accept}.`)
        return false
      }
    }
    return true
  }
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    if (validate(event.target.files)) {
      setError(null)
      onFilesChange?.(files)
      if (shouldUpload) uploadFiles(files)
    }
  }
  async function uploadFiles(files: File[]) {
    setIsLoading(true)
    try {
      const uploadpromises = files.map(async (file) => {
        const response = await uploadFile(file)
        return response.fileUrl
      })
      const urls = (await Promise.all(uploadpromises))
      setUploadedUrls(() => [...urls])
      onUrlChange?.([...urls])
    }
    catch {
      notifyError('File upload failed. Please try again.')
      setError('File upload failed. Please try again.')
    }
    setIsLoading(false)
  }
  const ref = React.useRef<HTMLInputElement>(null)
  const trigger = useCallback(() => {
    ref.current?.click()
  }, [ref])
  return (
    <>
      {triggerEl?.({ trigger }) || (canDrop && <FileDropzone />)}
      <Label className="w-full cursor-pointer">
        {
          children || (!noContent && (
            <div>
              <span className="block mb-2">
                Click
                {triggerEl ? ' or drag ' : ' '}
                files to upload
              </span>
              <span className="typography-2 text-gray-500">
                Accepted formats:
                {' '}
                {accept || 'any'}
              </span>
            </div>
          ))
        }
        {!children && !noContent && isLoading && <Loader2Icon className="animate-spin" />}
        <>
          {!children && !noContent && !isLoading && !!uploadedUrls.length
            && (
              <div className="w-full h-9 flex items-center px-3 py-1 text-start border border-border rounded-md overflow-hidden whitespace-pre-wrap text-ellipsis">
                {uploadedUrls[0]}
                <CheckIcon className="ml-auto text-success" />
              </div>
            )}
          {!children && !isLoading && (noContent || !uploadedUrls.length) && (
            (
              <>
                {
                  !hidden && (
                    <div className="w-full h-9 flex items-center justify-between px-3 py-1 text-start border border-border rounded-md overflow-hidden whitespace-pre-wrap text-ellipsis">
                      {(Number(value?.length) > 1 ? `${value?.length} files` : value?.[0]?.name) || (placeholder && <span className="text-muted-foreground">{placeholder}</span>) || 'Upload file'}
                      {suffix || <FileIcon className="w-6!" />}
                    </div>
                  )
                }
              </>
            )
          )}
          <Input
            {...omit(props, ['value', 'onChange', 'className'])}
            type="file"
            aria-label="file-uploader"
            ref={ref}
            accept={accept}
            multiple={multiple}
            className="hidden"
            wrapperClass="hidden"
            onChange={onChange}
          />
        </>
      </Label>
    </>
  )
}
