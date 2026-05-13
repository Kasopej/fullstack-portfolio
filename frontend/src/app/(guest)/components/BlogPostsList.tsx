'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetBlogPostsQuery } from '@/queries/endpoints/blog.endpoints'
import { format, millisecondsToMinutes } from 'date-fns'
import { DotIcon } from 'lucide-react'
import Link from 'next/link'

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
      {blogPosts.map(post => (
        <Link key={post.id} href={`/blog-posts/${post.id}`} className="w-full" data-analytics="" data-cta="">
          <Card className="bg-inherit">
            <CardContent className="flex flex-col gap-4">
              <p className="inline-flex items-center gap-2">
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                <DotIcon className="size-4" />
                {post.estimatedReadingTime
                  ? `${millisecondsToMinutes(post.estimatedReadingTime)} min`
                  : ''}
              </p>
              <div className="flex items-center gap-2">
                {
                  post.coverImage && (
                    <img src={post.coverImage} alt={post.title} className="w-20 aspect-video object-cover rounded-lg" />
                  )
                }
                <div>
                  <h4>{post.title}</h4>
                  <p>{post.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      {
        !blogPosts.length && (
          <>
            <SKeletonLoader />
            <SKeletonLoader />
          </>
        )
      }
    </div>
  )
}
