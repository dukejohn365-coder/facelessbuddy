import { DiscoverToolSkeleton } from "@/components/dashboard/discover-tool-skeleton"
import { PageHeaderSkeleton } from "@/components/dashboard/page-header-skeleton"

export default function DiscoverLoading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton />
      <DiscoverToolSkeleton />
    </div>
  )
}