'use client'
import AppLogo from '@/assets/logo/app_logo.svg?url'
import NavLink from '@/components/NavLink'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context-providers/AuthProvider'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="w-full bg-navbar text-navbar-foreground flex items-center justify-between py-4 px-12">
      <Link data-analytics="" data-cta="" href="/" className="inline-flex gap-2 items-center">
        <Image src={AppLogo} alt="App logo" className="size-8" />
        <span className="font-bold text-xl">PortfoliOS</span>
      </Link>
      <ul className="flex gap-8 ml-auto">
        <li>
          <NavLink href="/">Home</NavLink>
        </li>
        <li>
          <NavLink href="/projects">Projects</NavLink>
        </li>
        <li>
          <NavLink href="/blog-posts">Blog</NavLink>
        </li>
      </ul>
      <div className="ml-auto inline-flex gap-4 items-center">
        {user
          ? (
              <>
                <Link data-analytics="" data-cta="" href="/dashboard" className="text-muted-foreground">
                  Dashboard
                </Link>
                <Button onClick={logout} variant="destructive" size="lg">
                  Log out
                </Button>
              </>
            )
          : (
              <>
                <Link data-analytics="" data-cta="" href="/dashboard/login" className="text-muted-foreground">
                  Sign In
                </Link>
                <Link data-analytics="" data-cta="" href="/contact">
                  <Button className="bg-green-800 text-white" size="lg">
                    Contact Me
                  </Button>
                </Link>
              </>
            )}
      </div>
    </nav>
  )
}
