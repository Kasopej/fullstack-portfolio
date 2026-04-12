import Navbar from '@/app/(guest)/components/Layout/Navbar/Navbar'

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-dvh overflow-scroll flex flex-col bg-background">
      <Navbar />
      {children}
      <footer></footer>
    </div>
  )
}
