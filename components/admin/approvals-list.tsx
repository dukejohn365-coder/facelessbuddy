"use client"

import { useMutation, usePreloadedQuery } from "convex/react"
import type { Preloaded } from "convex/react"

import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"
import { AdminChannelCard } from "@/components/dashboard/channel-card"
import { toast } from "@/components/ui/toast"

export function ApprovalsList({
  preloadedPending,
  preloadedCounts,
}: {
  preloadedPending: Preloaded<typeof api.channels.listPendingChannels>
  preloadedCounts: Preloaded<typeof api.channels.listChannelStatusCounts>
}) {
  const pendingChannels = usePreloadedQuery(preloadedPending)
  const counts = usePreloadedQuery(preloadedCounts)
  const approve = useMutation(api.channels.approveChannel)
  const reject = useMutation(api.channels.rejectChannel)

  const handleApprove = async (channel: Doc<"channels">) => {
    try {
      await approve({ channelId: channel._id })
      toast.add({
        title: "Channel approved",
        description: `${channel.title} is now visible to users.`,
        type: "success",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't approve channel",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    }
  }

  const handleReject = async (channel: Doc<"channels">) => {
    try {
      await reject({ channelId: channel._id })
      toast.add({
        title: "Channel rejected",
        description: `${channel.title} was removed from pending channels.`,
        type: "info",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't reject channel",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    }
  }

  if (pendingChannels === undefined || counts === undefined) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Pending", value: counts.pending },
    { label: "Approved", value: counts.approved },
    { label: "Rejected", value: counts.rejected },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-xl border bg-card px-4 py-3 shadow-sm"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </span>
            <span className="text-2xl font-semibold tabular-nums">{stat.value}</span>
          </div>
        ))}
      </div>

      {pendingChannels.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
          <p className="text-sm font-medium">Nothing awaiting approval</p>
          <p className="text-sm text-muted-foreground">
            Run a scan in Discover to find new channels.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pendingChannels.map((channel) => (
            <AdminChannelCard
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
              }}
              onApprove={() => handleApprove(channel)}
              onReject={() => handleReject(channel)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
