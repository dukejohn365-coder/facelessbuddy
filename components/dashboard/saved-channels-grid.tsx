"use client"

import { useMutation } from "convex/react"
import { BookmarkCheckIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { ChannelCard } from "@/components/dashboard/channel-card"
import { toast } from "@/components/ui/toast"

type SavedEntry = {
  _id: string
  channelId: string
  savedAt: number
  channel: {
    _id: string
    channelId: string
    title: string
    thumbnailUrl?: string
    category: string
    subscriberCount: number
    videoCount: number
    viewCount: number
    channelPublishedAt?: string
    topOutlierVideo?: {
      videoId: string
      title: string
      thumbnailUrl: string
      views: number
      multiplier: number
    }
  }
}

export function SavedChannelsGrid({ saved }: { saved: SavedEntry[] }) {
  const toggleCompetitor = useMutation(api.competitors.toggleCompetitor)

  const handleToggleCompetitor = async (entry: SavedEntry) => {
    try {
      const res = await toggleCompetitor({ channelId: entry.channel._id as Id<"channels"> })
      toast.add({
        title: res.added ? "Competitor added" : "Competitor removed",
        description: res.added
          ? `${entry.channel.title} is now being tracked for analysis.`
          : `${entry.channel.title} removed from your competitors.`,
        type: res.added ? "success" : "info",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't update competitors",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    }
  }

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-6">
        <BookmarkCheckIcon className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Your watchlist is empty. Browse Discover Niches and bookmark the channels you
          want to track.
        </p>
        <Button variant="outline" size="sm" render={<a href="/dashboard/niches" />}>
          Browse Discover Niches
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((entry) => (
        <ChannelCard
          key={entry._id}
          channel={{
            _id: entry.channel._id as Id<"channels">,
            channelId: entry.channel.channelId,
            title: entry.channel.title,
            thumbnailUrl: entry.channel.thumbnailUrl,
            category: entry.channel.category,
            subscriberCount: entry.channel.subscriberCount,
            videoCount: entry.channel.videoCount,
            viewCount: entry.channel.viewCount,
            channelPublishedAt: entry.channel.channelPublishedAt,
            keyword: "",
            topOutlierVideo: entry.channel.topOutlierVideo,
          }}
          onAddCompetitor={() => handleToggleCompetitor(entry)}
        />
      ))}
    </div>
  )
}