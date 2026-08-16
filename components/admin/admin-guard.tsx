"use client"

import { useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAdmin = useQuery(api.admin.isAdminUser)

  if (isAdmin === undefined || isAdmin === false) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return <>{children}</>
}