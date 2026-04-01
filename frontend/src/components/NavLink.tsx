'use client'

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = Parameters<typeof Link>[0]
export default function NavLink(props: Props) {
    const pathname = usePathname()
    const active = props.href === pathname
    return (
      <Link
        {...props}
        className={clsx(
          "text-sm hover:font-bold hover:text-inherit",
          active ? "font-bold" : "text-muted-foreground",
        )}
      />
    );
}