import Navbar from './components/Layout/Navbar'
import AppSidebar from './components/Layout/Sidebar'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="dashboard-wrapper grid grid-cols-[min-content_1fr]">
      <AppSidebar />
      <div className="relative h-dvh overflow-auto flex flex-col">
        <Navbar />
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
