'use client'
import { use } from 'react'
import { useEffect } from 'react'
import BlogPostEditor from '../components/BlogPostEditor'
import { useGetBlogPostByIdQuery } from '@/queries/endpoints/blog.endpoints'
import { Loader2Icon } from 'lucide-react'
import { useBreadcrumb } from '@/context-providers/BreadcrumbProvider'

export default function CreatePostPage({ params }: { params: Promise<{ blogPostId: string }> }) {
  const { blogPostId } = use(params)
  const { setAdditionalRoutes } = useBreadcrumb()
  useEffect(() => {
    setAdditionalRoutes([{ title: 'Edit Blog Post', href: `/dashboard/blog-posts/${blogPostId}` }])
  }, [setAdditionalRoutes, blogPostId])
  const { data } = useGetBlogPostByIdQuery(blogPostId, {
    skip: !blogPostId,
  })
  return data ? <BlogPostEditor mode="edit" post={data} /> : <main><Loader2Icon className="animate-spin" /></main>
}
