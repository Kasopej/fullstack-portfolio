import Link from 'next/link'
import type { JSX } from 'react'
import type React from 'react'

export type MenuItem = Partial<React.ComponentProps<typeof Link>> & {
  title: string
  disabled?: boolean
  shortcut?: [string, string]
  icon?: React.FC<JSX.IntrinsicElements['svg']>
  activeIcon?: React.FC<JSX.IntrinsicElements['svg']>
  iconClass?: string
  isActive?(): boolean
  show?: boolean
  items?: MenuItem[]
  subPaths?: string[]
  getParent?(): MenuItem | undefined
  onClick?(): void
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}
