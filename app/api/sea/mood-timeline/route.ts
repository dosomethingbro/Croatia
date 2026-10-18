import { NextResponse } from "next/server"
import { ACTIVITY_BY_ID, CITIES, DAY_BY_KEY, dayCities, fmtHour, type Weather } from "@/lib/sea"
import { MOOD_BY_ID, SLOTS, moodTimeline, type MoodId, type SlotId } from "@/lib/sea-mood"
import { askClaude, claudeError, parseJson } from "@/lib/claude"
import { q } from "@/lib/sea-server"

export const dynamic = "force-dynamic"
export const maxDuration = 45

const WEATHERS = new Set(["clear", "cloudy", "rain-soon", "raining"])
type Story = { title: string; flow: string; lines: string[]; swap?: string }

// POST { dayKey, moods, weather?, exclude?, ai? }
// The engine builds the timed, mood-matched timeline. With ai:true Claude narrates it
// (cached per day + timeline so the same plan never costs twice).
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const day = DAY_BY_KEY[String(b?.dayKey ?? "")]
  if (!day) return NextResponse.json({ ok: false, error: "Unknown day" }, { status: 400 })
  const weather: Weather = WEATHERS.has(b?.weather) ? b.weather : "clear"
  const moods: Partial<Record<SlotId, MoodId>> = {}
  for (const s of SLOTS) {
    const m = b?.moods?.[s.id]
    if (MOOD_BY_ID[m as MoodId]) moods[s.id] = m
  }
  const exclude: string[] = Array.isArray(b?.exclude) ? b.exclude.map(String).slice(0, 40) : []
  const slots = moodTimeline(day, moods, weather, exclude)
  const picks = slots.filter((s) => s.pick)

  let story: Story | null = null
  let source: "claude" | "cache" | null = null
  let aiNote: string | null = null
  if (b?.ai && picks.length) {
    const key = `mood|${day.key}|${weather}|${picks.map((s) => `${s.mood}:${s.pick!.id}`).join(",")}`
    try {
      const [hit] = await q<{ payload: Story }>(`SELECT payload FROM trip_tips WHERE cache_key = $1`, [key])
      if (hit) { story = hit.payload; source = "cache" }
    } catch {}
    if (!story) {
      try {
        const cities = dayCities(day).map((c) => CITIES[c].name).join(" → ")
        const raw = await askClaude({
          system:
            "You are a sharp local fixer writing a mood-driven day for Tobi & Luke (Vietnam + Thailand). " +
            "Use only the places and times given. Never invent prices or opening hours. Elephant experiences must be observation-only. JSON only.",
          user:
            `${day.key} · ${day.title} · ${cities}. Weather: ${weather}.\n` +
            `Timeline:\n` +
            picks.map((s) => {
              const a = ACTIVITY_BY_ID[s.pick!.id]
              return `${s.label} (${MOOD_BY_ID[s.mood].label}) ${fmtHour(s.pick!.start)}–${fmtHour(s.pick!.end)}: ${a.name}, ${a.area}. Tip: ${a.tip}${a.how ? ` How: ${a.how}` : ""}`
            }).join("\n") +
            `\nReturn {"title":"<=8 word name for this day","flow":"2 sentences on how the energy builds or winds down",` +
            `"lines":["one vivid, practical sentence per timeline row, in order, max 26 words"],"swap":"one optional swap if energy dips"}`,
          maxTokens: 800,
          temperature: 0.7,
        })
        const j = parseJson<Story>(raw)
        if (!j?.lines?.length) throw new Error("empty story")
        story = j
        source = "claude"
        await q(
          `INSERT INTO trip_tips (cache_key, payload) VALUES ($1,$2) ON CONFLICT (cache_key) DO UPDATE SET payload = EXCLUDED.payload, created_at = now()`,
          [key, JSON.stringify(j)],
        ).catch(() => {})
      } catch (e) {
        aiNote = `AI offline: ${claudeError(e).message}`
      }
    }
  }

  return NextResponse.json({ ok: true, slots, story, source, aiNote })
}
