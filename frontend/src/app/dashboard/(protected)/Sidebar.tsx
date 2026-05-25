'use client'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuLink, SidebarProvider } from '@/components/ui/sidebar'
import Image from 'next/image'
import AppLogo from '@/assets/logo/app_logo.svg?url'
import Link from 'next/link'
import { isGroup, useMenu } from '@/hooks/use-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/context-providers/AuthProvider'
import { getInitials } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'

export default function AppSidebar() {
  const { menu = [], flatMenu = [] } = useMenu()
  const { user, logout } = useAuth()
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link data-analytics={null} data-cta={null} href="/" className="inline-flex gap-2 items-center">
            <Image src={AppLogo} alt="App logo" className="size-8" />
            <span className="font-bold text-xl">PortfoliOS</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {
              menu.map((menuItem) => {
                return isGroup(menuItem)
                  ? (
                      <SidebarGroup key={menuItem.title}>
                        <SidebarGroupLabel className="text-foreground uppercase">
                          {menuItem.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                          {menuItem.items.map(menuChildItem => (
                            <SidebarMenuItem key={menuChildItem.title}>
                              <SidebarMenuLink menuItem={menuChildItem} menu={flatMenu}>{menuChildItem.title}</SidebarMenuLink>
                            </SidebarMenuItem>
                          ))}
                        </SidebarGroupContent>
                      </SidebarGroup>
                    )
                  : (
                      <SidebarMenuItem key={menuItem.title}>
                        <SidebarMenuLink menuItem={menuItem} menu={flatMenu}>{menuItem.title}</SidebarMenuLink>
                      </SidebarMenuItem>
                    )
              })
            }
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex-row gap-2">
          <div className="w-full flex gap-2 items-center">
            <Avatar className="size-8">
              <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.user_metadata.first_name} />
              <AvatarFallback className="uppercase">{getInitials(`${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-contrast-foreground font-bold capitalize">
              {user?.user_metadata.first_name}
              {' '}
              {user?.user_metadata.last_name}
            </span>
          </div>
          <Button variant="destructive" size="icon" onClick={logout}>
            <LogOutIcon />
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
