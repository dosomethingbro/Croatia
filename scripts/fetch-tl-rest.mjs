// Fallback fetcher using Wikipedia REST summary API (different endpoint, avoids Commons rate limits)
import fs from "fs"
import path from "path"

const OUT = path.join(process.cwd(), "public/photos/tl")
const UA = "DubrovnikCompanion/1.0 (travel companion app; contact@example.com)"

// Wikipedia article titles whose lead image is authentic + period-appropriate
const ARTICLES = {
  plague:   ["The_Triumph_of_Death", "Danse_Macabre", "Black_Death"],
  neum:     ["Neum", "Klek,_Croatia"],
  habsburg: ["Kingdom_of_Dalmatia", "Dubrovnik", "Gruž"],
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function summaryImage(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  const r = await fetch(url, { headers: { "User-Agent": UA } })
  if (!r.ok) return null
  const j = await r.json()
  const img = j.originalimage?.source || j.thumbnail?.source
  if (!img) return null
  return { img, page: j.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${title}`, title }
}

async function download(url, dest) {
  const r = await fetch(url, { headers: { "User-Agent": UA } })
  if (!r.ok) throw new Error("HTTP " + r.status)
  const buf = Buffer.from(await r.arrayBuffer())
  fs.writeFileSync(dest, buf)
  return buf.length
}

const creditsPath = path.join(OUT, "credits.json")
const credits = JSON.parse(fs.readFileSync(creditsPath, "utf8"))

for (const [key, titles] of Object.entries(ARTICLES)) {
  let done = false
  for (const t of titles) {
    try {
      const found = await summaryImage(t)
      if (!found) { console.log(`${key}: no image for ${t}`); continue }
      // skip svg/logos
      if (/\.svg$/i.test(found.img)) { console.log(`${key}: skipping svg from ${t}`); continue }
      const bytes = await download(found.img, path.join(OUT, `${key}.jpg`))
      credits[key] = { title: found.title, source: found.page, artist: "", license: "Wikipedia" }
      fs.writeFileSync(creditsPath, JSON.stringify(credits, null, 2))
      console.log(`${key}\tOK ${(bytes / 1024).toFixed(0)}KB\tfrom ${t}`)
      done = true
      break
    } catch (e) {
      console.log(`${key}: error on ${t}: ${e.message}`)
    }
    await sleep(500)
  }
  if (!done) console.log(`${key}\tSTILL MISSING`)
  await sleep(500)
}
// kingslanding credit (reused local walls photo)
credits.kingslanding = { title: "Dubrovnik city walls (King's Landing)", source: "https://commons.wikimedia.org/wiki/Category:Walls_of_Dubrovnik", artist: "", license: "Commons" }
fs.writeFileSync(creditsPath, JSON.stringify(credits, null, 2))
console.log("kingslanding\tcredit set (reused walls photo)")
