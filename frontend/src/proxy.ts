import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SupabaseClient } from '@supabase/supabase-js'

const supabase: SupabaseClient = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
)
export async function proxy(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')
  const refreshToken = cookieStore.get('refreshToken')
  if (!token?.value) {
    if (request.nextUrl.pathname === '/dashboard/login') return NextResponse.next()
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  try {
    await supabase.auth.setSession({ access_token: token.value, refresh_token: refreshToken?.value || '' })
    if (request.nextUrl.pathname === '/dashboard/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }
  catch (error) {
    console.error('Error setting user session:', error)
    if (request.nextUrl.pathname === '/dashboard/login') return NextResponse.next()
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }
}

export const config = {
  matcher: '/dashboard/:path*',
}
