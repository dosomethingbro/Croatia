import fs from "fs"
import path from "path"

/* Authentic, period-accurate imagery for each Story of Ragusa timeline event.
   Terms prioritize real historical material: manuscripts, engravings, period maps,
   portraits, and documentary photos (for modern events). Multiple ";"-separated
   fallbacks per event, tried in order. Image files only (jpg/png). */
const MAP = {
  found:    "Cavtat Epidaurum;Ragusa Dubrovnik old map;Dubrovnik historical engraving",
  trade:    "Republic of Ragusa;Ragusa Dubrovnik veduta;Dubrovnik old engraving",
  statute:  "Statute of Dubrovnik;Liber statutorum civitatis Ragusii;Dubrovnik 1272 statute",
  fire:     "Dubrovnik Stradum historical;Ragusa old view;Dubrovnik Placa engraving",
  plague:   "The Triumph of Death Bruegel;Danse Macabre fresco;Plague of Florence painting;medieval plague miniature",
  venice:   "Treaty of Zadar;Rector's Palace Dubrovnik;Dubrovnik Rector palace",
  quarantine:"Lazareti Dubrovnik;Dubrovnik Lazareti;Ploce Lazareti",
  slavery:  "Republic of Ragusa flag;Ragusa Libertas;Ragusa coat of arms",
  quake:    "1667 Dubrovnik earthquake;Ragusa earthquake 1667;Dubrovnik earthquake engraving",
  neum:     "Neum Bosnia Herzegovina;Klek Neum coast;Neum Adriatic coast",
  napoleon: "Auguste de Marmont;Marmont marshal portrait;Illyrian Provinces Napoleon",
  habsburg: "Ragusa Dalmatia 1900;Dubrovnik Gruz historic photo;Dubrovnik historical photograph 1890;Gravosa Ragusa",
  unesco:   "Dubrovnik city walls aerial;Dubrovnik old town panorama;Dubrovnik walls view",
  siege:    "Siege of Dubrovnik;Dubrovnik 1991 war;Dubrovnik shelling 1991",
  rebuilt:  "Dubrovnik roofs red;Dubrovnik old town roofs;Dubrovnik rooftops restored",
  kingslanding:"Lovrijenac Dubrovnik;Dubrovnik city walls;Dubrovnik fort Bokar",
}

const OUT = path.resolve("public/photos/tl")
fs.mkdirSync(OUT, { recursive: true })

const UA = "DubrovnikTripGuide/1.0 (educational trip planner)"
const api = "https://commons.wikimedia.org/w/api.php"
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchRetry(url, opts = {}, tries = 6) {
  let delay = 1500
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: { "User-Agent": UA }, ...opts })
    if (r.ok) return r
    if (r.status === 429 || r.status >= 500) {
      const ra = Number(r.headers.get("retry-after"))
      const wait = Math.min(ra ? ra * 1000 : delay, 45000)
      console.log(`  ...${r.status}, waiting ${wait}ms (try ${i + 1}/${tries})`)
      await sleep(wait)
      delay = Math.min(delay * 2, 45000)
      continue
    }
    throw new Error("HTTP " + r.status)
  }
  throw new Error("HTTP 429 (exhausted retries)")
}

async function j(url) {
  const r = await fetchRetry(url)
  return r.json()
}

const IMG_RE = /\.(jpe?g|png)$/i

async function searchTerm(term) {
  const searchUrl =
    `${api}?action=query&format=json&generator=search&gsrnamespace=6` +
    `&gsrlimit=12&gsrsearch=${encodeURIComponent(term)}` +
    `&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1400`
  const data = await j(searchUrl)
  const pages = data?.query?.pages ? Object.values(data.query.pages) : []
  const scored = pages
    .filter((p) => p.imageinfo && p.imageinfo[0])
    .filter((p) => {
      const ii = p.imageinfo[0]
      return (ii.mime || "").startsWith("image/") && IMG_RE.test(p.title)
    })
    .map((p) => {
      const ii = p.imageinfo[0]
      const w = ii.width || 0
      const h = ii.height || 1
      const ratio = w / h
      // prefer landscape for the banner, but accept portrait historical art
      const shape = ratio >= 1.1 && ratio <= 2.4 ? 2 : ratio >= 0.7 ? 1 : 0
      const big = w >= 900 ? 1 : 0
      return { p, ii, score: shape + big }
    })
    .sort((a, b) => b.score - a.score)
  return scored[0] || null
}

async function findImage(query) {
  const terms = query.split(";").map((t) => t.trim()).filter(Boolean)
  for (const term of terms) {
    let best
    try {
      best = await searchTerm(term)
    } catch (e) {
      console.log(`  search failed for "${term}": ${e.message}`)
      continue
    }
    if (best) {
      const meta = best.ii.extmetadata || {}
      const artist = (meta.Artist?.value || "").replace(/<[^>]*>/g, "").trim().slice(0, 120)
      const license = (meta.LicenseShortName?.value || "").trim()
      return {
        title: best.p.title,
        term,
        thumb: best.ii.thumburl || best.ii.url,
        descUrl: best.ii.descriptionurl,
        artist,
        license,
      }
    }
    await sleep(400)
  }
  return null
}

async function download(url, dest) {
  const r = await fetchRetry(url)
  const buf = Buffer.from(await r.arrayBuffer())
  fs.writeFileSync(dest, buf)
  return buf.length
}

const creditsPath = path.join(OUT, "credits.json")
const credits = fs.existsSync(creditsPath)
  ? JSON.parse(fs.readFileSync(creditsPath, "utf8"))
  : {}

for (const key of Object.keys(MAP)) {
  const dest = path.join(OUT, `${key}.jpg`)
  if (credits[key] && fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
    console.log(`${key}\tSKIP (have it)`)
    continue
  }
  try {
    const found = await findImage(MAP[key])
    if (!found) {
      console.log(`${key}\tNO RESULT`)
      continue
    }
    const bytes = await download(found.thumb, dest)
    credits[key] = {
      title: found.title,
      source: found.descUrl,
      artist: found.artist,
      license: found.license,
    }
    fs.writeFileSync(creditsPath, JSON.stringify(credits, null, 2))
    console.log(`${key}\tOK ${(bytes / 1024).toFixed(0)}KB\t${found.title}`)
  } catch (e) {
    console.log(`${key}\tERROR\t${e.message}`)
  }
  await sleep(3000)
}
console.log("DONE")
