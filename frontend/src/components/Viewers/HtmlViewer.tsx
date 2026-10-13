'use client'
import { useEffect, useRef } from 'react'
import Quill from 'quill'
import hljs from 'highlight.js'
import { IframeBlot } from '../Editors/utils'
import '@/assets/styles/quill/index.css'
import '@/assets/styles/quill/quill-styles.css'

Quill.register(IframeBlot)

type Props = {
  value: string
}
export default function HtmlViewer({ value }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  useEffect(() => {
    if (!containerRef.current) return
    const quill = quillRef.current || new Quill(containerRef.current, {
      readOnly: true,
      modules: {
        syntax: {
          hljs,
        },
      },
    })
    quill.setContents(quill.clipboard.convert({ html: value }))
  }, [value])
  return (
    <div className="html-editor relative">
      <div ref={containerRef} className="min-h-[300px]" />
    </div>
  )
}
