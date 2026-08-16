import { KeyRoundIcon } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { KeywordsManager } from "@/components/admin/keywords-manager"
import { api } from "@/convex/_generated/api"
import { preloadAuthQuery } from "@/lib/auth-server"

export default async function AdminKeywordsPage() {
  const preloadedKeywords = await preloadAuthQuery(api.keywords.listKeywords, {})

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Keywords"
        description="Seed niches decide what we scan for. Manage the niches and the search terms that feed discovery."
        icon={KeyRoundIcon}
      />
      <KeywordsManager preloadedKeywords={preloadedKeywords} />
    </div>
  )
}