import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server"
import { api } from "@/convex/_generated/api"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminGuard } from "@/components/admin/admin-guard"

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Admin",
  },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authed = await isAuthenticated()

  if (!authed) {
    redirect("/login")
  }

  let isAdmin = false
  try {
    isAdmin = await fetchAuthQuery(api.admin.isAdminUser, {})
  } catch {
    isAdmin = false
  }

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex w-full min-w-0 flex-1 flex-col">
        <AdminHeader />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <AdminGuard>{children}</AdminGuard>
        </div>
      </main>
    </SidebarProvider>
  )
}
