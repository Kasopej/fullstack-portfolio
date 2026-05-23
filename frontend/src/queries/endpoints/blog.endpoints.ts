import { httpClient } from '@/lib/http/http.client'
import { formatErrorForRTK, queryAPI } from '../api'
import { PaginatedResponse, PaginationQuery } from '@/types'
import { BlogPost } from '@/schemas'

export type BlogPostFilter = Partial<{
  title: string
  type: 'all' | 'published' | 'draft'
} & PaginationQuery>
const blogEndpoints = queryAPI.injectEndpoints({
  endpoints: build => ({
    getBlogPosts: build.query<PaginatedResponse<BlogPost>, BlogPostFilter | void>({
      async queryFn(filter) {
        try {
          const { data } = await httpClient.request<PaginatedResponse<BlogPost>>(`/blog-post`, {
            params: filter ? { ...filter, page: (Number(filter.page) || 1).toString() } : {},
            notifyOnError: true,
            defaultError: 'Failed to fetch posts',
          })
          return { data: data, meta: data.meta }
        }
        catch (error) {
          return formatErrorForRTK(error)
        }
      },
      providesTags: ['BlogPost'],
    }),
    getBlogPostById: build.query<BlogPost, string>({
      async queryFn(id) {
        try {
          const { data } = await httpClient.request<BlogPost>(`/blog-post/${id}`, {
            notifyOnError: true,
            defaultError: 'Failed to fetch post',
          })
          return { data }
        }
        catch (error) {
          return formatErrorForRTK(error)
        }
      },
      providesTags(result, error, arg) {
        return [{ type: 'BlogPost', id: arg }]
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetBlogPostsQuery, useGetBlogPostByIdQuery } = blogEndpoints

export async function deleteBlogPost(id: number, opts?: { refetch?: () => void }) {
  try {
    await httpClient.request(`/blog-post/${id}`, {
      method: 'DELETE',
      notifyOnError: true,
      defaultError: 'Failed to delete post',
    })
    queryAPI.util.invalidateTags(['BlogPost'])
    opts?.refetch?.()
  }
  catch {
    // already handled
  }
}
