import { UserCogIcon } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminsManager } from "@/components/admin/admins-manager"

export default function AdminAdminsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Admins"
        description="Manage who can approve channels and run discoveries."
        icon={UserCogIcon}
      />
      <AdminsManager />
    </div>
  )
}
