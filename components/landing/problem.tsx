import { ClockIcon, DollarSignIcon, SkullIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const pains = [
  {
    icon: ClockIcon,
    title: "Weeks of manual scrolling",
    description:
      "Hours every day hunting YouTube, guessing at niches, and praying you didn't pick a dead one.",
  },
  {
    icon: SkullIcon,
    title: "Copying channels that already died",
    description:
      "The channel you're modeling quietly stopped posting six months ago — you just didn't know yet.",
  },
  {
    icon: DollarSignIcon,
    title: "Paying $499 for a stale list",
    description:
      "A 'vetted' course PDF that was already outdated by the time the credit card cleared.",
  },
]

export function Problem() {
  return (
    <section id="problem" className="scroll-mt-28 border-t bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full px-3">
            The Problem
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Starting a faceless channel shouldn&apos;t feel like guessing in
            the dark.
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-5 text-center">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            You&apos;ve watched the videos.{" "}
            <span className="font-medium text-foreground">
              &ldquo;Pick a niche.&rdquo; &ldquo;Find what&apos;s working.&rdquo;
              &ldquo;Study the outliers.&rdquo;
            </span>
          </p>
          <p className="font-display text-xl font-semibold text-foreground sm:text-2xl">
            Cool — which niche? Whose channel? Which video actually blew up,
            and why?
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pains.map((pain) => (
            <div
              key={pain.title}
              className="rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-destructive/10">
                <pain.icon className="size-5 text-destructive" />
              </div>
              <h3 className="font-display mb-2 text-base font-semibold">
                {pain.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pain.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-lg font-medium text-foreground sm:text-xl">
            You don&apos;t need more advice.{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-semibold text-transparent">
              You need current, verified proof of what&apos;s working right now.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}