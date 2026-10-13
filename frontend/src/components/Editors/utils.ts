import Embed from 'quill/blots/embed'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import type { Delta, Op } from 'quill/core'

export function deltaToHtml(ops: Delta['ops']) {
  const converter = new QuillDeltaToHtmlConverter(ops, {
    encodeHtml: true,
  })

  return converter.convert()
}

export const extractFileSrcListFromDelta = (delta: Delta): string[] => {
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

const IFRAME_RESIZE_EDGE_THRESHOLD = 30
const IFRAME_MIN_WIDTH = 120
const IFRAME_MIN_HEIGHT = 80

export class IframeBlot extends Embed {
  static blotName = 'iframe'
  static tagName = 'iframe'
  static className = 'ql-iframe-blot'

  static create(value?: { src: string, width?: string, height?: string }): Node {
    const node = super.create(value) as HTMLElement
    node.setAttribute('src', value?.src || '')
    if (value?.width) {
      node.style.width = value.width
      node.setAttribute('width', value.width)
    }
    if (value?.height) {
      node.style.height = value.height
      node.setAttribute('height', value.height)
    }
    return node
  }

  static formats(node: HTMLElement): Record<string, string> {
    const width = node.style.width || node.getAttribute('width')
    const height = node.style.height || node.getAttribute('height')

    return {
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
    }
  }

  static value(node: HTMLElement): { src: string, width?: string, height?: string } {
    const width = node.style.width || node.getAttribute('width') || undefined
    const height = node.style.height || node.getAttribute('height') || undefined

    return {
      src: node.getAttribute('src') || '',
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
    }
  }

  format(name: string, value: unknown): void {
    if (name === 'width' || name === 'height') {
      const node = this.domNode as HTMLElement
      const dimension = String(value)
      node.style[name] = dimension
      node.setAttribute(name, dimension)
      return
    }

    super.format(name, value)
  }
}

export function isCursorWithinIframeResizeHandle(
  iframe: HTMLElement,
  event: Pick<MouseEvent, 'clientX' | 'clientY'>,
  threshold = IFRAME_RESIZE_EDGE_THRESHOLD,
): boolean {
  const rect = iframe.getBoundingClientRect()
  return (
    event.clientX >= rect.right - threshold
    && event.clientX <= rect.right
    && event.clientY >= rect.bottom - threshold
    && event.clientY <= rect.bottom
  ) || (
    event.clientX <= rect.right + threshold
    && event.clientX >= rect.right
    && event.clientY <= rect.bottom + threshold
    && event.clientY >= rect.bottom
  )
}

function getIframeAtPoint(editor: HTMLElement, event: MouseEvent): HTMLElement | null {
  const iframe = document
    .elementsFromPoint(event.clientX, event.clientY)
    .find(element => (
      element instanceof HTMLElement
      && element.matches('.ql-iframe-blot')
      && editor.contains(element)
    ))

  return iframe instanceof HTMLElement ? iframe : null
}

function clearResizeHover(editor: HTMLElement, iframe: HTMLElement | null): void {
  editor.classList.remove('ql-iframe-resize-hover')
  iframe?.classList.remove('ql-iframe-blot--resize-ready')
}

export function attachIframeBlotResizeHandlers(
  editor: HTMLElement,
  onResizeEnd?: () => void,
): () => void {
  let activeIframe: HTMLElement | null = null
  let resizingIframe: HTMLElement | null = null
  let startX = 0
  let startY = 0
  let startWidth = 0
  let startHeight = 0

  const handleMouseMove = (event: MouseEvent) => {
    if (resizingIframe) return

    if (activeIframe && isCursorWithinIframeResizeHandle(activeIframe, event)) {
      editor.classList.add('ql-iframe-resize-hover')
      activeIframe.classList.add('ql-iframe-blot--resize-ready')
      return
    }

    const iframe = getIframeAtPoint(editor, event)
    const isResizeReady = iframe ? isCursorWithinIframeResizeHandle(iframe, event) : false

    if (activeIframe && activeIframe !== iframe) {
      activeIframe.classList.remove('ql-iframe-blot--resize-ready')
    }

    activeIframe = isResizeReady ? iframe : null

    if (activeIframe) {
      editor.classList.add('ql-iframe-resize-hover')
      activeIframe.classList.add('ql-iframe-blot--resize-ready')
      return
    }

    clearResizeHover(editor, iframe)
  }

  const handleResizeMove = (event: MouseEvent) => {
    if (!resizingIframe) return

    const iframeRect = resizingIframe.getBoundingClientRect()
    const editorRect = editor.getBoundingClientRect()
    const maxWidth = Math.max(IFRAME_MIN_WIDTH, editorRect.right - iframeRect.left)
    const maxHeight = Math.max(IFRAME_MIN_HEIGHT, editorRect.bottom - iframeRect.top)
    const width = Math.min(Math.max(startWidth + event.clientX - startX, IFRAME_MIN_WIDTH), maxWidth)
    const height = Math.min(Math.max(startHeight + event.clientY - startY, IFRAME_MIN_HEIGHT), maxHeight)

    // resizingIframe.style.width = `${width}px`
    resizingIframe.style.height = `${height}px`
    // resizingIframe.setAttribute('width', `${width}px`)
    resizingIframe.setAttribute('height', `${height}px`)
  }

  const handleResizeEnd = () => {
    if (!resizingIframe) return

    resizingIframe.classList.remove('ql-iframe-blot--resizing')
    clearResizeHover(editor, resizingIframe)
    resizingIframe = null
    activeIframe = null
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
    onResizeEnd?.()
  }

  const handleMouseDown = (event: MouseEvent) => {
    if (!activeIframe || !isCursorWithinIframeResizeHandle(activeIframe, event)) return

    event.preventDefault()
    resizingIframe = activeIframe
    const rect = resizingIframe.getBoundingClientRect()
    startX = event.clientX
    startY = event.clientY
    startWidth = rect.width
    startHeight = rect.height

    editor.classList.add('ql-iframe-resize-hover')
    resizingIframe.classList.add('ql-iframe-blot--resizing')
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
  }

  const handleMouseLeave = () => {
    if (!resizingIframe) {
      clearResizeHover(editor, activeIframe)
      activeIframe = null
    }
  }

  editor.addEventListener('mousemove', handleMouseMove)
  editor.addEventListener('mousedown', handleMouseDown)
  editor.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    editor.removeEventListener('mousemove', handleMouseMove)
    editor.removeEventListener('mousedown', handleMouseDown)
    editor.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }
}
