import { db } from "@/lib/db"
import { tripLog } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const TRIP = "honolulu"
const TAGS = new Set(["PLAY", "EXPERIENCE", "WATCH", "EXPLORE", "LEARN", "RELAX", "EAT_DRINK"])
const PEOPLE = new Set(["tobi", "luke"])

// Optional shared-passphrase gate for writes. If HONOLULU_TRIP_SECRET is set, POST/DELETE
// must send a matching `x-trip-key` header; if it's unset the log stays open (private
// two-person trip). This lets the couple lock down writes without any code change.
function writeAllowed(req: Request): boolean {
  const secret = process.env.HONOLULU_TRIP_SECRET
  if (!secret) return true
  return req.headers.get("x-trip-key") === secret
}

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
  if (!writeAllowed(req)) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 })
  try {
    const b = await req.json()
    // Validate + clamp everything client-supplied — never trust the body.
    const activityId = String(b?.activityId ?? "").slice(0, 64)
    const name = String(b?.name ?? "").slice(0, 120)
    const tag = String(b?.tag ?? "")
    const person = PEOPLE.has(String(b?.person)) ? String(b.person) : "tobi"
    const dayKey = String(b?.dayKey ?? "")
    if (!activityId || !name || !TAGS.has(tag) || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
      return NextResponse.json({ ok: false, error: "Invalid fields" }, { status: 400 })
    }
    const [row] = await db
      .insert(tripLog)
      .values({ trip: TRIP, activityId, name, tag, person, dayKey })
      .returning()
    return NextResponse.json({ ok: true, entry: row })
  } catch (e) {
    console.error("[v0] honolulu log POST failed:", e)
    return NextResponse.json({ ok: false, error: "Could not log activity" }, { status: 500 })
  }
}

// DELETE /api/honolulu/log?id=123 -> undo a log entry.
export async function DELETE(req: Request) {
  if (!writeAllowed(req)) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 })
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
