"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import {
  BarChart3Icon,
  BookmarkCheckIcon,
  BookmarkIcon,
  CircleDollarSignIcon,
  RadarIcon,
  SproutIcon,
  TagIcon,
  TrendingUpIcon,
  UserXIcon,
} from "lucide-react"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OutlierDialog } from "@/components/dashboard/outlier-dialog"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

import {
  channelUrl,
  formatChannelAge,
  formatCompactNumber,
  formatNumber,
} from "@/lib/format"

interface ChannelData {
  _id: Id<"channels">
  channelId: string
  title: string
  thumbnailUrl?: string
  category: string
  subscriberCount: number
  videoCount: number
  viewCount: number
  channelPublishedAt?: string
  keyword: string
  channelAgeInMonths?: number
  avgViews?: number
  estimatedMrr?: number
  topOutlierVideo?: {
    videoId: string
    title: string
    thumbnailUrl: string
    views: number
    multiplier: number
  }
}

interface ChannelCardProps {
  channel: ChannelData
  onAnalyze?: () => void
  onAddCompetitor?: () => void
}

function initials(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}

function getNiche(channel: ChannelData): string {
  const [first] = channel.category
    .split(/[,&]/)
    .map((c) => c.trim())
    .filter(Boolean)
  return first ?? "Niche"
}

function computeStats(channel: ChannelData) {
  const avgViews = channel.avgViews ??
    (channel.videoCount > 0 ? Math.round(channel.viewCount / channel.videoCount) : 0)

  const monthlyViews = avgViews * 4
  const estimatedRevenueLow = channel.estimatedMrr ?? Math.round(monthlyViews * 0.012)
  const estimatedRevenueHigh = channel.estimatedMrr
    ? Math.round(channel.estimatedMrr * 1.9)
    : Math.round(monthlyViews * 0.035)

  return { avgViews, estimatedRevenueLow, estimatedRevenueHigh }
}

function getSignals(channel: ChannelData) {
  return [
    {
      key: "profitable",
      label: "Profitable",
      hint: "5,000+ subscribers — the channel makes real money",
      icon: CircleDollarSignIcon,
      enabled: channel.subscriberCount >= 5000,
    },
    {
      key: "unsaturated",
      label: "Unsaturated",
      hint: "Fewer than 500 videos — less competition",
      icon: RadarIcon,
      enabled: channel.videoCount < 500,
    },
    {
      key: "faceless-ready",
      label: "Faceless-ready",
      hint: "No personal vlog content",
      icon: UserXIcon,
      enabled: !channel.title.toLowerCase().includes("vlog"),
    },
    {
      key: "beginner-viable",
      label: "Beginner-viable",
      hint: "Under 50,000 subscribers — room to grow",
      icon: SproutIcon,
      enabled: channel.subscriberCount < 50000,
    },
  ]
}

function StatCell({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 bg-card px-2.5 py-2">
      <span className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground/60">
        {label}
      </span>
      <span
        className={cn(
          "text-[0.8125rem] leading-none font-medium tabular-nums",
          accent ? "text-primary" : "text-foreground"
        )}
      >
        {value}
        {sub && (
          <span className="ml-0.5 text-[0.625rem] font-normal text-muted-foreground">
            {sub}
          </span>
        )}
      </span>
    </div>
  )
}

function StatGrid({ channel, stats }: { channel: ChannelData; stats: ReturnType<typeof computeStats> }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border bg-border">
      <div className="grid grid-cols-2 gap-px">
        <StatCell label="Avg Views" value={formatCompactNumber(stats.avgViews)} />
        <StatCell
          label="Growth"
          value={`+${formatCompactNumber(Math.round(channel.subscriberCount / 9))}`}
          sub="/mo"
          accent
        />
        <StatCell
          label="Revenue"
          value={`$${stats.estimatedRevenueLow}–${stats.estimatedRevenueHigh}`}
        />
        <StatCell label="Uploads" value={formatNumber(channel.videoCount)} />
      </div>
    </div>
  )
}

function SignalRow({ channel }: { channel: ChannelData }) {
  const signals = getSignals(channel)
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
      {signals.map((signal) => (
        <span
          key={signal.key}
          title={signal.hint}
          aria-label={signal.hint}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[0.5625rem] font-medium transition-colors",
            signal.enabled
              ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "bg-muted text-muted-foreground/40"
          )}
        >
          <signal.icon className="size-3" />
          {signal.label}
        </span>
      ))}
    </div>
  )
}

