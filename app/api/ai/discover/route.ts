import { db } from "@/lib/db"
import { aiPlaces } from "@/lib/db/schema"
import { NextResponse } from "next/server"
import { askClaude, parseJson, dedupKey, distanceMeters, reverseGeocode, geoLine, claudeError } from "@/lib/claude"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const PEOPLE = ["tobi", "luke"]

type NewPlace = {
  title: string
  category: string
  blurb: string
  lat: number
  lng: number
  why?: string
  whatHappened?: string
  figures?: string[]
  tip?: string
  era?: string
}

// POST { lat, lng, person, radiusKm? } -> plot a fresh batch of nearby points, never repeating
// anything already saved or dismissed anywhere near here.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const lat = Number(body.lat)
    const lng = Number(body.lng)
    const person = PEOPLE.includes(body.person) ? body.person : "tobi"
    const radiusKm = Number(body.radiusKm) || 3
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "invalid coordinates" }, { status: 400 })
    }

    // Ground truth for where the traveller actually is (stops the LLM snapping to the Old Town).
    const geo = await reverseGeocode(lat, lng)
    const place = geoLine(geo, lat, lng)

    // Everything we already know about near here — fed back so the LLM won't double-dip.
    const all = await db.select().from(aiPlaces)
    const known = all.filter((p) => distanceMeters([lat, lng], [p.lat, p.lng]) < radiusKm * 1000 * 1.5)
    const knownList = known.map((p) => `- ${p.title} (${p.status})`).join("\n") || "(none yet)"

    const system = `You are the discovery engine for the Command Center travel app.
Plot 4-6 genuinely interesting points within about ${radiusKm} km of the traveller's EXACT location that are worth a detour.
Return ONLY a valid JSON array (no markdown) of objects:
{
  "title": string,
  "category": "history" | "landmark" | "viewpoint" | "food" | "hidden" | "nature",
  "blurb": string,        // one-line hook, <= 90 chars
  "lat": number, "lng": number,   // real coordinates, genuinely within ${radiusKm} km of the traveller
  "why": string,          // 1-2 sentences, why go, present tense
  "whatHappened": string, // optional: the event/story tied to it
  "figures": string[],    // optional: local people tied to it
  "tip": string,          // optional: a practical or "look closer" tip
  "era": string           // optional short era label
}
Rules:
- Anchor on the EXACT coordinates + the reverse-geocoded place below. Do NOT dump every suggestion onto the nearest famous tourist zone if the traveller is somewhere else (e.g. up in the hills). Spread points around where they ACTUALLY are.
- Coordinates for each point must be real and plausibly within ${radiusKm} km of the traveller.
- Everyday, local, and hidden spots count — it does not all have to be famous history.
- Do NOT suggest anything in the "already known" list. Offer only NEW spots.`

    const user = `My EXACT live location is latitude ${lat}, longitude ${lng}.
Reverse-geocoded ground truth: ${place}.
Already known nearby (do not repeat these):
${knownList}

Give me new points to explore genuinely near THIS spot.`

    const raw = await askClaude({ system, user, maxTokens: 2200, temperature: 0.8 })
    const parsed = parseJson<NewPlace[]>(raw)
    const list = Array.isArray(parsed) ? parsed : []

    const inserted: (typeof aiPlaces.$inferSelect)[] = []
    for (const p of list) {
      const plat = Number(p.lat)
      const plng = Number(p.lng)
      if (!Number.isFinite(plat) || !Number.isFinite(plng) || !p.title) continue
      const key = dedupKey(p.title, plat, plng)
      const [row] = await db
        .insert(aiPlaces)
        .values({
          lat: plat,
          lng: plng,
          title: p.title.slice(0, 120),
          category: p.category || "history",
          blurb: (p.blurb || "").slice(0, 140),
          detail: {
            why: p.why,
            whatHappened: p.whatHappened,
            figures: p.figures,
            tip: p.tip,
            era: p.era,
          },
          status: "suggested",
          dedupKey: key,
          createdBy: person,
        })
        .onConflictDoNothing({ target: aiPlaces.dedupKey })
        .returning()
      if (row) inserted.push(row)
    }

    return NextResponse.json({ added: inserted.length, places: inserted })
  } catch (err) {
    console.log("[v0] POST /api/ai/discover error:", (err as Error).message)
    const ce = claudeError(err)
    return NextResponse.json({ error: ce.message, code: ce.code }, { status: ce.status })
  }
}
