import Image from "next/image"
import Link from "next/link"
import { STATS, TRIP_SHAPE, ROUTE, DESTINATIONS, IMG } from "@/lib/trip-data"
import { Eyebrow, SectionHead } from "./ui"
import { Countdown } from "./countdown"

export function Overview({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="pt-2">
      {/* Photographic hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border">
        <Image
          src={IMG.halong || "/placeholder.svg"}
          alt="Limestone karsts rising from the emerald water of Ha Long Bay, Vietnam"
          fill
          priority
          sizes="(max-width: 1500px) 100vw, 1500px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" aria-hidden />
        <div className="relative flex min-h-[560px] flex-col justify-end p-6 sm:p-10 lg:min-h-[620px] lg:p-14">
          <Eyebrow>Vietnam → Thailand · 17 days</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-6xl font-bold leading-[0.92] tracking-tight text-balance sm:text-7xl lg:text-[92px]">
            Culture first.
            <br />
            Beach finish.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85 text-pretty">
            Hanoi, Ninh Binh and Ha Long for food, history and landscape; Chiang Mai for Lanna culture, ethical
            elephant observation and mountains; Railay for a deliberately slower ending with Phi Phi and Hong Islands.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("transport")}
              className="rounded-xl bg-foreground px-4 py-3 text-sm font-bold text-background transition hover:opacity-90"
            >
              Review travel logistics
            </button>
            <button
              onClick={() => onNavigate("itinerary")}
              className="rounded-xl border border-white/20 bg-background/40 px-4 py-3 text-sm font-bold text-foreground backdrop-blur transition hover:bg-background/60"
            >
              Open itinerary
            </button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_.55fr]">
        <div className="grid grid-cols-2 content-start gap-2.5 sm:grid-cols-3 lg:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-panel p-4">
              <b className="font-display text-2xl font-bold">{s.value}</b>
              <span className="mt-1 block text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
          <div className="col-span-2 rounded-xl border border-border bg-panel p-5 sm:col-span-3">
            <Countdown />
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-panel p-6">
          <Eyebrow>Route</Eyebrow>
          <ol className="mt-4">
            {ROUTE.map((stop, i) => (
              <li key={stop.name} className="relative grid grid-cols-[18px_1fr] gap-3 pb-4 last:pb-0">
                {i < ROUTE.length - 1 && (
                  <span className="absolute left-[5px] top-3.5 bottom-0 w-px bg-border" aria-hidden />
                )}
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-blue" aria-hidden />
                <div>
                  <strong className="block text-sm">{stop.name}</strong>
                  <span className="text-xs text-muted-foreground">{stop.when}</span>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <SectionHead eyebrow="Destination guides" title="Explore each base" aside="Full detail pages for the three home bases" />
      <div className="grid gap-3.5 md:grid-cols-3">
        {DESTINATIONS.map((d) => (
          <Link
            key={d.slug}
            href={`/destination/${d.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-panel transition hover:border-brand-blue/50"
          >
            <div className="relative h-44 overflow-hidden">
              <Image
                src={d.image || "/placeholder.svg"}
                alt={`${d.name}, ${d.country}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" aria-hidden />
              <small className="absolute left-4 top-4 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-foreground backdrop-blur">
                {d.country} · {d.when}
              </small>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-xl font-semibold">{d.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">{d.tagline}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue transition group-hover:gap-2.5">
                Open guide
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <SectionHead eyebrow="Trip shape" title="Why the route works" />
      <div className="grid gap-3 md:grid-cols-3">
        {TRIP_SHAPE.map((card) => (
          <article key={card.tag} className="rounded-2xl border border-border bg-panel p-5">
            <small className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-blue">{card.tag}</small>
            <h3 className="mt-2 font-display text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
