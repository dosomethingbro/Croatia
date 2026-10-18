"use client"

import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { CHECKLIST, SOURCE_NOTES, BOOKING_RESOURCES } from "@/lib/trip-data"
import { getChecklist, setChecklistItem } from "@/app/actions/checklist"
import { SectionHead, BookButton } from "./ui"

const MIGRATION_KEY = "tripcheck_migrated_v2"
const LEGACY_KEY = "tripcheck_state_v1"

export function Checklist() {
  const { data, isLoading, mutate } = useSWR<Record<string, boolean>>("checklist", getChecklist, {
    revalidateOnFocus: true,
  })
  const [pending, setPending] = useState<Record<string, boolean>>({})
  const migrated = useRef(false)

  // One-time migration: push any locally-saved checkmarks from the previous
  // localStorage-only version up to the shared database, then stop.
  useEffect(() => {
    if (migrated.current || isLoading || !data) return
    migrated.current = true
    if (localStorage.getItem(MIGRATION_KEY)) return

    let legacy: Record<string, boolean> = {}
    try {
      const raw = localStorage.getItem(LEGACY_KEY)
      if (raw) legacy = JSON.parse(raw)
      for (const item of CHECKLIST) {
        if (localStorage.getItem("tripcheck_" + item.id) === "1") legacy[item.id] = true
      }
    } catch {
      // ignore malformed legacy data
    }

    const toPush = CHECKLIST.filter((c) => legacy[c.id] && !data[c.id])
    localStorage.setItem(MIGRATION_KEY, "1")
    if (toPush.length === 0) return
    ;(async () => {
      let latest = data
      for (const item of toPush) {
        latest = await setChecklistItem(item.id, true)
      }
      mutate(latest, { revalidate: false })
    })()
  }, [data, isLoading, mutate])

  const state = data ?? {}

  const toggle = async (id: string) => {
    const next = !state[id]
    setPending((p) => ({ ...p, [id]: true }))
    // optimistic update
    mutate({ ...state, [id]: next }, { revalidate: false })
    try {
      const fresh = await setChecklistItem(id, next)
      mutate(fresh, { revalidate: false })
    } catch {
      mutate() // roll back to server truth on failure
    } finally {
      setPending((p) => {
        const { [id]: _drop, ...rest } = p
        return rest
      })
    }
  }

  const completed = CHECKLIST.filter((c) => state[c.id]).length
  const pct = Math.round((completed / CHECKLIST.length) * 100)
  const ready = !isLoading && !!data

  return (
    <div>
      <SectionHead
        eyebrow="Action center"
        title="Book / prep checklist"
        aside="Synced live across every device viewing this trip"
      />

      <div className="mb-5 rounded-2xl border border-border bg-panel p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {completed} of {CHECKLIST.length} complete
          </span>
          <span className="font-display font-bold text-brand-green">{ready ? `${pct}%` : "—"}</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-panel-2">
          <div
            className="h-full rounded-full bg-brand-green transition-all duration-500"
            style={{ width: ready ? `${pct}%` : "0%" }}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {CHECKLIST.map((item) => {
          const checked = !!state[item.id]
          return (
            <label
              key={item.id}
              className="flex cursor-pointer gap-3 rounded-2xl border border-border bg-panel p-4 transition hover:border-brand-green/40 data-[busy=true]:opacity-60"
              data-busy={pending[item.id] ? "true" : undefined}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={!ready}
                onChange={() => toggle(item.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-green"
              />
              <div>
                <b className={checked ? "block text-muted-foreground line-through" : "block"}>{item.title}</b>
                <span className="text-xs text-muted-foreground">{item.note}</span>
              </div>
            </label>
          )
        })}
      </div>

      <SectionHead eyebrow="Booking resources" title="Jump straight to booking" />
      <div className="grid gap-3.5 md:grid-cols-3">
        {BOOKING_RESOURCES.map((group) => (
          <article key={group.group} className="rounded-2xl border border-border bg-panel p-5">
            <h3 className="font-display text-base font-semibold text-brand-teal">{group.group}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((l) => (
                <BookButton key={l.label} href={l.href}>
                  {l.label}
                </BookButton>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-border bg-panel-2/60 p-5 text-xs leading-relaxed text-muted-foreground">
        <b className="text-foreground/80">Planning-source notes</b>
        <p className="mt-2">{SOURCE_NOTES}</p>
      </div>
    </div>
  )
}
