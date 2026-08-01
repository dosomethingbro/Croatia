import fs from "node:fs"
import path from "node:path"

// Curated Wikimedia Commons queries per stop id.
// Prefer specific file titles (File:...) when known; otherwise a search term.
const MAP = {
  1: "File:Dubrovnik srdj.jpg|Srđ Dubrovnik cable car view",
  2: "Fort Imperial Dubrovnik Srđ",
  3: "Srđ Dubrovnik;Mount Srd Dubrovnik;Dubrovnik panorama Srd",
  4: "Kupari abandoned hotels Croatia",
  5: "Sokol Grad Konavle",
  6: "Pasjača beach Konavle",
  7: "Lovrijenac Dubrovnik",
  8: "Dubrovnik city walls",
  9: "Minčeta tower Dubrovnik",
  10: "Revelin fortress Dubrovnik",
  11: "Fort of St John Dubrovnik",
  12: "Lazareti Dubrovnik",
  13: "Rector's Palace Dubrovnik",
  14: "War Photo Limited Dubrovnik",
  15: "Franciscan monastery Dubrovnik pharmacy",
  16: "Buza bar Dubrovnik;Dubrovnik city walls sea;Dubrovnik cliff Adriatic",
  17: "Porporela Dubrovnik",
  18: "Gradac Park Dubrovnik",
  19: "Danče beach Dubrovnik",
  20: "Lokrum Fort Royal",
  21: "Boninovo Dubrovnik cemetery",
  22: "Konavle;Konavle Croatia landscape;Cavtat Konavle",
  23: "Gruž harbour Dubrovnik",
  24: "Dubrovnik Srđ panorama view",
  25: "Old Port Dubrovnik arsenal",
  26: "Ljuta Konavle mill",
  27: "Jesuit Staircase Dubrovnik;Dubrovnik Jesuit stairs;St Ignatius Church Dubrovnik",
  28: "Stradun Dubrovnik;Dubrovnik Placa street;Dubrovnik old town main street",
  29: "Pile Dubrovnik;Kolorina bay Dubrovnik;Dubrovnik Lovrijenac bay",
  30: "Trsteno Arboretum",
  31: "Prijeko Dubrovnik;Dubrovnik old town alley restaurant;Dubrovnik narrow street dining",
  32: "Dubrovnik old town street food",
  33: "Dubrovnik cafe old town;Dubrovnik street cafe;Dubrovnik old town square",
  34: "Dubrovnik old town restaurant terrace;Dubrovnik square dining;Gundulic square Dubrovnik",
  35: "Ston oysters Croatia",
  36: "Dubrovnik rooftop view;Dubrovnik terrace sea view;Dubrovnik restaurant Adriatic view",
  37: "Lapad Dubrovnik;Lapad bay Dubrovnik;Dubrovnik Lapad promenade",
  38: "Gruz Dubrovnik;Gruz port Dubrovnik;Dubrovnik Gruz harbour market",
  39: "Mediterranean vegetarian dish;vegetarian plate restaurant;falafel plate",
  40: "Ćevapi Bosnian food",
  41: "Pelješac wine Croatia",
  42: "Dubrovnik walls swimming;Dubrovnik cliff sea;Adriatic Dubrovnik rocks swim",
  43: "Dance Dubrovnik;Dubrovnik rocky beach;Dubrovnik Adriatic swimming rocks",
  44: "Šulić beach Dubrovnik",
  45: "Kolorina Dubrovnik;Dubrovnik cove Lovrijenac;Dubrovnik small bay",
  46: "Lokrum island Dubrovnik",
  47: "Elaphiti islands Croatia Lopud",
  48: "Cavtat;Cavtat Croatia;Cavtat harbour",
  49: "Ston walls Croatia",
  50: "Kotor Montenegro bay",
  51: "Pile Gate Dubrovnik;Dubrovnik Pile entrance;Brsalje Dubrovnik",
  52: "Fort of St John Dubrovnik harbour",
  53: "Gelato ice cream Italy",
  54: "Sveti Jakov beach Dubrovnik",
  55: "Betina cave beach Dubrovnik",
  56: "Dubrovnik sunset sea;Dubrovnik walls sunset;Adriatic sunset Dubrovnik",
  57: "Gradac Park Dubrovnik;Dubrovnik park sea view;Dubrovnik Lovrijenac park",
  58: "Dubrovnik old town stairs alley",
  59: "Park Orsula Dubrovnik;Dubrovnik viewpoint east;Dubrovnik coast panorama",
  60: "Rupe granary Dubrovnik museum",
  61: "Maritime Museum Dubrovnik",
  62: "Dubrovnik synagogue",
  63: "Dubrovnik old town street;Dubrovnik Antuninska;Dubrovnik gallery street",
  64: "Fort Imperial Srđ Dubrovnik museum",
  65: "Trsteno Arboretum Renaissance",
  66: "Mljet National Park lakes",
  67: "Konavle;Konavle valley;Konavle vineyard;Konavle Croatia landscape",
  68: "Onofrio fountain Dubrovnik;Large Onofrio's Fountain Dubrovnik;Onofrijeva fontana",
  69: "Franciscan monastery Dubrovnik;Franciscan monastery cloister Dubrovnik;Franciscan pharmacy Dubrovnik",
  70: "Sponza Palace Dubrovnik;Palača Sponza;Sponza Dubrovnik Luza",
  71: "Church of St Blaise Dubrovnik;Sveti Vlaho Dubrovnik;Orlando column Dubrovnik",
  72: "Dubrovnik Cathedral;Assumption Cathedral Dubrovnik;Dubrovnik katedrala",
  73: "Dominican Monastery Dubrovnik;Dominican monastery cloister Dubrovnik;Dominikanski samostan Dubrovnik",
}

