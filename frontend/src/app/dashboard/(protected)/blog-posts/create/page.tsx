'use client'
import { useEffect } from 'react'
import { useBreadcrumb } from '@/context-providers/BreadcrumbProvider'
import BlogPostEditor from '../components/BlogPostEditor'

export default function CreatePostPage() {
  const { setAdditionalRoutes } = useBreadcrumb()
  useEffect(() => {
    setAdditionalRoutes([{ title: 'Create Blog Post', href: '/dashboard/blog-posts/create' }])
  }, [setAdditionalRoutes])
  return <BlogPostEditor mode="create" />
}
