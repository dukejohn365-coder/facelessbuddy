"use client"

import { useMutation, useQuery } from "convex/react"
import { TrendingUpIcon, PlayIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { OutlierCardSkeleton } from "@/components/dashboard/outlier-card-skeleton"

import { channelUrl, formatNumber } from "@/lib/format"

type OutlierVideo = {
  videoId: string
  title: string
  thumbnailUrl: string
  publishedAt: string
  views: number
  likes: number
  comments: number
  multiplier: number
}

type OutlierResultEntry = {
  _id: string
  channelId: string
  status: "pending" | "completed" | "failed"
  avgViews: number
  outlierThreshold: number
  outliers: OutlierVideo[]
  message?: string
  fetchedAt: number
  channel: {
    _id: string
    channelId: string
    title: string
    thumbnailUrl?: string
    subscriberCount: number
  }
}

function initials(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}

function videoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

function OutlierPreferenceSelector() {
  const preference = useQuery(api.outliers.getOutlierPreference)
  const setPreference = useMutation(api.outliers.setOutlierPreference)

  if (preference === undefined) return <Skeleton className="h-10 w-full" />

  const options = [
    { value: "saved_only" as const, label: "My Saved Channels" },
    { value: "similar" as const, label: "Similar Channels" },
    { value: "all" as const, label: "All Tracked Channels" },
  ]

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-medium text-muted-foreground">
        Show outlier videos from:
      </p>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPreference({ scope: opt.value })}
            className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors ${
              preference === opt.value
                ? "bg-primary text-primary-foreground"
                : "border bg-muted hover:bg-muted/80"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function VideoCard({
  video,
  channel,
}: {
  video: OutlierVideo
  channel: OutlierResultEntry["channel"]
}) {
  return (
    <Card className="group overflow-hidden border-border bg-card transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <CardContent className="p-3">
        {/* Thumbnail */}
        <a href={videoUrl(video.videoId)} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <PlayIcon className="size-6 text-muted-foreground" />
              </div>
            )}
            <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {video.multiplier}x avg
            </span>
          </div>
        </a>

        {/* Title */}
        <a
          href={videoUrl(video.videoId)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block"
        >
          <p className="line-clamp-2 text-[13px] font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
            {video.title}
          </p>
        </a>

        {/* Stats */}
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
          <span>{formatNumber(video.views)} views</span>
          <span>·</span>
          <span>{formatNumber(video.likes)} likes</span>
          <span>·</span>
          <span>{formatNumber(video.comments)} comments</span>
        </div>

        {/* Channel footer */}
        <div className="mt-2.5 flex items-center gap-2 border-t pt-2.5">
          <Avatar className="size-6 ring-1 ring-border">
            <AvatarImage src={channel.thumbnailUrl} alt={channel.title} />
            <AvatarFallback className="bg-muted text-[9px] font-medium text-muted-foreground">
              {initials(channel.title)}
            </AvatarFallback>
          </Avatar>
          <a
            href={channelUrl(channel.channelId)}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-[11px] text-muted-foreground transition-colors hover:text-primary"
          >
            {channel.title}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export function OutliersGrid({ results }: { results: OutlierResultEntry[] }) {
  const videos = results
    .filter((r) => r.status === "completed")
    .flatMap((r) =>
      r.outliers.map((video) => ({ video, channel: r.channel }))
    )

  const hasPending = results.some((r) => r.status === "pending")

  const notes = results.filter(
    (r) =>
      r.status === "failed" ||
      (r.status === "completed" && r.outliers.length === 0 && r.message),
  )

  return (
    <div className="flex flex-col gap-6">
      <OutlierPreferenceSelector />

      {results.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-6">
          <TrendingUpIcon className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nothing here yet. Save a channel from Discover Niches and we&apos;ll
            automatically watch for its outlier videos.
          </p>
        </div>
      ) : (
        <>
          {notes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {notes.map((result) => (
                <p
                  key={result._id}
                  className="text-sm text-muted-foreground"
                >
                  {result.status === "failed"
                    ? `Outlier detection failed for ${result.channel.title}.`
                    : result.message}
                </p>
              ))}
            </div>
          )}

          {videos.length === 0 && !hasPending ? (
            <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-6">
              <TrendingUpIcon className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No outlier videos found yet. They&apos;ll show up here as soon as
                they&apos;re detected.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map(({ video, channel }) => (
                <VideoCard
                  key={`${channel.channelId}-${video.videoId}`}
                  video={video}
                  channel={channel}
                />
              ))}
              {hasPending &&
                Array.from({ length: 3 }).map((_, i) => (
                  <OutlierCardSkeleton key={`pending-${i}`} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}