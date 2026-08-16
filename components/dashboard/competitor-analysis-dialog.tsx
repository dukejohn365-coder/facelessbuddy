"use client"

import { useState } from "react"
import { useAction } from "convex/react"
import {
  SwordsIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  ExternalLinkIcon,
} from "lucide-react"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"

import { formatNumber } from "@/lib/format"

interface AnalysisDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  channelId: Id<"channels"> | null
  channelTitle: string
}

type AnalysisResult = {
  channel: {
    title: string
    subscriberCount: number
    avgViews: number
    videoCount: number
  }
  titlePatterns: {
    words: { word: string; count: number }[]
    bigrams: { phrase: string; count: number }[]
  }
  uploadFrequency: string
  viewTrend: "growing" | "stable" | "declining"
  topVideos: {
    videoId: string
    title: string
    views: number
    likes: number
    publishedAt: string
  }[]
}

function TrendIcon({ trend }: { trend: "growing" | "stable" | "declining" }) {
  if (trend === "growing") return <TrendingUpIcon className="size-4 text-emerald-500" />
  if (trend === "declining") return <TrendingDownIcon className="size-4 text-red-500" />
  return <MinusIcon className="size-4 text-muted-foreground" />
}

export function AnalysisDialog({
  open,
  onOpenChange,
  channelId,
  channelTitle,
}: AnalysisDialogProps) {
  const analyzeCompetitor = useAction(api.competitors.analyzeCompetitor)

  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = async (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (isOpen && channelId && !result && !loading) {
      setLoading(true)
      setError(null)
      try {
        const data = await analyzeCompetitor({ channelId })
        setResult(data)
        toast.add({
          title: "Analysis complete",
          description: `Breakdown ready for ${channelTitle} — ${data.topVideos.length} top videos found.`,
          type: "success",
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to analyze channel"
        setError(message)
        toast.add({
          title: "Failed to analyze channel",
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
            <SwordsIcon className="size-4" />
            Analysis — {channelTitle}
          </DialogTitle>
          <DialogDescription>
            Title patterns, upload frequency, and top performing videos
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
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-muted px-3 py-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Avg Views</p>
                  <p className="text-sm font-semibold">{formatNumber(result.channel.avgViews)}</p>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Uploads</p>
                  <p className="text-sm font-semibold">{result.channel.videoCount}</p>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Cadence</p>
                  <p className="text-[11px] font-semibold">{result.uploadFrequency}</p>
                </div>
              </div>

              {/* View Trend */}
              <div className="flex items-center gap-2 rounded-lg border p-2.5">
                <TrendIcon trend={result.viewTrend} />
                <span className="text-[11px] font-medium capitalize">{result.viewTrend}</span>
                <span className="text-[10px] text-muted-foreground">view trend</span>
              </div>

              {/* Title Patterns - Words */}
              {result.titlePatterns.words.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Top Title Words
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {result.titlePatterns.words.slice(0, 10).map((item) => (
                      <Badge
                        key={item.word}
                        variant="secondary"
                        className="text-[10px] font-normal"
                      >
                        {item.word} ({item.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Title Patterns - Bigrams */}
              {result.titlePatterns.bigrams.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Common Title Phrases
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {result.titlePatterns.bigrams.slice(0, 8).map((item) => (
                      <Badge
                        key={item.phrase}
                        variant="outline"
                        className="text-[10px] font-normal"
                      >
                        &quot;{item.phrase}&quot; ({item.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Videos */}
              {result.topVideos.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Top Performing Videos
                  </p>
                  <div className="space-y-1.5">
                    {result.topVideos.map((video) => (
                      <div
                        key={video.videoId}
                        className="flex items-center gap-2 rounded-md border p-2 text-[11px]"
                      >
                        <div className="min-w-0 flex-1 truncate font-medium">
                          {video.title}
                        </div>
                        <span className="shrink-0 text-muted-foreground">
                          {formatNumber(video.views)} views
                        </span>
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLinkIcon className="size-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-2/3" />
      <div className="space-y-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}