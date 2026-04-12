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
      <main className="dashboard-main relative h-dvh overflow-auto flex flex-col">
        <Navbar />
        <section className="p-8">
          {children}
        </section>
      </main>
    </div>
  )
}
