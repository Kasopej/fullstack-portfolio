'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetProjectsQuery } from '@/queries/endpoints/projects.endpoints'
import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const ProjectSKeletonLoader = () => {
  return (
    <article className="w-full">
      <Skeleton className="w-full aspect-video mb-4" />
      <div className="flex flex-col gap-4">
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-full h-12" />
      </div>
    </article>
  )
}

export default function ProjectList() {
  const { data: projects = [] } = useGetProjectsQuery()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map(project => (
        <Card key={project.id} className="w-full flex flex-col gap-4 bg-background rounded-lg border border-input">
          <CardHeader>
            <Image
              src={project.coverImage || 'https://via.placeholder.com/150'}
              width={600}
              height={400}
              alt={project.title}
              className="w-full aspect-video"
            />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <Link className="self-end" data-analytics="" data-cta="" href={`/projects/${project.id}`}>
                <Button variant="outline" size="icon" title="View Project">
                  <MoveRight />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
      {
        !projects.length && (
          <>
            <ProjectSKeletonLoader />
            <ProjectSKeletonLoader />
          </>
        )
      }
    </div>
  )
}
