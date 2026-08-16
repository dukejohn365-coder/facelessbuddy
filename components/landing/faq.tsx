import { ChevronDownIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const faqs = [
  {
    question: "How is this different from just scrolling YouTube myself?",
    answer:
      "You could spend 20+ hours a week manually searching, checking subscriber counts, and guessing which videos are outliers. FacelessBuddy does that scanning and vetting for you, continuously — and shows you the proof, not just a channel name.",
  },
  {
    question: "Is this AI-generated data I can't trust?",
    answer:
      "No. Every channel is manually approved by our team using real YouTube data (subscribers, views, upload history) before it appears in your dashboard. No AI guessing — just verified numbers.",
  },
  {
    question: "I'm a total beginner — will this actually help me pick a niche?",
    answer:
      "Yes. That's exactly who Niche Discovery is built for. You'll see real channels, in real niches, with real numbers — so you're not starting from a blank page.",
  },
  {
    question: "What if the niches shown don't fit what I want to do?",
    answer:
      "New channels are added regularly across a growing list of niches (finance, health, history, travel, and more). You can also add any channel as a competitor to study, even ones outside the current discovery list.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes — both paid plans include a 7-day free trial, and you can cancel anytime with one click.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-28 border-t py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full px-3">
            FAQ
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            The questions you&apos;re already asking
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border bg-card transition-colors open:border-primary/30 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-base font-semibold">
                  {faq.question}
                </span>
                <ChevronDownIcon className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}