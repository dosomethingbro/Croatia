import { db } from "@/lib/db"
import { tripLog } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const TRIP = "honolulu"

// GET /api/honolulu/log -> the shared manifest (both travellers see the same log).
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(tripLog)
      .where(eq(tripLog.trip, TRIP))
      .orderBy(desc(tripLog.loggedAt))
    return NextResponse.json({ ok: true, log: rows })
  } catch (e) {
    console.error("[v0] honolulu log GET failed:", e)
    return NextResponse.json({ ok: false, log: [] }, { status: 500 })
  }
}

// POST { activityId, name, tag, person, dayKey } -> log an activity as done.
export async function POST(req: Request) {
  try {
    const b = await req.json()
    if (!b?.activityId || !b?.name || !b?.tag || !b?.dayKey) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 })
    }
    const [row] = await db
      .insert(tripLog)
      .values({
        trip: TRIP,
        activityId: String(b.activityId),
        name: String(b.name),
        tag: String(b.tag),
        person: String(b.person || "tobi"),
        dayKey: String(b.dayKey),
      })
      .returning()
    return NextResponse.json({ ok: true, entry: row })
  } catch (e) {
    console.error("[v0] honolulu log POST failed:", e)
    return NextResponse.json({ ok: false, error: "Could not log activity" }, { status: 500 })
  }
}

// DELETE /api/honolulu/log?id=123 -> undo a log entry.
export async function DELETE(req: Request) {
  try {
    const id = Number(new URL(req.url).searchParams.get("id"))
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 })
    await db.delete(tripLog).where(and(eq(tripLog.trip, TRIP), eq(tripLog.id, id)))
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[v0] honolulu log DELETE failed:", e)
    return NextResponse.json({ ok: false, error: "Could not remove entry" }, { status: 500 })
  }
}
