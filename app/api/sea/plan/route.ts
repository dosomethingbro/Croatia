import { NextResponse } from "next/server"
import { ACTIVITY_BY_ID, DAY_BY_KEY, draftDay } from "@/lib/sea"
import { DAY_RE, PEOPLE, SEA_TRIP, q, writeAllowed } from "@/lib/sea-server"

export const dynamic = "force-dynamic"

// GET -> every planned item for the whole trip, grouped client-side by day.
export async function GET() {
  try {
    const rows = await q(
      `SELECT id, day_key AS "dayKey", activity_id AS "activityId", position, person
       FROM trip_plan WHERE trip = $1 ORDER BY day_key, position, id`,
      [SEA_TRIP],
    )
    return NextResponse.json({ ok: true, plan: rows })
  } catch (e) {
    console.error("[v0] sea plan GET failed:", e)
    return NextResponse.json({ ok: false, plan: [] }, { status: 500 })
  }
}

// PUT { dayKey, ids[] }   -> replace that day's plan with exactly these ids (reorder/remove).
// PUT { dayKey, draft:true } -> replace with the deterministic draft for the day.
export async function PUT(req: Request) {
  if (!writeAllowed(req)) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 })
  try {
    const b = await req.json()
    const dayKey = String(b?.dayKey ?? "")
    const day = DAY_BY_KEY[dayKey]
    if (!DAY_RE.test(dayKey) || !day) return NextResponse.json({ ok: false, error: "Unknown day" }, { status: 400 })
    const person = PEOPLE.has(String(b?.person)) ? String(b.person) : "tobi"

    let ids: string[]
    if (b?.draft) ids = draftDay(day, b?.weather === "raining" || b?.weather === "rain-soon" ? b.weather : "clear").map((s) => s.id)
    else ids = (Array.isArray(b?.ids) ? b.ids : []).map(String).filter((id: string) => ACTIVITY_BY_ID[id])
    ids = [...new Set(ids)].slice(0, 12)

    await q(`DELETE FROM trip_plan WHERE trip = $1 AND day_key = $2`, [SEA_TRIP, dayKey])
    for (let i = 0; i < ids.length; i++) {
      await q(`INSERT INTO trip_plan (trip, day_key, activity_id, position, person) VALUES ($1,$2,$3,$4,$5)`, [SEA_TRIP, dayKey, ids[i], i, person])
    }
    return NextResponse.json({ ok: true, dayKey, ids })
  } catch (e) {
    console.error("[v0] sea plan PUT failed:", e)
    return NextResponse.json({ ok: false, error: "Could not save plan" }, { status: 500 })
  }
}
