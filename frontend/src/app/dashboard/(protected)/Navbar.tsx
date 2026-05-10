'use client'
import { Button } from '@/components/ui/button'
import { BellIcon } from 'lucide-react'
import AppBreadcrumb from './Breadcrumb'

export default function Navbar() {
  return (
    <nav className="sticky top-0 inset-x-0 z-50 w-full flex items-center gap-2 border-b px-8 py-4 backdrop-blur">
      <AppBreadcrumb />
      <div className="ml-auto">
        <Button variant="ghost">
          <BellIcon className="size-6" />
        </Button>
      </div>
    </nav>
  )
}
