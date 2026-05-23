/* eslint-disable @stylistic/object-curly-spacing */
import { Request, Response } from 'node-fetch'
import { FetchBaseQueryArgs, FetchBaseQueryError, FetchArgs } from '@reduxjs/toolkit/query'
import type { PaginatedResponse } from '../index'
declare module '@reduxjs/toolkit/query/react' {
  type FetchBaseQueryMeta = {
    request?: Request
    response?: Response
  } & Partial<PaginatedResponse['meta']>
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  declare function fetchBaseQuery({ baseUrl, prepareHeaders, fetchFn, paramsSerializer, isJsonContentType, jsonContentType, jsonReplacer, timeout: defaultTimeout, responseHandler: globalResponseHandler, validateStatus: globalValidateStatus, ...baseFetchOptions }?: FetchBaseQueryArgs): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>
  export { FetchBaseQueryMeta, fetchBaseQuery }
}
