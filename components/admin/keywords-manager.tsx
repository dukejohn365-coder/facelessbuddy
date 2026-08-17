"use client"

import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useMutation, usePreloadedQuery } from "convex/react"
import type { Preloaded } from "convex/react"
import {
  KeyRoundIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react"

import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"

type Filter = "all" | "active" | "inactive"

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export function KeywordsManager({
  preloadedKeywords,
}: {
  preloadedKeywords: Preloaded<typeof api.keywords.listKeywords>
}) {
  const keywords = usePreloadedQuery(preloadedKeywords)

  const addKeyword = useMutation(api.keywords.addKeyword)
  const toggleKeyword = useMutation(api.keywords.toggleKeyword)
  const deleteKeyword = useMutation(api.keywords.deleteKeyword)
  const seedDefaultKeywords = useMutation(api.keywords.seedDefaultKeywords)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [keywordInput, setKeywordInput] = useState("")
  const [nicheInput, setNicheInput] = useState("")
  const [prevCategories, setPrevCategories] = useState<string[] | null>(null)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [submitting, setSubmitting] = useState(false)
  const [seeding, setSeeding] = useState(false)

  const categories = useMemo(
    () => [...new Set((keywords ?? []).map((k) => k.category))].sort(),
    [keywords]
  )

  if (prevCategories !== categories) {
    setPrevCategories(categories)
    const first = categories[0] ?? null
    setSelectedCategory((current) =>
      current !== null && categories.includes(current) ? current : first
    )
    setNicheInput((current) =>
      current === "" || current === null || !categories.includes(current)
        ? first ?? ""
        : current
    )
  }

  const niches = useMemo(() => {
    const grouped = new Map<string, Doc<"keywords">[]>()
    for (const k of keywords ?? []) {
      const arr = grouped.get(k.category) ?? []
      arr.push(k)
      grouped.set(k.category, arr)
    }
    return [...grouped.entries()].map(([category, items]) => ({
      category,
      total: items.length,
      active: items.filter((k) => k.active).length,
      items,
    }))
  }, [keywords])

  const selected = niches.find((n) => n.category === selectedCategory) ?? null

  const filteredKeywords = useMemo(() => {
    if (!selected) return []
    const q = query.trim().toLowerCase()
    return selected.items.filter((k) => {
      if (filter === "active" && !k.active) return false
      if (filter === "inactive" && k.active) return false
      if (q && !k.keyword.toLowerCase().includes(q)) return false
      return true
    })
  }, [selected, query, filter])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const kw = keywordInput.trim().toLowerCase()
    const cat = nicheInput.trim()
    if (!kw || !cat || submitting) return
    setSubmitting(true)
    try {
      await addKeyword({ keyword: kw, category: cat })
      setSelectedCategory(cat)
      setKeywordInput("")
      toast.add({
        title: "Keyword added",
        description: `"${kw}" added to ${cat}.`,
        type: "success",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't add keyword",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSeed = async () => {
    if (seeding) return
    setSeeding(true)
    try {
      const res = await seedDefaultKeywords()
      toast.add({
        title: res.seeded ? "Starter niches seeded" : "Nothing to seed",
        description: res.seeded
          ? `Added ${res.inserted} keywords across the default niches.`
          : "Keywords already exist.",
        type: "success",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't seed keywords",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    } finally {
      setSeeding(false)
    }
  }

  const handleToggle = async (keyword: Doc<"keywords">, active: boolean) => {
    try {
      await toggleKeyword({ keywordId: keyword._id, active })
      toast.add({
        title: active ? "Keyword activated" : "Keyword deactivated",
        description: `"${keyword.keyword}" is now ${active ? "included" : "excluded"} from discoveries.`,
        type: active ? "success" : "info",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't update keyword",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    }
  }

  const handleDelete = async (keyword: Doc<"keywords">) => {
    try {
      await deleteKeyword({ keywordId: keyword._id })
      toast.add({
        title: "Keyword deleted",
        description: `"${keyword.keyword}" was removed from ${keyword.category}.`,
        type: "info",
      })
    } catch (e) {
      toast.add({
        title: "Couldn't delete keyword",
        description: e instanceof Error ? e.message : String(e),
        type: "error",
      })
    }
  }

  if (keywords === undefined) {
    return (
      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
      <aside className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Seed Niches</h2>
          <Badge variant="secondary">{niches.length}</Badge>
        </div>

        {niches.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-4">
            <p className="text-sm text-muted-foreground">
              No seed niches yet. Seed the starter list or add keywords below.
            </p>
            <Button onClick={handleSeed} disabled={seeding} size="sm">
              {seeding ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <SparklesIcon />
              )}
              Seed starter niches
            </Button>
          </div>
        ) : (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {niches.map((n) => {
              const active = n.category === selectedCategory
              const pct = n.total > 0 ? Math.round((n.active / n.total) * 100) : 0
              return (
                <button
                  key={n.category}
                  type="button"
                  onClick={() => setSelectedCategory(n.category)}
                  className={cn(
                    "flex min-w-56 shrink-0 cursor-pointer flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors lg:min-w-0",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {n.category}
                    </span>
                    <Badge variant={active ? "default" : "outline"}>{n.total}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {n.active}/{n.total}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </aside>

      <section className="flex flex-col gap-4">
        {selected ? (
          <>
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-base font-semibold">{selected.category}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selected.active} of {selected.total} keywords active
                  </p>
                </div>
                <Badge
                  variant={
                    selected.total > 0 && selected.active === selected.total
                      ? "default"
                      : "secondary"
                  }
                >
                  {selected.total > 0 && selected.active === selected.total
                    ? "All vetted"
                    : `${Math.round(
                        (selected.active / Math.max(selected.total, 1)) * 100
                      )}% vetted`}
                </Badge>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end"
              >
                <div className="grid flex-1 gap-1.5">
                  <Label htmlFor="keyword-input" className="sr-only">
                    Keyword
                  </Label>
                  <Input
                    id="keyword-input"
                    placeholder="e.g. passive income ideas"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    className="sm:h-9"
                  />
                </div>
                <div className="grid flex-1 gap-1.5">
                  <Label htmlFor="niche-input" className="sr-only">
                    Niche
                  </Label>
                  <Input
                    id="niche-input"
                    list="niche-suggestions"
                    placeholder="Niche — type to create a new one"
                    value={nicheInput}
                    onChange={(e) => setNicheInput(e.target.value)}
                    className="sm:h-9"
                  />
                  <datalist id="niche-suggestions">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <Button type="submit" disabled={submitting} className="sm:h-9">
                  {submitting ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <PlusIcon />
                  )}
                  Add keyword
                </Button>
              </form>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-56">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter keywords…"
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-1" role="group" aria-label="Keyword status">
                  {FILTERS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFilter(f.value)}
                      className={cn(
                        "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        filter === f.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="divide-y divide-border">
                {filteredKeywords.map((k) => (
                  <li
                    key={k._id}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{k.keyword}</p>
                    </div>
                    <Switch
                      checked={k.active}
                      onCheckedChange={(checked) => handleToggle(k, checked)}
                      aria-label={`Toggle ${k.keyword}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Delete ${k.keyword}`}
                      onClick={() => handleDelete(k)}
                    >
                      <Trash2Icon />
                    </Button>
                  </li>
                ))}
                {filteredKeywords.length === 0 && (
                  <li className="flex flex-col items-center gap-1 px-4 py-10 text-center">
                    <KeyRoundIcon className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {selected.items.length === 0
                        ? "No keywords yet — add the first one above."
                        : "No keywords match this filter."}
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
            <KeyRoundIcon className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium">Select a seed niche</p>
            <p className="text-sm text-muted-foreground">
              Choose a niche from the list to vet its keywords.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}