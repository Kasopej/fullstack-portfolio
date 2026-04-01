import { queryAPI } from "../api"

export type Project = {
    id: string
    title: string
    description: string
    image: string
    tags: string[]
}
const projectsEndpoints = queryAPI.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => 'test',
    }),
  }),
  overrideExisting: false,
})

export const { useGetProjectsQuery } = projectsEndpoints