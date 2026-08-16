"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangleIcon, RotateCwIcon, ShieldCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AdminError({
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
    <div className="flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed bg-background/50 px-4 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon className="size-6 text-destructive" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-xl font-semibold tracking-tight">
          This view hit a snag
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground" role="alert">
          We couldn&apos;t load this part of the admin panel. No changes were made —
          try again.
        </p>
        {error.digest && (
          <p className="mt-0.5 text-xs text-muted-foreground/60">
            Error code: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => unstable_retry()} size="sm">
          <RotateCwIcon className="size-4" />
          Try again
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/admin" />}
        >
          <ShieldCheckIcon className="size-4" />
          Go to approvals
        </Button>
      </div>
    </div>
  )
}