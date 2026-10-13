import { Root } from 'parchment'
import Embed from 'quill/blots/embed'

export class IframeBlot extends Embed {
  static blotName = 'iframe'
  static tagName = 'iframe'
  static className = 'ql-iframe-blot'

  static create(value?: { src: string }): Node {
    const node = super.create(value) as HTMLElement
    node.setAttribute('src', value?.src || '')
    return node
  }

  static formats(node: HTMLElement, _scroll: Root): string | null {
    return node.getAttribute('src')
  }
}
