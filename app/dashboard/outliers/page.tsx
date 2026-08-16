"use client"

import { useQuery } from "convex/react"
import { TrendingUpIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import { OutliersGrid } from "@/components/dashboard/outliers-grid"
import { OutlierCardSkeleton } from "@/components/dashboard/outlier-card-skeleton"
import { PageHeaderSkeleton } from "@/components/dashboard/page-header-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function OutliersPage() {
  const results = useQuery(api.outliers.listAllOutlierResults)

  if (results === undefined) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeaderSkeleton />
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <OutlierCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Outlier Videos"
        description="Videos that beat their channel's average by 2x or more in the last 140 days — the clearest signal for what's working right now."
        icon={TrendingUpIcon}
      />
      <OutliersGrid results={results} />
    </div>
  )
}