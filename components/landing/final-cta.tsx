import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section className="border-t py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-16 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Your next faceless channel idea is already out there,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                making money.
              </span>{" "}
              Go find it.
            </h2>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-11 gap-2 rounded-full px-7 text-base shadow-lg shadow-primary/25"
                render={<Link href="/signup" />}
              >
                Start Free — See 3 Channels Now
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <CheckIcon className="size-3.5 text-primary" />
              No credit card required
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}