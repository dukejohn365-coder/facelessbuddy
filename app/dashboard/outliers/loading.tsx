import { OutlierCardSkeleton } from "@/components/dashboard/outlier-card-skeleton"
import { PageHeaderSkeleton } from "@/components/dashboard/page-header-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function OutliersLoading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton />
      <Skeleton className="h-10 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <OutlierCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}