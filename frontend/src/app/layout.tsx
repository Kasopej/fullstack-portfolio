import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/assets/styles/global.css'
import { ReduxProvider } from '@/context-providers/ReduxProvider'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${interFontCss.variable} antialiased`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
