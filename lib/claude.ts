import Anthropic from "@anthropic-ai/sdk"
import { readFileSync } from "node:fs"
import { join } from "node:path"

export const CLAUDE_MODEL = "claude-sonnet-4-5-20250929"

let _client: Anthropic | null = null
export function claude(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set")
    _client = new Anthropic({ apiKey })
  }
  return _client
}

// Load the editable trip-context seed (CLAUDE.md). Cached after first read.
let _tripContext: string | null = null
export function tripContext(): string {
  if (_tripContext) return _tripContext
  try {
    _tripContext = readFileSync(join(process.cwd(), "CLAUDE.md"), "utf8")
  } catch {
    _tripContext =
      "Travellers Tobi & Luke exploring Dubrovnik and the Dalmatian coast. " +
      "They love vivid, present-tense history, battles, local heroes, and a strong sense of presence. " +
      "Ground everything in the given coordinates. Never fabricate precise figures or names. Return valid JSON only when asked."
  }
  return _tripContext
}

export type ClaudeTextBlock = { type: "text"; text: string }
export type ClaudeImageBlock = {
  type: "image"
  source: { type: "base64"; media_type: string; data: string }
}
export type ClaudeContent = string | Array<ClaudeTextBlock | ClaudeImageBlock>

// Call Claude and return the concatenated text output.
export async function askClaude(opts: {
  system?: string
  user: ClaudeContent
  maxTokens?: number
  temperature?: number
}): Promise<string> {
  const system = `${tripContext()}\n\n${opts.system ?? ""}`.trim()
  const content =
    typeof opts.user === "string" ? [{ type: "text" as const, text: opts.user }] : opts.user

  const res = await claude().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: opts.maxTokens ?? 1800,
    temperature: opts.temperature ?? 0.7,
    system,
    messages: [{ role: "user", content: content as Anthropic.MessageParam["content"] }],
  })

  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim()
}

// Turn a raw Claude/Anthropic SDK error into a friendly, actionable message + code.
// Used by the API routes so the app can show something human instead of "failed".
export function claudeError(err: unknown): { code: string; message: string; status: number } {
  const e = err as { status?: number; error?: { error?: { type?: string } }; message?: string }
  const status = typeof e?.status === "number" ? e.status : 0
  const type = e?.error?.error?.type || ""
  const raw = (e?.message || "").toLowerCase()

  if (!process.env.ANTHROPIC_API_KEY) {
    return { code: "no_key", message: "The AI companion isn\u2019t connected yet \u2014 an ANTHROPIC_API_KEY needs to be added to the project.", status: 503 }
  }
  if (status === 400 && (raw.includes("credit balance") || raw.includes("too low"))) {
    return { code: "billing", message: "Claude is out of credits. Top up the Anthropic account (console.anthropic.com \u2192 Billing) and this will work instantly \u2014 no code changes needed.", status: 402 }
  }
  if (status === 401 || type === "authentication_error") {
    return { code: "auth", message: "The Anthropic API key was rejected. Double-check ANTHROPIC_API_KEY in the project settings.", status: 401 }
  }
  if (status === 429 || type === "rate_limit_error") {
    return { code: "rate_limit", message: "Claude is rate-limited right now. Give it a few seconds and tap again.", status: 429 }
  }
  if (status === 529 || type === "overloaded_error" || raw.includes("overloaded")) {
    return { code: "overloaded", message: "Claude is overloaded at the moment. Try again in a few seconds.", status: 503 }
  }
  if (raw.includes("timeout") || raw.includes("aborted")) {
    return { code: "timeout", message: "That took too long to come back. Try again \u2014 it\u2019s usually quicker the second time.", status: 504 }
  }
  return { code: "failed", message: "Couldn\u2019t reach Claude just now. Try again in a moment.", status: 500 }
}

// Extract and parse the first JSON object/array from a model response.
export function parseJson<T>(raw: string): T {
  let s = raw.trim()
  // Strip ```json fences if present
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) s = fence[1].trim()
  // Fall back to slicing between the first { or [ and its matching last bracket
  if (!(s.startsWith("{") || s.startsWith("["))) {
    const firstObj = s.indexOf("{")
    const firstArr = s.indexOf("[")
    const start =
      firstArr === -1 ? firstObj : firstObj === -1 ? firstArr : Math.min(firstObj, firstArr)
    if (start >= 0) {
      const lastCurly = s.lastIndexOf("}")
      const lastSquare = s.lastIndexOf("]")
      const end = Math.max(lastCurly, lastSquare)
      if (end > start) s = s.slice(start, end + 1)
    }
  }
  return JSON.parse(s) as T
}

/* ---------- geo helpers (drive the no-double-dip contract) ---------- */

