import { FileTextIcon, RefreshCwIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { HeroVisual } from "@/components/landing/hero-visual"

export function SocialProof() {
  return (
    <section id="proof" className="scroll-mt-28 border-t py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full px-3">
            Proof, Not Promises
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            This is what $499 courses sell you as a PDF. We give you the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              live dashboard.
            </span>
          </h2>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm text-destructive">
            <FileTextIcon className="size-4" />
            $499 PDF — outdated the moment you buy
          </div>
          <span className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            vs
          </span>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <RefreshCwIcon className="size-4" />
            FacelessBuddy — updated every week
          </div>
        </div>

        <HeroVisual />

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every channel here is manually approved by our team, then tracked
          automatically for outlier performance. No AI guesswork. No outdated
          screenshots. Just real, current data.
        </p>
      </div>
    </section>
  )
}