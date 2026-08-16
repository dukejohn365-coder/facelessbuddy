import Link from "next/link"
import { RadarIcon } from "lucide-react"

interface LegalLayoutProps {
  title: string
  updated: string
  children: React.ReactNode
}

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <RadarIcon className="size-3.5" />
            </div>
            <span className="font-display text-sm font-semibold">
              FacelessBuddy
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-muted-foreground">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: {updated}
        </p>
        <div className="mt-10">{children}</div>
      </main>

      <footer className="border-t bg-muted/30">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>
            &copy; {new Date().getFullYear()} FacelessBuddy. All rights
            reserved.
          </span>
          <nav className="flex items-center gap-5">
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/refunds" className="transition-colors hover:text-foreground">
              Refunds
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export function LegalLead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg leading-relaxed text-foreground/90">{children}</p>
  )
}

export function LegalH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 font-display text-xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  )
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  )
}

export function LegalUl({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </ul>
  )
}

export function LegalOl({ children }: { children: React.ReactNode }) {
  return (
    <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </ol>
  )
}

export function LegalLi({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>
}

export function LegalNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border bg-muted/50 p-4 text-sm leading-relaxed text-foreground/90">
      {children}
    </div>
  )
}