// Fine ~11m grid cell used to cache history briefings. Tight on purpose so a
// hillside spot never inherits the briefing of a famous place down the road.
export function cellKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`
}

/* ---------- reverse geocoding: ground truth for "where am I really?" ---------- */

export type GeoPlace = {
  label: string // best human description, e.g. "Ulica put Bosanke, Ploče, Dubrovnik"
  road?: string
  neighbourhood?: string
  suburb?: string
  town?: string
  city?: string
  county?: string
  state?: string
  country?: string
  osmType?: string // e.g. "residential", "peak", "path"
  raw?: unknown
}

// Reverse-geocode exact coordinates via OpenStreetMap Nominatim. This is the anchor
// that stops the model from snapping to the nearest famous landmark.
export async function reverseGeocode(lat: number, lng: number): Promise<GeoPlace | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    const res = await fetch(url, {
      headers: {
        "User-Agent": "CommandCenterTravelApp/1.0 (personal travel companion for Tobi & Luke)",
        "Accept-Language": "en",
      },
      // Nominatim is external; keep it snappy so we can fall back gracefully.
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const j: any = await res.json()
    const a = j.address || {}
    const road = a.road || a.pedestrian || a.footway || a.path
    const neighbourhood = a.neighbourhood || a.hamlet
    const suburb = a.suburb || a.quarter || a.city_district
    const town = a.town || a.village || a.municipality
    const city = a.city
    return {
      label: (j.display_name as string) || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      road,
      neighbourhood,
      suburb,
      town,
      city,
      county: a.county,
      state: a.state,
      country: a.country,
      osmType: j.type || j.category,
      raw: a,
    }
  } catch {
    return null
  }
}

// Compact one-line description of the geocoded place for prompting.
export function geoLine(g: GeoPlace | null, lat: number, lng: number): string {
  if (!g) return `${lat.toFixed(5)}, ${lng.toFixed(5)} (no map match — describe the immediate terrain honestly)`
  const parts = [g.road, g.neighbourhood, g.suburb, g.town, g.city, g.county, g.state, g.country].filter(Boolean)
  const kind = g.osmType ? ` [map feature: ${g.osmType}]` : ""
  return `${parts.join(", ")}${kind}`
}

/* ---------- fact-check agent: a second pass that verifies the first ---------- */

export type FactCheckResult<T> = {
  data: T
  confidence: "high" | "medium" | "low"
  notes: string
}

// Runs a skeptical second Claude call that verifies a draft against the exact
// coordinates + reverse-geocoded place, corrects any snapping/fabrication, and
// returns the corrected JSON plus a confidence rating and a short note.
export async function factCheck<T>(opts: {
  lat: number
  lng: number
  geo: GeoPlace | null
  draftJson: unknown
  schemaHint: string
}): Promise<FactCheckResult<T>> {
  const system = `You are a meticulous, skeptical fact-checking historian working as a SECOND pass.
You are given exact GPS coordinates, the real reverse-geocoded place, and a DRAFT briefing written by another model.
Your job:
- VERIFY every claim against the EXACT coordinates and the real place. The coordinates are ground truth.
- If the draft "snapped" to a famous landmark that is not actually at these coordinates, CORRECT it. Do not let it drift to the nearest tourist site.
- Remove or hedge any invented names, dates, casualty figures, or quotes. Distinguish record from legend.
- Keep the immersive, present-tense, time-travel structure intact, but make it TRUE for this exact spot.
- If the exact spot is ordinary (a modern street, a hillside, a field), that is fine — describe honestly what people would have been doing on THIS ground in each era.
Return ONLY valid JSON (no markdown) of the form:
{ "confidence": "high"|"medium"|"low", "notes": string, "data": <the corrected briefing matching the same schema> }
where "data" matches: ${opts.schemaHint}`

  const user = `EXACT coordinates: latitude ${opts.lat}, longitude ${opts.lng}
Real place (reverse-geocoded ground truth): ${geoLine(opts.geo, opts.lat, opts.lng)}

DRAFT to verify and correct:
${JSON.stringify(opts.draftJson)}`

  const raw = await askClaude({ system, user, maxTokens: 2600, temperature: 0.2 })
  const parsed = parseJson<FactCheckResult<T>>(raw)
  return {
    data: (parsed.data ?? (opts.draftJson as T)) as T,
    confidence: parsed.confidence || "medium",
    notes: parsed.notes || "",
  }
}

// Stable de-dup key for a discovered place: normalized title + coarse coords.
export function dedupKey(title: string, lat: number, lng: number): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
  return `${slug}@${lat.toFixed(3)},${lng.toFixed(3)}`
}

// Haversine distance in metres.
export function distanceMeters(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const la1 = (a[0] * Math.PI) / 180
  const la2 = (b[0] * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
