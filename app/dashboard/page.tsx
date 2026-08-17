"use client"

import { RadarIcon } from "lucide-react"

import { AdminBootstrap } from "@/components/dashboard/admin-bootstrap"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import { NichesGrid } from "@/components/dashboard/niches-grid"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminBootstrap />

      <DashboardPageHeader
        title="Discover Niches"
        description="Hand-picked faceless channels that are already making money — real numbers, no guessing."
        icon={RadarIcon}
      />

      <NichesGrid />
    </div>
  )
}