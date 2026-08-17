import { Skeleton } from "@/components/ui/skeleton"

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="size-10 shrink-0 rounded-lg" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
    </div>
  )
}