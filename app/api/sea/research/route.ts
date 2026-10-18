import { NextResponse } from "next/server"
import { ACTIVITY_BY_ID, CITIES } from "@/lib/sea"
import { HISTORY_BY_ID } from "@/lib/sea-history"
import { newsFor, wikiSummary } from "@/lib/sea-live"
import { askClaude, claudeError, parseJson } from "@/lib/claude"
import { q } from "@/lib/sea-server"

export const dynamic = "force-dynamic"
export const maxDuration = 45

type Dossier = { gist: string; bestTime: string; howTo: string; localTake: string; skip?: string; facts: string[] }

// POST { id, kind: "activity" | "history", ai?, refresh? }
// Pulls the place's Wikipedia summary and latest news. With ai:true Claude turns that into a
// short research dossier, cached per place per day so it stays fresh but cheap.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const id = String(b?.id ?? "")
  const act = b?.kind === "history" ? null : ACTIVITY_BY_ID[id]
  const hist = b?.kind === "history" ? HISTORY_BY_ID[id] : null
  if (!act && !hist) return NextResponse.json({ ok: false, error: "Unknown place" }, { status: 400 })

  const cityId = (act?.city ?? hist!.city) as keyof typeof CITIES
  const city = CITIES[cityId]
  const name = act ? act.name : hist!.title
  const wikiQ = hist ? hist.wiki : `${name.replace(/\(.*?\)/g, "").trim()} ${city.name}`
  const newsQ = `"${(act ? act.name : hist!.place).replace(/\(.*?\)/g, "").trim()}" ${city.name}`

  const [wiki, news] = await Promise.all([
    wikiSummary(wikiQ).catch(() => null),
    newsFor(newsQ, 6).catch(() => []),
  ])

  let dossier: Dossier | null = null
  let source: "claude" | "cache" | null = null
  let aiNote: string | null = null
  if (b?.ai) {
    const key = `research|${b?.kind === "history" ? "h" : "a"}|${id}|${new Date().toISOString().slice(0, 10)}`
    if (!b?.refresh) {
      try {
        const [hit] = await q<{ payload: Dossier }>(`SELECT payload FROM trip_tips WHERE cache_key = $1`, [key])
        if (hit) { dossier = hit.payload; source = "cache" }
      } catch {}
    }
    if (!dossier) {
      try {
        const raw = await askClaude({
          system:
            "You are a travel researcher for Tobi & Luke. Synthesize only from the material given plus well-established general knowledge. " +
            "Flag uncertainty instead of inventing prices, hours or names. Elephant experiences must be observation-only. JSON only.",
          user:
            `Place: ${name} (${city.name}, ${city.country}).\n` +
            (act ? `Our notes: ${act.tip}${act.how ? ` How: ${act.how}` : ""}. Hours ${act.openHour}-${act.closeHour}.\n` : "") +
            (hist ? `History: ${hist.year}. ${hist.summary} Ripple: ${hist.ripple}\n` : "") +
            (wiki ? `Wikipedia: ${wiki.extract.slice(0, 1400)}\n` : "") +
            (news.length ? `Recent headlines: ${news.map((n) => `${n.title} (${n.source}, ${n.date.slice(0, 16)})`).join("; ")}\n` : "") +
            `Return {"gist":"2 sentences","bestTime":"when to go and why","howTo":"how to actually do it well",` +
            `"localTake":"how locals see it / tourist-trap risk","skip":"optional: who should skip it","facts":["2-3 surprising true facts"]}`,
          maxTokens: 800,
          temperature: 0.5,
        })
        const j = parseJson<Dossier>(raw)
        if (!j?.gist) throw new Error("empty dossier")
        dossier = j
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

  return NextResponse.json({ ok: true, id, name, city: cityId, wiki, news, dossier, source, aiNote })
}
