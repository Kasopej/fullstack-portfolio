import Navbar from '@/app/(guest)/components/Layout/Navbar/Navbar'
import SessionTracker from '@/components/Analytics/SessionTracker'

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-dvh overflow-scroll flex flex-col bg-background">
      <Navbar />
      <SessionTracker>
        {children}
      </SessionTracker>
      <footer></footer>
    </div>
  )
}
