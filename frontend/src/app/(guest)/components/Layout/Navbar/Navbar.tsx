'use client'
import AppLogo from '@/assets/logo/app_logo.svg?url'
import NavLink from '@/components/NavLink'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/context-providers/AuthProvider'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const menuItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog-posts', label: 'Blog' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav className="w-full bg-navbar text-navbar-foreground flex flex-wrap items-center justify-between gap-y-4 py-4 px-4 md:px-12">
      <Link data-analytics="" data-cta="" href="/" className="inline-flex gap-2 items-center">
        <Image src={AppLogo} alt="App logo" className="size-8" />
        <span className="font-bold text-xl">PortfoliOS</span>
      </Link>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden" aria-label="Open navigation menu">
            <MenuIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 md:hidden" aria-label="Navigation menu">
          <ul className="flex flex-col gap-3 p-2">
            {menuItems.map(item => (
              <li key={item.href}>
                <NavLink href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>
              </li>
            ))}
            {user
              ? (
                  <>
                    <li>
                      <Link data-analytics="" data-cta="" href="/dashboard" className="text-muted-foreground">
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <Button onClick={logout} variant="link" size="lg" className="text-destructive">
                        Log out
                      </Button>
                    </li>
                  </>
                )
              : (
                  <>
                    <li>
                      <Link data-analytics="" data-cta="" href="/dashboard/login" className="text-muted-foreground">
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link className="w-full" data-analytics="" data-cta="" href="/contact">
                        <Button className="w-full bg-green-800 text-white" size="lg">
                          Contact Me
                        </Button>
                      </Link>
                    </li>
                  </>
                )}
          </ul>
        </PopoverContent>
      </Popover>
      <ul className="hidden gap-8 ml-auto md:flex">
        {menuItems.map(item => (
          <li key={item.href}>
            <NavLink href={item.href}>{item.label}</NavLink>
          </li>
        ))}
      </ul>
      <div className="ml-auto hidden md:flex w-full justify-end gap-4 items-center md:w-auto">
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
