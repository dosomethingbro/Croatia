import { NextResponse } from "next/server"
import { CITIES, DAY_BY_KEY, fmtHour, rankSea, type LoggedItem, type Weather } from "@/lib/sea"
import { askClaude, claudeError, parseJson } from "@/lib/claude"

export const dynamic = "force-dynamic"
export const maxDuration = 45

const WEATHERS = new Set(["clear", "cloudy", "rain-soon", "raining"])

// POST { dayKey, hour, weather, logged[], planIds[], refine?, indoorOnly?, ai? }
// The deterministic engine decides; Claude (optional) only rewrites the rationale lines.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const day = DAY_BY_KEY[String(b?.dayKey ?? "")]
  if (!day) return NextResponse.json({ ok: false, error: "Unknown trip day" }, { status: 400 })
  const hour = Math.min(23.9, Math.max(0, Number(b?.hour) || 9))
  const weather: Weather = WEATHERS.has(b?.weather) ? b.weather : "clear"
  const logged: LoggedItem[] = Array.isArray(b?.logged) ? b.logged.slice(0, 200) : []
  const planIds = new Set<string>(Array.isArray(b?.planIds) ? b.planIds.map(String) : [])
  const refine = typeof b?.refine === "string" ? b.refine.slice(0, 120) : ""

  const result = rankSea({ day, hour, weather, logged, planIds, refine, indoorOnly: !!b?.indoorOnly })
  let aiNote: string | null = null

  if (b?.ai && result.candidates.length) {
    try {
      const city = CITIES[result.city]
      const raw = await askClaude({
        system:
          "You are the travel console for Tobi & Luke's Vietnam + Thailand trip. Write short, specific, warm rationales. " +
          "Never invent opening hours, prices or names beyond what you're given. Return JSON only.",
        user:
          `It is ${fmtHour(hour)} on ${day.key} in ${city.name} (${day.title}). Weather: ${weather}.` +
          (refine ? ` They asked for: "${refine}".` : "") +
          (result.anchor ? ` Next fixed commitment: ${result.anchor.label} at ${fmtHour(result.anchor.start)}.` : "") +
          `\nCandidates:\n` +
          result.candidates.map((c, i) => `${i}. ${c.activity.name} (${c.activity.area}; ${c.activity.durationMin} min; tip: ${c.activity.tip})`).join("\n") +
          `\nReturn {"lines":["one sentence per candidate, max 24 words"],"note":"one sentence of timing or local advice for right now"}`,
        maxTokens: 600,
        temperature: 0.6,
      })
      const j = parseJson<{ lines?: string[]; note?: string }>(raw)
      result.candidates.forEach((c, i) => { if (j.lines?.[i]) c.rationale = j.lines[i] })
      aiNote = j.note ?? null
    } catch (e) {
      aiNote = `AI offline: ${claudeError(e).message}`
    }
  }

  return NextResponse.json({ ok: true, ...result, aiNote })
}
