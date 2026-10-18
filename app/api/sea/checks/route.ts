import { NextResponse } from "next/server"
import { CHECKLIST } from "@/lib/sea"
import { SEA_TRIP, q, writeAllowed } from "@/lib/sea-server"

export const dynamic = "force-dynamic"
const IDS = new Set(CHECKLIST.map((c) => c.id))

export async function GET() {
  try {
    const rows = await q<{ item_id: string; done: boolean }>(`SELECT item_id, done FROM trip_checks WHERE trip = $1`, [SEA_TRIP])
    return NextResponse.json({ ok: true, checks: Object.fromEntries(rows.map((r) => [r.item_id, r.done])) })
  } catch (e) {
    console.error("[v0] sea checks GET failed:", e)
    return NextResponse.json({ ok: false, checks: {} }, { status: 500 })
  }
}

// POST { id, done }
export async function POST(req: Request) {
  if (!writeAllowed(req)) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 })
  try {
    const b = await req.json()
    const id = String(b?.id ?? "")
    if (!IDS.has(id)) return NextResponse.json({ ok: false, error: "Unknown item" }, { status: 400 })
    await q(
      `INSERT INTO trip_checks (trip, item_id, done, updated_at) VALUES ($1,$2,$3,now())
       ON CONFLICT (trip, item_id) DO UPDATE SET done = EXCLUDED.done, updated_at = now()`,
      [SEA_TRIP, id, !!b?.done],
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[v0] sea checks POST failed:", e)
    return NextResponse.json({ ok: false, error: "Could not save" }, { status: 500 })
  }
}
