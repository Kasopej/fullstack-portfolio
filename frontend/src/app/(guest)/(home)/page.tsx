import './styles.css'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CloudCogIcon, CodeIcon, DatabaseIcon, DownloadIcon, GithubIcon, MoveRight } from 'lucide-react'
import ProfileAvatar from '@/assets/images/profile_avatar_sample.png'
import ColumnGridIcon from '@/assets/icons/column-grid.svg'
import DockerIcon from '@/assets/icons/docker.svg'
import Link from 'next/link'
import ProjectList from './components/ProjectList'
import BlogPostsList from './components/BlogPostsList'

export default function Home() {
  return (
    <main className="page home">
      <section className="hero max-xl:w-2/3 w-3/4 mx-auto pt-30 pb-20 flex flex-col items-center gap-12 text-center whitespace-pre-wrap">
        <Avatar className="size-22!">
          <AvatarImage src={ProfileAvatar.src} />
        </Avatar>
        <h1>
          Building digital products
          {' '}
          <br />
          {' '}
          with
          {' '}
          <br />
          {' '}
          performance and purpose.
        </h1>
        <p className="md:w-1/2 text-muted-foreground">
          Hi, I&apos;m Alex. A Full Stack Developer specializing in React,
          Node.js, and cloud architecture. I build accessible, pixel- perfect,
          and performant web applications.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Button className="bg-green-800 text-white">
            View my work
            <DownloadIcon className="size-4" />
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/alexdotjs">
              <GithubIcon className="size-4" />
              Github
            </a>
          </Button>
        </div>
      </section>
      <ul className="tech-skills min-w-full p-6 bg-muted text-muted-foreground border-t border-b flex flex-wrap items-center justify-center gap-6 md:gap-12">
        <li>
          <CodeIcon />
          Next.js
        </li>
        <li>
          <DatabaseIcon />
          PostgresSQL
        </li>
        <li>
          <ColumnGridIcon />
          Tailwind
        </li>
        <li>
          <DockerIcon />
          Docker
        </li>
        <li>
          <CloudCogIcon />
          Deployment
        </li>
      </ul>
      <section className="px-6 py-12">
        <header className="w-full flex flex-col gap-1 mb-10">
          <h2 className="mb-6">Selected Work</h2>
          <p>A few projects I&apos;ve worked on recently.</p>
          <Link
            href="#"
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
            href="#"
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
