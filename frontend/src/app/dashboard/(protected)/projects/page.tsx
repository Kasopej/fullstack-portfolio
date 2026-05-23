'use client'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/Project/data-table.config'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { useImmer } from 'use-immer'
import { useCallback, useMemo, useRef, useState } from 'react'
import { PaginationState } from '@tanstack/react-table'
import { useDebounce } from 'use-debounce'
import { Project } from '@/schemas'
import DeleteDialog from '@/components/Dialog/DeleteDialog'
import { deleteProject, ProjectsFilter, useGetProjectsQuery } from '@/queries/endpoints/projects.endpoints'

export default function ProjectsPage() {
  const [filter, setFilter] = useImmer<ProjectsFilter>({
    page: '1',
    limit: '10',
  })
  const [debouncedFilter] = useDebounce(filter, 500)
  const { data: { data = [], meta } = {}, refetch } = useGetProjectsQuery(debouncedFilter)
  const pagination = useMemo<PaginationState>(() => ({
    pageIndex: Number(filter.page) - 1,
    pageSize: Number(filter.limit),
  }), [filter])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const projectToDelete = useRef<Project | null>(null)
  const onDelete = useCallback((row: Project) => {
    projectToDelete.current = row
    setShowDeleteDialog(true)
  }, [])
  return (
    <main>
      <header className="flex items-center flex-wrap justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/dashboard/projects/create" data-analytics="" data-cta="">
          <Button>Create Project</Button>
        </Link>
      </header>
      <section>
        <DataTable
          data={data}
          columns={columns}
          pageCount={meta?.totalPages}
          rowCount={meta?.total}
          pagination={pagination}
          onPaginationChange={(pagination) => {
            setFilter({
              page: String(pagination.pageIndex + 1),
              limit: String(pagination.pageSize),
            })
          }}
          titleBar={() => (
            <div className="flex gap-3 items-center py-4">
              <Input
                placeholder="Search projects..."
                onChange={event =>
                  setFilter({
                    title: event.target.value,
                  })}
                className="max-w-sm"
              />
            </div>
          )}
          meta={{
            onDelete,
          }}
        />
      </section>
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={() => {
          setShowDeleteDialog(false)
          projectToDelete.current = null
        }}
        onConfirm={() => {
          if (projectToDelete.current) {
            deleteProject(projectToDelete.current.id, { refetch })
          }
        }}
      />
    </main>
  )
}
