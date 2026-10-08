import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SupabaseClient } from '@supabase/supabase-js'

const publicRoutes = new Set([
  '/dashboard/login',
  '/dashboard/reset-password',
])
const localOnlyRoutes = new Set(['/dashboard/reset-password'])
const isLocalOrigin = (url: URL) => {
  return /localhost:\d/.test(url.origin)
}
export async function proxy(request: NextRequest) {
  const supabase: SupabaseClient = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
  )
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value || ''
  const refreshToken = cookieStore.get('refreshToken')?.value || ''
  const headers = new Headers()
  const pathname = request.nextUrl.pathname
  headers.set('x-nextjs-pathname', pathname)
  if (localOnlyRoutes.has(pathname) && !isLocalOrigin(new URL(pathname))) {
    return NextResponse.error()
  }
  if (publicRoutes.has(pathname)) {
    return NextResponse.next({
      headers,
    })
  }
  if (!token) {
    if (pathname === '/dashboard/login') return NextResponse.next()
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  try {
    const { error } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (error) throw error
    return NextResponse.next({ headers })
  }
  catch (error) {
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    console.error('Error setting user session:', error)
    if (pathname === '/dashboard/login') return NextResponse.next({ headers })
    return NextResponse.redirect(new URL('/dashboard/login', request.url), { headers })
  }
}

export const config = {
  matcher: '/dashboard/:path*',
}
