import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  if (token?.value) return
  if (request.nextUrl.pathname === '/dashboard/login') return
  return NextResponse.redirect(new URL('/dashboard/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