function TopOutlier({ channel }: { channel: ChannelData }) {
  if (!channel.topOutlierVideo) return null
  return (
    <div className="mt-2.5 rounded-lg border border-primary/20 bg-primary/5 p-2">
      <div className="mb-1 flex items-center gap-1.5">
        <TrendingUpIcon className="size-3 text-primary" />
        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-primary">
          Top Outlier
        </span>
      </div>
      <div className="flex items-center gap-2">
        <img
          src={channel.topOutlierVideo.thumbnailUrl}
          alt={channel.topOutlierVideo.title}
          className="size-12 shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.6875rem] font-medium text-foreground">
            {channel.topOutlierVideo.title}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-[0.625rem] text-muted-foreground">
            <span>{formatNumber(channel.topOutlierVideo.views)} views</span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-primary">
              {channel.topOutlierVideo.multiplier}x avg
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function thumbnailSrc(channel: ChannelData): string {
  return (
    channel.thumbnailUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.title)}&background=1a1a2e&color=94a3b8&size=96`
  )
}

function CardHeader({
  channel,
  rightSlot,
}: {
  channel: ChannelData
  rightSlot?: React.ReactNode
}) {
  const niche = getNiche(channel)
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <Avatar className="size-9 ring-1 ring-border transition-transform duration-200 group-hover:scale-105">
          <AvatarImage src={thumbnailSrc(channel)} alt={channel.title} />
          <AvatarFallback className="bg-muted text-[0.6875rem] font-medium text-muted-foreground">
            {initials(channel.title)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <Link
            href={channelUrl(channel.channelId)}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-[0.8125rem] font-medium text-foreground transition-colors hover:text-primary"
          >
            {channel.title}
          </Link>
          <p className="text-[0.6875rem] text-muted-foreground">
            {formatCompactNumber(channel.subscriberCount)} subs ·{" "}
            {formatChannelAge(channel.channelPublishedAt)}
          </p>
        </div>

        {rightSlot}
      </div>

      <span
        className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-primary"
        title={channel.keyword ? `Found via: ${channel.keyword}` : niche}
      >
        <TagIcon className="size-3" />
        {niche}
      </span>
    </div>
  )
}

export function ChannelCard({ channel, onAnalyze, onAddCompetitor }: ChannelCardProps) {
  const stats = computeStats(channel)

  const isSaved = useQuery(api.savedChannels.isChannelSaved, {
    channelId: channel._id,
  })
  const toggleSave = useMutation(api.savedChannels.toggleSave)
  const [outlierOpen, setOutlierOpen] = useState(false)

  const handleToggleSave = async () => {
    try {
      const res = await toggleSave({ channelId: channel._id })
      toast.add({
        title: res.saved ? "Channel saved" : "Channel unsaved",
        description: res.saved
          ? `${channel.title} added to your saved channels.`
          : `${channel.title} removed from saved channels.`,
        type: res.saved ? "success" : "info",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't update saved channels",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    }
  }

  const hasActions = onAnalyze || onAddCompetitor || isSaved

  return (
    <Card className="group overflow-hidden border-border bg-card py-0 transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <CardContent className="p-3.5">
        <CardHeader
          channel={channel}
          rightSlot={
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-foreground sm:h-7 sm:w-7"
              onClick={handleToggleSave}
              aria-label={isSaved ? "Unsave channel" : "Save channel"}
            >
              {isSaved ? (
                <BookmarkCheckIcon className="size-3.5 text-primary" />
              ) : (
                <BookmarkIcon className="size-3.5" />
              )}
            </Button>
          }
        />

        <StatGrid channel={channel} stats={stats} />

        <SignalRow channel={channel} />

        <TopOutlier channel={channel} />

        {hasActions && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {onAnalyze && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex-1 text-[0.6875rem] font-medium sm:h-7"
                onClick={onAnalyze}
              >
                <BarChart3Icon className="mr-1 size-3" />
                Analyze
              </Button>
            )}
            {onAddCompetitor && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex-1 text-[0.6875rem] font-medium sm:h-7"
                onClick={onAddCompetitor}
              >
                Add Competitor
              </Button>
            )}
            {isSaved && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex-1 text-[0.6875rem] font-medium sm:h-7"
                onClick={() => setOutlierOpen(true)}
              >
                <TrendingUpIcon className="mr-1 size-3" />
                Find Outliers
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <OutlierDialog
        open={outlierOpen}
        onOpenChange={setOutlierOpen}
        channelId={channel._id}
        channelTitle={channel.title}
      />
    </Card>
  )
}

export function AdminChannelCard({
  channel,
  onApprove,
  onReject,
}: ChannelCardProps & {
  onApprove: () => void
  onReject: () => void
}) {
  const stats = computeStats(channel)

  return (
    <Card className="group overflow-hidden border-border bg-card py-0 transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <CardContent className="p-3.5">
        <CardHeader channel={channel} />

        <StatGrid channel={channel} stats={stats} />

        <SignalRow channel={channel} />

        <TopOutlier channel={channel} />

        <div className="mt-2.5 flex gap-1.5">
          <Button
            variant="default"
            size="sm"
            className="h-7 flex-1 text-[0.6875rem] font-medium"
            onClick={onApprove}
          >
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 flex-1 text-[0.6875rem] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={onReject}
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { type ChannelData }