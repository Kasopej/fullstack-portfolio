'use client'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/BlogPost/data-table.config'
import Link from 'next/link'
import { BlogPostFilter, deleteBlogPost, useGetBlogPostsQuery } from '@/queries/endpoints/blog.endpoints'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useImmer } from 'use-immer'
import { useCallback, useMemo, useRef, useState } from 'react'
import { PaginationState } from '@tanstack/react-table'
import { useDebounce } from 'use-debounce'
import { BlogPost } from '@/schemas'
import DeleteDialog from '@/components/Dialog/DeleteDialog'

export default function BlogPostsPage() {
  const [filter, setFilter] = useImmer<BlogPostFilter>({
    page: '1',
    limit: '10',
  })
  const [debouncedFilter] = useDebounce(filter, 500)
  const { data: { data = [], meta } = {}, refetch } = useGetBlogPostsQuery(debouncedFilter)
  const pagination = useMemo<PaginationState>(() => ({
    pageIndex: Number(filter.page) - 1,
    pageSize: Number(filter.limit),
  }), [filter])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const blogToDelete = useRef<BlogPost | null>(null)
  const onDelete = useCallback((row: BlogPost) => {
    blogToDelete.current = row
    setShowDeleteDialog(true)
  }, [])
  return (
    <main>
      <header className="flex items-center flex-wrap justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/dashboard/blog-posts/create" data-analytics="" data-cta="">
          <Button>Create Post</Button>
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
                placeholder="Search posts..."
                onChange={event =>
                  setFilter({
                    title: event.target.value,
                  })}
                className="max-w-sm"
              />
              <Tabs
                defaultValue=""
                onValueChange={value => setFilter({
                  type: !value ? 'all' : value === 'published' ? 'published' : 'draft',
                })}
              >
                <TabsList>
                  <TabsTrigger value="">All</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                </TabsList>
              </Tabs>
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
          blogToDelete.current = null
        }}
        onConfirm={() => {
          if (blogToDelete.current) {
            deleteBlogPost(blogToDelete.current.id, { refetch })
          }
        }}
      />
    </main>
  )
}
