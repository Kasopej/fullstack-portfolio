'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function PageToolbar({ children }: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setContainer(document.getElementById('page-toolbar'))
  }, [setContainer])

  if (!container) return null

  return createPortal(children, container)
}
