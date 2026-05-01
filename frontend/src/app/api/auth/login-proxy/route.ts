import { httpClient, HTTPError } from '@/lib/http/http.client'
import { NextResponse } from 'next/server'
import type { Session } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const loginResponse = (await httpClient.request<Session>(
      '/auth/login',
      {
        method: 'POST',
        data: await request.json(),
      },
    )).data
    const response = NextResponse.json(loginResponse)
    response.cookies.set('accessToken', loginResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: loginResponse.expires_at && new Date(loginResponse.expires_at * 1000),
    })
    response.cookies.set('refreshToken', loginResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: loginResponse.expires_at && new Date(loginResponse.expires_at * 1000),
    })
    return response
  }
  catch (error) {
    if (error instanceof HTTPError) {
      return NextResponse.json({ error: error.body }, { status: error.status })
    }
    throw error
  }
}
