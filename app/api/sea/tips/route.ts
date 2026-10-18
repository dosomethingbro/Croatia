import { NextResponse } from "next/server"
import { ACTIVITY_BY_ID, CITIES, DAY_BY_KEY, dayCities, fmtHour, scheduleDay } from "@/lib/sea"
import { askClaude, claudeError, parseJson } from "@/lib/claude"
import { q } from "@/lib/sea-server"

export const dynamic = "force-dynamic"
export const maxDuration = 45

type Brief = { headline: string; tips: string[]; watchOut: string; phrase?: { local: string; meaning: string } }

// POST { dayKey, ids[], refresh? } -> a Claude day briefing for the planned day.
// Cached in trip_tips by day + plan so the same plan never costs twice. When Claude
// is unavailable we return the curated city tips so the panel is never empty.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const day = DAY_BY_KEY[String(b?.dayKey ?? "")]
  if (!day) return NextResponse.json({ ok: false, error: "Unknown day" }, { status: 400 })
  const ids: string[] = (Array.isArray(b?.ids) ? b.ids : []).map(String).filter((id: string) => ACTIVITY_BY_ID[id]).slice(0, 12)
  const cities = dayCities(day).map((c) => CITIES[c])
  const fallback: Brief = {
    headline: `${day.title} — ${cities.map((c) => c.name).join(" → ")}`,
    tips: cities.flatMap((c) => c.tips).slice(0, 5),
    watchOut: cities[0].climate,
  }

  const key = `${day.key}|${ids.join(",")}`
  try {
    if (!b?.refresh) {
      const [hit] = await q<{ payload: Brief }>(`SELECT payload FROM trip_tips WHERE cache_key = $1`, [key])
      if (hit) return NextResponse.json({ ok: true, source: "cache", brief: hit.payload })
    }
  } catch {}

  const sched = scheduleDay(day, ids)
  try {
    const raw = await askClaude({
      system:
        "You are a seasoned Southeast Asia travel fixer briefing Tobi & Luke. Be concrete and practical: transport, etiquette, " +
        "cash, timing, food. Respect their rule: elephant experiences must be observation-only. Do not invent exact prices or hours. JSON only.",
      user:
        `Day: ${day.key} — ${day.title} (${cities.map((c) => c.name).join(" → ")}). ${day.body}\n` +
        `Fixed blocks: ${day.blocks.map((x) => `${fmtHour(x.start)}–${fmtHour(x.end)} ${x.label}`).join("; ") || "none"}\n` +
        `Their plan: ${sched.map((s) => `${fmtHour(s.start)} ${ACTIVITY_BY_ID[s.id].name}`).join("; ") || "nothing yet"}\n` +
        `Season notes: ${cities.map((c) => c.climate).join(" ")}\n` +
        `Return {"headline":"<=10 words","tips":["4-5 specific tips for this exact day"],"watchOut":"the one thing most likely to go wrong",` +
        `"phrase":{"local":"one useful phrase in the local language","meaning":"English"}}`,
      maxTokens: 700,
      temperature: 0.6,
    })
    const brief = parseJson<Brief>(raw)
    if (!brief?.tips?.length) throw new Error("empty brief")
    await q(
      `INSERT INTO trip_tips (cache_key, payload) VALUES ($1,$2) ON CONFLICT (cache_key) DO UPDATE SET payload = EXCLUDED.payload, created_at = now()`,
      [key, JSON.stringify(brief)],
    ).catch(() => {})
    return NextResponse.json({ ok: true, source: "claude", brief })
  } catch (e) {
    const err = claudeError(e)
    return NextResponse.json({ ok: true, source: "curated", note: err.message, brief: fallback })
  }
}
