// Mood planning: pick a mood for each time slot of a day and the engine finds the places
// that fit that mood, are open then, are in the city you'll actually be in, and suit the
// weather. Every place gets a 0–1 fit per mood so the console can chart where moods overlap.

import {
  ACTIVITIES,
  ACTIVITY_BY_ID,
  cityAt,
  fmtHour,
  travelHours,
  unavailableReason,
  type SeaActivity,
  type TripDay,
  type Weather,
} from "@/lib/sea"
import { HISTORY } from "@/lib/sea-history"

export type MoodId = "early" | "chill" | "relax" | "run" | "explore" | "culture" | "food" | "event" | "dark"
export type SlotId = "dawn" | "morning" | "midday" | "afternoon" | "evening" | "night"

export interface Mood { id: MoodId; label: string; energy: number; color: string; blurb: string }
export interface TimeSlot { id: SlotId; label: string; start: number; end: number }

export const MOODS: Mood[] = [
  { id: "early", label: "Early start", energy: 3, color: "#F2C14E", blurb: "Up before the crowds: sunrise, markets, empty temples." },
  { id: "chill", label: "Slow & chill", energy: 1, color: "#7FC0E8", blurb: "Cafés, lake walks, nothing that needs a plan." },
  { id: "relax", label: "Recharge", energy: 1, color: "#9AD1A6", blurb: "Spa, pool, beach. Battery back to 100." },
  { id: "run", label: "Hit the ground running", energy: 5, color: "#E2543D", blurb: "Big headline experiences. Go hard while you've got the energy." },
  { id: "explore", label: "Go & explore", energy: 4, color: "#3DD6C4", blurb: "Wander, get lost, find hidden gems." },
  { id: "culture", label: "Culture & history", energy: 3, color: "#D9A35A", blurb: "Temples, museums, the story of the place." },
  { id: "food", label: "Food crawl", energy: 2, color: "#E8A23D", blurb: "Street food, markets, the dish this city is known for." },
  { id: "event", label: "Night out / event", energy: 4, color: "#B98CE0", blurb: "Night markets, shows, rooftops, whatever's on tonight." },
  { id: "dark", label: "Dark history", energy: 2, color: "#8E6A6A", blurb: "The sites where things went badly wrong, and why it still matters." },
]
export const MOOD_BY_ID: Record<MoodId, Mood> = Object.fromEntries(MOODS.map((m) => [m.id, m])) as Record<MoodId, Mood>

export const SLOTS: TimeSlot[] = [
  { id: "dawn", label: "Dawn", start: 5, end: 8 },
  { id: "morning", label: "Morning", start: 8, end: 11.5 },
  { id: "midday", label: "Midday", start: 11.5, end: 14.5 },
  { id: "afternoon", label: "Afternoon", start: 14.5, end: 17.5 },
  { id: "evening", label: "Evening", start: 17.5, end: 21 },
  { id: "night", label: "Night", start: 21, end: 24 },
]

export const MOOD_PRESETS: { id: string; label: string; blurb: string; moods: Partial<Record<SlotId, MoodId>> }[] = [
  { id: "early-chill", label: "Early chill", blurb: "Up early, then take it slow", moods: { dawn: "early", morning: "chill", midday: "food", afternoon: "relax", evening: "chill" } },
  { id: "run", label: "Hit the ground running", blurb: "Big sights, all day", moods: { morning: "run", midday: "food", afternoon: "run", evening: "event", night: "event" } },
  { id: "explore", label: "Go & explore", blurb: "Gems and wandering", moods: { morning: "explore", midday: "food", afternoon: "explore", evening: "food", night: "event" } },
  { id: "recharge", label: "Recharge day", blurb: "Rest up between big days", moods: { morning: "chill", midday: "relax", afternoon: "relax", evening: "food" } },
  { id: "history", label: "History deep-dive", blurb: "The story, light and dark", moods: { morning: "culture", midday: "food", afternoon: "dark", evening: "culture" } },
  { id: "event", label: "Event night", blurb: "Save energy for tonight", moods: { morning: "chill", afternoon: "relax", evening: "food", night: "event" } },
]

const HISTORY_SITES = new Set(HISTORY.flatMap((h) => h.sites))
const DARK_SITES = new Set(HISTORY.filter((h) => h.kind === "dark").flatMap((h) => h.sites))

