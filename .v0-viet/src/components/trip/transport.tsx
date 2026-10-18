import { TRANSFERS, TRANSFER_MATRIX, type TransferTone } from "@/lib/trip-data"
import { SectionHead, Pill, VerdictText } from "./ui"
import { cn } from "@/lib/utils"

const toneStyles: Record<TransferTone, string> = {
  neutral: "border-border bg-panel-2 text-muted-foreground",
  good: "border-brand-green/40 bg-brand-green/10 text-brand-green",
  warn: "border-brand-gold/40 bg-brand-gold/10 text-brand-gold",
  risk: "border-brand-red/40 bg-brand-red/10 text-brand-red",
}

export function Transport() {
  return (
    <div>
      <SectionHead
        eyebrow="Most important section"
        title="Travel within Vietnam & Thailand"
        aside="Every transfer, with failure modes"
      />

      <div className="grid gap-3.5 md:grid-cols-2">
        {TRANSFERS.map((t) => (
          <article key={t.route} className="flex flex-col rounded-2xl border border-border bg-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <small className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-blue">{t.tag}</small>
              <span className="whitespace-nowrap text-xs font-extrabold text-brand-green">{t.mode}</span>
            </div>
            <div className="my-2.5 font-display text-xl font-bold">{t.route}</div>
            <p className="text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            <div className="my-3 flex flex-wrap gap-1.5">
              {t.pills.map((p) => (
                <Pill key={p}>{p}</Pill>
              ))}
            </div>
            <div className={cn("mt-auto rounded-xl border px-3 py-2.5 text-xs leading-relaxed", toneStyles[t.note.tone])}>
              <b>{t.note.label}</b> {t.note.text}
            </div>
          </article>
        ))}
      </div>

      <SectionHead eyebrow="Transfer decision matrix" title="Where to spend for convenience" />
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-panel-2 text-left text-foreground/85">
              <th className="p-3.5 font-semibold">Leg</th>
              <th className="p-3.5 font-semibold">DIY</th>
              <th className="p-3.5 font-semibold">Private / operator</th>
              <th className="p-3.5 font-semibold">Recommendation</th>
              <th className="p-3.5 font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody>
            {TRANSFER_MATRIX.map((row) => (
              <tr key={row.leg} className="border-t border-border align-top text-muted-foreground">
                <td className="p-3.5 font-medium text-foreground">{row.leg}</td>
                <td className="p-3.5">{row.diy}</td>
                <td className="p-3.5">{row.private}</td>
                <td className="p-3.5">
                  <VerdictText verdict={row.verdict}>{row.rec}</VerdictText>
                </td>
                <td className="p-3.5">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
