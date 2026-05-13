'use client'
import { useEffect, useRef } from 'react'
import Quill from 'quill'
import hljs from 'highlight.js'

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
