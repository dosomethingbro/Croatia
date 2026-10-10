# Dubrovnik & Dalmatia — a travel companion for two

A personal, map-first travel app built for a trip through Dubrovnik and the
Dalmatian coast. It exists for two kinds of traveller at once: the **planner**
who wants the day structured, mapped, and timed — and the **wanderer** who wants
to walk around, stand somewhere, and discover what happened right there.

It is used by two named profiles, **Tobi** and **Luke**. There are no passwords:
you tap a name to switch whose "want to see" / "seen it" marks you are editing.
Everything is shared and stored in a real database, not throwaway browser state.

---

## The core idea

> **Review the history → plan the trip around what moves you → iterate on the way.**

You read what actually happened on the ground you're standing on, decide it's
worth a detour, drop it into the day, and adjust live as things slip — heat,
parking, running late. The trip becomes a conversation with the place rather
than a checklist.

---

## What's inside (the tabs)

- **Map** — a clustered Leaflet map of curated stops across the region, filtered
  by category (history, views & swims, food & drink, etc.). Tap a pin for a rich
  stop card: the read, history, cool facts, and one-tap Google Maps navigation.

- **Codex** — the full curated library of stops as browsable reference cards.

- **Near Me** — uses your live GPS to surface the closest curated stops first,
  sorted by real walking distance.

- **Time Machine (Discover)** — the signature feature. You stand anywhere and the
  app takes your **exact** coordinates (not the nearest famous landmark) and has
  Claude walk you through the eras of that precise ground. A **second AI pass
  fact-checks** the first, so stories are grounded and labelled with a confidence
  level instead of confidently hallucinated. It then plots **AI-recommended
  points of interest nearby** so you can keep exploring outward.

- **Plan** — a shared, editable trip brief the two travellers build together.

- **Command Center (Siege)** — a focused operational view for a specific day/route.

- **Road Trip** — a dedicated Dubrovnik → Ston itinerary tab: a live route map with
  numbered, priority-coded stops, a live **departure countdown**, turn-by-turn
  **driver mode**, Google Maps directions per stop, rich history cards, per-stop
  **photo uploads**, and built-in **contingency plans** (running late, extreme
  heat, parking delays, hard turnaround times).

---

## Things that make it feel real

- **Live location** everywhere it helps — a pulsing GPS dot that tracks you on the
  map and powers "near me" sorting.
- **Photos** — capture a shot at any stop; an "identify" mode asks Claude *"what am
  I looking at?"* and returns the subject, its story, and what to look closer at.
- **Fact-checking** — the history engine never just trusts its first answer.
- **No double-dipping the AI** — history briefings are cached per location cell, and
  dismissed/saved discovery points are fed back so the model never re-suggests the
  same thing.
- **Laptop-friendly** — on wide screens the phone bottom-sheets become a docked
  two-pane layout (left nav rail + side panel beside a full-height map).

---

## Coming soon

Per-stop **Add photo / Add video / Drop a note** — turning each place into
something you can annotate and make your own.

---

For the technical architecture (stack, data flow, API routes, database schema,
the AI pipeline, and how images are stored), see **[CODE_EXPLAINER.md](./CODE_EXPLAINER.md)**.
