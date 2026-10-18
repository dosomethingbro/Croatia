import { NextResponse } from "next/server"
import { ACTIVITIES, BOOKING_LINKS, BUDGET, CHECKLIST, CITIES, CRUISES, DAYS, TRANSFERS, TRIP } from "@/lib/sea"

// The whole trip as one payload: the console renders from this single source of truth.
export async function GET() {
  return NextResponse.json({
    ok: true,
    trip: TRIP,
    cities: CITIES,
    days: DAYS,
    activities: ACTIVITIES,
    transfers: TRANSFERS,
    checklist: CHECKLIST,
    cruises: CRUISES,
    links: BOOKING_LINKS,
    budget: BUDGET,
  })
}
