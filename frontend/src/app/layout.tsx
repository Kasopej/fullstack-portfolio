import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/assets/styles/global.css'
import { ReduxProvider } from '@/context-providers/ReduxProvider'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context-providers/AuthProvider'
import { cookies } from 'next/headers'

const interFontCss = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: `PortfolioOS | Manage your entire digital presence from one
central hub.`,
  description: `Manage your entire digital presence from one
central hub.`,
}

const getCredentials = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  return accessToken && refreshToken ? { accessToken, refreshToken } : null
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const credentials = await getCredentials()
  return (
    <html lang="en">
      <body className={`${interFontCss.variable} antialiased`}>
        <AuthProvider credentials={credentials}>
          <ReduxProvider>
            <Toaster position="top-right" />
            {children}
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
