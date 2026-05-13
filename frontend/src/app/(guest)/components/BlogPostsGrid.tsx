'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetBlogPostsQuery } from '@/queries/endpoints/blog.endpoints'
import { format, millisecondsToMinutes } from 'date-fns'
import { DotIcon } from 'lucide-react'
import Image from 'next/image'
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
    <div className="grid md:grid-cols-3 gap-4">
      {blogPosts.map(post => (
        <Link key={post.id} href={`/blog-posts/${post.id}`} className="w-full" data-analytics="" data-cta="">
          <Card className="border-none ring-0">
            <CardHeader>
              <p className="inline-flex items-center gap-2">
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                <DotIcon className="size-4" />
                {post.estimatedReadingTime
                  ? `${millisecondsToMinutes(post.estimatedReadingTime)} min`
                  : ''}
              </p>
              <Image
                src={post.coverImage || 'https://via.placeholder.com/150'}
                width={600}
                height={400}
                alt={post.title}
                className="w-full aspect-video"
              />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
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
