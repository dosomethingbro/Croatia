import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { DESTINATIONS } from "@/lib/trip-data"

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const dest = DESTINATIONS.find((d) => d.slug === slug)
  if (!dest) return { title: "Destination not found" }
  return {
    title: `${dest.name} · Trip Command Center`,
    description: dest.tagline,
  }
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dest = DESTINATIONS.find((d) => d.slug === slug)
  if (!dest) notFound()

  const idx = DESTINATIONS.findIndex((d) => d.slug === slug)
  const next = DESTINATIONS[(idx + 1) % DESTINATIONS.length]

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1100px] items-center gap-4 px-4 py-3.5 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Command center
          </Link>
          <span className="ml-auto rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground">
            {dest.country} · {dest.when}
          </span>
        </div>
      </header>

      <section className="relative mx-auto max-w-[1100px] px-4 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border">
          <Image
            src={dest.image || "/placeholder.svg"}
            alt={`${dest.name}, ${dest.country}`}
            width={1600}
            height={900}
            priority
            className="h-[42vh] min-h-[300px] w-full object-cover sm:h-[52vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-blue">{dest.dates}</div>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              {dest.name}
            </h1>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-4 pb-20 pt-6 sm:px-6">
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">{dest.tagline}</p>
        <p className="mt-5 max-w-3xl leading-relaxed text-foreground/85">{dest.intro}</p>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Things to do</h2>
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            {dest.highlights.map((h) => (
              <article key={h.title} className="rounded-2xl border border-border bg-panel p-5">
                <h3 className="font-display text-lg font-semibold">{h.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">What to eat</h2>
            <ul className="mt-4 space-y-2.5">
              {dest.food.map((f) => (
                <li key={f} className="flex items-center gap-3 rounded-xl border border-border bg-panel px-4 py-3 text-sm">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Logistics</h2>
            <div className="mt-4 space-y-3.5">
              {dest.logistics.map((l) => (
                <article key={l.title} className="rounded-2xl border border-border bg-panel p-5">
                  <h3 className="font-display text-base font-semibold text-brand-teal">{l.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{l.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-panel-2/60 p-6">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-gold">History layer</div>
          <p className="mt-2 max-w-3xl leading-relaxed text-foreground/85">{dest.history}</p>
        </section>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Link href="/" className="text-sm text-muted-foreground transition hover:text-foreground">
            All destinations
          </Link>
          <Link
            href={`/destination/${next.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition hover:text-brand-teal"
          >
            {next.name}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  )
}
