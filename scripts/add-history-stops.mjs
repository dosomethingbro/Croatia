import fs from "node:fs"

const FILE = "public/dubrovnik.html"
const html = fs.readFileSync(FILE, "utf8")
const re = /(<script id="data" type="application\/json">)(\[[\s\S]*?\])(<\/script>)/
const m = html.match(re)
if (!m) throw new Error("data script not found")
const stops = JSON.parse(m[2])

const mapUrl = (lat, lng) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

const NEW = [
  {
    id: 68,
    name: "Onofrio's Great Fountain",
    lat: 42.6415,
    lng: 18.1064,
    area: "Old Town · Poljana Paska Miličevića",
    time: "10 min",
    priority: "First stop inside Pile Gate",
    tags: ["1438", "aqueduct", "landmark"],
    summary:
      "The big domed fountain that greets you just inside Pile Gate — the public endpoint of a 12km aqueduct that piped fresh spring water into the city in 1438.",
    history:
      "Built by Neapolitan engineer Onofrio della Cava, the fountain carried water from the Šumet spring 12km away. It made Dubrovnik one of the few medieval cities with clean running water for everyone.",
    dark: "The 1667 earthquake and fire stripped its once-ornate sculpture down to the 16 plain masks you see today — a survivor's scars hiding in plain sight.",
    fact: "Sixteen carved masks ring the dome, each spouting drinkable spring water. Arriving traders and pilgrims washed here before being allowed deeper into the city during plague years.",
    visit:
      "You'll pass it automatically entering from Pile. Fill your bottle — the water is clean, cold and free.",
    hidden:
      "Touch all sixteen masks for luck, locals say. Come at opening or dusk to photograph it without the crowd.",
    url: mapUrl(42.6415, 18.1064),
    lenses: ["must", "gem"],
  },
  {
    id: 69,
    name: "Franciscan Monastery & Old Pharmacy",
    lat: 42.6416,
    lng: 18.1069,
    area: "Old Town · Stradun (west)",
    time: "45 min",
    priority: "One of Europe's oldest pharmacies",
    tags: ["1317", "cloister", "pharmacy"],
    summary:
      "A serene Romanesque-Gothic cloister and the Old Pharmacy of 1317 — still operating, and among the oldest continuously-run pharmacies in the world.",
    history:
      "Founded in the 14th century, the monastery's pharmacy has served the public without interruption since 1317. Its library holds thousands of manuscripts and old apothecary jars.",
    dark: "The friars dispensed medicine through plague, war and the 1667 quake that killed much of the city — a rare thread of continuity through Ragusa's worst days.",
    fact: "The pharmacy still sells creams made to centuries-old monastery recipes. The quiet cloister garden feels a world away from the Stradun crowds a few steps outside.",
    visit:
      "Buy the museum ticket to see the cloister, old pharmacy museum and library. Working pharmacy counter is at the front, free to peek at.",
    hidden:
      "The cloister's carved capitals are all different — spot the grotesque faces. It's one of the coolest, calmest spots in the Old Town at midday.",
    url: mapUrl(42.6416, 18.1069),
    lenses: ["must", "gem"],
  },
  {
    id: 70,
    name: "Sponza Palace & Memorial Room",
    lat: 42.641,
    lng: 18.1108,
    area: "Old Town · Luža Square",
    time: "30 min",
    priority: "Sole survivor of the 1667 quake",
    tags: ["1522", "archives", "1991 memorial"],
    summary:
      "The elegant 16th-century palace on Luža Square — the only major building to survive the 1667 earthquake intact, now the State Archives.",
    history:
      "Completed in 1522 as a customs house and mint, Sponza mixed Gothic and Renaissance styles. Its atrium was the commercial heart of the Republic, where goods were weighed and taxed.",
    dark: "Inside is the Memorial Room of the Defenders — portraits of the young Dubrovnik men killed defending the city during the 1991–92 siege. It is quiet, sobering and free.",
    fact: "An inscription in the atrium reads that cheating on the scales was forbidden — 'when I weigh goods, God weighs me.' The archives preserve 1,000 years of Ragusan records.",
    visit:
      "Step into the courtyard for free; the Memorial Room is off the atrium. Combine with St. Blaise and Orlando's Column, all on the same square.",
    hidden:
      "Look up at the loggia arches — the mix of Gothic windows and Renaissance arcade tells you it was built right as styles were changing.",
    url: mapUrl(42.641, 18.1108),
    lenses: ["must", "dark"],
  },
  {
    id: 71,
    name: "Church of St. Blaise & Orlando's Column",
    lat: 42.6409,
    lng: 18.1104,
    area: "Old Town · Luža Square",
    time: "25 min",
    priority: "Patron saint & symbol of liberty",
    tags: ["St. Blaise", "Libertas", "1418"],
    summary:
      "The baroque church of the city's patron saint, facing Orlando's Column — the stone knight that symbolized Ragusan freedom and law.",
    history:
      "St. Blaise (Sveti Vlaho) has been Dubrovnik's protector since 972. Orlando's Column, raised in 1418, was where laws were proclaimed and the Republic's flag of Libertas flew.",
    dark: "Public punishments and proclamations happened at Orlando's feet. The column's forearm was the city's official unit of length — justice and commerce enforced from the same stone.",
    fact: "The statue of St. Blaise above the church door holds a model of the city as it looked before the 1667 earthquake — a snapshot of medieval Dubrovnik.",
    visit:
      "The church interior is free and quick. Every 3 February the saint's feast fills this square with a centuries-old procession.",
    hidden:
      "Find the carved forearm on Orlando's Column — the 'Dubrovnik cubit' (51.2cm) that merchants once measured cloth against.",
    url: mapUrl(42.6409, 18.1104),
    lenses: ["must"],
  },
  {
    id: 72,
    name: "Dubrovnik Cathedral & Treasury",
    lat: 42.6402,
    lng: 18.1109,
    area: "Old Town · Poljana Marina Držića",
    time: "30 min",
    priority: "Relics & the Lionheart legend",
    tags: ["baroque", "treasury", "relics"],
    summary:
      "A baroque cathedral built over Romanesque ruins, whose Treasury holds gold-and-silver reliquaries including the skull-reliquary of St. Blaise.",
    history:
      "Legend says an earlier cathedral was funded by Richard the Lionheart in thanks for surviving a shipwreck near Lokrum in 1192. The current church rose after the 1667 quake destroyed its predecessor.",
    dark: "The 1667 earthquake flattened the old cathedral and killed clergy inside. Excavations below later revealed layers of even older churches beneath the floor.",
    fact: "The Treasury's relics include what are venerated as St. Blaise's head, arm and leg in jeweled cases, paraded through the city on his feast day.",
    visit:
      "The cathedral is free; the Treasury is a small paid room to the side, well worth it. Modest dress required.",
    hidden:
      "Ask to see the panel paintings and look for the Titian-school altarpiece — easy to miss among the gold.",
    url: mapUrl(42.6402, 18.1109),
    lenses: ["must", "gem"],
  },
  {
    id: 73,
    name: "Dominican Monastery",
    lat: 42.6417,
    lng: 18.1116,
    area: "Old Town · Ploče (east)",
    time: "40 min",
    priority: "Gothic cloister & art",
    tags: ["1315", "cloister", "art museum"],
    summary:
      "A fortress-like monastery near Ploče Gate hiding a gorgeous Gothic-Renaissance cloister and a museum of Dubrovnik-school religious paintings.",
    history:
      "Begun in 1315, the Dominicans built partly into the city walls, so the complex doubled as a defensive strongpoint on the eastern flank. Its art collection charts Dubrovnik's own school of painters.",
    dark: "The bare, high walls facing the street were deliberate — a religious house built to help hold the wall line if the eastern defenses were breached.",
    fact: "The cloister was designed by Florentine masters; the museum holds works by Titian and Vlaho Bukovac alongside 15th-century local masters.",
    visit:
      "Enter up the grand staircase by Ploče Gate. Far quieter than the Franciscan cloister and just as beautiful.",
    hidden:
      "The monastery bell tower and the shaded cloister garden are among the most peaceful corners inside the walls.",
    url: mapUrl(42.6417, 18.1116),
    lenses: ["gem", "must"],
  },
]

// avoid duplicate ids on re-run
const existing = new Set(stops.map((s) => s.id))
const toAdd = NEW.filter((s) => !existing.has(s.id))
const merged = stops.concat(toAdd)

const out = html.replace(re, `$1${JSON.stringify(merged)}$3`)
fs.writeFileSync(FILE, out)
console.log(`Added ${toAdd.length} stops. Total now ${merged.length}.`)
console.log("New ids:", toAdd.map((s) => s.id).join(", "))
