import { Skeleton } from "@/components/ui/skeleton"

export function DiscoverToolSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border bg-card p-5">
        <Skeleton className="h-5 w-40" />
        <div className="mt-3 flex items-center gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-4 w-3/4" />
        <Skeleton className="mt-4 h-10 w-36 rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-24" />
        <div className="overflow-hidden rounded-xl border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}