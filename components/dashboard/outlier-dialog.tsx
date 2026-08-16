"use client"

import { useState } from "react"
import { useAction } from "convex/react"
import { TrendingUpIcon, ExternalLinkIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"

import { formatNumber } from "@/lib/format"

interface OutlierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  channelId: Id<"channels">
  channelTitle: string
}

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

type OutlierResult = {
  channel: {
    title: string
    avgViews: number
    subscriberCount: number
  }
  outliers: OutlierVideo[]
  message: string
}

export function OutlierDialog({
  open,
  onOpenChange,
  channelId,
  channelTitle,
}: OutlierDialogProps) {
  const findOutliers = useAction(api.outliers.findOutliers)

  const [result, setResult] = useState<OutlierResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = async (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (isOpen && !result && !loading) {
      setLoading(true)
      setError(null)
      try {
        const data = await findOutliers({ channelId })
        setResult(data)
        toast.add({
          title: data.outliers.length > 0 ? "Outliers found" : "No outliers found",
          description:
            data.outliers.length > 0
              ? `${data.outliers.length} video${data.outliers.length === 1 ? "" : "s"} performing above 2x average for ${channelTitle}.`
              : data.message,
          type: data.outliers.length > 0 ? "success" : "info",
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to find outliers"
        setError(message)
        toast.add({
          title: "Failed to find outliers",
          description: message,
          type: "error",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUpIcon className="size-4" />
            Outliers — {channelTitle}
          </DialogTitle>
          <DialogDescription>
            Videos performing above 2x the channel&apos;s average views
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && <LoadingSkeleton />}

          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && !loading && (
            <>
              <div className="mb-3 flex items-center gap-4 rounded-lg bg-muted px-3 py-2 text-[11px]">
                <span>
                  Avg views: <strong>{formatNumber(result.channel.avgViews)}</strong>
                </span>
                <span className="text-muted-foreground">|</span>
                <span>
                  Threshold: <strong>{formatNumber(result.channel.avgViews * 2)}</strong>
                </span>
              </div>

              {result.outliers.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {result.message}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {result.outliers.map((video) => (
                    <OutlierRow key={video.videoId} video={video} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function OutlierRow({ video }: { video: OutlierVideo }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-2.5 transition-colors hover:bg-muted/50">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="size-16 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">{video.title}</p>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{formatNumber(video.views)} views</span>
          <span>{formatNumber(video.likes)} likes</span>
          <span>{formatNumber(video.comments)} comments</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {video.multiplier}x avg
          </span>
        </div>
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <ExternalLinkIcon className="size-3.5" />
      </a>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border p-2.5">
          <Skeleton className="size-16 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
