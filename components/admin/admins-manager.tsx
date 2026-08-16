"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { PlusIcon, Trash2Icon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function AdminsManager() {
  const admins = useQuery(api.admin.getAdmins)
  const addAdmin = useMutation(api.admin.addAdmin)
  const removeAdmin = useMutation(api.admin.removeAdmin)

  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (admins === undefined) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  const handleAdd = async () => {
    if (!email.trim() || submitting) return
    setSubmitting(true)
    try {
      await addAdmin({ email })
      toast.add({
        title: "Admin added",
        description: `${email.trim()} can now access the dashboard.`,
        type: "success",
      })
      setEmail("")
    } catch (e) {
      toast.add({
        title: "Couldn't add admin",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (admin: Doc<"admins">) => {
    try {
      await removeAdmin({ adminId: admin._id })
      toast.add({
        title: "Admin removed",
        description: `${admin.email} no longer has dashboard access.`,
        type: "info",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't remove admin",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="grid max-w-sm gap-2">
        <Label htmlFor="admin-email">Email</Label>
        <div className="flex items-center gap-2">
          <Input
            id="admin-email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={submitting}>
            <PlusIcon />
            Add
          </Button>
        </div>
      </div>

      {admins.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No admins yet. Add an admin email to grant dashboard access.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table className="min-w-[480px]">
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${admin.email}`}
                        onClick={() => handleRemove(admin)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
