"use client"

import { useQuery } from "convex/react"
import { BookmarkIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import { SavedChannelsGrid } from "@/components/dashboard/saved-channels-grid"
import { ChannelCardSkeleton } from "@/components/dashboard/channel-card-skeleton"
import { PageHeaderSkeleton } from "@/components/dashboard/page-header-skeleton"

export default function SavedChannelsPage() {
  const saved = useQuery(api.savedChannels.listSaved)

  if (saved === undefined) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeaderSkeleton />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ChannelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Saved Channels"
        description="Your watchlist. Bookmark winners from Discover, then add them as competitors to study."
        icon={BookmarkIcon}
      />
      <SavedChannelsGrid saved={saved} />
    </div>
  )
}