'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import HtmlViewer from '@/components/Viewers/HtmlViewer'
import { getInitials } from '@/lib/utils/format'
import { BlogPost } from '@/schemas'
import { format, millisecondsToMinutes } from 'date-fns'
import { DotIcon, HeartIcon } from 'lucide-react'
import { Suspense, use } from 'react'

type Props = {
  className?: string
  data: Promise<BlogPost | null>
}

export default function BlogPostDetail({ className, data }: Props) {
  const post = use(data)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={className}>
        {
          post
            ? (
                <>
                  <header className="flex flex-col items-center gap-6 px-10 mb-10">
                    <div className="flex justify-center items-center flex-wrap gap-2">
                      <ul>
                        {post.tags.map(tag => (
                          <li key={tag.name}>
                            <Badge variant="outline" className="bg-primary text-primary-foreground">{tag.name}</Badge>
                          </li>
                        ))}
                      </ul>
                      <span>{format(post.createdAt, 'MMMM d, yyyy')}</span>
                      <DotIcon />
                      <span>{post.estimatedReadingTime ? `${millisecondsToMinutes(post.estimatedReadingTime)} min` : ''}</span>
                    </div>
                    <h1>{post.title}</h1>
                    <p className="text-muted-foreground">{post.description}</p>
                    <div className="flex justify-center items-center gap-2">
                      <Avatar className="size-10!">
                        <AvatarImage>
                        </AvatarImage>
                        <AvatarFallback>
                          {
                            getInitials(`${post.author.firstName} ${post.author.lastName}`)
                          }
                        </AvatarFallback>
                      </Avatar>
                      <p>
                        <span>
                          {post.author.firstName}
                          {' '}
                          {post.author.lastName}
                        </span>
                      </p>
                    </div>
                  </header>
                  <section className="px-10 grid md:grid-cols-[1fr_200px] gap-6">
                    <div className="space-y-10">
                      {
                        post.coverImage && (
                          <img src={post.coverImage} alt={post.title} className="w-full aspect-video object-cover rounded-lg" />
                        )
                      }
                      <div className="border border-input rounded-md p-4">
                        <HtmlViewer value={post.html} />
                      </div>
                    </div>
                    <aside className="flex flex-col gap-4 border-l border-input pl-4">
                      <div className="space-y-3">
                        <span className="inline-flex gap-2">
                          <HeartIcon />
                          <span>10 likes</span>
                        </span>
                      </div>
                    </aside>
                  </section>
                </>
              )
            : (
                <div>Post not found</div>
              )
        }
      </main>
    </Suspense>
  )
}
