import { duplicateRequestError } from '@/constants'
import { notifyError } from '../utils/client/errors.utils'

type FetchArgs = Parameters<typeof fetch>

type RawFetchInput = FetchArgs[0]
type RawFetchInit = NonNullable<FetchArgs[1]>
type HttpClientResponse<T> = Promise<{
  data: T
  response: Response
}>
type RequestInterceptor = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<[RequestInfo | URL, RequestInit?]> | [RequestInfo | URL, RequestInit?]

type ResponseSuccessInterceptor<T = unknown> = (
  data: T,
  response: Response,
) => Promise<T> | T

type ResponseErrorInterceptor = (error: unknown) => Promise<HTTPError> | HTTPError

type RequestOptions = { baseUrl?: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: unknown, params?: Record<string, string>, aborter?: AbortController, notifyOnError?: boolean, defaultError?: string }

export class HTTPError {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown,
  ) {
  }
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL!
class HttpClient {
  static baseUrl = apiBaseUrl

  private static requestInterceptors = new Set<RequestInterceptor>()
  private static responseSuccessInterceptors = new Set<ResponseSuccessInterceptor>()
  private static responseErrorInterceptors = new Set<ResponseErrorInterceptor>()
  private static tempRequestHashMap = new Map<string, AbortController>() // for deduping (stores hash of request options)

  static addRequestInterceptors(...fns: RequestInterceptor[]) {
    fns.forEach(fn => this.requestInterceptors.add(fn))
    return this // chainable
  }

  static addResponseInterceptors(
    successFns: ResponseSuccessInterceptor[] = [],
    errorFns: ResponseErrorInterceptor[] = [],
  ) {
    successFns.forEach(fn => this.responseSuccessInterceptors.add(fn))
    errorFns.forEach(fn => this.responseErrorInterceptors.add(fn))
    return this // chainable
  }

  static async request<T = unknown>(
    input: RawFetchInput,
    init?: Omit<RawFetchInit, 'body' | 'method'> & RequestOptions,
  ): HttpClientResponse<T> {
    const base = init?.baseUrl ?? this.baseUrl
    const requestUrl = new URL(input instanceof Request ? input.url : input.toString(), base || globalThis.location.origin)
    const headers = new Headers(init?.headers || {})
    const abortController = init?.aborter || new AbortController()
    const token = globalThis.localStorage?.getItem('accessToken')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    const data = init?.data
    let finalInit: (RawFetchInit & RequestOptions) | undefined = init
    if (data != null) {
      if (typeof data === 'object' && !(data instanceof FormData) && !(data instanceof Blob) && !(data instanceof ArrayBuffer)) {
        if (!headers.has('content-type')) headers.set('content-type', 'application/json')
        finalInit = {
          ...init,
          body: JSON.stringify(data),
        }
      }
      else if (typeof data === 'string') {
        if (!headers.has('content-type')) headers.set('content-type', 'text/plain')
      }
    }
    if (init?.params) {
      Object.entries(init.params).forEach(([key, value]) => {
        requestUrl.searchParams.set(key, value)
      })
    }
    finalInit = {
      ...finalInit,
      headers,
      signal: abortController.signal,
    }

    if (globalThis.window) {
      // near instant duplicate requests (e.g react double effect) override previous requests
      const requestHash = JSON.stringify({
        url: requestUrl.toString(),
        method: finalInit?.method || 'GET',
        headers: finalInit?.headers || {},
        body: finalInit?.body,
      })

      if (this.tempRequestHashMap.has(requestHash)) {
        this.tempRequestHashMap.get(requestHash)?.abort(duplicateRequestError)
      }
      this.tempRequestHashMap.set(requestHash, abortController)
      setTimeout(() => {
        this.tempRequestHashMap.delete(requestHash)
      }, 5000)
    }

    for (const interceptor of this.requestInterceptors) {
      await interceptor(requestUrl, finalInit)
    }

    try {
      const response = await fetch(requestUrl, finalInit)

      if (!response.ok) {
        const errorBody = await this.parseBody(response)
        const error = new HTTPError(response.status, response.statusText, errorBody)
        throw error
      }

      let data: T = await this.parseBody(response)
      for (const interceptor of this.responseSuccessInterceptors) {
        data = (await interceptor(data, response) as T)
      }

      return {
        data,
        response,
      }
    }
    catch (err) {
      let isOverrideError = false
      if (err instanceof Error && err.message === duplicateRequestError) {
        isOverrideError = true
      }
      if (err instanceof HTTPError) throw err
      let interceptedError = new HTTPError(isOverrideError ? 0 : 500, '', err instanceof Error ? err.message : err)
      for (const errInterceptor of this.responseErrorInterceptors) {
        interceptedError = await errInterceptor(interceptedError)
      }
      if (init?.notifyOnError) {
        notifyError(interceptedError, { fallback: init.defaultError })
      }
      throw interceptedError
    }
  }

  private static async parseBody(response: Response) {
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      return response.json()
    }

    if (contentType.includes('text/')) {
      return response.text()
    }

    return response.arrayBuffer()
  }
}

const httpClient = HttpClient
export { httpClient }
