import { httpClient } from '@/lib/http/http.client'
import { Project } from '@/schemas'
import ProjectDetail from '../../components/ProjectDetail'

export default async function GuestProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const projectPromise = httpClient.request<Project>(`/projects/${projectId}`)
  return (
    <ProjectDetail className="page home p-6" data={projectPromise.then(response => response.data).catch(() => null)} />
  )
}
