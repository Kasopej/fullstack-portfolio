import { queryAPI } from '../api'
import { Project } from '@/schemas'
import { httpClient } from '@/lib/http/http.client'
import { formatErrorForRTK } from '../api'
import { PaginatedResponse, PaginationQuery } from '@/types'

export type ProjectsFilter = Partial<{
  title: string
} & PaginationQuery>
const projectsEndpoints = queryAPI.injectEndpoints({
  endpoints: build => ({
    getProjects: build.query<PaginatedResponse<Project>, ProjectsFilter | void>({
      async queryFn(filter) {
        try {
          const { data } = await httpClient.request<PaginatedResponse<Project>>(`/projects`, {
            notifyOnError: true,
            defaultError: 'Failed to fetch projects',
            params: filter || {},
          })
          return { data: data }
        }
        catch (error) {
          return formatErrorForRTK(error)
        }
      },
      providesTags: ['Project'],
    }),
    getProjectById: build.query<Project, string>({
      async queryFn(projectId) {
        try {
          const { data } = await httpClient.request<Project>(`/projects/${projectId}`, {
            notifyOnError: true,
            defaultError: 'Failed to fetch project',
          })
          return { data: data }
        }
        catch (error) {
          return formatErrorForRTK(error)
        }
      },
      providesTags: ['Project'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetProjectsQuery, useGetProjectByIdQuery } = projectsEndpoints

export async function deleteProject(id: number, opts?: { refetch?: () => void }) {
  try {
    await httpClient.request(`/projects/${id}`, {
      method: 'DELETE',
      notifyOnError: true,
      defaultError: 'Failed to delete project',
    })
    queryAPI.util.invalidateTags(['Project'])
    opts?.refetch?.()
  }
  catch {
    // already handled
  }
}
