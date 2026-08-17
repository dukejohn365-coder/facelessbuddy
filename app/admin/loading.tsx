import { PageHeaderSkeleton } from "@/components/dashboard/page-header-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton />
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}