import { NextResponse } from "next/server"
import { ACTIVITY_BY_ID, DAY_BY_KEY, scheduleDay, type Weather } from "@/lib/sea"

export const dynamic = "force-dynamic"

const WEATHERS = new Set(["clear", "cloudy", "rain-soon", "raining"])

// POST { dayKey, ids[], weather? } -> timed slots for the trip builder, laid out around the
// day's fixed flights/transfers with opening hours, travel buffers and warnings applied.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const day = DAY_BY_KEY[String(b?.dayKey ?? "")]
  if (!day) return NextResponse.json({ ok: false, error: "Unknown day" }, { status: 400 })
  const ids: string[] = (Array.isArray(b?.ids) ? b.ids : []).map(String).filter((id: string) => ACTIVITY_BY_ID[id]).slice(0, 12)
  const weather: Weather = WEATHERS.has(b?.weather) ? b.weather : "clear"
  return NextResponse.json({ ok: true, slots: scheduleDay(day, ids, weather) })
}
