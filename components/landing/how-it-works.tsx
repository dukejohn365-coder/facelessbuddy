import { RadarIcon, TrendingUpIcon, SwordsIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const steps = [
  {
    number: "01",
    title: "Discover",
    icon: RadarIcon,
    description:
      "Browse a growing, hand-vetted list of faceless channels — real subscriber counts, estimated monthly revenue, and channel age, all in one dashboard.",
  },
  {
    number: "02",
    title: "Study the Outliers",
    icon: TrendingUpIcon,
    description:
      "Every channel comes with proof: the single video that outperformed its own average by 2x or more. See exactly what hook, topic, or format made it take off.",
  },
  {
    number: "03",
    title: "Analyze & Copy What Works",
    icon: SwordsIcon,
    description:
      "Save channels, add them as competitors, and break down their title hooks, script patterns, and audience interests — so your first video isn't a guess.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-28 border-t py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full px-3">
            How It Works
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            From &ldquo;which niche?&rdquo; to proven winners in 3 steps
          </h2>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-1/2 hidden h-px w-full bg-border md:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border bg-card shadow-sm">
                  <step.icon className="size-7 text-primary" />
                </div>
                <div className="font-display mb-2 text-xs font-semibold tracking-widest text-primary">
                  Step {step.number}
                </div>
                <h3 className="font-display mb-3 text-xl font-bold">
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}