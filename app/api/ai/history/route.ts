import { db } from "@/lib/db"
import { briefings } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { NextResponse } from "next/server"
import { askClaude, parseJson, cellKey, reverseGeocode, geoLine, factCheck, claudeError } from "@/lib/claude"

export const dynamic = "force-dynamic"
export const maxDuration = 60

type Era = {
  label: string // "Ancient / Illyrian", "Roman", "Republic of Ragusa", "Napoleonic", "20th century", "Today"
  years: string // "before 600 BC", "1358–1808", ...
  scene: string // what THIS exact ground looked like then, present-tense
  life: string // what people on/near this spot were doing then
}
type Briefing = {
  place: string // honest description of where we actually are
  locationType: string // e.g. "residential hillside above Ploče, ~1.4km NE of the Old Town"
  intro: string // present-tense orientation from this exact spot
  eras: Era[] // chronological, ancient -> present (the time-travel journey)
  figures: { name: string; note: string }[]
  presence: string // what to look at / feel from here right now
  confidence?: "high" | "medium" | "low"
  factCheck?: string
  sources?: string[]
}

const SCHEMA_HINT = `{
  "place": string, "locationType": string, "intro": string,
  "eras": { "label": string, "years": string, "scene": string, "life": string }[],
  "figures": { "name": string, "note": string }[],
  "presence": string, "sources": string[]
}`

// GET /api/ai/history?saved=1 -> list saved story summaries (shared between travellers).
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    if (url.searchParams.get("saved") === "1") {
      const rows = await db
        .select()
        .from(briefings)
        .where(eq(briefings.saved, true))
        .orderBy(desc(briefings.createdAt))
      const stories = rows.map((r) => ({
        cell: r.cell,
        lat: r.lat,
        lng: r.lng,
        title: r.title,
        place: r.place,
        confidence: r.confidence,
        ...(r.payload as Briefing),
      }))
      return NextResponse.json({ stories })
    }
    return NextResponse.json({ stories: [] })
  } catch (err) {
    console.log("[v0] GET /api/ai/history error:", (err as Error).message)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}

// POST { lat, lng, refresh? } -> verified, immersive era-by-era history for THIS EXACT spot.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const lat = Number(body.lat)
    const lng = Number(body.lng)
    const refresh = !!body.refresh
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "invalid coordinates" }, { status: 400 })
    }

    const cell = cellKey(lat, lng)

    // Serve the cached, already-verified story for this precise spot unless refresh is forced.
    if (!refresh) {
      const [cached] = await db.select().from(briefings).where(eq(briefings.cell, cell)).limit(1)
      if (cached) {
        return NextResponse.json({
          cached: true,
          cell,
          lat,
          lng,
          saved: cached.saved,
          title: cached.title,
          place: cached.place,
          confidence: cached.confidence,
          ...(cached.payload as Briefing),
        })
      }
    }

    // 1) Ground truth: what is actually at these coordinates?
    const geo = await reverseGeocode(lat, lng)
    const place = geoLine(geo, lat, lng)

    // 2) First pass: write the immersive era-by-era time journey for THIS exact spot.
    const system = `You are the on-the-ground historian for a travel app. The traveller wants to feel TELEPORTED to this exact spot in ancient times and walk FORWARD through history to today.
Return ONLY valid JSON (no markdown) matching:
${SCHEMA_HINT}

Rules:
- You are at the EXACT coordinates given. Do NOT drift to the nearest famous landmark or tourist site. If the Old Town / a famous site is nearby but NOT at these coordinates, only mention it as "down the hill / X metres away", never as if we are standing in it.
- Use the reverse-geocoded place as ground truth for where we really are.
- Build "eras" as a CHRONOLOGICAL journey from the earliest plausible human era at this spot to today (e.g. prehistoric/Illyrian → Greek/Roman → medieval → early-modern → 19th c. → 20th c. → today). Include only eras that make sense here.
- For each era: "scene" = what THIS ground/terrain looked like then; "life" = what people on or beside this exact spot were doing (farming, quarrying, defending a wall, living in these houses, etc.). It does NOT have to be famous history — everyday life counts.
- Present tense, second person, vivid but honest. NEVER invent specific names, dates, casualty numbers, or quotes. Hedge with "likely"/"by tradition" when unsure.
- 4-7 eras. 2-4 real figures tied to this area (or omit if none are genuinely tied here).`

    const user = `My EXACT live location is latitude ${lat}, longitude ${lng}.
Reverse-geocoded ground truth: ${place}.
Teleport me to this exact spot in the deep past and walk me forward through history to today. What was happening on THIS ground in each era, and what would people right here have been doing?`

    const draft = await askClaude({ system, user, maxTokens: 2600, temperature: 0.7 })
    const draftData = parseJson<Briefing>(draft)

    // 3) Second pass: a separate fact-check agent verifies against the exact coordinates.
    const checked = await factCheck<Briefing>({ lat, lng, geo, draftJson: draftData, schemaHint: SCHEMA_HINT })
    const data: Briefing = {
      ...checked.data,
      confidence: checked.confidence,
      factCheck: checked.notes,
    }

    const title = data.place || geo?.road || geo?.suburb || geo?.town || geo?.city || "This spot"

    // Cache the verified story for this precise cell.
    await db
      .insert(briefings)
      .values({ cell, lat, lng, title, place, confidence: checked.confidence, payload: data })
      .onConflictDoUpdate({
        target: briefings.cell,
        set: { payload: data, title, place, confidence: checked.confidence },
      })

    return NextResponse.json({ cached: false, cell, lat, lng, saved: false, title, place, confidence: checked.confidence, ...data })
  } catch (err) {
    console.log("[v0] POST /api/ai/history error:", (err as Error).message)
    const ce = claudeError(err)
    return NextResponse.json({ error: ce.message, code: ce.code }, { status: ce.status })
  }
}

// PATCH { cell, saved } -> bookmark / unbookmark a story summary.
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const cell = String(body.cell || "")
    const saved = !!body.saved
    if (!cell) return NextResponse.json({ error: "missing cell" }, { status: 400 })
    await db.update(briefings).set({ saved }).where(eq(briefings.cell, cell))
    return NextResponse.json({ ok: true, saved })
  } catch (err) {
    console.log("[v0] PATCH /api/ai/history error:", (err as Error).message)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}
