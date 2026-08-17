"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  GalleryVerticalEndIcon,
  BookmarkIcon,
  RadarIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  SwordsIcon,
  LogOutIcon,
} from "lucide-react"
import { useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

function getInitials(name: string | null | undefined) {
  if (!name) return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}

const navItems = [
  {
    title: "Discover Niches",
    href: "/dashboard/niches",
    icon: RadarIcon,
  },
  {
    title: "Saved Channels",
    href: "/dashboard/saved-channels",
    icon: BookmarkIcon,
  },
  {
    title: "Outlier Videos",
    href: "/dashboard/outliers",
    icon: TrendingUpIcon,
  },
  {
    title: "Competitor Analysis",
    href: "/dashboard/competitor-analysis",
    icon: SwordsIcon,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { state } = useSidebar()
  const isAdmin = useQuery(api.admin.isAdminUser)
  const { data: session } = authClient.useSession()
  const user = session?.user

  const isItemActive = (href: string) => {
    if (href === "/dashboard/niches") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/niches")
    }
    return pathname === href
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEndIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">FacelessBuddy</span>
                <span className="truncate text-xs">Niche Discovery</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isItemActive(item.href)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      render={<a href={item.href} />}
                      className={cn(
                        active &&
                          "data-active:bg-primary/10 data-active:font-semibold data-active:text-primary"
                      )}
                    >
                      {active && (
                        <span
                          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary transition-all"
                          aria-hidden="true"
                        />
                      )}
                      <item.icon />
                      <span className="flex-1">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === "/admin"}
                    render={<a href="/admin" />}
                    className={cn(
                      pathname === "/admin" &&
                        "data-active:bg-primary/10 data-active:font-semibold data-active:text-primary"
                    )}
                  >
                    {pathname === "/admin" && (
                      <span
                        className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary transition-all"
                        aria-hidden="true"
                      />
                    )}
                    <ShieldCheckIcon />
                    <span className="flex-1">Admin</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8 rounded-full">
                      <AvatarImage
                        src={user?.image ?? undefined}
                        alt={user?.name ?? ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-medium">{user?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                side={state === "collapsed" ? "right" : "top"}
                align="start"
                sideOffset={8}
                className="w-64"
              >
                <DropdownMenuLabel className="flex flex-col gap-1 py-2.5">
                  <span className="truncate text-sm font-medium">{user?.name}</span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
