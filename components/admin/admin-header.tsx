"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function AdminHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
    </header>
  )
}