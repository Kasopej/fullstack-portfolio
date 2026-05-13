import { queryAPI } from '../api'
import { Project } from '@/schemas'
import { httpClient } from '@/lib/http/http.client'
import { formatErrorForRTK } from '../api'
import { PaginatedResponse } from '@/types'

const projectsEndpoints = queryAPI.injectEndpoints({
  endpoints: build => ({
    getProjects: build.query<Project[], void>({
      async queryFn() {
        try {
          const { data } = await httpClient.request<PaginatedResponse<Project>>(`/projects`, {
            notifyOnError: true,
            defaultError: 'Failed to fetch projects',
          })
          return { data: data.data }
        }
        catch (error) {
          return formatErrorForRTK(error)
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetProjectsQuery } = projectsEndpoints
