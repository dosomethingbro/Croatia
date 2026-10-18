import { NextResponse } from "next/server"
import { CITIES, type CityId } from "@/lib/sea"
import { nearbyWiki, newsFor } from "@/lib/sea-live"

export const revalidate = 1800

// GET ?city=hanoi -> live headlines (travel + local news) and Wikipedia places near the
// city centre. Cached for 30 min so the console can poll it freely.
export async function GET(req: Request) {
  const city = new URL(req.url).searchParams.get("city") as CityId | null
  const c = city ? CITIES[city] : null
  if (!c || city === "transit") return NextResponse.json({ ok: false, error: "Unknown city" }, { status: 400 })
  const [travel, local, nearby] = await Promise.all([
    newsFor(`${c.name} ${c.country} travel`, 8).catch(() => []),
    newsFor(`${c.name} ${c.country}`, 8).catch(() => []),
    nearbyWiki(c.center[0], c.center[1]).catch(() => []),
  ])
  const seen = new Set<string>()
  const news = [...travel, ...local]
    .filter((n) => (seen.has(n.title) ? false : (seen.add(n.title), true)))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 12)
  return NextResponse.json({ ok: true, city, news, nearby, fetchedAt: new Date().toISOString() })
}
