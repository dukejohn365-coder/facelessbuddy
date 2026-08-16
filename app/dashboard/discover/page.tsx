"use client"

import { useQuery } from "convex/react"
import { RocketIcon, ShieldAlertIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import { DiscoverTool } from "@/components/dashboard/discover-tool"
import { DiscoverToolSkeleton } from "@/components/dashboard/discover-tool-skeleton"
import { PageHeaderSkeleton } from "@/components/dashboard/page-header-skeleton"

export default function DiscoverPage() {
  const isAdmin = useQuery(api.admin.isAdminUser)

  if (isAdmin === undefined) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeaderSkeleton />
        <DiscoverToolSkeleton />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex max-w-md flex-col gap-3 rounded-lg border border-dashed p-6">
        <ShieldAlertIcon className="size-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Discover</h1>
        <p className="text-sm text-muted-foreground">
          Only admins can scan for new channels. Ask an admin to run a scan, then check
          the results in Discover Niches.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Discover"
        description="Scan YouTube for fresh faceless channels across your seed niches. New finds land in Approvals for review."
        icon={RocketIcon}
      />
      <DiscoverTool />
    </div>
  )
}