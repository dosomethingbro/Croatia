# Code Explainer — architecture & implementation

A technical tour of how this app is built. For the product story, see
**[EXPLAINER.md](./EXPLAINER.md)**.

---

## Stack

| Layer      | Choice |
|------------|--------|
| Framework  | Next.js (App Router) as a thin API/backend host |
| Frontend   | A single static file, `public/dubrovnik.html` (vanilla JS + Leaflet), served at `/` via a rewrite |
| Database   | Neon Postgres, accessed with Drizzle ORM |
| AI         | Anthropic Claude (`claude-sonnet-4-5`) via the official SDK |
| Storage    | Vercel Blob (public store) for uploaded photos |
| Maps       | Leaflet + CARTO Voyager tiles + OpenStreetMap data |

The UI is intentionally **not** React. The whole experience lives in one
hand-written HTML/CSS/JS file for zero build friction and instant HMR; Next.js is
used only for the API routes and to serve the static app.

---

## Repository map

```
app/
  layout.tsx                 root metadata + <html> shell
  page.tsx                   redirects "/" into /dubrovnik.html (so the preview lands on the app)
  api/
    ai/history/route.ts      "what happened here" briefings (Time Machine) + fact-check
    ai/discover/route.ts     nearby AI point-of-interest discovery
    ai/places/route.ts       CRUD for saved/dismissed discovered places
    marks/route.ts           shared want/done marks per traveller
    photos/route.ts          photo upload + list + Claude "identify" vision
    file/route.ts            image delivery (redirects to the public blob URL)
lib/
  claude.ts                  Claude client, trip-context seed, askClaude(), parseJson(), claudeError()
  db/index.ts                Drizzle client bound to Neon
  db/schema.ts               marks, briefings, ai_places, photos tables
  utils.ts                   shared helpers
public/
  dubrovnik.html             the entire frontend (~3.3k lines)
  trip-ston.json             the Dubrovnik -> Ston road-trip itinerary dataset
  photos/                    seeded/curated imagery
scripts/                     one-off data + photo maintenance scripts (mjs)
CLAUDE.md                    editable trip-context seed injected into every AI system prompt
next.config.mjs              rewrite "/" -> /dubrovnik.html
```

---

## Data model (`lib/db/schema.ts`)

- **`marks`** — `(person, stopId, want, done)`. Shared want/seen state for the two
  travellers. No auth by design — the app switches between named profiles.
- **`briefings`** — cached Time Machine history, keyed by a coarse **location cell**
  (~11 m lat/lng grid) so the same area is never re-generated. Stores the JSON
  payload, the reverse-geocoded real place label (ground truth), and a fact-check
  confidence (`high | medium | low`).
- **`ai_places`** — AI-discovered points of interest with a `status`
  (`suggested | saved | dismissed`) and a unique `dedupKey` (normalized title +
  coarse coords). Dismissed/saved rows are fed back to the model so it never
  re-suggests the same place.
- **`photos`** — uploaded imagery. Links optionally to `placeId`, `stopId`, or
  `tripSite` (string id for road-trip stops). `kind` is `gallery` or `identify`;
  `analysis` holds the Claude vision result for identify shots.

---

## The AI pipeline (`lib/claude.ts`)

1. **Trip context seed** — `tripContext()` reads `CLAUDE.md` (an editable file) and
   prepends it to every system prompt, so all AI output stays grounded in who the
   travellers are and the "never fabricate precise names/figures" rules.
2. **`askClaude()`** — single entry point that merges the seed with a per-call
   system prompt and returns concatenated text. Supports multimodal input
   (text + base64 image) for the "what am I looking at?" vision feature.
3. **`parseJson()`** — extracts the first valid JSON object/array from a model
   response, so routes can ask for structured output robustly.
4. **Fact-check** — the history route runs a **second Claude pass** over the first
   answer to grade it and attach a confidence level, rather than trusting a single
   generation.
5. **`claudeError()`** — normalizes Anthropic SDK errors into friendly,
   actionable messages with a `code` (`billing`, `auth`, `no_key`, `rate_limit`,
   `overloaded`, `timeout`). The frontend shows setup issues (billing/auth) as a
   persistent dismissible toast and transient issues as a quick auto-hiding one.

---

## Request flows

**Time Machine (`POST /api/ai/history`)**
GPS coords → coarse cell key → cache hit returns instantly; otherwise
reverse-geocode for a ground-truth place label → Claude generates eras/figures/
presence → second Claude pass fact-checks + scores confidence → persist to
`briefings` → return payload.

**Discover (`POST /api/ai/discover`)**
GPS coords + already-known places (to avoid repeats) → Claude proposes nearby
points → dedupe by `dedupKey` and distance → persist as `suggested` → return.
Saved/dismissed transitions go through `/api/ai/places`.

**Photos (`POST /api/photos`)**
Multipart upload → `put()` to the **public** Blob store with `access: "public"` →
store the returned public `url` on the row. For `kind: "identify"`, the bytes are
also sent to Claude vision and the parsed result is saved to `analysis`. Any
vision failure is returned as a friendly `visionError` while the photo still
saves.

**Image delivery (`GET /api/file?pathname=...`)**
Redirects to the public blob URL. This indirection keeps every frontend
`<img src="/api/file?pathname=...">` reference stable regardless of the
underlying store.

> **Note:** the store is a **public** Blob store, so uploads use
> `access: "public"` and the row stores the public URL. (An earlier version
> mismatched this with `access: "private"`, which silently broke every upload —
> fixed by aligning both the upload and the delivery route to the public store.)

---

## Frontend (`public/dubrovnik.html`)

One file, organized into `#view-*` sections (map, codex, near, time, plan, siege,
trip) toggled by a tab bar. Key patterns:

- **Design tokens** — CSS custom properties in `:root` (`--ink`, `--limestone`,
  `--trip`, `--got`, etc.); no direct colors.
- **Map** — Leaflet with marker clustering, category filters, and a pulsing live
  GPS dot fed by `watchPosition`.
- **Sheets** — stop detail, discover, and road-trip panels are bottom sheets on
  mobile that transform into left-docked side panels at `min-width: 900px`.
- **Road trip** — `openTrip()` fetches `trip-ston.json`, draws a priority-coded
  route + polyline, renders the itinerary timeline and contingency plans, runs a
  1s **countdown** to the next scheduled departure, and offers a **driver mode**
  that shows only the next few turn-by-turn instructions for the active leg.
- **Class-scoping gotcha** — the view containers are styled via `body > .view` so
  they never collide with an inline `.tagchip.view` lens chip that shares the
  class name.

---

## Environment

Provided by the connected integrations (do not re-add):

- `ANTHROPIC_API_KEY` — Claude access.
- `DATABASE_URL` / `POSTGRES_URL` (+ unpooled variants) — Neon.
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob.

---

## Local development

```bash
pnpm install
pnpm dev          # serves the app at http://localhost:3000  (redirects to /dubrovnik.html)
```
