import { HTTPError } from '@/lib/http/http.client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL!
export const queryAPI = createApi({
  reducerPath: 'queryAPI',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: build => ({
  }),
  tagTypes: ['BlogPost', 'Project'],
})

export function formatErrorForRTK(error: unknown): {
  error: {
    status: number
    data?: unknown
  }
} {
  if (error instanceof HTTPError) {
    return {
      error: {
        status: error.status,
        data: error.body || error.statusText,
      },
    }
  }
  // extra error cases for custom queryFn calls
  if (error instanceof Error) {
    return {
      error: {
        status: 500,
        data: error.message,
      },
    }
  }
  // something went wrong
  return {
    error: {
      status: 500,
      data: 'Something went wrong, try again',
    },
  }
}
