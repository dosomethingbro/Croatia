"use client"

import { useEffect, useState } from "react"
import { TRIP } from "@/lib/trip-data"

function diff(target: number) {
  const now = Date.now()
  const ms = Math.max(0, target - now)
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  return { days, hours, minutes, seconds }
}

const cells: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] = [
  { key: "days", label: "days" },
  { key: "hours", label: "hrs" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "sec" },
]

export function Countdown() {
  const target = new Date(TRIP.departISO).getTime()
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null)

  useEffect(() => {
    setT(diff(target))
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div>
      <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-gold">Countdown to departure</div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {cells.map((c) => (
          <div key={c.key} className="rounded-xl border border-border bg-panel-2 px-2 py-3 text-center">
            <div className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
              {t ? String(t[c.key]).padStart(2, "0") : "--"}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
