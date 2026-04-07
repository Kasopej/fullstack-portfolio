'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetBlogPostsQuery } from '@/queries/endpoints/blog.queries'
import { DotIcon } from 'lucide-react'

const SKeletonLoader = () => {
  return (
    <Card className="bg-inherit w-full">
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="w-1/3 h-6" />
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-full h-12" />
      </CardContent>
    </Card>
  )
}

export default function BlogPostsList() {
  const { data: blogPosts = [] } = useGetBlogPostsQuery()
  return (
    <div className="flex flex-col gap-6">
      {blogPosts.map(project => (
        <Card key={project.id} className="bg-inherit w-full">
          <CardContent className="flex flex-col gap-4">
            <p className="inline-flex items-center gap-2">
              {project.date}
              <DotIcon className="size-4" />
              {project.estimatedReadingTime}
              {' '}
              min read
            </p>
            <h4>{project.title}</h4>
            <p>{project.description}</p>
          </CardContent>
        </Card>
      ))}
      <SKeletonLoader />
      <SKeletonLoader />
    </div>
  )
}
