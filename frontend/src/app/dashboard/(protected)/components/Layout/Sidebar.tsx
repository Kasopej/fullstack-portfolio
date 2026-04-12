'use client'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuLink, SidebarProvider } from '@/components/ui/sidebar'
import Image from 'next/image'
import AppLogo from '@/assets/logo/app_logo.svg?url'
import Link from 'next/link'
import { isGroup, useMenu } from '@/hooks/use-menu'

export default function AppSidebar() {
  const { menu } = useMenu()
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="inline-flex gap-2 items-center">
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
                      <SidebarGroup>
                        <SidebarGroupLabel className="text-foreground uppercase">
                          {menuItem.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                          {menuItem.items.map(menuChildItem => (
                            <SidebarMenuItem key={menuChildItem.id}>
                              <SidebarMenuLink menu={menuChildItem}>{menuChildItem.title}</SidebarMenuLink>
                            </SidebarMenuItem>
                          ))}
                        </SidebarGroupContent>
                      </SidebarGroup>
                    )
                  : (
                      <SidebarMenuItem key={menuItem.id}>
                        <SidebarMenuLink menu={menuItem}>{menuItem.title}</SidebarMenuLink>
                      </SidebarMenuItem>
                    )
              })
            }
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
