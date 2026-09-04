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

function dayName(d: Date): "Fri" | "Sat" | "Sun" | "other" {
  const n = d.getDay()
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

// Full ranking + wildcard pick. Returns top candidates with the wildcard flagged.
export function rankCandidates(ctx: {
  now: Date
  hour: number
  weather: Weather
  logged: LoggedItem[]
  anchor: Anchor | null
  indoorOnly?: boolean
}): Candidate[] {
  const loggedTodayIds = new Set(ctx.logged.filter((l) => l.today).map((l) => l.activityId))

  let pool = ACTIVITIES.filter((a) =>
    passesHardFilters(a, { now: ctx.now, hour: ctx.hour, weather: ctx.weather, loggedTodayIds, anchor: ctx.anchor }),
  )
  if (ctx.indoorOnly) pool = pool.filter((a) => a.indoorOutdoor === "indoor")

  const scored: Candidate[] = pool.map((a) => {
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

  scored.sort((x, y) => y.score - x.score)
  const top = scored.slice(0, 3)
  const topTags = new Set(top.map((c) => c.activity.tag))

  // Wildcard: an unusual pick on a tag not already in the top 3.
  const rest = scored.slice(3)
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
