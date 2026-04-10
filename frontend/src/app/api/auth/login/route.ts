import { httpClient } from '@/lib/http/http.client'
import { NextResponse } from 'next/server'
import type { Session } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const loginResponse = await httpClient.request<Session>('/auth/login', {
    method: 'POST',
    data: await request.json(),
  })
  const response = NextResponse.json(loginResponse)
  response.cookies.set('token', loginResponse.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: loginResponse.expires_at && new Date(loginResponse.expires_at * 1000),
  })
  return response
}
