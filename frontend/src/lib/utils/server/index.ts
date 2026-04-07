import { headers } from 'next/headers'

export async function getServerDevice() {
  const ua = ((await headers()).get('user-agent') || '').toLowerCase()
  const isPhone
    = /iphone|ipod|android.*mobile|windows phone|blackberry|opera mini/.test(ua)
  return isPhone ? 'phone' : 'desktop'
}
