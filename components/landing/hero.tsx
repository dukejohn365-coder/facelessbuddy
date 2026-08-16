import Link from "next/link"
import { ArrowRightIcon, CheckIcon, RadarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HeroVisual } from "@/components/landing/hero-visual"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-64 -right-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 h-6 gap-1.5 rounded-full px-3">
            <RadarIcon className="size-3" />
            For faceless YouTube creators
          </Badge>

          <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find Profitable,{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Unsaturated Faceless Channels
            </span>{" "}
            to Start
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Stop guessing which faceless channel to start. See the ones already
            printing money — hand-vetted, with real numbers and proof.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="h-11 gap-2 rounded-full px-7 text-base shadow-lg shadow-primary/25"
              render={<Link href="/signup" />}
            >
              See 3 Channels Free
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-3.5 text-primary" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-3.5 text-primary" />
              Free forever plan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-3.5 text-primary" />
              Cancel anytime
            </span>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}