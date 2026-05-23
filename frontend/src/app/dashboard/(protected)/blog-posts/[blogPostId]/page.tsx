'use client'
import { use } from 'react'
import BlogPostEditor from '../components/BlogPostEditor'
import { useGetBlogPostByIdQuery } from '@/queries/endpoints/blog.endpoints'
import { Loader2Icon } from 'lucide-react'

export default function CreatePostPage({ params }: { params: Promise<{ blogPostId: string }> }) {
  const { blogPostId } = use(params)
  const { data } = useGetBlogPostByIdQuery(blogPostId, {
    skip: !blogPostId,
  })
  return data ? <BlogPostEditor mode="edit" post={data} /> : <main><Loader2Icon className="animate-spin" /></main>
}
