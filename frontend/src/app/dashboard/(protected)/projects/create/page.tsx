'use client'
import { useBreadcrumb } from '@/context-providers/BreadcrumbProvider'
import ProjectEditor from '../components/ProjectEditor'
import { useEffect } from 'react'

export default function CreatePostPage() {
  const { setAdditionalRoutes } = useBreadcrumb()
  useEffect(() => {
    setAdditionalRoutes([{ title: 'Create Project', href: '/dashboard/projects/create' }])
  }, [setAdditionalRoutes])
  return <ProjectEditor mode="create" />
}
