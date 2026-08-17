"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { LockIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { ChannelCard } from "@/components/dashboard/channel-card"
import { ChannelCardSkeleton } from "@/components/dashboard/channel-card-skeleton"

export function NichesGrid() {
  const categories = useQuery(api.channels.listApprovedCategories)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const data = useQuery(api.channels.listApprovedChannels, {
    category: activeCategory ?? undefined,
  })

  if (data === undefined || categories === undefined) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ChannelCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const { channels, total, canViewAll } = data
  const lockedCount = total - channels.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          key="all"
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {channels.length === 0 && !canViewAll ? (
        <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-6">
          <p className="text-sm text-muted-foreground">
            Nothing in this category yet. Try a different one.
          </p>
        </div>
      ) : channels.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-6">
          <p className="text-sm text-muted-foreground">
            Nothing here yet. The first approved channels will show up here soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <ChannelCard
              key={channel._id}
              channel={{
                _id: channel._id,
                channelId: channel.channelId,
                title: channel.title,
                thumbnailUrl: channel.thumbnailUrl,
                category: channel.category,
                subscriberCount: channel.subscriberCount,
                videoCount: channel.videoCount,
                viewCount: channel.viewCount,
                channelPublishedAt: channel.channelPublishedAt,
                keyword: channel.keyword,
                channelAgeInMonths: channel.channelAgeInMonths,
                avgViews: channel.avgViews,
                estimatedMrr: channel.estimatedMrr,
                topOutlierVideo: channel.topOutlierVideo,
              }}
            />
          ))}
          {lockedCount > 0 && (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-background shadow-sm">
                <LockIcon className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">
                {lockedCount} more channel{lockedCount === 1 ? "" : "s"} locked
              </p>
              <p className="text-xs text-muted-foreground">
                Upgrade to unlock the rest of the database.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                render={<Link href="/#pricing" />}
              >
                <SparklesIcon className="size-4" />
                See plans
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
