import { RadarIcon } from "lucide-react"

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import { NichesGrid } from "@/components/dashboard/niches-grid"

export default function NichesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Discover Niches"
        description="Hand-picked faceless channels that are already making money — real numbers, no guessing."
        icon={RadarIcon}
      />
      <NichesGrid />
    </div>
  )
}