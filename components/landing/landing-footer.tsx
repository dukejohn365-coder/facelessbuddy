import Link from "next/link"
import { RadarIcon } from "lucide-react"

const footerLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
]

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <RadarIcon className="size-3.5" />
            </div>
            <span className="font-display text-sm font-semibold">
              FacelessBuddy
            </span>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FacelessBuddy. All rights
            reserved.
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Made for faceless YouTube creators.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/refunds"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Refund Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}