import './styles.css'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import Link from 'next/link'
import ProjectList from '@/components/Project/ProjectList'
import BlogPostsList from '@/components/BlogPost/BlogPostsList'

export default function Home() {
  return (
    <main className="page home">
      <section className="hero lg:w-1/2 mx-auto pt-30 pb-20 flex flex-col items-center gap-8 text-center whitespace-pre-wrap">
        <Avatar className="size-22!">
          <AvatarImage src="/me.jpg" />
        </Avatar>
        <h1>
          Great work deserves great documentation.
        </h1>
        <p className="text-muted-foreground">
          A dedicated space to document projects, capture technical decisions, and turn complex engineering work into structured, meaningful case studies.
        </p>
        <Button size="xl" asChild className="w-full max-w-100 bg-green-800 text-white">
          <Link href="/dashboard" data-analytics="" data-cta="">
            Start writing
          </Link>
        </Button>
      </section>
      <hr className="min-w-full" />
      <section className="px-6 py-12">
        <header className="w-full flex flex-col gap-1 mb-10">
          <h2 className="mb-6">Selected Work</h2>
          <p>A few projects I&apos;ve worked on recently.</p>
          <Link
            data-analytics=""
            data-cta=""
            href="/projects"
            className="md:self-end inline-flex items-center gap-2 text-contrast-foreground font-semibold"
          >
            View all projects
            <MoveRight className="size-4" />
          </Link>
        </header>
        <ProjectList />
      </section>
      <section className="px-6 py-12">
        <header className="w-full flex flex-col gap-1 mb-10">
          <h2 className="mb-6">Recent Writing</h2>
          <p>Thoughts on software architecture and engineering.</p>
          <Link
            data-analytics=""
            data-cta=""
            href="/blog-posts"
            className="md:self-end inline-flex items-center gap-2 text-contrast-foreground font-semibold"
          >
            Read the blog
            <MoveRight className="size-4" />
          </Link>
        </header>
        <BlogPostsList />
      </section>
    </main>
  )
}
