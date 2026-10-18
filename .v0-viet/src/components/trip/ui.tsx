import { cn } from "@/lib/utils"
import type { Verdict } from "@/lib/trip-data"

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-blue", className)}>
      {children}
    </div>
  )
}

export function SectionHead({
  eyebrow,
  title,
  aside,
}: {
  eyebrow: string
  title: string
  aside?: React.ReactNode
}) {
  return (
    <div className="mt-9 mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      </div>
      {aside ? <div className="text-sm text-muted-foreground text-pretty">{aside}</div> : null}
    </div>
  )
}

const verdictStyles: Record<Verdict, string> = {
  pick: "text-brand-green",
  skip: "text-brand-red",
  consider: "text-brand-gold",
}

export function VerdictText({ verdict, children }: { verdict: Verdict; children: React.ReactNode }) {
  return <span className={cn("font-extrabold", verdictStyles[verdict])}>{children}</span>
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground">{children}</span>
  )
}

export function BookButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-brand-blue/30 bg-brand-blue/10 px-3 py-1.5 text-xs font-semibold text-brand-blue transition hover:border-brand-blue/60 hover:bg-brand-blue/20"
    >
      {children}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}
