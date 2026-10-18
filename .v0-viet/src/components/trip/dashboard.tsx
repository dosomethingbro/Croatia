"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { TRIP, PHOTO_CREDITS } from "@/lib/trip-data"
import { Overview } from "./overview"
import { MapView } from "./map-view"
import { Itinerary } from "./itinerary"
import { Transport } from "./transport"
import { Excursions } from "./excursions"
import { Cruises } from "./cruises"
import { Budget } from "./budget"
import { History } from "./history"
import { Checklist } from "./checklist"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "map", label: "Map" },
  { id: "itinerary", label: "Itinerary" },
  { id: "transport", label: "In-country travel" },
  { id: "excursions", label: "Excursions" },
  { id: "cruises", label: "Ha Long cruise" },
  { id: "budget", label: "Budget" },
  { id: "history", label: "History" },
  { id: "checklist", label: "Book / prep" },
]

export function Dashboard() {
  const [active, setActive] = useState("overview")

  const go = (id: string) => {
    setActive(id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2 whitespace-nowrap text-[13px] font-extrabold tracking-[0.14em]">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-green" aria-hidden />
            TRIP COMMAND CENTER
          </div>
          <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto px-1 sm:order-none sm:ml-auto sm:w-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => go(tab.id)}
                aria-current={active === tab.id ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] transition",
                  active === tab.id
                    ? "bg-soft text-foreground"
                    : "text-muted-foreground hover:bg-soft hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <span className="hidden whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground lg:block">
            {TRIP.window}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 pb-20 pt-6 sm:px-6">
        {active === "overview" && <Overview onNavigate={go} />}
        {active === "map" && <MapView />}
        {active === "itinerary" && <Itinerary />}
        {active === "transport" && <Transport />}
        {active === "excursions" && <Excursions />}
        {active === "cruises" && <Cruises />}
        {active === "budget" && <Budget />}
        {active === "history" && <History />}
        {active === "checklist" && <Checklist />}
      </main>

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
            Photo credits
          </div>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground/80">
            {PHOTO_CREDITS.map((c) => c.credit).join(" · ")}
          </p>
        </div>
      </footer>
    </div>
  )
}
