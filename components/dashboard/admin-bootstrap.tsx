"use client"

import { useMutation, useQuery } from "convex/react"
import { ShieldCheckIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"

export function AdminBootstrap() {
  const isAdmin = useQuery(api.admin.isAdminUser)
  const hasAnyAdmins = useQuery(api.admin.hasAnyAdmins)
  const bootstrapAdmin = useMutation(api.admin.bootstrapAdmin)

  if (isAdmin === undefined || hasAnyAdmins === undefined) {
    return <Skeleton className="h-16 w-full" />
  }

  if (isAdmin || hasAnyAdmins) {
    return null
  }

  const handleBootstrap = async () => {
    try {
      const res = await bootstrapAdmin()
      if (res.bootstrapped) {
        toast.add({ title: "You are now an admin", type: "success" })
      }
    } catch (e) {
      toast.add({
        title: "Failed to become admin",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="size-5 text-muted-foreground" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium">No admins configured yet</p>
          <p className="text-sm text-muted-foreground">
            Become the first admin to approve channels and run discoveries.
          </p>
        </div>
      </div>
      <Button onClick={handleBootstrap}>Become admin</Button>
    </div>
  )
}
