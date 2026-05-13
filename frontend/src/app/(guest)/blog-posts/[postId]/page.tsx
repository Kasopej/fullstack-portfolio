import { httpClient } from '@/lib/http/http.client'
import { BlogPost } from '@/schemas'
import BlogPostDetail from '../../components/BlogPostDetail'

export default async function GuestProjectDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const postPromise = httpClient.request<BlogPost>(`/blog-post/${postId}`)
  return (
    <BlogPostDetail className="page home p-6" data={postPromise.then(response => response.data).catch(() => null)} />
  )
}
