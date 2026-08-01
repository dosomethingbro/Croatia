import { db } from "@/lib/db"
import { aiPlaces } from "@/lib/db/schema"
import { eq, ne } from "drizzle-orm"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET /api/ai/places -> all points that are still in play (suggested or saved), shared by both travellers.
export async function GET() {
  try {
    const rows = await db.select().from(aiPlaces).where(ne(aiPlaces.status, "dismissed"))
    return NextResponse.json({ places: rows })
  } catch (err) {
    console.log("[v0] GET /api/ai/places error:", (err as Error).message)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}

// POST /api/ai/places { id, status } -> save / dismiss / restore a point.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = Number(body.id)
    const status = String(body.status || "")
    if (!Number.isInteger(id) || !["suggested", "saved", "dismissed"].includes(status)) {
      return NextResponse.json({ error: "invalid" }, { status: 400 })
    }
    await db.update(aiPlaces).set({ status, updatedAt: new Date() }).where(eq(aiPlaces.id, id))
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log("[v0] POST /api/ai/places error:", (err as Error).message)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}
