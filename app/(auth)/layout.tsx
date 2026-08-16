import { GalleryVerticalEndIcon, RadarIcon } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            FacelessBuddy
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/70" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 size-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative flex h-full flex-col items-start justify-between p-10">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-white/15 text-white">
              <RadarIcon className="size-4" />
            </div>
            <span className="text-sm font-semibold text-white">
              FacelessBuddy
            </span>
          </div>
          <div className="flex flex-col gap-6">
            <p className="font-heading max-w-sm text-3xl font-bold tracking-tight text-white">
              Stop guessing. Start with channels already printing money.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-white" />
                Hand-vetted faceless channels
              </div>
              <div className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-accent-foreground" />
                Outlier videos & real numbers
              </div>
              <div className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-emerald-300" />
                Updated every week
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
