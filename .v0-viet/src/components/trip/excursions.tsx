import Image from "next/image"
import { EXCURSIONS, EXCURSION_MATRIX } from "@/lib/trip-data"
import { SectionHead, VerdictText, BookButton } from "./ui"

export function Excursions() {
  return (
    <div>
      <SectionHead eyebrow="Excursions" title="What to book — and what to skip" />

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {EXCURSIONS.map((e) => (
          <article key={e.title} className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-panel">
            {e.image && (
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={e.image || "/placeholder.svg"}
                  alt={e.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel/90 to-transparent" aria-hidden />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              {e.rank && (
                <span className="absolute right-4 top-4 rounded-full bg-background/70 px-2 py-1 font-display text-sm font-extrabold text-brand-green backdrop-blur">
                  {e.rank}
                </span>
              )}
              <small className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-blue">{e.region}</small>
              <h3 className="mt-1.5 font-display text-lg font-semibold">{e.title}</h3>
              <div className="my-2 font-display text-2xl font-black">{e.cost}</div>
              <div className="font-extrabold text-brand-gold">{e.score}</div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
              {e.links && (
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {e.links.map((l) => (
                    <BookButton key={l.label} href={l.href}>
                      {l.label}
                    </BookButton>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <SectionHead eyebrow="Filter" title="Excursion decision matrix" />
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-panel-2 text-left text-foreground/85">
              <th className="p-3.5 font-semibold">Option</th>
              <th className="p-3.5 font-semibold">Time</th>
              <th className="p-3.5 font-semibold">Best for</th>
              <th className="p-3.5 font-semibold">Decision</th>
              <th className="p-3.5 font-semibold">Tradeoff</th>
            </tr>
          </thead>
          <tbody>
            {EXCURSION_MATRIX.map((row) => (
              <tr key={row.option} className="border-t border-border align-top text-muted-foreground">
                <td className="p-3.5 font-medium text-foreground">{row.option}</td>
                <td className="p-3.5">{row.time}</td>
                <td className="p-3.5">{row.bestFor}</td>
                <td className="p-3.5">
                  <VerdictText verdict={row.verdict}>{row.decision}</VerdictText>
                </td>
                <td className="p-3.5">{row.tradeoff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
