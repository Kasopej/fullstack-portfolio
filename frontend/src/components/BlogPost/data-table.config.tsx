'use client'

import {
  type ColumnDef,
} from '@tanstack/react-table'
import { Edit2Icon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { BlogPost } from '@/schemas'
import { Badge } from '../ui/badge'
import { DateString } from '@/types'
import { format, isValid } from 'date-fns'
import Link from 'next/link'

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    onDelete?: (row: TData) => void
  }
}

export const columns: ColumnDef<BlogPost>[] = [
  {
    accessorKey: 'title',
    header: 'TITLE',
  },
  {
    accessorKey: 'tags',
    header: 'TAGS',
    cell: ({ row }) => {
      const tags = row.getValue('tags') as BlogPost['tags']
      return (
        <div className="max-w-[200px] flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag.name} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'publish',
    header: 'STATUS',
    cell: ({ row }) => {
      const rowValue = row.getValue('publish') as BlogPost['publish']
      return (
        <Badge variant={rowValue ? 'default' : 'secondary'}>
          {rowValue ? 'Published' : 'Draft'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'DATE',
    cell: ({ row }) => {
      const dateString = row.getValue('createdAt') as DateString
      const date = isValid(new Date(dateString)) ? new Date(dateString) : new Date()
      return (
        <div className="capitalize">
          {format(date, 'MMM dd, yyyy')}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'ACTIONS',
    enableHiding: false,
    cell: ({ row, table }) => {
      return (
        <span className="inline-flex gap-2 items-center">
          <Link href={`/dashboard/blog-posts/${row.original.id}`} data-analytics="" data-cta="">
            <Button variant="outline" size="icon">
              <Edit2Icon />
            </Button>
          </Link>
          <Button onClick={() => table.options.meta?.onDelete?.(row.original)} variant="outline" size="icon">
            <Trash2Icon />
          </Button>
        </span>
      )
    },
  },
]
