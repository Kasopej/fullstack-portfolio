'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import HtmlViewer from '@/components/Viewers/HtmlViewer'
import { Project } from '@/schemas'
import { ExternalLinkIcon, GithubIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense, use } from 'react'

type Props = {
  className?: string
  data: Promise<Project | null>
}

export default function ProjectDetail({ className, data }: Props) {
  const project = use(data)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={className}>
        {
          project
            ? (
                <>
                  <header className="flex flex-col gap-6 px-10 mb-10">
                    <h1>{project.title}</h1>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex items-center gap-2">
                      <Link href={project.projectUrl || '#'} data-analytics="" data-cta="">
                        <Button size="xl">
                          <ExternalLinkIcon />
                          View Project
                        </Button>
                      </Link>
                      <Link href={project.repoUrl || '#'} data-analytics="" data-cta="">
                        <Button variant="outline" size="xl">
                          <GithubIcon />
                          View Source
                        </Button>
                      </Link>
                    </div>
                  </header>
                  {
                    project.coverImage && (
                      <img src={project.coverImage} alt={project.title} className="w-full mb-10 aspect-video object-cover rounded-lg" />
                    )
                  }
                  <section className="px-10 grid md:grid-cols-[200px_1fr] gap-6">
                    <aside className="flex flex-col gap-4">
                      <div className="space-y-3">
                        <h3 className="text-muted-foreground capitalize">Tech Stack</h3>
                        <ul>
                          {project.skills.map(skill => (
                            <li key={skill.name}>
                              <Badge variant="outline" className="bg-primary text-primary-foreground">{skill.name}</Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </aside>
                    <div className="space-y-3">
                      <h3 className="text-muted-foreground capitalize">Details</h3>
                      <div className="border border-input rounded-md p-4">
                        <HtmlViewer value={project.html} />
                      </div>
                    </div>
                  </section>
                </>
              )
            : (
                <div>Project not found</div>
              )
        }
      </main>
    </Suspense>
  )
}
