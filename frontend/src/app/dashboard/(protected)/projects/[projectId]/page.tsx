'use client'
import { use } from 'react'
import { useEffect } from 'react'
import { useBreadcrumb } from '@/context-providers/BreadcrumbProvider'
import ProjectEditor from '../components/ProjectEditor'
import { useGetProjectByIdQuery } from '@/queries/endpoints/projects.endpoints'
import { Loader2Icon } from 'lucide-react'

export default function CreatePostPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const { setAdditionalRoutes } = useBreadcrumb()
  useEffect(() => {
    setAdditionalRoutes([{ title: 'Edit Project', href: `/dashboard/projects/${projectId}` }])
  }, [setAdditionalRoutes, projectId])
  const { data } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  })
  return data ? <ProjectEditor mode="edit" project={data} /> : <main><Loader2Icon className="animate-spin" /></main>
}
