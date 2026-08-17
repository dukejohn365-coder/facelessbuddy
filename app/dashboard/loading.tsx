import { ChannelCardSkeleton } from "@/components/dashboard/channel-card-skeleton"
import { PageHeaderSkeleton } from "@/components/dashboard/page-header-skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ChannelCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}