export function moodFit(a: SeaActivity, m: MoodId): number {
  let s = 0
  const low = a.effort === "low", high = a.effort === "high"
  const market = /market|bazaar/i.test(a.name)
  switch (m) {
    case "early":
      s += a.openHour <= 6.5 ? 0.6 : a.openHour <= 8 ? 0.3 : 0
      if (a.indoorOutdoor !== "indoor") s += 0.2
      if (a.tag === "EXPLORE" || a.tag === "RELAX") s += 0.2
      if (a.eveningOnly) s -= 1
      break
    case "chill":
      if (low) s += 0.4
      if (a.tag === "RELAX" || a.tag === "EAT_DRINK") s += 0.35
      if (a.zone === "walkable") s += 0.15
      if (a.cost === "free" || a.cost === "$") s += 0.1
      if (high) s -= 0.5
      break
    case "relax":
      if (a.tag === "RELAX") s += 0.7
      if (low) s += 0.2
      if (a.indoorOutdoor === "indoor") s += 0.1
      if (high) s -= 0.6
      break
    case "run":
      if (high) s += 0.4
      else if (a.effort === "med") s += 0.2
      if (a.tag === "EXPERIENCE" || a.tag === "PLAY") s += 0.35
      else if (a.tag === "EXPLORE") s += 0.2
      if (a.durationMin >= 180) s += 0.2
      if (a.commitment === "reserved") s += 0.1
      if (a.tag === "RELAX") s -= 0.5
      break
    case "explore":
      if (a.tag === "EXPLORE") s += 0.5
      if (a.novelty === "unusual") s += 0.25
      if (a.kind === "gem") s += 0.25
      else if (a.kind === "daytrip") s += 0.2
      break
    case "culture":
      if (a.tag === "LEARN") s += 0.5
      if (HISTORY_SITES.has(a.id)) s += 0.35
      if (a.tag === "WATCH") s += 0.1
      break
    case "food":
      if (a.tag === "EAT_DRINK") s += 0.8
      if (market) s += 0.3
      break
    case "event":
      if (a.eveningOnly) s += 0.45
      if (a.closeHour >= 21.5) s += 0.2
      if (a.tag === "WATCH") s += 0.3
      if (a.onDates || a.days) s += 0.25
      if (a.tag === "PLAY") s += 0.1
      break
    case "dark":
      if (DARK_SITES.has(a.id)) s += 0.8
      else if (HISTORY_SITES.has(a.id)) s += 0.2
      if (a.tag === "LEARN") s += 0.15
      break
  }
  return Math.round(Math.max(0, Math.min(1, s)) * 100) / 100
}

export function moodVector(a: SeaActivity): Record<MoodId, number> {
  return Object.fromEntries(MOODS.map((m) => [m.id, moodFit(a, m.id)])) as Record<MoodId, number>
}

export const FIT_MIN = 0.35

export interface MoodSlotResult {
  slot: SlotId
  label: string
  start: number
  end: number
  mood: MoodId
  pick: { id: string; start: number; end: number; fit: number } | null
  alts: { id: string; fit: number }[]
  note?: string
}

// One activity per moody slot, chained in time: a long excursion that eats the next
// slot marks that slot as "covered" instead of double-booking it.
export function moodTimeline(
  day: TripDay,
  moods: Partial<Record<SlotId, MoodId>>,
  weather: Weather = "clear",
  exclude: string[] = [],
): MoodSlotResult[] {
  const used = new Set(exclude)
  const suggested = new Set(day.suggested)
  const out: MoodSlotResult[] = []
  let cursor = 0
  for (const slot of SLOTS) {
    const mood = moods[slot.id]
    if (!mood || !MOOD_BY_ID[mood]) continue
    const base: MoodSlotResult = { slot: slot.id, label: slot.label, start: slot.start, end: slot.end, mood, pick: null, alts: [] }
    if (cityAt(day, slot.start) === "transit" || day.city === "transit") {
      out.push({ ...base, note: "Travel day" })
      continue
    }
    const block = day.blocks.find((b) => b.start <= slot.start + 0.25 && b.end >= slot.end - 0.25)
    if (block) {
      out.push({ ...base, note: `Locked: ${block.label}` })
      continue
    }
    if (cursor >= slot.end - 0.25) {
      out.push({ ...base, note: "Covered by the previous pick" })
      continue
    }
    const from = Math.max(slot.start, cursor)
    const ranked = ACTIVITIES.filter((a) => !used.has(a.id))
      .map((a) => {
        let st = Math.max(from + (cursor ? travelHours(a) : 0), a.openHour)
        for (const b of day.blocks) if (st < b.end && st + a.durationMin / 60 > b.start) st = Math.max(st, b.end + travelHours(a))
        st = Math.ceil(st * 4) / 4
        return { a, st, fit: moodFit(a, mood) }
      })
      .filter(({ a, st, fit }) => fit >= FIT_MIN && st < slot.end - 0.25 && !unavailableReason(a, day, st, weather))
      .map((x) => ({
        ...x,
        rank: x.fit * 10 + (suggested.has(x.a.id) ? 1.5 : 0) + (x.a.novelty === "unusual" ? 0.5 : 0) -
          (x.a.commitment === "reserved" && !suggested.has(x.a.id) ? 0.6 : 0) - (x.st - slot.start) * 0.3,
      }))
      .sort((x, y) => y.rank - x.rank)

    const top = ranked[0]
    if (!top) {
      out.push({ ...base, note: `Nothing that fits "${MOOD_BY_ID[mood].label}" is open then. Try another mood.` })
      continue
    }
    const end = top.st + top.a.durationMin / 60
    used.add(top.a.id)
    cursor = end
    out.push({
      ...base,
      pick: { id: top.a.id, start: top.st, end, fit: top.fit },
      alts: ranked.slice(1, 4).map((r) => ({ id: r.a.id, fit: r.fit })),
      note: end > slot.end + 0.5 ? `Runs into the next slot (until ${fmtHour(end)})` : undefined,
    })
  }
  return out
}

export function moodIdsInOrder(slots: MoodSlotResult[]): string[] {
  return slots.filter((s) => s.pick && ACTIVITY_BY_ID[s.pick.id]).map((s) => s.pick!.id)
}
