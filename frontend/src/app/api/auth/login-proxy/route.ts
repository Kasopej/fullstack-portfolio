import { httpClient, HTTPError } from '@/lib/http/http.client'
import { NextResponse } from 'next/server'
import type { Session } from '@supabase/supabase-js'

type BodyParams = {
  email: string
  password: string
  persistent: boolean
}
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BodyParams
    const loginResponse = (await httpClient.request<Session>(
      '/auth/login',
      {
        method: 'POST',
        data: body,
      },
    )).data
    const response = NextResponse.json(loginResponse)
    response.cookies.set('accessToken', loginResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: body.persistent ? (loginResponse.expires_at && new Date(loginResponse.expires_at * 1000)) : undefined,
    })
    response.cookies.set('refreshToken', loginResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: body.persistent ? (loginResponse.expires_at && new Date(loginResponse.expires_at * 1000)) : undefined,
    })
    return response
  }
  catch (error) {
    console.log('login error', error)
    if (error instanceof HTTPError) {
      return NextResponse.json(error.body ?? { message: 'An error occurred' }, { status: error.status })
    }
    return NextResponse.json({ message: String(error) }, { status: 500 })
  }
}
