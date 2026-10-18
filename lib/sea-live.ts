// Live sources for the trip console: Google News RSS for current coverage and the
// Wikipedia APIs for nearby places and page summaries. All calls are cached by Next.

const UA = { "user-agent": "TripConsole/1.0 (personal travel planner)" }

export interface FeedItem { title: string; link: string; source: string; date: string }
export interface NearbyItem { title: string; lat: number; lng: number; dist: number; url: string }
export interface WikiSummary { title: string; extract: string; url: string; thumb?: string }

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/<[^>]+>/g, "")
    .trim()
}

export async function newsFor(query: string, limit = 8): Promise<FeedItem[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`
  const res = await fetch(url, { headers: UA, next: { revalidate: 1800 } })
  if (!res.ok) return []
  const xml = await res.text()
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit).map((m) => {
    const it = m[1]
    const pick = (t: string) => decode(it.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`))?.[1] ?? "")
    const source = pick("source")
    let title = pick("title")
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3))
    return { title, link: pick("link"), source, date: pick("pubDate") }
  }).filter((x) => x.title && x.link.startsWith("https://"))
}

export async function nearbyWiki(lat: number, lng: number, radius = 10000, limit = 14): Promise<NearbyItem[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=${radius}&gslimit=${limit}&format=json&origin=*`
  const res = await fetch(url, { headers: UA, next: { revalidate: 86400 } })
  if (!res.ok) return []
  const j = await res.json()
  return (j?.query?.geosearch ?? []).map((g: any) => ({
    title: g.title,
    lat: g.lat,
    lng: g.lon,
    dist: Math.round(g.dist),
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(String(g.title).replace(/ /g, "_"))}`,
  }))
}

// Search for the best-matching article, then fetch its REST summary.
export async function wikiSummary(query: string): Promise<WikiSummary | null> {
  const s = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`,
    { headers: UA, next: { revalidate: 86400 } },
  )
  if (!s.ok) return null
  const title = (await s.json())?.query?.search?.[0]?.title
  if (!title) return null
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`, {
    headers: UA,
    next: { revalidate: 86400 },
  })
  if (!r.ok) return null
  const j = await r.json()
  return {
    title: j.title ?? title,
    extract: j.extract ?? "",
    url: j.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    thumb: j.thumbnail?.source,
  }
}
