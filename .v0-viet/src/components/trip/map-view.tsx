"use client"

import dynamic from "next/dynamic"
import { SectionHead } from "./ui"

const RouteMap = dynamic(() => import("./route-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map…</div>
  ),
})

const LEGEND = [
  { color: "#80aef7", label: "Base city" },
  { color: "#f0c36c", label: "Excursion" },
  { color: "#62c6bd", label: "Cruise" },
  { color: "#73d69a", label: "Beach" },
]

export function MapView() {
  return (
    <div>
      <SectionHead
        eyebrow="Route map"
        title="The trip, geographically"
        aside="Numbered by travel order · tap a marker for dates"
      />
      <div className="flex flex-wrap gap-4 pb-4">
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-3 w-3 rounded-full" style={{ background: l.color }} aria-hidden />
            {l.label}
          </span>
        ))}
      </div>
      <div className="h-[520px] w-full overflow-hidden rounded-2xl border border-border">
        <RouteMap />
      </div>
    </div>
  )
}
