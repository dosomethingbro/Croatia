import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const DIR = path.join(process.cwd(), "public", "photos")
const MAX_W = 1200 // plenty for full-width phone/retina display
const QUALITY = 72

const files = fs.readdirSync(DIR).filter((f) => /\.jpg$/i.test(f))
let before = 0
let after = 0

for (const f of files) {
  const p = path.join(DIR, f)
  const orig = fs.statSync(p).size
  before += orig
  try {
    const buf = await sharp(p)
      .rotate() // respect EXIF orientation before stripping metadata
      .resize({ width: MAX_W, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
      .toBuffer()
    // Only overwrite if we actually saved space
    if (buf.length < orig) {
      fs.writeFileSync(p, buf)
      after += buf.length
      console.log(`${f}\t${(orig / 1024).toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB`)
    } else {
      after += orig
      console.log(`${f}\tkept (${(orig / 1024).toFixed(0)}KB)`)
    }
  } catch (e) {
    after += orig
    console.log(`${f}\tERROR ${e.message}`)
  }
}

console.log(
  `\nTOTAL: ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB across ${files.length} files`,
)
