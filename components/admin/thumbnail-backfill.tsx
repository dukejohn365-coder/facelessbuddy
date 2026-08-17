"use client"

import { useState } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2Icon, RefreshCwIcon } from "lucide-react"
import { toast } from "@/components/ui/toast"

export function ThumbnailBackfill() {
  const backfillThumbnails = useAction(api.channelsBackfill.backfillThumbnails)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    updated?: number
    total?: number
    message?: string
  } | null>(null)

  const handleBackfill = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await backfillThumbnails()
      setResult(response)
      if (response.updated !== undefined) {
        toast.add({
          title: "Thumbnails refreshed",
          description: `Updated ${response.updated} of ${response.total ?? response.updated} channel thumbnails.`,
          type: "success",
        })
      } else {
        toast.add({
          title: "Thumbnails refreshed",
          description: response.message ?? "Channel thumbnails are up to date.",
          type: "success",
        })
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to backfill thumbnails"
      setResult({ message })
      toast.add({
        title: "Failed to backfill thumbnails",
        description: message,
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleBackfill}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2Icon className="mr-2 size-4 animate-spin" />
        ) : (
          <RefreshCwIcon className="mr-2 size-4" />
        )}
        Backfill Thumbnails
      </Button>
      {result && (
        <Badge variant={result.updated ? "default" : "secondary"}>
          {result.message}
        </Badge>
      )}
    </div>
  )
}
