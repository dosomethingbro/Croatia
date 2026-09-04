import { NextResponse } from "next/server"
import { ACTIVITIES, WAIKIKI_CENTER, rankCandidates, type Candidate, type LoggedItem, type Weather, type Anchor } from "@/lib/honolulu"
import { askClaude, parseJson, claudeError } from "@/lib/claude"

export const dynamic = "force-dynamic"
export const maxDuration = 45

// GET → the full activity catalogue + map anchor, for the Candidates board and map pins.
export async function GET() {
  return NextResponse.json({ ok: true, activities: ACTIVITIES, center: WAIKIKI_CENTER })
}

// POST body:
// { hour, weather, dayKey, logged:[{activityId,tag,today}], anchor:{name,hour}|null, refine?:string, indoorOnly?:boolean }
//
// The DECISION stays deterministic and explainable — rankCandidates() does the hard
// filters + additive scoring + wildcard entirely in code. Claude is used ONLY to (a) rewrite
// each rationale in warm, human language and (b) interpret an optional free-text refinement
// like "something weird" or "nothing involving museums" into soft nudges. Claude never
// invents a score; if it's unavailable we fall back to the template rationales.
export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 })
  }

  const hour: number = typeof body.hour === "number" ? body.hour : 12
  const weather: Weather = body.weather || "clear"
  const logged: LoggedItem[] = Array.isArray(body.logged) ? body.logged : []
  const anchor: Anchor | null = body.anchor || null
  const refine: string = (body.refine || "").toString().slice(0, 200)
  const indoorOnly: boolean = !!body.indoorOnly
  const now = body.dayKey ? new Date(body.dayKey + "T" + String(Math.floor(hour)).padStart(2, "0") + ":00:00") : new Date()

  let candidates: Candidate[] = rankCandidates({ now, hour, weather, logged, anchor, indoorOnly })

  // Apply free-text refinement as a soft re-rank BEFORE trimming, so "no museums" etc.
  // demotes rather than hard-removing (still explainable — we tag why).
  if (refine) {
    const low = refine.toLowerCase()
    const wantsWeird = /weird|unusual|different|strange|off.?beat|random/.test(low)
    const noMuseum = /no |not |without |avoid |skip /.test(low) && /museum|learn|art|history/.test(low)
    candidates = candidates
      .map((c) => {
        let adj = 0
        if (wantsWeird && c.activity.novelty === "unusual") adj += 1.5
        if (noMuseum && c.activity.tag === "LEARN") adj -= 5
        return adj ? { ...c, score: Math.round((c.score + adj) * 10) / 10, breakdown: [...c.breakdown, { label: `“${refine.slice(0, 24)}”`, value: adj }] } : c
      })
      .sort((a, b) => b.score - a.score)
  }

  // Upgrade rationales with Claude (best-effort).
  let claudeNote: string | null = null
  let aiCode: string | null = null
  try {
    const list = candidates.map((c) => ({
      id: c.activity.id,
      name: c.activity.name,
      tag: c.activity.tag,
      novelty: c.activity.novelty,
      zone: c.activity.zone,
      cost: c.activity.cost,
      indoorOutdoor: c.activity.indoorOutdoor,
      wildcard: c.wildcard,
      slack: c.slack,
    }))
    const sys = `You write ONE-LINE rationales for a Waikīkī "what should we do next" console for two travellers (Tobi & Luke), no car.
Voice: warm, plain, confident — like a friend who knows the island. No jargon, no emoji, max ~14 words each.
Context: local time ${hour.toFixed(1)}h, weather "${weather}"${anchor ? `, dinner anchor "${anchor.name}" at ${anchor.hour}h` : ""}.
${refine ? `The travellers asked for: "${refine}". Reflect that where it fits.` : ""}
For the wildcard item, make it sound like a genuine left-field alternative, not fourth place.
Return ONLY JSON: { "rationales": { "<id>": "<one line>" }, "note": "<=12 word summary of the vibe you picked for" }`
    const user = `Candidates: ${JSON.stringify(list)}`
    const raw = await askClaude({ system: sys, user, maxTokens: 700, temperature: 0.7 })
    const parsed = parseJson<{ rationales: Record<string, string>; note?: string }>(raw)
    candidates = candidates.map((c) =>
      parsed.rationales?.[c.activity.id] ? { ...c, rationale: parsed.rationales[c.activity.id] } : c,
    )
    claudeNote = parsed.note || null
  } catch (e) {
    // The DECISION is deterministic and already complete — this only affects the prose.
    // Surface a soft code so the client can show a subtle, honest hint (e.g. "add credits").
    const ce = claudeError(e)
    aiCode = ce.code
  }

  return NextResponse.json({ ok: true, candidates, note: claudeNote, aiCode })
}
