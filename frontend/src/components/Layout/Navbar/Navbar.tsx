import AppLogo from "@/assets/logo/app_logo.svg?url";
import NavLink from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-navbar text-navbar-foreground flex items-center justify-between py-4 px-12">
      <div className="inline-flex gap-2 items-center">
        <Image src={AppLogo} alt="App logo" className="size-8" />
        <span className="font-bold text-xl">PortfoliOS</span>
      </div>
      <ul className="flex gap-8 ml-auto">
        <li>
          <NavLink href="/">Home</NavLink>
        </li>
        <li>
          <NavLink href="/projects">Projects</NavLink>
        </li>
        <li>
          <NavLink href="/blog">Blog</NavLink>
        </li>
        <li>
          <NavLink href="/about">About</NavLink>
        </li>
      </ul>
      <div className="ml-auto inline-flex gap-4 items-center">
        <Link href="/login" className="text-muted-foreground">
          Sign In
        </Link>
        <Button asChild className="bg-green-800 text-white" size="lg">
          <Link href="/contact">Contact Me</Link>
        </Button>
      </div>
    </nav>
  );
}
