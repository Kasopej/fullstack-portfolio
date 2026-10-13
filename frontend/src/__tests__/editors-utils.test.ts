import { deltaToHtml } from '../components/Editors/utils'

jest.mock('quill/blots/embed', () => ({
  __esModule: true,
  default: class {},
}))

describe('deltaToHtml', () => {
  it('renders an iframe-only document', () => {
    const html = deltaToHtml([
      { insert: { iframe: { src: 'https://example.com/embed' } } },
      { insert: '\n' },
    ])

    const content = document.createElement('div')
    content.innerHTML = html
    expect(content.querySelector('p > iframe')?.getAttribute('src')).toBe('https://example.com/embed')
    expect(content.querySelector('iframe')?.className).toBe('ql-iframe-blot')
  })

  it('preserves resized dimensions, formatted text, and replaced image URLs together', () => {
    const html = deltaToHtml([
      { insert: 'Caption', attributes: { bold: true } },
      { insert: '\n' },
      { insert: { image: 'https://example.com/uploaded.png' } },
      { insert: { iframe: { src: 'https://example.com/embed', width: '400px', height: '200px' } } },
      { insert: '\n' },
    ])

    const content = document.createElement('div')
    content.innerHTML = html
    const iframe = content.querySelector('iframe')
    expect(content.querySelector('strong')?.textContent).toBe('Caption')
    expect(content.querySelector('img')?.getAttribute('src')).toBe('https://example.com/uploaded.png')
    expect(iframe?.getAttribute('width')).toBe('400px')
    expect(iframe?.getAttribute('height')).toBe('200px')
    expect(iframe?.style.width).toBe('400px')
    expect(iframe?.style.height).toBe('200px')
  })

  it('escapes iframe attributes and uses dimension formats when supplied', () => {
    const src = 'https://example.com/embed?q="quoted"&other=value'
    const html = deltaToHtml([
      {
        insert: { iframe: { src, width: '300px', height: '150px' } },
        attributes: { width: '500px', height: '250px' },
      },
      { insert: '\n' },
    ])

    const content = document.createElement('div')
    content.innerHTML = html
    const iframe = content.querySelector('iframe')
    expect(iframe?.getAttribute('src')).toBe(src)
    expect(iframe?.getAttribute('width')).toBe('500px')
    expect(iframe?.getAttribute('height')).toBe('250px')
    expect(iframe?.style.width).toBe('500px')
  })
})
