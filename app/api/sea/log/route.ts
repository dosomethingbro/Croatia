import { NextResponse } from "next/server"
import { ACTIVITY_BY_ID } from "@/lib/sea"
import { DAY_RE, PEOPLE, SEA_TRIP, q, writeAllowed } from "@/lib/sea-server"

export const dynamic = "force-dynamic"

// The shared "done it" log, stored in the existing trip_log table under trip = 'sea'.
export async function GET() {
  try {
    const rows = await q(
      `SELECT id, activity_id AS "activityId", name, tag, person, day_key AS "dayKey", logged_at AS "loggedAt"
       FROM trip_log WHERE trip = $1 ORDER BY logged_at DESC`,
      [SEA_TRIP],
    )
    return NextResponse.json({ ok: true, log: rows })
  } catch (e) {
    console.error("[v0] sea log GET failed:", e)
    return NextResponse.json({ ok: false, log: [] }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!writeAllowed(req)) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 })
  try {
    const b = await req.json()
    const a = ACTIVITY_BY_ID[String(b?.activityId ?? "")]
    const dayKey = String(b?.dayKey ?? "")
    if (!a || !DAY_RE.test(dayKey)) return NextResponse.json({ ok: false, error: "Invalid fields" }, { status: 400 })
    const person = PEOPLE.has(String(b?.person)) ? String(b.person) : "tobi"
    const [row] = await q(
      `INSERT INTO trip_log (trip, activity_id, name, tag, person, day_key) VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, activity_id AS "activityId", name, tag, person, day_key AS "dayKey", logged_at AS "loggedAt"`,
      [SEA_TRIP, a.id, a.name, a.tag, person, dayKey],
    )
    return NextResponse.json({ ok: true, entry: row })
  } catch (e) {
    console.error("[v0] sea log POST failed:", e)
    return NextResponse.json({ ok: false, error: "Could not log" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!writeAllowed(req)) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 })
  const id = Number(new URL(req.url).searchParams.get("id"))
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "Bad id" }, { status: 400 })
  try {
    await q(`DELETE FROM trip_log WHERE trip = $1 AND id = $2`, [SEA_TRIP, id])
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[v0] sea log DELETE failed:", e)
    return NextResponse.json({ ok: false, error: "Could not remove" }, { status: 500 })
  }
}
