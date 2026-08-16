"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { SwordsIcon, PlusIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { ChannelCard } from "@/components/dashboard/channel-card"
import { ChannelCardSkeleton } from "@/components/dashboard/channel-card-skeleton"
import { AnalysisDialog } from "@/components/dashboard/competitor-analysis-dialog"

export function CompetitorAnalysisView() {
  const competitors = useQuery(api.competitors.listCompetitors)
  const [analyzeChannel, setAnalyzeChannel] = useState<{
    _id: Id<"channels">
    title: string
  } | null>(null)

  if (competitors === undefined) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ChannelCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (competitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <SwordsIcon className="size-6 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">No Competitors Yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Save channels from Discover Niches, then add them as competitors from
            the Saved Channels page to analyze their content patterns.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.href = "/dashboard/niches"}>
          <PlusIcon className="mr-1.5 size-3" />
          Browse Discover Niches
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {competitors.map((competitor) => (
          <ChannelCard
            key={competitor._id}
            channel={{
              _id: competitor.channel._id,
              channelId: competitor.channel.channelId,
              title: competitor.channel.title,
              thumbnailUrl: competitor.channel.thumbnailUrl,
              category: competitor.channel.category,
              subscriberCount: competitor.channel.subscriberCount,
              videoCount: competitor.channel.videoCount,
              viewCount: competitor.channel.viewCount,
              avgViews: competitor.channel.avgViews,
              keyword: "",
            }}
            onAnalyze={() =>
              setAnalyzeChannel({
                _id: competitor.channel._id,
                title: competitor.channel.title,
              })
            }
          />
        ))}
      </div>

      <AnalysisDialog
        key={analyzeChannel?._id ?? "none"}
        open={analyzeChannel !== null}
        onOpenChange={(open) => {
          if (!open) setAnalyzeChannel(null)
        }}
        channelId={analyzeChannel?._id ?? null}
        channelTitle={analyzeChannel?.title ?? ""}
      />
    </div>
  )
}