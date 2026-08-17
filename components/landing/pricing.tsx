import Link from "next/link"
import { CheckIcon, SparklesIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type PlanFeature = {
  label: string
  included: boolean
  highlighted?: boolean
}

const plans: {
  name: string
  price: string
  period: string
  cta: string
  highlight?: boolean
  features: PlanFeature[]
}[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    cta: "Start Free",
    features: [
      { label: "See 3 channels", included: true },
      { label: "Rest of the database shown blurred", included: true },
      { label: "Outlier video tracking", included: false },
      { label: "Competitor tools", included: false },
    ],
  },
  {
    name: "Starter",
    price: "$14",
    period: "/mo",
    cta: "Start Free Trial",
    highlight: true,
    features: [
      { label: "Full channel discovery", included: true },
      { label: "Outlier video tracking", included: true },
      { label: "Competitor analysis", included: false },
      { label: "7-day free trial", included: true, highlighted: true },
    ],
  },
  {
    name: "Growth",
    price: "$29",
    period: "/mo",
    cta: "Start Free Trial",
    features: [
      { label: "Everything in Starter", included: true },
      { label: "Competitor analysis", included: true },
      { label: "Priority access to new channels", included: true },
      { label: "7-day free trial", included: true, highlighted: true },
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-28 border-t bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full px-3">
            Pricing
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Cheaper than one course. Updated every week.
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3 md:items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-7 shadow-sm",
                plan.highlight &&
                  "border-primary/40 bg-primary/[0.03] shadow-lg shadow-primary/10 md:-my-3 md:py-10"
              )}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full px-3">
                  <SparklesIcon className="size-3" />
                  Most Popular
                </Badge>
              )}
              <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>

              <ul className="mt-7 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-start gap-2.5">
                    {feature.included ? (
                      <CheckIcon
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          feature.highlighted
                            ? "text-primary"
                            : "text-primary"
                        )}
                      />
                    ) : (
                      <XIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        feature.highlighted && "font-medium text-primary",
                        !feature.included && "text-muted-foreground/70"
                      )}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? "default" : "outline"}
                className="mt-8 w-full rounded-full"
                render={<Link href="/signup" />}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <Button
            size="lg"
            className="h-11 rounded-full px-7 text-base shadow-lg shadow-primary/25"
            render={<Link href="/signup" />}
          >
            Start your free trial — cancel anytime
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            No commitment. Cancel in one click during your 7-day trial and you
            won&apos;t be charged.
          </p>
        </div>
      </div>
    </section>
  )
}