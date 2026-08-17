import { Badge } from "@/components/ui/badge"

const features = [
  {
    emoji: "🔍",
    title: "Niche Discovery",
    description:
      "A live, hand-curated database of faceless channels across finance, health, history, travel, and more — filtered so you only see channels with real traction (1,000+ subscribers, consistent uploads, genuine English-language, non-spam content). No dead channels. No vanity metrics.",
    accent: "from-primary/10 to-transparent",
  },
  {
    emoji: "📈",
    title: "Outlier Videos",
    description:
      "Every channel is tracked for outlier performance — videos that hit 2x their channel's average views within the last ~140 days. This is the fastest way to see exactly which topic or hook is working right now, not six months ago.",
    accent: "from-accent/10 to-transparent",
  },
  {
    emoji: "🥊",
    title: "Competitor Analysis",
    description:
      "Already running a channel? Add any saved channel as a competitor and see the patterns behind their growth — title hooks, script structure, and the topics their audience actually cares about.",
    accent: "from-emerald-500/10 to-transparent",
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-28 border-t bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full px-3">
            Feature Deep-Dive
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to stop guessing
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${feature.accent} opacity-70`}
              />
              <div className="relative">
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border bg-background/80 text-2xl shadow-sm backdrop-blur-sm">
                  <span aria-hidden="true">{feature.emoji}</span>
                </div>
                <h3 className="font-display mb-3 text-xl font-bold">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}