const OUT = path.resolve("public/photos")
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
      // Cap any wait at 45s so a huge Retry-After never hangs the run
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

const IMG_RE = /\.(jpe?g|png)$/i // photographs only — no PDFs, SVGs, TIFFs, GIFs

async function searchTerm(term) {
  const searchUrl =
    `${api}?action=query&format=json&generator=search&gsrnamespace=6` +
    `&gsrlimit=12&gsrsearch=${encodeURIComponent(term)}` +
    `&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1200`
  const data = await j(searchUrl)
  const pages = data?.query?.pages ? Object.values(data.query.pages) : []
  const scored = pages
    .filter((p) => p.imageinfo && p.imageinfo[0])
    .filter((p) => {
      const ii = p.imageinfo[0]
      const isImg = (ii.mime || "").startsWith("image/") && IMG_RE.test(p.title)
      return isImg
    })
    .map((p) => {
      const ii = p.imageinfo[0]
      const w = ii.width || 0
      const h = ii.height || 1
      const ratio = w / h
      const landscape = ratio >= 1.1 && ratio <= 2.2 ? 2 : ratio >= 0.9 ? 1 : 0
      const big = w >= 1000 ? 1 : 0
      return { p, ii, score: landscape + big }
    })
    .sort((a, b) => b.score - a.score)
  return scored[0] || null
}

async function findImage(query) {
  // Support multiple fallback terms separated by ";"
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
      const artist = (meta.Artist?.value || "").replace(/<[^>]*>/g, "").trim()
      const license = (meta.LicenseShortName?.value || "").trim()
      return {
        title: best.p.title,
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

// Resume: load existing credits so we skip already-downloaded images
const creditsPath = path.join(OUT, "credits.json")
const credits = fs.existsSync(creditsPath)
  ? JSON.parse(fs.readFileSync(creditsPath, "utf8"))
  : {}
const ids = Object.keys(MAP).map(Number).sort((a, b) => a - b)

for (const id of ids) {
  const dest = path.join(OUT, `${id}.jpg`)
  if (credits[id] && fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
    console.log(`${id}\tSKIP (have it)`)
    continue
  }
  try {
    const found = await findImage(MAP[id])
    if (!found) {
      console.log(`${id}\tNO RESULT\t${MAP[id]}`)
      continue
    }
    const bytes = await download(found.thumb, dest)
    credits[id] = {
      title: found.title,
      source: found.descUrl,
      artist: found.artist,
      license: found.license,
    }
    fs.writeFileSync(creditsPath, JSON.stringify(credits, null, 2))
    console.log(`${id}\tOK ${(bytes / 1024).toFixed(0)}KB\t${found.title}`)
  } catch (e) {
    console.log(`${id}\tERROR\t${e.message}`)
  }
  await sleep(3000)
}

fs.writeFileSync(path.join(OUT, "credits.json"), JSON.stringify(credits, null, 2))
console.log("DONE. credits.json written with", Object.keys(credits).length, "entries.")
