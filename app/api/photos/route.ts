import { db } from "@/lib/db"
import { photos } from "@/lib/db/schema"
import { and, eq, desc } from "drizzle-orm"
import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { askClaude, parseJson, claudeError } from "@/lib/claude"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const PEOPLE = ["tobi", "luke"]

type Vision = {
  subject: string
  whatItIs: string
  history: string
  lookCloser: string
  confidence?: string
}

// GET /api/photos?placeId=..  OR  ?stopId=..  -> photos for a place/stop, newest first.
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const placeId = url.searchParams.get("placeId")
    const stopId = url.searchParams.get("stopId")
    const tripSite = url.searchParams.get("tripSite")
    let rows
    if (placeId) rows = await db.select().from(photos).where(eq(photos.placeId, Number(placeId))).orderBy(desc(photos.createdAt))
    else if (stopId) rows = await db.select().from(photos).where(eq(photos.stopId, Number(stopId))).orderBy(desc(photos.createdAt))
    else if (tripSite) rows = await db.select().from(photos).where(eq(photos.tripSite, tripSite)).orderBy(desc(photos.createdAt))
    else rows = await db.select().from(photos).orderBy(desc(photos.createdAt)).limit(200)
    return NextResponse.json({ photos: rows })
  } catch (err) {
    console.log("[v0] GET /api/photos error:", (err as Error).message)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}

// POST multipart: file, person, kind ("gallery"|"identify"), placeId?, stopId?, lat?, lng?, caption?
// For kind="identify" we also run Claude vision and store the analysis.
export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "no file" }, { status: 400 })

    const person = PEOPLE.includes(String(form.get("person"))) ? String(form.get("person")) : "tobi"
    const kind = String(form.get("kind") || "gallery") === "identify" ? "identify" : "gallery"
    const placeId = form.get("placeId") ? Number(form.get("placeId")) : null
    const stopId = form.get("stopId") ? Number(form.get("stopId")) : null
    const tripSite = form.get("tripSite") ? String(form.get("tripSite")).slice(0, 80) : null
    const lat = form.get("lat") ? Number(form.get("lat")) : null
    const lng = form.get("lng") ? Number(form.get("lng")) : null
    const caption = form.get("caption") ? String(form.get("caption")).slice(0, 300) : null

    // Read bytes once (used for both upload and vision).
    const bytes = Buffer.from(await file.arrayBuffer())
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg"
    // The connected Blob store is public, so upload with public access and keep the
    // returned URL. We store that URL as the photo's `pathname` so the delivery route
    // can redirect to it without any extra lookups.
    const blob = await put(`travel-photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`, bytes, {
      access: "public",
      contentType: file.type || "image/jpeg",
    })

    let analysis: Vision | null = null
    let visionError: string | null = null
    if (kind === "identify") {
      const media = (file.type || "image/jpeg") as string
      const system = `You identify what the traveller is photographing and connect it to the place.
Return ONLY valid JSON (no markdown):
{ "subject": string, "whatItIs": string, "history": string, "lookCloser": string, "confidence": "high"|"medium"|"low" }
Keep it vivid, present tense, factual. "lookCloser" = one detail most people miss.`
      const locHint = lat != null && lng != null ? ` I am at latitude ${lat}, longitude ${lng}.` : ""
      try {
        const raw = await askClaude({
          system,
          maxTokens: 1200,
          temperature: 0.6,
          user: [
            { type: "image", source: { type: "base64", media_type: media, data: bytes.toString("base64") } },
            { type: "text", text: `What am I looking at?${locHint}` },
          ],
        })
        analysis = parseJson<Vision>(raw)
      } catch (e) {
        console.log("[v0] vision error:", (e as Error).message)
        visionError = claudeError(e).message
      }
    }

    const [row] = await db
      .insert(photos)
      .values({ pathname: blob.url, person, kind, placeId, stopId, tripSite, lat, lng, caption, analysis })
      .returning()

    return NextResponse.json({ ok: true, photo: row, analysis, visionError })
  } catch (err) {
    console.log("[v0] POST /api/photos error:", (err as Error).message)
    return NextResponse.json({ error: "failed", detail: (err as Error).message }, { status: 500 })
  }
}
