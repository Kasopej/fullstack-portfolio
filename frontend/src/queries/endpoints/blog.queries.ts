import { queryAPI } from "../api"

export type Blog = {
    id: string
    title: string
    description: string
    image: string
    date: string
    estimatedReadingTime: number
    tags: string[]
}
const blogEndpoints = queryAPI.injectEndpoints({
  endpoints: (build) => ({
    getBlogPosts: build.query<Blog[], void>({
      query: () => 'test',
    }),
  }),
  overrideExisting: false,
})

export const { useGetBlogPostsQuery } = blogEndpoints