import { ImageIcon, ShieldCheckIcon } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ApprovalsList } from "@/components/admin/approvals-list"
import { ThumbnailBackfill } from "@/components/admin/thumbnail-backfill"
import { api } from "@/convex/_generated/api"
import { preloadAuthQuery } from "@/lib/auth-server"

export default async function AdminPage() {
  const preloadedPending = await preloadAuthQuery(
    api.channels.listPendingChannels,
    {}
  )
  const preloadedCounts = await preloadAuthQuery(
    api.channels.listChannelStatusCounts,
    {}
  )

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Channel Approvals"
        description="Review newly found channels and approve the ones worth adding to the marketplace."
        icon={ShieldCheckIcon}
      />
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ImageIcon className="size-4 text-muted-foreground" />
            Thumbnails
          </h2>
          <p className="text-xs text-muted-foreground">
            Re-fetch missing channel thumbnails from YouTube.
          </p>
        </div>
        <ThumbnailBackfill />
      </div>
      <ApprovalsList
        preloadedPending={preloadedPending}
        preloadedCounts={preloadedCounts}
      />
    </div>
  )
}
