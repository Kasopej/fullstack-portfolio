import { BreadcrumbProvider } from '@/context-providers/BreadcrumbProvider'
import Navbar from './Navbar'
import AppSidebar from './Sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="dashboard-wrapper">
      <BreadcrumbProvider>
        <SidebarProvider className="grid grid-cols-[min-content_1fr]">
          <AppSidebar />
          <div className="relative h-dvh max-w-full overflow-auto flex flex-col">
            <Navbar />
            <div className="p-8">
              {children}
            </div>
          </div>
        </SidebarProvider>
      </BreadcrumbProvider>
    </div>
  )
}
