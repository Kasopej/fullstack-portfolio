type FetchArgs = Parameters<typeof fetch>

type RawFetchInput = FetchArgs[0]
type RawFetchInit = NonNullable<FetchArgs[1]>
type RequestInterceptor = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<[RequestInfo | URL, RequestInit?]> | [RequestInfo | URL, RequestInit?]

type ResponseSuccessInterceptor<T = unknown> = (
  data: T,
  response: Response,
) => Promise<T> | T

type ResponseErrorInterceptor = (error: unknown) => Promise<HTTPError> | HTTPError

type RequestOptions = { baseUrl?: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: unknown }

class HTTPError {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown,
  ) {
  }
}

class HttpClient {
  static baseUrl = 'http://localhost:3001'

  private static requestInterceptors = new Set<RequestInterceptor>()
  private static responseSuccessInterceptors = new Set<ResponseSuccessInterceptor>()
  private static responseErrorInterceptors = new Set<ResponseErrorInterceptor>()

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
  ): Promise<T> {
    const base = init?.baseUrl ?? this.baseUrl
    const requestUrl = new URL(input instanceof Request ? input.url : input.toString(), base || globalThis.location.origin)
    const headers = new Headers(init?.headers || {})
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
    finalInit = {
      ...finalInit,
      headers,
    }

    for (const interceptor of this.requestInterceptors) {
      await interceptor(requestUrl, finalInit)
    }

    try {
      const response = await fetch(requestUrl, finalInit)

      if (!response.ok) {
        const errorBody = await this.parseBody(response)
        const error = new HTTPError(response.status, response.statusText, errorBody)

        let interceptedError = error
        for (const errInterceptor of this.responseErrorInterceptors) {
          interceptedError = (await errInterceptor(interceptedError) as typeof error)
        }

        throw interceptedError
      }

      let data: T = await this.parseBody(response)
      for (const interceptor of this.responseSuccessInterceptors) {
        data = (await interceptor(data, response) as T)
      }

      return data
    }
    catch (err) {
      if (err instanceof HTTPError) throw err
      let interceptedError = new HTTPError(0, '', err)
      for (const errInterceptor of this.responseErrorInterceptors) {
        interceptedError = await errInterceptor(interceptedError)
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
