'use client'
import '../styles.css'
import Image from 'next/image'
import Link from 'next/link'
import AppLogo from '@/assets/logo/app_logo.svg?url'
import { useIsMobile } from '@/hooks/use-mobile'
import { Slot } from 'radix-ui'
import { BadgeCheckIcon, ShieldCheckIcon } from 'lucide-react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMobile = useIsMobile()
  if (!isMobile) return (
    <main className="h-dvh grid grid-cols-[1fr_1fr]">
      <section className="auth-sidebar-banner">
        <Link href="/" className="absolute! top-6 left-6 inline-flex gap-2 items-center">
          <Image src={AppLogo} alt="App logo" className="size-8" />
          <span className="font-bold text-xl">PortfoliOS</span>
        </Link>
        <p className="max-w-120">
          <q className="block text-2xl font-medium mb-6">
            Manage your entire digital
            presence from one central hub.
          </q>
          <span className="text-sm font-light">
            Admin Dashboard & CMS
          </span>
        </p>
      </section>
      <section className="auth-page-wrapper relative p-6 bg-contrast flex justify-center items-center">
        {children}
      </section>
    </main>
  )
  return (
    <>
      <main className="p-6 space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex gap-2 items-center">
            <Image src={AppLogo} alt="App logo" className="size-10" />
            <span className="font-bold text-xl text-contrast-foreground">PortfoliOS</span>
          </Link>
        </div>
        <header className="flex flex-col items-start gap-4">
          <span className="rounded-3xl inline-flex gap-2 items-center bg-primary text-primary-foreground py-2 px-4">
            <ShieldCheckIcon className="size-4.5" />
            Admin Dashboard & CMS
          </span>
          <p className="text-3xl text-contrast-foreground font-bold">
            Manage your entire digital
            presence from one central hub.
          </p>
        </header>
        <div className="bg-contrast p-6 rounded-[12px]">{children}</div>
      </main>
    </>
  )
}
