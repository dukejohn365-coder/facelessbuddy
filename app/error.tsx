"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangleIcon, RadarIcon, RotateCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon className="size-6 text-destructive" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground" role="alert">
          An unexpected error happened while loading this page. Try again, or head
          back to safety.
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-muted-foreground/60">
            Error code: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => unstable_retry()}>
          <RotateCwIcon className="size-4" />
          Try again
        </Button>
        <Button variant="outline" render={<Link href="/" />}>
          <RadarIcon className="size-4" />
          Back to home
        </Button>
      </div>
    </div>
  )
}