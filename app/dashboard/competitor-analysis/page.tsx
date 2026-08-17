"use client"

import { SwordsIcon } from "lucide-react"

import { CompetitorAnalysisView } from "@/components/dashboard/competitor-analysis-view"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"

export default function CompetitorAnalysisPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Competitor Analysis"
        description="See the patterns behind your competitors — title hooks, posting rhythm, and the videos their audience loves."
        icon={SwordsIcon}
      />
      <CompetitorAnalysisView />
    </div>
  )
}