"use client"

import { useMemo, useState } from "react"
import { BUDGET } from "@/lib/trip-data"
import { SectionHead } from "./ui"
import { cn } from "@/lib/utils"

const CATEGORY_COLOR: Record<string, string> = {
  Flights: "bg-brand-blue",
  Lodging: "bg-brand-teal",
  Excursions: "bg-brand-gold",
  "Ground + food": "bg-brand-orange",
}

const fmt = (n: number) => "$" + n.toLocaleString("en-US")

export function Budget() {
  const [perPerson, setPerPerson] = useState(false)
  const [excluded, setExcluded] = useState<Set<string>>(new Set())

  const divisor = perPerson ? 2 : 1

  const categories = useMemo(() => {
    const map = new Map<string, { low: number; high: number }>()
    for (const line of BUDGET) {
      if (excluded.has(line.item)) continue
      const cur = map.get(line.category) ?? { low: 0, high: 0 }
      cur.low += line.low
      cur.high += line.high
      map.set(line.category, cur)
    }
    return map
  }, [excluded])

  const total = useMemo(() => {
    let low = 0
    let high = 0
    for (const v of categories.values()) {
      low += v.low
      high += v.high
    }
    return { low, high }
  }, [categories])

  const toggle = (item: string) =>
    setExcluded((prev) => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })

  const grouped = useMemo(() => {
    const g = new Map<string, typeof BUDGET>()
    for (const line of BUDGET) {
      const arr = g.get(line.category) ?? []
      arr.push(line)
      g.set(line.category, arr)
    }
    return [...g.entries()]
  }, [])

  return (
    <div>
      <SectionHead
        eyebrow="Planning budget"
        title="Estimated trip cost"
        aside="Rough ranges to pressure-test the plan — recheck live pricing before booking"
      />

      <div className="grid gap-3.5 lg:grid-cols-[1fr_.8fr]">
        {/* Total card */}
        <div className="rounded-2xl border border-border bg-panel p-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-gold">
              Estimated total {perPerson ? "per person" : "per couple"}
            </span>
            <div className="flex rounded-lg border border-border bg-panel-2 p-0.5 text-xs font-bold">
              <button
                onClick={() => setPerPerson(false)}
                className={cn("rounded-md px-2.5 py-1 transition", !perPerson ? "bg-soft text-foreground" : "text-muted-foreground")}
              >
                Couple
              </button>
              <button
                onClick={() => setPerPerson(true)}
                className={cn("rounded-md px-2.5 py-1 transition", perPerson ? "bg-soft text-foreground" : "text-muted-foreground")}
              >
                Per person
              </button>
            </div>
          </div>
          <div className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">
            {fmt(Math.round(total.low / divisor))}
            <span className="text-muted-foreground"> – </span>
            {fmt(Math.round(total.high / divisor))}
          </div>

          {/* Stacked share bar */}
          <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-panel-2">
            {[...categories.entries()].map(([cat, v]) => {
              const mid = (v.low + v.high) / 2
              const totalMid = (total.low + total.high) / 2 || 1
              return (
                <div
                  key={cat}
                  className={cn("h-full", CATEGORY_COLOR[cat] ?? "bg-muted-foreground")}
                  style={{ width: `${(mid / totalMid) * 100}%` }}
                  title={cat}
                />
              )
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {[...categories.entries()].map(([cat, v]) => (
              <span key={cat} className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", CATEGORY_COLOR[cat] ?? "bg-muted-foreground")} />
                {cat}: {fmt(Math.round(v.low / divisor))}–{fmt(Math.round(v.high / divisor))}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Toggle any line off to model a leaner trip. Ranges are for two travelers unless "Per person" is selected.
          </p>
        </div>

        {/* Line items */}
        <div className="rounded-2xl border border-border bg-panel p-5">
          {grouped.map(([cat, lines]) => (
            <div key={cat} className="mb-4 last:mb-0">
              <div className="mb-2 flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", CATEGORY_COLOR[cat] ?? "bg-muted-foreground")} />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-foreground/80">{cat}</span>
              </div>
              <ul className="space-y-1">
                {lines.map((line) => {
                  const off = excluded.has(line.item)
                  return (
                    <li key={line.item}>
                      <button
                        onClick={() => toggle(line.item)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-panel-2",
                          off && "opacity-40",
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                              off ? "border-border text-transparent" : "border-brand-green bg-brand-green/15 text-brand-green",
                            )}
                            aria-hidden
                          >
                            ✓
                          </span>
                          <span className="text-foreground">{line.item}</span>
                        </span>
                        <span className="whitespace-nowrap tabular-nums text-muted-foreground">
                          {fmt(Math.round(line.low / divisor))}–{fmt(Math.round(line.high / divisor))}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
