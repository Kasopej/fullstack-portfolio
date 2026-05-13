import { httpClient } from '@/lib/http/http.client'
import { formatErrorForRTK, queryAPI } from '../api'
import { PaginatedResponse } from '@/types'
import { BlogPost } from '@/schemas'

const blogEndpoints = queryAPI.injectEndpoints({
  endpoints: build => ({
    getBlogPosts: build.query<BlogPost[], void>({
      async queryFn() {
        try {
          const { data } = await httpClient.request<PaginatedResponse<BlogPost>>(`/blog-post`, {
            notifyOnError: true,
            defaultError: 'Failed to fetch posts',
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

export const { useGetBlogPostsQuery } = blogEndpoints
