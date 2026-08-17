import { RadarIcon } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
        <div className="relative flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <RadarIcon className="size-6" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Loading FacelessBuddy…</p>
    </div>
  )
}