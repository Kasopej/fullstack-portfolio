'use client'
import { Button } from '@/components/ui/button'
import { BellIcon, MenuIcon } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import AppBreadcrumb from './Breadcrumb'

export default function Navbar() {
  const { toggleSidebar, openMobile } = useSidebar()

  return (
    <nav className="sticky top-0 inset-x-0 z-50 w-full flex items-center gap-2 border-b px-8 py-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open sidebar"
        aria-expanded={openMobile}
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </Button>
      <AppBreadcrumb />
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <div id="page-toolbar" className="flex flex-wrap items-center gap-2"></div>
        <Button variant="ghost">
          <BellIcon className="size-6" />
        </Button>
      </div>
    </nav>
  )
}
