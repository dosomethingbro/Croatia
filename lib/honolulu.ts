// Honolulu "Mission Control" activity catalogue + the explainable decision engine.
// This is the single source of truth shared by the API routes and (serialized) the client.
// The scoring is deliberately additive and traceable — never a single opaque percentage.

export type Tag = "PLAY" | "EXPERIENCE" | "WATCH" | "EXPLORE" | "LEARN" | "RELAX" | "EAT_DRINK"

export interface Activity {
  id: string
  name: string
  tag: Tag
  effort: "low" | "med" | "high"
  commitment: "dropin" | "reserved"
  novelty: "familiar" | "unusual"
  durationMin: number
  cost: "$" | "$$" | "$$$" | "free"
  indoorOutdoor: "indoor" | "outdoor" | "mixed"
  zone: "walkable" | "rideshare"
  openHour: number
  closeHour: number
  dayOnly?: "Fri" | "Sat" | "Sun"
  eveningOnly?: boolean
  lastChecked: string
  // Added for the REAL upgrade: real coordinates so activities render on the map.
  lat: number
  lng: number
}

// Waikīkī anchor (Kalākaua Ave, in front of the beach) — used for walkable distance.
export const WAIKIKI_CENTER: [number, number] = [21.2793, -157.8292]

export const ACTIVITIES: Activity[] = [
  { id: "beach-walk", name: "Waikīkī Beach Walk", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 60, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 0, closeHour: 24, lastChecked: "Sep 2", lat: 21.2762, lng: -157.8267 },
  { id: "glow-putt", name: "Glow Putt Mini Golf", tag: "PLAY", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 45, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 10, closeHour: 23, lastChecked: "Sep 2", lat: 21.2823, lng: -157.8301 },
  { id: "intl-market", name: "International Market Place", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 60, cost: "$$", indoorOutdoor: "mixed", zone: "walkable", openHour: 10, closeHour: 21, lastChecked: "Sep 2", lat: 21.2808, lng: -157.8286 },
  { id: "ohana-ent", name: "Ohana Entertainment Center", tag: "PLAY", effort: "med", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$$", indoorOutdoor: "indoor", zone: "walkable", openHour: 10, closeHour: 23, lastChecked: "Sep 2", lat: 21.2831, lng: -157.8318 },
  { id: "surf-lesson", name: "Surf lesson", tag: "EXPERIENCE", effort: "high", commitment: "reserved", novelty: "unusual", durationMin: 120, cost: "$$$", indoorOutdoor: "outdoor", zone: "walkable", openHour: 7, closeHour: 12, lastChecked: "Sep 1", lat: 21.2735, lng: -157.8241 },
  { id: "catamaran", name: "Catamaran sail", tag: "EXPERIENCE", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 150, cost: "$$$", indoorOutdoor: "outdoor", zone: "walkable", openHour: 12, closeHour: 17, lastChecked: "Sep 1", lat: 21.2748, lng: -157.8281 },
  { id: "snorkel", name: "Turtle Canyon snorkeling", tag: "EXPERIENCE", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 180, cost: "$$$", indoorOutdoor: "outdoor", zone: "walkable", openHour: 7, closeHour: 11, lastChecked: "Sep 1", lat: 21.2705, lng: -157.8215 },
  { id: "fireworks", name: "Friday Waikīkī fireworks", tag: "WATCH", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 20, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 19, closeHour: 21, dayOnly: "Fri", eveningOnly: true, lastChecked: "Sep 2", lat: 21.2818, lng: -157.8355 },
  { id: "lewers", name: "Lewers Lounge", tag: "RELAX", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$$", indoorOutdoor: "indoor", zone: "walkable", openHour: 16, closeHour: 24, eveningOnly: true, lastChecked: "Sep 2", lat: 21.2792, lng: -157.8305 },
  { id: "beach-bars", name: "Beachfront bars", tag: "RELAX", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$$", indoorOutdoor: "mixed", zone: "walkable", openHour: 12, closeHour: 24, lastChecked: "Sep 2", lat: 21.2769, lng: -157.8273 },
  { id: "iolani", name: "ʻIolani Palace", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 90, cost: "$$", indoorOutdoor: "mixed", zone: "rideshare", openHour: 9, closeHour: 16, lastChecked: "Aug 29", lat: 21.3066, lng: -157.8583 },
  { id: "homa", name: "Honolulu Museum of Art", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 90, cost: "$$", indoorOutdoor: "indoor", zone: "rideshare", openHour: 10, closeHour: 18, lastChecked: "Aug 29", lat: 21.3040, lng: -157.8489 },
  { id: "bishop", name: "Bishop Museum", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 120, cost: "$$", indoorOutdoor: "indoor", zone: "rideshare", openHour: 9, closeHour: 17, lastChecked: "Aug 29", lat: 21.3330, lng: -157.8710 },
  { id: "ala-moana", name: "Ala Moana", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$$", indoorOutdoor: "mixed", zone: "rideshare", openHour: 10, closeHour: 21, lastChecked: "Sep 2", lat: 21.2911, lng: -157.8434 },
  { id: "game-show", name: "Great Big Game Show Honolulu", tag: "PLAY", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 90, cost: "$$", indoorOutdoor: "indoor", zone: "rideshare", openHour: 18, closeHour: 22, eveningOnly: true, lastChecked: "Aug 30", lat: 21.2887, lng: -157.8399 },
  { id: "escape-game", name: "The Escape Game Honolulu", tag: "PLAY", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 60, cost: "$$", indoorOutdoor: "indoor", zone: "walkable", openHour: 10, closeHour: 22, lastChecked: "Aug 30", lat: 21.2838, lng: -157.8330 },
  { id: "magical-parlour", name: "Waikīkī's Magical Parlour", tag: "WATCH", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 75, cost: "$$", indoorOutdoor: "indoor", zone: "walkable", openHour: 18, closeHour: 22, eveningOnly: true, lastChecked: "Aug 30", lat: 21.2801, lng: -157.8295 },
  { id: "mystery-show", name: "The Magical Mystery Show", tag: "WATCH", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 75, cost: "$$", indoorOutdoor: "indoor", zone: "walkable", openHour: 18, closeHour: 22, eveningOnly: true, lastChecked: "Aug 30", lat: 21.2810, lng: -157.8299 },
  { id: "scaventour", name: "Scaventour", tag: "PLAY", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 90, cost: "$$", indoorOutdoor: "outdoor", zone: "walkable", openHour: 9, closeHour: 17, lastChecked: "Aug 30", lat: 21.2795, lng: -157.8288 },
  { id: "lucky-strike", name: "Lucky Strike", tag: "PLAY", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 60, cost: "$$", indoorOutdoor: "indoor", zone: "rideshare", openHour: 11, closeHour: 24, lastChecked: "Sep 2", lat: 21.2905, lng: -157.8420 },
  { id: "dnb", name: "Dave & Buster's", tag: "PLAY", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$$", indoorOutdoor: "indoor", zone: "rideshare", openHour: 11, closeHour: 24, lastChecked: "Sep 2", lat: 21.2898, lng: -157.8412 },
  { id: "rage-room", name: "Break'N Anger", tag: "PLAY", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 45, cost: "$$", indoorOutdoor: "indoor", zone: "rideshare", openHour: 11, closeHour: 21, lastChecked: "Aug 28", lat: 21.3195, lng: -157.8665 },
  { id: "karaoke", name: "Private-room karaoke", tag: "PLAY", effort: "low", commitment: "reserved", novelty: "familiar", durationMin: 60, cost: "$$", indoorOutdoor: "indoor", zone: "walkable", openHour: 17, closeHour: 24, eveningOnly: true, lastChecked: "Sep 2", lat: 21.2827, lng: -157.8312 },
  { id: "blue-note", name: "Blue Note Hawaii", tag: "WATCH", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 90, cost: "$$$", indoorOutdoor: "indoor", zone: "walkable", openHour: 19, closeHour: 22, eveningOnly: true, lastChecked: "Aug 31", lat: 21.2807, lng: -157.8296 },
  { id: "auana", name: "Cirque du Soleil ʻAuana", tag: "WATCH", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 80, cost: "$$$", indoorOutdoor: "indoor", zone: "walkable", openHour: 17, closeHour: 22, eveningOnly: true, lastChecked: "Sep 4", lat: 21.2836, lng: -157.8321 },
  { id: "first-friday", name: "First Friday (Chinatown)", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 120, cost: "free", indoorOutdoor: "outdoor", zone: "rideshare", openHour: 17, closeHour: 21, dayOnly: "Fri", eveningOnly: true, lastChecked: "Aug 30", lat: 21.3134, lng: -157.8626 },
  { id: "homa-nights", name: "HoMA Nights", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 120, cost: "$", indoorOutdoor: "mixed", zone: "rideshare", openHour: 18, closeHour: 21, dayOnly: "Fri", eveningOnly: true, lastChecked: "Aug 30", lat: 21.3040, lng: -157.8489 },
]

export type Weather = "clear" | "cloudy" | "rain-soon" | "raining"

export interface LoggedItem {
  activityId: string
  tag: Tag
  today: boolean // logged on the current local day
}

export interface Anchor {
  name: string
  hour: number // decimal hours, e.g. 19.5 for 7:30pm
}

export interface ScoreLine {
  label: string
  value: number
}

export interface Candidate {
  activity: Activity
  score: number
  breakdown: ScoreLine[]
  rationale: string // filled by template first, upgraded by Claude
  slack: number | null // minutes of buffer vs anchor, or null if no anchor
  walkable: boolean
  wildcard: boolean
}

// The caller builds `now` at UTC noon of the Honolulu calendar day (see the route), so we
// read the weekday in UTC — this avoids the server's own timezone shifting the date.
function dayName(d: Date): "Fri" | "Sat" | "Sun" | "other" {
  const n = d.getUTCDay()
  return n === 5 ? "Fri" : n === 6 ? "Sat" : n === 0 ? "Sun" : "other"
}

// Hard filters — pass/fail, plain code, never scored.
export function passesHardFilters(a: Activity, ctx: {
  now: Date
  hour: number
  weather: Weather
  loggedTodayIds: Set<string>
  anchor: Anchor | null
}): boolean {
  if (ctx.loggedTodayIds.has(a.id)) return false
  if (a.dayOnly && a.dayOnly !== dayName(ctx.now)) return false
  if (a.eveningOnly && ctx.hour < 17) return false
  if (ctx.hour < a.openHour || ctx.hour >= a.closeHour) return false
  if (ctx.weather === "raining" && a.indoorOutdoor === "outdoor") return false
  // The anchor only constrains while we're still before it (small grace window).
  if (ctx.anchor && ctx.hour < ctx.anchor.hour - 0.25) {
    const slack = computeSlack(a, ctx.hour, ctx.anchor)
    if (slack < -15) return false
  }
  return true
}

// True while the anchor is still ahead of us and worth showing buffer against.
export function anchorActive(hour: number, anchor: Anchor | null): boolean {
  return !!anchor && hour < anchor.hour - 0.25
}

// slack = anchorTime − (currentTime + duration + travelBuffer)
export function computeSlack(a: Activity, hour: number, anchor: Anchor): number {
  const travelBuffer = a.zone === "walkable" ? 10 : 20
  const endMinutes = hour * 60 + a.durationMin + travelBuffer
  return Math.round(anchor.hour * 60 - endMinutes)
}

// Additive score with a fully visible breakdown.
export function scoreActivity(a: Activity, ctx: {
  hour: number
  weather: Weather
  logged: LoggedItem[]
}): { score: number; breakdown: ScoreLine[] } {
  const lines: ScoreLine[] = []
  if (a.novelty === "unusual") lines.push({ label: "novelty", value: 2 })
  if (a.zone === "walkable") lines.push({ label: "walkable", value: 1.5 })
  if (ctx.weather === "rain-soon" && a.indoorOutdoor === "indoor") lines.push({ label: "beats the rain", value: 2 })
  const sameTag = ctx.logged.filter((l) => l.tag === a.tag).length
  if (sameTag > 0) lines.push({ label: `repeats ${a.tag.replace("_", " ").toLowerCase()} ×${sameTag}`, value: -1.2 * sameTag })
  if (a.effort === "high" && ctx.hour >= 15) lines.push({ label: "high effort, late", value: -2 })
  if (a.cost === "free") lines.push({ label: "free", value: 0.5 })
  const score = Math.round(lines.reduce((s, l) => s + l.value, 0) * 10) / 10
  return { score, breakdown: lines }
}

// ---- Free-text refinement → deterministic, explainable soft nudges ----
// Claude interprets the refine text when it's available; this is the always-on fallback so
// refinement still works when the AI is down. Crucially it's applied to the FULL scored pool
// BEFORE trimming to top-3+wildcard, so a refine can genuinely surface an activity that
// wasn't already going to be shown — not merely reorder the four you'd see anyway.
type RefineRule = { label: string; adj: (a: Activity) => number }

export function buildRefineRules(text: string): RefineRule[] {
  const low = ` ${text.toLowerCase()} `
  // Match on a LEADING word boundary but no trailing one, so plurals/gerunds still hit
  // ("museum" matches "museums", "relax" matches "relaxing"). This is the fix for the spec's
  // own example "nothing involving museums".
  const has = (re: RegExp) => re.test(low)
  const neg = /\b(no|not|without|avoid|skip|none|nothing|don'?t|do not|hate|except|rather not|less)\b/.test(low)
  const rules: RefineRule[] = []
  if (has(/\b(weird|unusual|different|strange|off.?beat|random|quirky|surpris|wild|novel)/))
    rules.push({ label: "unusual", adj: (a) => (a.novelty === "unusual" ? 1.5 : -0.75) })
  if (has(/\b(museum|art|history|historic|cultur|learn|educational)/))
    rules.push({ label: neg ? "no museums" : "culture", adj: (a) => (a.tag === "LEARN" ? (neg ? -6 : 2) : 0) })
  if (has(/\b(cheap|budget|free|affordable|inexpensive|save money|expensive|pricey)/))
    rules.push({ label: "budget", adj: (a) => (a.cost === "free" ? 2 : a.cost === "$" ? 1 : a.cost === "$$$" ? -2.5 : 0) })
  if (has(/\b(splurge|treat|fancy|special|blow.?out)/) && !neg)
    rules.push({ label: "splurge", adj: (a) => (a.cost === "$$$" ? 1.5 : a.cost === "free" ? -0.5 : 0) })
  if (has(/\b(chill|relax|low.?key|mellow|calm|lazy|easygoing|easy.going|slow)/))
    rules.push({ label: "low-key", adj: (a) => (a.effort === "low" ? 1 : 0) + (a.tag === "RELAX" ? 1.5 : 0) - (a.effort === "high" ? 2 : 0) })
  if (has(/\b(active|adventure|adrenaline|energetic|exciting|thrill|sporty)/) && !neg)
    rules.push({ label: "high-energy", adj: (a) => (a.effort === "high" ? 2 : a.effort === "med" ? 1 : -0.5) })
  if (has(/\b(indoor|inside|air.?con|out of the (sun|heat))/))
    rules.push({ label: neg ? "not indoor" : "indoor", adj: (a) => (a.indoorOutdoor === "indoor" ? (neg ? -2.5 : 2) : 0) })
  if (has(/\b(outdoor|outside|beach|ocean|water|sunshine|nature|fresh air)/) && !neg)
    rules.push({ label: "outdoor", adj: (a) => (a.indoorOutdoor === "outdoor" ? 2 : a.indoorOutdoor === "mixed" ? 1 : -0.5) })
  if (has(/\b(close|near|walk|on foot|nearby|short trip)/))
    rules.push({ label: "close by", adj: (a) => (a.zone === "walkable" ? 2 : -2) })
  if (has(/\b(quick|short|fast|little time|hour or less|not long)/))
    rules.push({ label: "quick", adj: (a) => (a.durationMin <= 60 ? 1.5 : a.durationMin >= 150 ? -2 : 0) })
  if (has(/\b(eat|food|drink|hungry|dinner|lunch|brunch|bar|cocktail|coffee|dessert)/) && !neg)
    rules.push({ label: "food & drink", adj: (a) => (a.tag === "EAT_DRINK" ? 2.5 : a.tag === "RELAX" ? 1 : 0) })
  if (has(/\b(show|music|live|perform|concert|theatre|theater|comedy)/) && !neg)
    rules.push({ label: "a show", adj: (a) => (a.tag === "WATCH" ? 2 : 0) })
  return rules
}

// Returns a new scored list with nudges applied, plus whether anything matched (so the
// caller/UI can honestly say the refinement had no effect rather than pretend it worked).
export function applyRefine(scored: Candidate[], text: string): { candidates: Candidate[]; matched: boolean } {
  const rules = buildRefineRules(text)
  if (!rules.length) return { candidates: scored, matched: false }
  const label = `"${text.slice(0, 28)}"`
  const out = scored.map((c) => {
    let adj = 0
    for (const r of rules) adj += r.adj(c.activity)
    adj = Math.round(adj * 10) / 10
    if (!adj) return c
    return { ...c, score: Math.round((c.score + adj) * 10) / 10, breakdown: [...c.breakdown, { label, value: adj }] }
  })
  return { candidates: out, matched: true }
}

// Full ranking + wildcard pick. Returns top candidates with the wildcard flagged.
export function rankCandidates(ctx: {
  now: Date
  hour: number
  weather: Weather
  logged: LoggedItem[]
  anchor: Anchor | null
  indoorOnly?: boolean
  refine?: string
}): Candidate[] {
  const loggedTodayIds = new Set(ctx.logged.filter((l) => l.today).map((l) => l.activityId))

  let pool = ACTIVITIES.filter((a) =>
    passesHardFilters(a, { now: ctx.now, hour: ctx.hour, weather: ctx.weather, loggedTodayIds, anchor: ctx.anchor }),
  )
  if (ctx.indoorOnly) pool = pool.filter((a) => a.indoorOutdoor === "indoor")

  let scored: Candidate[] = pool.map((a) => {
    const { score, breakdown } = scoreActivity(a, { hour: ctx.hour, weather: ctx.weather, logged: ctx.logged })
    return {
      activity: a,
      score,
      breakdown,
      rationale: templateRationale(a, ctx),
      slack: anchorActive(ctx.hour, ctx.anchor) ? computeSlack(a, ctx.hour, ctx.anchor!) : null,
      walkable: a.zone === "walkable",
      wildcard: false,
    }
  })

  // Refinement nudges the WHOLE pool before we trim, so "something weird" can pull a
  // genuinely off-beat option up into the visible picks.
  if (ctx.refine) scored = applyRefine(scored, ctx.refine).candidates

  scored.sort((x, y) => y.score - x.score)
  const top = scored.slice(0, 3)
  const topTags = new Set(top.map((c) => c.activity.tag))

  // Wildcard: an unusual pick on a tag not already in the top 3. Exclude anything the
  // refinement pushed negative — otherwise "no museums" could reappear as the wildcard.
  const rest = scored.slice(3).filter((c) => c.score >= 0)
  const wildcard =
    rest.find((c) => c.activity.novelty === "unusual" && !topTags.has(c.activity.tag)) ??
    rest.find((c) => c.activity.novelty === "unusual") ??
    null
  if (wildcard) wildcard.wildcard = true

  const out = [...top]
  if (wildcard) out.push(wildcard)
  return out
}

// Human, plain-language fallback rationale (Claude upgrades this when available).
function templateRationale(a: Activity, ctx: { weather: Weather; hour: number }): string {
  const bits: string[] = []
  if (ctx.weather === "rain-soon" && a.indoorOutdoor === "indoor") bits.push("stays dry if the rain rolls in")
  else if (a.novelty === "unusual") bits.push("something you haven't done yet")
  else bits.push("an easy, familiar win")
  if (a.zone === "walkable") bits.push("right on foot from the beach")
  else bits.push("a short rideshare out")
  if (a.cost === "free") bits.push("and it's free")
  const s = bits.join(", ")
  return s.charAt(0).toUpperCase() + s.slice(1) + "."
}
