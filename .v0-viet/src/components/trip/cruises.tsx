import Image from "next/image"
import { CRUISES, CRUISE_DECISION, IMG } from "@/lib/trip-data"
import { SectionHead, BookButton } from "./ui"

export function Cruises() {
  return (
    <div>
      <div className="relative mt-2 overflow-hidden rounded-3xl border border-border">
        <Image
          src={IMG.halong || "/placeholder.svg"}
          alt="Cruise boats among the karsts of Ha Long Bay"
          width={1600}
          height={700}
          className="h-[34vh] min-h-[240px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-blue">Nov 25–26 · overnight</div>
          <h2 className="mt-1.5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Ha Long / Lan Ha Bay</h2>
        </div>
      </div>

      <SectionHead
        eyebrow="Shortlist"
        title="Ha Long / Lan Ha cruise shortlist"
        aside="Target: comfortable luxury, balcony, good activities, not absurdly expensive"
      />

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {CRUISES.map((c) => (
          <article key={c.name} className="relative rounded-2xl border border-border bg-panel p-5">
            {c.rank && <span className="absolute right-4 top-4 font-display font-extrabold text-brand-green">{c.rank}</span>}
            <small className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-blue">{c.tier}</small>
            <h3 className="mt-1.5 font-display text-lg font-semibold">{c.name}</h3>
            <div className="my-2 font-display text-2xl font-black">{c.cost}</div>
            <div className="font-extrabold text-brand-gold">{c.score}</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            {c.link && (
              <div className="mt-3.5">
                <BookButton href={c.link.href}>{c.link.label}</BookButton>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-panel p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Current cruise decision</h3>
            <div className="mt-1 font-extrabold text-brand-green">
              Compare Capella vs Orchid Classic vs Heritage Binh Chuan
            </div>
          </div>
          <span className="w-fit whitespace-nowrap rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 text-[11px] font-bold text-brand-gold">
            DO NOT OVERPAY
          </span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {CRUISE_DECISION.map((d) => (
            <li key={d} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" aria-hidden />
              <span className="leading-relaxed">{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
