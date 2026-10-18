import { NextResponse } from "next/server"
import { DAY_BY_KEY } from "@/lib/sea"
import { MOOD_BY_ID, SLOTS, type MoodId, type SlotId } from "@/lib/sea-mood"
import { PEOPLE, SEA_TRIP, q, writeAllowed } from "@/lib/sea-server"

export const dynamic = "force-dynamic"

const SLOT_IDS = new Set(SLOTS.map((s) => s.id))

// GET -> { moods: { [dayKey]: { [slot]: mood } } } for the whole trip.
export async function GET() {
  try {
    const rows = await q<{ dayKey: string; moods: Record<string, string> }>(
      `SELECT day_key AS "dayKey", moods FROM trip_moods WHERE trip = $1`,
      [SEA_TRIP],
    )
    return NextResponse.json({ ok: true, moods: Object.fromEntries(rows.map((r) => [r.dayKey, r.moods])) })
  } catch (e) {
    console.error("[v0] sea moods GET failed:", e)
    return NextResponse.json({ ok: false, moods: {} }, { status: 500 })
  }
}

// PUT { dayKey, moods: { slot: mood } } -> replace that day's mood map.
export async function PUT(req: Request) {
  if (!writeAllowed(req)) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 })
  try {
    const b = await req.json()
    const dayKey = String(b?.dayKey ?? "")
    if (!DAY_BY_KEY[dayKey]) return NextResponse.json({ ok: false, error: "Unknown day" }, { status: 400 })
    const clean: Partial<Record<SlotId, MoodId>> = {}
    for (const [k, v] of Object.entries(b?.moods ?? {})) {
      if (SLOT_IDS.has(k as SlotId) && MOOD_BY_ID[v as MoodId]) clean[k as SlotId] = v as MoodId
    }
    const person = PEOPLE.has(String(b?.person)) ? String(b.person) : "tobi"
    await q(
      `INSERT INTO trip_moods (trip, day_key, moods, person) VALUES ($1,$2,$3,$4)
       ON CONFLICT (trip, day_key) DO UPDATE SET moods = EXCLUDED.moods, person = EXCLUDED.person, updated_at = now()`,
      [SEA_TRIP, dayKey, JSON.stringify(clean), person],
    )
    return NextResponse.json({ ok: true, dayKey, moods: clean })
  } catch (e) {
    console.error("[v0] sea moods PUT failed:", e)
    return NextResponse.json({ ok: false, error: "Could not save moods" }, { status: 500 })
  }
}
