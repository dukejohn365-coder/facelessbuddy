import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ChannelCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card py-0">
      <CardContent className="p-3.5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-7 w-7 shrink-0 rounded-md" />
        </div>

        <Skeleton className="mt-2 h-5 w-16 rounded-md" />

        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-border">
          <div className="grid grid-cols-2 gap-px">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5 bg-card px-2.5 py-2.5">
                <Skeleton className="h-2.5 w-10" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-16 rounded-md" />
          ))}
        </div>

        <div className="mt-2.5 rounded-lg border border-border bg-card p-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-12 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex gap-1.5">
          <Skeleton className="h-7 flex-1 rounded-md" />
          <Skeleton className="h-7 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}