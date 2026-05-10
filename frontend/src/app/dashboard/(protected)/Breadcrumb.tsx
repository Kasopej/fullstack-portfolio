import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { isMenuActive, useMenu } from '@/hooks/use-menu'
import { HomeIcon, SlashIcon } from 'lucide-react'
import ForwardSlashIcon from '@/assets/icons/forward-slash.svg'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function AppBreadcrumb() {
  const { flatMenu } = useMenu()
  const pathname = usePathname()
  const activeMenu = flatMenu.find(menu => isMenuActive(menu, pathname))
  const [_, ...parents] = segmentPath(pathname).reverse()
  const activeMenuParents = flatMenu.filter(menu => menu.href && parents.includes(menu.href.toString())).reverse()
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard"><HomeIcon className="size-4" /></BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="w-1.25 h-4.25">
          <ForwardSlashIcon className="mt-0.5 w-1.25 h-4.25" />
        </BreadcrumbSeparator>
        {
          activeMenuParents.map((parent, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem key={index}>
                {parent.href ? <BreadcrumbLink href={parent.href.toString()}>{parent.title}</BreadcrumbLink> : parent.title}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="w-1.25 h-4.25">
                <ForwardSlashIcon className="mt-0.5 w-1.25 h-4.25" />
              </BreadcrumbSeparator>
            </React.Fragment>
          ))
        }
        <BreadcrumbItem>
          <BreadcrumbPage>{activeMenu?.title || pathname.split('/').pop()}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function segmentPath(path: string): string[] {
  const parts = path.split('/').filter(Boolean)
  const result: string[] = []

  for (let i = 0; i < parts.length; i++) {
    result.push(parts.slice(0, i + 1).join('/'))
  }

  return result
}
