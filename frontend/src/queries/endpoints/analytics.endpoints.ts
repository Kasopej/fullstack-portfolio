import { SessionQueryData } from '@/types/session-tracking.types'
import { formatErrorForRTK, queryAPI } from '../api'
import { httpClient } from '@/lib/http/http.client'

export type PageViewHistoryFilter = 'daily' | 'weekly' | 'monthly'
const analyticsEndpoints = queryAPI.injectEndpoints({
  endpoints: build => ({
    getPageViewsHistoricalData: build.query<SessionQueryData<[string, number]>, { days: PageViewHistoryFilter }>({
      queryFn: async ({ days }) => {
        try {
          const { data } = await httpClient.request<SessionQueryData<[string, number]>>(`/analytics/sessions-historical-data?days=${days}`, {
            notifyOnError: true,
            defaultError: 'Failed to fetch web analytics data',
          })
          return { data }
        }
        catch (error) {
          return formatErrorForRTK(error)
        }
      },
    }),
    getPageViewsPerDeviceType: build.query<SessionQueryData<[string, number]>, { days: PageViewHistoryFilter }>({
      queryFn: async ({ days }) => {
        try {
          const { data } = await httpClient.request<SessionQueryData<[string, number]>>(`/analytics/sessions-per-device-type?days=${days}`, {
            notifyOnError: true,
            defaultError: 'Failed to fetch web analytics data',
          })
          return { data }
        }
        catch (error) {
          return formatErrorForRTK(error)
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetPageViewsHistoricalDataQuery, useGetPageViewsPerDeviceTypeQuery } = analyticsEndpoints
