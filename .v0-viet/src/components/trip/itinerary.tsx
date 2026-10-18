import { ITINERARY } from "@/lib/trip-data"
import { SectionHead } from "./ui"

export function Itinerary() {
  return (
    <div>
      <SectionHead
        eyebrow="Day by day"
        title="Current itinerary"
        aside="Working plan · times are planning targets"
      />
      <div className="mx-auto max-w-4xl">
        {ITINERARY.map((d, i) => (
          <div key={d.date} className="relative grid grid-cols-[68px_1fr] gap-4 pb-4 sm:grid-cols-[105px_1fr] sm:gap-6">
            {i < ITINERARY.length - 1 && (
              <span
                className="absolute top-8 bottom-0 w-px bg-border left-[78px] sm:left-[117px]"
                aria-hidden
              />
            )}
            <div className="pt-3.5 text-sm font-extrabold text-foreground/90">{d.date}</div>
            <div className="relative rounded-2xl border border-border bg-panel px-4 py-4 sm:px-5">
              <span
                className="absolute -left-[23px] top-5 h-2.5 w-2.5 rounded-full border-4 border-background bg-brand-green sm:-left-7"
                aria-hidden
              />
              <div className="text-[10px] font-extrabold tracking-[0.13em] text-brand-blue">{d.loc}</div>
              <h3 className="mt-1.5 font-display text-lg font-semibold">{d.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
