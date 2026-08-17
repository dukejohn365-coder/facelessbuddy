import type { LucideIcon } from "lucide-react"

export function DashboardPageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon?: LucideIcon
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
          <Icon className="size-5 text-primary" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}