import { db } from "@/lib/db"
import { marks } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const PEOPLE = ["tobi", "luke"]

// GET /api/marks -> { tobi: { "51": { want, done } }, luke: { ... } }
export async function GET() {
  try {
    const rows = await db.select().from(marks)
    const out: Record<string, Record<string, { want: boolean; done: boolean }>> = {
      tobi: {},
      luke: {},
    }
    for (const r of rows) {
      if (!out[r.person]) out[r.person] = {}
      out[r.person][String(r.stopId)] = { want: r.want, done: r.done }
    }
    return NextResponse.json(out)
  } catch (err) {
    console.log("[v0] GET /api/marks error:", (err as Error).message)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}

// POST /api/marks { person, stopId, want, done } -> upsert (or delete when both false)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const person = String(body.person || "")
    const stopId = Number(body.stopId)
    const want = !!body.want
    const done = !!body.done

    if (!PEOPLE.includes(person) || !Number.isInteger(stopId)) {
      return NextResponse.json({ error: "invalid" }, { status: 400 })
    }

    if (!want && !done) {
      await db.delete(marks).where(and(eq(marks.person, person), eq(marks.stopId, stopId)))
      return NextResponse.json({ ok: true, cleared: true })
    }

    await db
      .insert(marks)
      .values({ person, stopId, want, done, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [marks.person, marks.stopId],
        set: { want, done, updatedAt: new Date() },
      })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log("[v0] POST /api/marks error:", (err as Error).message)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}
