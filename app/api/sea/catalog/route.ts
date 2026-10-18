import { NextResponse } from "next/server"
import { ACTIVITIES, BOOKING_LINKS, BUDGET, CHECKLIST, CITIES, CRUISES, DAYS, TRANSFERS, TRIP } from "@/lib/sea"
import { GUIDES, HISTORY } from "@/lib/sea-history"
import { MOODS, MOOD_PRESETS, SLOTS, moodVector } from "@/lib/sea-mood"

// The whole trip as one payload: the console renders from this single source of truth.
export async function GET() {
  return NextResponse.json({
    ok: true,
    trip: TRIP,
    cities: CITIES,
    days: DAYS,
    activities: ACTIVITIES.map((a) => ({ ...a, moods: moodVector(a) })),
    transfers: TRANSFERS,
    checklist: CHECKLIST,
    cruises: CRUISES,
    links: BOOKING_LINKS,
    budget: BUDGET,
    history: HISTORY,
    guides: GUIDES,
    moods: MOODS,
    slots: SLOTS,
    presets: MOOD_PRESETS,
  })
}
