import { TrendingUpIcon } from "lucide-react"

const mockChannels = [
  { name: "WealthPaths Daily", niche: "Personal Finance", subs: "412K", mrr: "$8.2K", thumb: "from-emerald-500/70 to-teal-600/70", outlier: true },
  { name: "Ancient Echoes", niche: "History & Geography", subs: "287K", mrr: "$5.1K", thumb: "from-amber-500/70 to-orange-600/70", outlier: false },
  { name: "Mindful Minutes", niche: "Meditation & Wellness", subs: "195K", mrr: "$3.8K", thumb: "from-sky-500/70 to-indigo-600/70", outlier: true },
  { name: "Cold Case Files", niche: "True Crime", subs: "534K", mrr: "$12.4K", thumb: "from-rose-500/70 to-red-600/70", outlier: false },
  { name: "Space Frontier", niche: "Space & Science", subs: "148K", mrr: "$2.9K", thumb: "from-violet-500/70 to-purple-600/70", outlier: false },
  { name: "Quiet Living", niche: "Minimalism", subs: "96K", mrr: "$1.7K", thumb: "from-lime-500/70 to-green-600/70", outlier: true },
]

export function HeroVisual() {
  return (
    <div className="relative mx-auto mt-16 max-w-4xl">
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />

      <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-yellow-400" />
            <span className="size-3 rounded-full bg-green-400" />
          </div>
          <div className="ml-3 hidden h-6 flex-1 items-center rounded-full bg-background px-3 text-xs text-muted-foreground sm:flex">
            app.facelessbuddy.com/dashboard
          </div>
        </div>

        <div className="flex">
          <aside className="hidden w-44 shrink-0 flex-col gap-4 border-r bg-muted/20 p-4 md:flex">
            <div className="h-3 w-20 rounded-full bg-muted" />
            {["Discover Niches", "Saved Channels", "Outlier Videos"].map((item, i) => (
              <div key={item} className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${i === 0 ? "bg-primary" : "bg-muted"}`}
                />
                <div
                  className={`h-2.5 w-24 rounded-full ${
                    i === 0 ? "bg-primary/20" : "bg-muted"
                  }`}
                />
              </div>
            ))}
          </aside>

          <div className="flex-1 p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mockChannels.map((channel) => (
                <div
                  key={channel.name}
                  className="group rounded-xl border bg-card p-3 shadow-sm"
                >
                  <div
                    className={`relative mb-3 flex h-16 items-center justify-center rounded-lg bg-gradient-to-br ${channel.thumb}`}
                  >
                    {channel.outlier && (
                      <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        <TrendingUpIcon className="size-2.5" />
                        2.4x
                      </span>
                    )}
                  </div>
                  <div className="mb-1 truncate text-xs font-semibold">
                    {channel.name}
                  </div>
                  <div className="mb-2 text-[10px] text-muted-foreground">
                    {channel.niche}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {channel.subs} subs
                    </span>
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">
                      {channel.mrr}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}