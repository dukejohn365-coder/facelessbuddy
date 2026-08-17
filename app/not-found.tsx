import Link from "next/link"
import { RadarIcon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
        <RadarIcon className="size-7" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-display text-6xl font-bold tracking-tight">404</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          This page isn&apos;t on our radar
        </h1>
        <p className="mx-auto flex max-w-md items-start justify-center gap-1.5 text-sm leading-relaxed text-muted-foreground">
          <SearchXIcon className="mt-0.5 size-4 shrink-0" />
          The page you&apos;re looking for was moved, deleted, or never existed in
          the first place.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button render={<Link href="/" />}>
          Back to home
        </Button>
        <Button variant="outline" render={<Link href="/dashboard" />}>
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}