"use client"

import * as React from "react"
import Link from "next/link"
import { MenuIcon, RadarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
]

export function LandingNav() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="sticky top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border px-3 transition-all duration-300 sm:px-4",
          scrolled
            ? "border-border bg-background/85 shadow-lg shadow-black/5 backdrop-blur-xl supports-backdrop-filter:bg-background/70"
            : "border-transparent bg-transparent"
        )}
      >
        <a href="#" className="flex items-center gap-2 pl-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <RadarIcon className="size-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            FacelessBuddy
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" render={<Link href="/login" />}>
            Sign In
          </Button>
          <Button render={<Link href="/signup" />}>Get Started</Button>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Open menu" />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex items-center gap-2 px-1 pt-1">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <RadarIcon className="size-4" />
                </div>
                <span className="font-display text-lg font-semibold tracking-tight">
                  FacelessBuddy
                </span>
              </div>
              <nav className="mt-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                <Button variant="outline" render={<Link href="/login" />}>
                  Sign In
                </Button>
                <Button render={<Link href="/signup" />}>Get Started</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}