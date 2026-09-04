import { pgTable, text, integer, boolean, timestamp, serial, doublePrecision, jsonb, index } from "drizzle-orm/pg-core"

// Shared trip marks for the two travellers (Tobi & Luke). No auth by design —
// the app switches between named profiles rather than using passwords.
export const marks = pgTable("marks", {
  person: text("person").notNull(),
  stopId: integer("stop_id").notNull(),
  want: boolean("want").notNull().default(false),
  done: boolean("done").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

// Cached "what happened here" history briefings, keyed by a coarse location cell
// so we never pay for the same area twice (no double-dipping the LLM).
export const briefings = pgTable("briefings", {
  id: serial("id").primaryKey(),
  cell: text("cell").notNull().unique(), // fine ~11m lat/lng grid key, e.g. "42.6412,18.1083"
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  title: text("title").notNull(),
  place: text("place"), // reverse-geocoded real place label (ground truth)
  confidence: text("confidence"), // fact-check confidence: high | medium | low
  saved: boolean("saved").notNull().default(false), // traveller bookmarked this story
  payload: jsonb("payload").notNull(), // { place, locationType, intro, eras[], figures[], presence, confidence, factCheck, sources[] }
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

// AI-discovered points of interest, shared between both travellers. Each point can be
// suggested, saved, or dismissed — dismissed/saved points are fed back to the LLM so it
// never re-suggests the same thing (no double-dipping).
export const aiPlaces = pgTable(
  "ai_places",
  {
    id: serial("id").primaryKey(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    title: text("title").notNull(),
    category: text("category").notNull().default("history"), // history | landmark | viewpoint | food | hidden | nature
    blurb: text("blurb").notNull(), // one-line hook
    detail: jsonb("detail"), // { why, whatHappened, figures[], tip, era }
    status: text("status").notNull().default("suggested"), // suggested | saved | dismissed
    dedupKey: text("dedup_key").notNull().unique(), // normalized title + coarse coords
    createdBy: text("created_by").notNull().default("tobi"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    locIdx: index("ai_places_loc_idx").on(t.lat, t.lng),
    statusIdx: index("ai_places_status_idx").on(t.status),
  }),
)

// Photos uploaded to areas of interest, plus "what am I looking at?" identify shots.
// Stored in a PRIVATE Blob store — only the pathname is kept; images are served via /api/file.
export const photos = pgTable(
  "photos",
  {
    id: serial("id").primaryKey(),
    pathname: text("pathname").notNull(), // private blob pathname
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    person: text("person").notNull().default("tobi"),
    placeId: integer("place_id"), // optional link to ai_places.id
    stopId: integer("stop_id"), // optional link to a curated itinerary stop
    tripSite: text("trip_site"), // optional link to a road-trip site (string id, e.g. "ston-old-town-walls")
    caption: text("caption"),
    kind: text("kind").notNull().default("gallery"), // gallery | identify
    analysis: jsonb("analysis"), // claude vision result for identify shots
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    placeIdx: index("photos_place_idx").on(t.placeId),
    locIdx: index("photos_loc_idx").on(t.lat, t.lng),
    tripSiteIdx: index("photos_trip_site_idx").on(t.tripSite),
  }),
)

// Shared "what we've done" manifest for the Honolulu Mission Control console (and any
// future decision-console location). One row per logged activity; both travellers see
// the same log, and the scoring engine reads it to bias away from repeated tags.
export const tripLog = pgTable(
  "trip_log",
  {
    id: serial("id").primaryKey(),
    trip: text("trip").notNull().default("honolulu"), // which location console
    activityId: text("activity_id").notNull(), // e.g. "surf-lesson"
    name: text("name").notNull(),
    tag: text("tag").notNull(), // PLAY | EXPERIENCE | WATCH | EXPLORE | LEARN | RELAX | EAT_DRINK
    person: text("person").notNull().default("tobi"),
    dayKey: text("day_key").notNull(), // local calendar day, e.g. "2026-09-05", for "today" grouping
    loggedAt: timestamp("logged_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tripIdx: index("trip_log_trip_idx").on(t.trip),
  }),
)
