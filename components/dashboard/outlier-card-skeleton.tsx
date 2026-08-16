import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function OutlierCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-3">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-3 w-2/3" />
        <div className="mt-2.5 flex items-center gap-2 border-t pt-2.5">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </CardContent>
    </Card>
  )
}