"use client"

import { useEffect } from "react"
import { AlertTriangleIcon, RotateCwIcon } from "lucide-react"

import "./globals.css"

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 py-16 text-center text-foreground antialiased">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangleIcon className="size-6 text-destructive" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground" role="alert">
            An unexpected error happened while loading this page. Try again, or
            refresh your browser.
          </p>
        </div>

        <button
          onClick={() => unstable_retry()}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RotateCwIcon className="size-4" />
          Try again
        </button>
      </body>
    </html>
  )
}