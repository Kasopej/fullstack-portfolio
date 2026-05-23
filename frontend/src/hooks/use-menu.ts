import type { FlatMenu, MenuItem } from '@/types/navigation.types'
import DashboardMenuIcon from '@/assets/icons/menu/dashboard.svg'
import LiveSiteMenuIcon from '@/assets/icons/menu/live-site.svg'
import { BriefcaseIcon, ChartNoAxesColumnIcon, FileTextIcon, SettingsIcon } from 'lucide-react'

export function useMenu() {
  const menu: MenuItem[] = [
    {
      title: 'Dashboard',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: DashboardMenuIcon,
          activeIcon: undefined,
          shortcut: ['d', 'd'],
          items: [],
        },
        {
          title: 'Live Site',
          href: '/dashboard/live-site',
          icon: LiveSiteMenuIcon,
          activeIcon: undefined,
          shortcut: ['d', 'b'],
          items: [],
        },
      ],
    },
    {
      title: 'Content',
      items: [
        {
          title: 'Blog Posts',
          href: '/dashboard/blog-posts',
          icon: FileTextIcon,
          activeIcon: undefined,
          shortcut: ['d', 'b'],
          items: [],
        },
        {
          title: 'Projects',
          href: '/dashboard/projects',
          icon: BriefcaseIcon,
          activeIcon: undefined,
          shortcut: ['d', 'p'],
          items: [],
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Analytics',
          href: '/dashboard/analytics',
          icon: ChartNoAxesColumnIcon,
          activeIcon: undefined,
          shortcut: ['d', 'd'],
          items: [],
        },
        {
          title: 'Settings',
          href: '/dashboard/settings',
          icon: SettingsIcon,
          activeIcon: undefined,
          shortcut: ['d', 'b'],
          items: [],
        },
      ],
    },
  ]
  return {
    menu,
    flatMenu: recursivelyFlattenMenuItems(menu),
  }
}

export function isMenuActive(menuItem: MenuItem, pathname: string, menu: FlatMenu) {
  const matchingMenus = menu.filter(menuItem => isMatchingMenu(menuItem, pathname))
  const bestMatch = matchingMenus.reduce((bestMatch, menuItem) => {
    const bestMatchPathLength = bestMatch?.href?.toString().length || 0
    const currentPathLength = menuItem.href?.toString().length || 0

    if (currentPathLength > bestMatchPathLength) {
      return menuItem
    }

    return bestMatch
  }, menu[0])

  return bestMatch?.title === menuItem.title
}

function isMatchingMenu(menuItem: MenuItem, pathname: string) {
  return (
    (menuItem.href && pathname.includes(menuItem.href.toString()))
    || (menuItem.subPaths
      && menuItem.subPaths.some(path => pathname.includes(path)))
  )
}

export function isGroup(item: MenuItem): item is MenuItem & { items: MenuItem[] } {
  return !!item.items && item.items.length > 0
}

export function recursivelyFlattenMenuItems(items: MenuItem[]): FlatMenu {
  return items.reduce((acc, item) => {
    if (isGroup(item)) {
      return [...acc, ...recursivelyFlattenMenuItems(item.items)]
    }
    return [...acc, item]
  }, [] as MenuItem[])
}
