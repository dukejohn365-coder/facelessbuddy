"use client"

import { useState } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { Loader2Icon, RocketIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCompactNumber, formatDate } from "@/lib/format"

export function DiscoverTool() {
  const runDiscovery = useAction(api.discovery.runDiscovery)
  const seedDefaultKeywords = useMutation(api.keywords.seedDefaultKeywords)
  const keywords = useQuery(api.keywords.listKeywords)
  const runs = useQuery(api.discovery.listDiscoveryRuns)
  const counts = useQuery(api.channels.listChannelStatusCounts)

  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  if (keywords === undefined || runs === undefined || counts === undefined) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const activeCount = keywords.filter((k) => k.active).length

  const handleRun = async () => {
    setRunning(true)
    setError(null)
    setResult(null)
    const loadingToast = toast.add({
      title: "Discovery running",
      description: "Scanning YouTube for new channels across your keywords…",
      type: "loading",
    })
    try {
      const res = await runDiscovery({})
      const summary = `Found ${formatCompactNumber(res.uniqueChannelsFound)} unique channels (${formatCompactNumber(
        res.newChannels
      )} new) across ${res.keywordCount} keywords.`
      setResult(summary)
      toast.add({
        title: "Discovery complete",
        description: summary,
        type: "success",
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      toast.add({
        title: "Discovery failed",
        description: message,
        type: "error",
      })
    } finally {
      setRunning(false)
      toast.close(loadingToast)
    }
  }

  const handleSeed = async () => {
    try {
      await seedDefaultKeywords()
      toast.add({
        title: "Default keywords seeded",
        description: "Starter niches are ready for discovery.",
        type: "success",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't seed keywords",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Run niche discovery</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary">{activeCount} active keywords</Badge>
            <Badge variant="outline">{counts.pending} pending</Badge>
            <Badge variant="secondary">{counts.approved} approved</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Scans YouTube for videos from the last 90 days (4+ minutes) per active
            keyword, collects the channels behind them, and adds new finds as pending
            for your approval.
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={handleRun} disabled={running || activeCount === 0}>
              {running ? <Loader2Icon className="animate-spin" /> : <RocketIcon />}
              {running ? "Running…" : "Run Discovery"}
            </Button>
            {keywords.length === 0 && (
              <Button variant="outline" onClick={handleSeed}>
                Seed default keywords
              </Button>
            )}
          </div>
          {result && <p className="text-sm text-emerald-600 dark:text-emerald-400">{result}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Recent runs</h2>
        {runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No scans yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Found</TableHead>
                  <TableHead>New</TableHead>
                  <TableHead>Triggered by</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => (
                  <TableRow key={run._id}>
                    <TableCell>
                      <Badge
                        variant={
                          run.status === "completed"
                            ? "secondary"
                            : run.status === "failed"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(run.startedAt)}
                    </TableCell>
                    <TableCell>{run.keywordCount}</TableCell>
                    <TableCell>{formatCompactNumber(run.channelsFound)}</TableCell>
                    <TableCell>{formatCompactNumber(run.newChannels)}</TableCell>
                    <TableCell className="text-muted-foreground">{run.triggeredBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
