"use client"

import { usePathname } from "next/navigation"

import { SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles: Record<string, { title: string; section: string }> = {
  "/dashboard": { title: "Discover Niches", section: "Dashboard" },
  "/dashboard/niches": { title: "Discover Niches", section: "Dashboard" },
  "/dashboard/saved-channels": { title: "Saved Channels", section: "Dashboard" },
  "/dashboard/outliers": { title: "Outlier Videos", section: "Dashboard" },
  "/dashboard/competitor-analysis": { title: "Competitor Analysis", section: "Dashboard" },
  "/dashboard/discover": { title: "Discover", section: "Dashboard" },
}

export function DashboardHeader() {
  const pathname = usePathname()
  const current = pageTitles[pathname]

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="flex min-w-0 items-center gap-2">
        {current && (
          <>
            <span className="text-xs text-muted-foreground">{current.section}</span>
            <span aria-hidden="true" className="text-muted-foreground/50">
              /
            </span>
            <span className="truncate text-sm font-semibold text-foreground">
              {current.title}
            </span>
          </>
        )}
      </div>
    </header>
  )
}