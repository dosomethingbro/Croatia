import { HISTORY } from "@/lib/trip-data"
import { SectionHead } from "./ui"
import { cn } from "@/lib/utils"

export function History() {
  return (
    <div>
      <SectionHead
        eyebrow="World explorer layer"
        title="Historical context around the trip"
        aside="The deeper story beneath each stop on the map"
      />
      <div className="grid gap-3.5 md:grid-cols-2">
        {HISTORY.map((h) => (
          <article
            key={h.title}
            className={cn(
              "rounded-2xl border bg-panel p-5",
              h.dark ? "border-brand-red/30" : "border-border",
            )}
          >
            <div className={cn("text-[11px] font-extrabold tracking-[0.05em]", h.dark ? "text-brand-red" : "text-brand-blue")}>
              {h.era}
            </div>
            <h3 className="mt-1.5 font-display text-lg font-semibold text-balance">{h.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
