import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { isAuthenticated } from "@/lib/auth-server"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s · Dashboard",
  },
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authed = await isAuthenticated()

  if (!authed) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex w-full min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
