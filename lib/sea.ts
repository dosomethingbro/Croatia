// Vietnam + Thailand "Field Console": the multi-city sibling of the Honolulu console.
// Single source of truth for cities, the day-by-day itinerary (with fixed transport
// blocks), the activity catalogue, and the deterministic planning engine used by every
// /api/sea/* route. Claude only ever writes prose on top of these decisions.

import { buildRefineRules } from "@/lib/honolulu"

export type Tag = "PLAY" | "EXPERIENCE" | "WATCH" | "EXPLORE" | "LEARN" | "RELAX" | "EAT_DRINK"
export type CityId = "hanoi" | "ninhbinh" | "halong" | "chiangmai" | "railay" | "transit"
export type Dow = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"
export type Weather = "clear" | "cloudy" | "rain-soon" | "raining"
export type Zone = "walkable" | "ride" | "excursion"

export interface City {
  id: CityId
  name: string
  country: "Vietnam" | "Thailand" | "In transit"
  center: [number, number]
  zoom: number
  climate: string
  tips: string[]
}

export interface Block {
  start: number
  end: number
  label: string
  kind: "flight" | "transfer" | "cruise"
}

export interface TripDay {
  key: string
  city: CityId
  cityAfter?: CityId
  switchHour?: number
  loc: string
  title: string
  body: string
  blocks: Block[]
  suggested: string[]
}

export interface SeaActivity {
  id: string
  city: CityId
  area: string
  name: string
  tag: Tag
  effort: "low" | "med" | "high"
  commitment: "dropin" | "reserved"
  novelty: "familiar" | "unusual"
  durationMin: number
  cost: "free" | "$" | "$$" | "$$$"
  indoorOutdoor: "indoor" | "outdoor" | "mixed"
  zone: Zone
  openHour: number
  closeHour: number
  days?: Dow[]
  closed?: Dow[]
  onDates?: string[]
  eveningOnly?: boolean
  dryOnly?: boolean
  animal?: boolean
  welfare?: "observation" | "contact"
  lat: number
  lng: number
  tip: string
  book?: { label: string; href: string }
  kind?: "gem" | "daytrip"
  how?: string
  lastChecked: string
}

export const TRIP = {
  title: "Vietnam + Thailand",
  window: "Nov 19 – Dec 5, 2026",
  departISO: "2026-11-19T23:50:00-08:00",
  firstDay: "2026-11-21",
  tz: "UTC+7 (Hanoi & Bangkok share a clock)",
}

const gyg = (q: string) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}`
const gsearch = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`

export const CITIES: Record<CityId, City> = {
  hanoi: {
    id: "hanoi", name: "Hanoi", country: "Vietnam", center: [21.0305, 105.8495], zoom: 14,
    climate: "Late November is Hanoi's sweet spot: dry, roughly 18–25°C, cool evenings. Pack a light layer.",
    tips: [
      "Cross streets at a slow, steady pace — motorbikes flow around you. Never dart or stop suddenly.",
      "Use Grab (car or bike) for anything over ~1.5 km; it's metered and avoids haggling.",
      "Fri–Sun from ~7 PM the streets around Hoan Kiem Lake go pedestrian-only.",
      "Carry small VND notes (10k–50k) — street food and small cafés are often cash-only.",
      "Temples and Hoa Lo: shoulders and knees covered.",
    ],
  },
  ninhbinh: {
    id: "ninhbinh", name: "Ninh Binh", country: "Vietnam", center: [20.2547, 105.93], zoom: 12,
    climate: "Similar to Hanoi — dry and mild (18–25°C). Limestone steps get slick after any drizzle.",
    tips: [
      "Book a tour that explicitly lists Bich Dong — many 'complete' tours quietly skip it.",
      "Mua Cave is ~500 steep steps; late afternoon light is best, early morning is quietest.",
      "Trang An rowers appreciate ~50k VND each as a tip at the end.",
    ],
  },
  halong: {
    id: "halong", name: "Ha Long / Lan Ha", country: "Vietnam", center: [20.82, 107.08], zoom: 11,
    climate: "Cool and often hazy (17–23°C). Typhoon season is over; sea fog can soften sunrise.",
    tips: [
      "Confirm whether the Hanoi limousine transfer is included — many headline rates exclude it.",
      "Bring cash (VND or USD) for drinks and crew tips on board.",
      "Kayaking is the crew's call on the day based on wind and tide.",
    ],
  },
  chiangmai: {
    id: "chiangmai", name: "Chiang Mai", country: "Thailand", center: [18.7877, 98.9905], zoom: 14,
    climate: "Start of the cool season: dry and clear, roughly 16–29°C. Doi Inthanon's summit can be 5–10°C at dawn.",
    tips: [
      "Elephant rule: observation-only. Walk away from any program offering riding, bathing, shows or hand-feeding sessions.",
      "Red songthaews are cheap for Old City ↔ Nimman — agree the fare first — or use Grab/Bolt.",
      "Temples: shoes off, shoulders and knees covered; women shouldn't touch monks or hand them things directly.",
      "Sunday Walking Street gets packed after 7 PM — arrive around 5–6 PM.",
      "Kew Mae Pan trail on Doi Inthanon requires a local guide at the trailhead.",
    ],
  },
  railay: {
    id: "railay", name: "Railay", country: "Thailand", center: [8.0105, 98.8385], zoom: 15,
    climate: "Tail end of the wet season: 25–31°C, short showers possible, seas usually calming through December.",
    tips: [
      "Railay has no road access — every arrival and departure is a boat. Pack in bags you can lift into a longtail.",
      "Plan boat days around tide and sea state; ask your hotel the evening before.",
      "Phi Phi and Hong national-park fees are usually cash, per person — confirm whether your tour includes them.",
      "Skip the viewpoint/lagoon scramble after rain — it's muddy rope climbing.",
      "ATMs on the peninsula are limited and pricey; bring baht from Krabi.",
    ],
  },
  transit: {
    id: "transit", name: "In transit", country: "In transit", center: [37.7749, -122.4194], zoom: 4,
    climate: "Long-haul day. Hydrate, sleep on Vietnam time, and keep passports + e-visa printouts handy.",
    tips: [
      "Vietnam requires an e-visa for US passports — apply on the official evisa.gov.vn site only, well before departure.",
      "Thailand: check current visa-exemption rules and complete the Thailand Digital Arrival Card before landing in Chiang Mai.",
      "Set phones to UTC+7 on boarding; both countries share that clock.",
    ],
  },
}

export const DAYS: TripDay[] = [
  { key: "2026-11-19", city: "transit", loc: "SAN FRANCISCO", title: "Departure", body: "SFO around 8:30–9:00 PM · international flight 11:50 PM.", blocks: [], suggested: [] },
  { key: "2026-11-20", city: "transit", loc: "IN TRANSIT", title: "Flying", body: "International travel day — you cross the date line.", blocks: [], suggested: [] },
  {
    key: "2026-11-21", city: "hanoi", loc: "HANOI", title: "Arrival + Old Quarter",
    body: "Arrive 11:35 AM · hotel by ~1:30 PM · Hoan Kiem Lake · Ngoc Son · food and coffee.",
    blocks: [{ start: 11.5, end: 13.5, label: "Land HAN 11:35 → hotel", kind: "transfer" }],
    suggested: ["hoan-kiem", "egg-coffee", "old-quarter", "weekend-market"],
  },
  {
    key: "2026-11-22", city: "hanoi", loc: "HANOI", title: "History + food",
    body: "Hoa Lo Prison · French Quarter · Michelin-recognized pho · evening motorbike food tour.",
    blocks: [], suggested: ["pho-bat-dan", "hoa-lo", "hanoi-opera", "food-tour"],
  },
  {
    key: "2026-11-23", city: "hanoi", loc: "HANOI", title: "Temples + city",
    body: "Tran Quoc Pagoda · Temple of Literature · cafés · Train Street / rooftop.",
    blocks: [], suggested: ["temple-lit", "tran-quoc", "train-street", "rooftop"],
  },
  {
    key: "2026-11-24", city: "ninhbinh", cityAfter: "hanoi", switchHour: 19.5, loc: "NINH BINH", title: "Full-day excursion",
    body: "Hoa Lu + Trang An + Bich Dong + Mua Cave. Small-group / limousine tour preferred.",
    blocks: [], suggested: ["ninhbinh-tour"],
  },
  {
    key: "2026-11-25", city: "halong", loc: "HA LONG / LAN HA", title: "Overnight cruise",
    body: "Hanoi pickup ~8:00 AM · marina ~11:00 AM · embark before noon · kayaking · sunset · dinner.",
    blocks: [
      { start: 8, end: 11.5, label: "Limousine Hanoi → Tuan Chau marina", kind: "transfer" },
      { start: 11.5, end: 13, label: "Embark + welcome lunch", kind: "cruise" },
    ],
    suggested: ["cruise-kayak", "sundeck-sunset", "cooking-demo"],
  },
  {
    key: "2026-11-26", city: "halong", cityAfter: "hanoi", switchHour: 15, loc: "HA LONG → HANOI", title: "Cruise morning + Hanoi",
    body: "Sunrise · cave / boat activity · brunch · disembark late morning · Hanoi ~2:30–3:00 PM.",
    blocks: [
      { start: 10.25, end: 11.5, label: "Brunch + disembark", kind: "cruise" },
      { start: 11.5, end: 15, label: "Limousine → Hanoi", kind: "transfer" },
    ],
    suggested: ["taichi", "cave-visit", "massage-hn"],
  },
  {
    key: "2026-11-27", city: "hanoi", cityAfter: "chiangmai", switchHour: 17.25, loc: "HANOI → CHIANG MAI", title: "Regional flight",
    body: "Easy Hanoi morning · airport ~1 PM · flight around 3:30 PM · Chiang Mai dinner.",
    blocks: [
      { start: 12.75, end: 13.5, label: "Grab to HAN airport", kind: "transfer" },
      { start: 13.5, end: 15.5, label: "Check-in + security (international)", kind: "flight" },
      { start: 15.5, end: 17.25, label: "HAN → CNX flight", kind: "flight" },
      { start: 17.25, end: 18, label: "CNX → Old City hotel", kind: "transfer" },
    ],
    suggested: ["bun-cha", "night-bazaar"],
  },
  {
    key: "2026-11-28", city: "chiangmai", loc: "CHIANG MAI", title: "Ethical elephant half-day",
    body: "Observation-first, no riding, bathing, shows or forced interaction. Massage / pool afterward.",
    blocks: [], suggested: ["elephant", "thai-massage", "saturday-market"],
  },
  {
    key: "2026-11-29", city: "chiangmai", loc: "CHIANG MAI", title: "Old City + Sunday Market",
    body: "Wat Phra Singh · Wat Chedi Luang · cafés · Sunday Walking Street in the evening.",
    blocks: [], suggested: ["wat-phra-singh", "wat-chedi-luang", "khao-soi", "sunday-market"],
  },
  {
    key: "2026-11-30", city: "chiangmai", loc: "CHIANG MAI", title: "Choose your final excursion",
    body: "Option A: Doi Inthanon + Kew Mae Pan. Option B: Lamphun + Wiang Kum Kam. Muay Thai at night if energy allows.",
    blocks: [], suggested: ["doi-inthanon", "muay-thai"],
  },
  {
    key: "2026-12-01", city: "chiangmai", cityAfter: "railay", switchHour: 7.9, loc: "CHIANG MAI → RAILAY", title: "Morning flight south",
    body: "7:55 → 9:55 AM CNX–KBV · road transfer · longtail to Railay · beach afternoon.",
    blocks: [
      { start: 5.75, end: 6.5, label: "Hotel → CNX airport", kind: "transfer" },
      { start: 7.9, end: 9.9, label: "CNX → KBV 7:55 AM", kind: "flight" },
      { start: 9.9, end: 12.5, label: "KBV → pier → longtail to Railay", kind: "transfer" },
    ],
    suggested: ["railay-west", "sunset-west", "seafood-bbq"],
  },
  {
    key: "2026-12-02", city: "railay", loc: "RAILAY", title: "Stay local",
    body: "Railay West · Phra Nang · kayak · viewpoint if conditions are good · massage · sunset.",
    blocks: [], suggested: ["phra-nang", "kayak-railay", "beach-massage", "sunset-west"],
  },
  {
    key: "2026-12-03", city: "railay", loc: "PHI PHI", title: "Small-group speedboat",
    body: "Maya Bay · Pileh Lagoon · snorkeling · Phi Phi Don. Verify Railay pickup logistics.",
    blocks: [], suggested: ["phi-phi", "fire-show"],
  },
  {
    key: "2026-12-04", city: "railay", loc: "HONG ISLANDS", title: "Private longtail",
    body: "Lagoon · snorkeling · beach time · sunset. Better place to spend for privacy than Phi Phi.",
    blocks: [], suggested: ["hong-islands", "seafood-bbq"],
  },
  {
    key: "2026-12-05", city: "railay", loc: "RAILAY → KBV", title: "Departure day",
    body: "Pre-arranged hotel boat + road transfer with a big weather / sea-state buffer for a 9:00 AM flight.",
    blocks: [
      { start: 5.5, end: 7.5, label: "Hotel boat + road to KBV", kind: "transfer" },
      { start: 7.5, end: 9, label: "Check-in + security", kind: "flight" },
      { start: 9, end: 23.9, label: "KBV 9:00 AM → home", kind: "flight" },
    ],
    suggested: [],
  },
]

type Raw = Omit<SeaActivity, "lastChecked">

const RAW: Raw[] = [
  // Hanoi
  { id: "hoan-kiem", city: "hanoi", area: "Old Quarter", name: "Hoan Kiem Lake & Ngoc Son Temple", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 75, cost: "$", indoorOutdoor: "mixed", zone: "walkable", openHour: 7, closeHour: 18, lat: 21.0288, lng: 105.8525, tip: "Cross the red Huc Bridge to Ngoc Son (small fee). Early morning, locals do tai chi around the lake." },
  { id: "old-quarter", city: "hanoi", area: "Old Quarter", name: "Old Quarter street walk", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 7, closeHour: 22, lat: 21.034, lng: 105.85, tip: "Streets were historically one guild each — Hang Bac (silver), Hang Ma (paper goods). Look up at the tube-house facades." },
  { id: "st-joseph", city: "hanoi", area: "Old Quarter", name: "St Joseph's Cathedral", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 30, cost: "free", indoorOutdoor: "mixed", zone: "walkable", openHour: 8, closeHour: 18, lat: 21.0287, lng: 105.8489, tip: "Neo-Gothic, 1886. The interior opens mainly around mass times; the plaza cafés are the real draw." },
  { id: "hoa-lo", city: "hanoi", area: "French Quarter", name: "Hoa Lo Prison", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 90, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 8, closeHour: 17, lat: 21.0253, lng: 105.8466, tip: "Get the audio guide. The narrative is the official one — read the American POW section with that in mind." },
  { id: "hanoi-opera", city: "hanoi", area: "French Quarter", name: "Opera House & French Quarter", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 60, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 7, closeHour: 21, lat: 21.0242, lng: 105.8578, tip: "Colonial boulevards around Trang Tien. Exterior only unless you catch a performance." },
  { id: "temple-lit", city: "hanoi", area: "Dong Da", name: "Temple of Literature", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 75, cost: "$", indoorOutdoor: "mixed", zone: "ride", openHour: 8, closeHour: 17, lat: 21.0277, lng: 105.8355, tip: "Vietnam's first university (1070). Go at opening to beat school groups." },
  { id: "tran-quoc", city: "hanoi", area: "West Lake", name: "Tran Quoc Pagoda", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 45, cost: "free", indoorOutdoor: "outdoor", zone: "ride", openHour: 7.5, closeHour: 18, lat: 21.048, lng: 105.8368, tip: "Hanoi's oldest pagoda on a West Lake islet. Pair with a lakefront drink at sunset." },
  { id: "ethnology", city: "hanoi", area: "Cau Giay", name: "Vietnam Museum of Ethnology", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 120, cost: "$", indoorOutdoor: "mixed", zone: "ride", openHour: 8.5, closeHour: 17.5, closed: ["Mon"], lat: 21.0405, lng: 105.7986, tip: "The outdoor garden of full-size ethnic-minority houses is the highlight. ~25 min by Grab." },
  { id: "train-street", city: "hanoi", area: "Old Quarter", name: "Train Street café", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 60, cost: "$", indoorOutdoor: "outdoor", zone: "walkable", openHour: 8, closeHour: 22, lat: 21.0297, lng: 105.8443, tip: "Police periodically close the tracks to visitors. Only enter via a café that seats you; never stand on the rails." },
  { id: "egg-coffee", city: "hanoi", area: "Old Quarter", name: "Egg coffee at Café Giảng", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 40, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 7, closeHour: 22, lat: 21.0333, lng: 105.8542, tip: "The original (1946). Order it hot — it arrives sitting in a bowl of warm water." },
  { id: "pho-bat-dan", city: "hanoi", area: "Old Quarter", name: "Phở Gia Truyền (Bát Đàn)", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 30, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 6, closeHour: 10, lat: 21.0334, lng: 105.8467, tip: "Queue, pay first, carry your own bowl. Mornings only — often sold out by ~10 AM." },
  { id: "bun-cha", city: "hanoi", area: "Hai Ba Trung", name: "Bún Chả Hương Liên", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 45, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 8, closeHour: 20, lat: 21.0177, lng: 105.8521, tip: "The 'Obama bún chả' spot. Order the combo; lunch is the busiest window." },
  { id: "food-tour", city: "hanoi", area: "Old Quarter pickup", name: "Evening motorbike food tour", tag: "EAT_DRINK", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 210, cost: "$$", indoorOutdoor: "outdoor", zone: "walkable", openHour: 17, closeHour: 23, eveningOnly: true, lat: 21.0345, lng: 105.852, tip: "Book an operator that provides helmets and insurance. Flag spice or allergy limits when booking.", book: { label: "GetYourGuide", href: gyg("Hanoi motorbike street food tour evening") } },
  { id: "water-puppet", city: "hanoi", area: "Old Quarter", name: "Thang Long Water Puppet Theatre", tag: "WATCH", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 50, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 15, closeHour: 21, lat: 21.0318, lng: 105.8535, tip: "Several shows from mid-afternoon. Buy at the box office earlier in the day for good rows." },
  { id: "weekend-market", city: "hanoi", area: "Old Quarter", name: "Weekend Night Market (Hàng Đào)", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 18, closeHour: 23, days: ["Fri", "Sat", "Sun"], eveningOnly: true, lat: 21.0352, lng: 105.851, tip: "Runs north from the lake on Fri–Sun nights while the lake streets are pedestrian-only." },
  { id: "rooftop", city: "hanoi", area: "West Lake", name: "West Lake rooftop drinks", tag: "RELAX", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$$", indoorOutdoor: "mixed", zone: "ride", openHour: 17, closeHour: 24, eveningOnly: true, lat: 21.0516, lng: 105.8366, tip: "Sunset over West Lake is the move. Most rooftops have a smart-casual dress code." },
  { id: "massage-hn", city: "hanoi", area: "Old Quarter", name: "Foot & body massage", tag: "RELAX", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 10, closeHour: 23, lat: 21.033, lng: 105.8505, tip: "A good reset after a walking day. Tipping 50–100k VND is customary." },

  // Ninh Binh
  { id: "ninhbinh-tour", city: "ninhbinh", area: "Hanoi pickup", name: "Ninh Binh small-group day tour", tag: "EXPERIENCE", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 690, cost: "$$", indoorOutdoor: "outdoor", zone: "excursion", openHour: 7, closeHour: 19.5, lat: 20.2547, lng: 105.918, tip: "Must list Hoa Lu + Trang An + Bich Dong + Mua Cave. Pickup ~7–7:30 AM, back ~7–8 PM.", book: { label: "GetYourGuide", href: gyg("Ninh Binh Trang An Mua Cave Bich Dong day tour from Hanoi") } },
  { id: "trang-an", city: "ninhbinh", area: "Trang An", name: "Trang An rowing-boat loop", tag: "EXPERIENCE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 180, cost: "$", indoorOutdoor: "outdoor", zone: "ride", openHour: 7, closeHour: 16, lat: 20.2559, lng: 105.9179, tip: "Two to three hours threading limestone caves. Tip rowers ~50k VND each." },
  { id: "mua-cave", city: "ninhbinh", area: "Tam Coc", name: "Mua Cave viewpoint (500 steps)", tag: "EXPERIENCE", effort: "high", commitment: "dropin", novelty: "unusual", durationMin: 90, cost: "$", indoorOutdoor: "outdoor", zone: "ride", openHour: 6, closeHour: 19, dryOnly: true, lat: 20.2309, lng: 105.9341, tip: "Dragon-topped summit over Tam Coc. Best light late afternoon; steep and slippery when wet." },
  { id: "hoa-lu", city: "ninhbinh", area: "Hoa Lu", name: "Hoa Lu ancient capital", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 60, cost: "$", indoorOutdoor: "outdoor", zone: "ride", openHour: 7, closeHour: 17, lat: 20.2864, lng: 105.9061, tip: "10th-century capital of the Dinh and early Le dynasties; temples to both kings survive." },
  { id: "bich-dong", city: "ninhbinh", area: "Tam Coc", name: "Bich Dong Pagoda", tag: "EXPLORE", effort: "med", commitment: "dropin", novelty: "unusual", durationMin: 60, cost: "free", indoorOutdoor: "outdoor", zone: "ride", openHour: 7, closeHour: 17, lat: 20.2181, lng: 105.9261, tip: "Three-level pagoda built into a cliff — the quietest of the Ninh Binh sites." },

  // Ha Long / Lan Ha (cruise)
  { id: "cruise-kayak", city: "halong", area: "Lan Ha Bay", name: "Kayak the Lan Ha lagoons", tag: "EXPERIENCE", effort: "med", commitment: "dropin", novelty: "unusual", durationMin: 75, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 14, closeHour: 17, onDates: ["2026-11-25"], lat: 20.784, lng: 107.056, tip: "Usually included on Capella / Orchid itineraries; the crew decides based on wind and tide." },
  { id: "sundeck-sunset", city: "halong", area: "On board", name: "Sundeck sunset", tag: "WATCH", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 45, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 16.5, closeHour: 17.75, onDates: ["2026-11-25"], lat: 20.79, lng: 107.07, tip: "Sunset is ~5:15 PM in late November. Claim the bow seats early." },
  { id: "cooking-demo", city: "halong", area: "On board", name: "Onboard spring-roll class", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 45, cost: "free", indoorOutdoor: "indoor", zone: "walkable", openHour: 17.75, closeHour: 19.25, onDates: ["2026-11-25"], lat: 20.791, lng: 107.072, tip: "A short demo before dinner on most mid-range cruises." },
  { id: "squid-fishing", city: "halong", area: "On board", name: "Night squid fishing", tag: "PLAY", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 60, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 20, closeHour: 22.5, onDates: ["2026-11-25"], eveningOnly: true, lat: 20.789, lng: 107.068, tip: "Low odds, high fun. Bring a layer — the deck is cool at night in November." },
  { id: "taichi", city: "halong", area: "On board", name: "Sunrise tai chi on deck", tag: "RELAX", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 40, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 6, closeHour: 7, onDates: ["2026-11-26"], lat: 20.792, lng: 107.074, tip: "Sunrise is ~6:15 AM. Worth it even if you go back to bed." },
  { id: "cave-visit", city: "halong", area: "Lan Ha Bay", name: "Morning cave visit", tag: "EXPLORE", effort: "med", commitment: "dropin", novelty: "unusual", durationMin: 90, cost: "free", indoorOutdoor: "mixed", zone: "walkable", openHour: 7, closeHour: 10.25, onDates: ["2026-11-26"], lat: 20.8, lng: 107.09, tip: "Usually Trung Trang or Sung Sot depending on route — steps and damp floors." },

  // Chiang Mai
  { id: "elephant", city: "chiangmai", area: "Mae Taeng valley (typical)", name: "Ethical elephant half-day (observation only)", tag: "EXPERIENCE", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 300, cost: "$$$", indoorOutdoor: "outdoor", zone: "excursion", openHour: 7.5, closeHour: 14, animal: true, welfare: "observation", lat: 19.2165, lng: 98.8584, tip: "Hard rule: observation-first only — no riding, bathing, shows or forced interaction. Vet the current program wording before booking (e.g. Elephant Nature Park observation programs, Kindred Spirit in Mae Chaem).", book: { label: "Search sanctuaries", href: gsearch("Chiang Mai high welfare elephant sanctuary observation only no riding") } },
  { id: "wat-phra-singh", city: "chiangmai", area: "Old City", name: "Wat Phra Singh", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 45, cost: "$", indoorOutdoor: "mixed", zone: "walkable", openHour: 6, closeHour: 18, lat: 18.7884, lng: 98.9821, tip: "The Old City's most revered temple; the small Viharn Lai Kham holds the Phra Singh Buddha and Lanna murals." },
  { id: "wat-chedi-luang", city: "chiangmai", area: "Old City", name: "Wat Chedi Luang + monk chat", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 60, cost: "$", indoorOutdoor: "mixed", zone: "walkable", openHour: 8, closeHour: 17, lat: 18.787, lng: 98.9867, tip: "The 15th-century chedi was toppled by an earthquake. Monk chat tables usually run in the afternoon — ask anything." },
  { id: "wat-umong", city: "chiangmai", area: "Suthep", name: "Wat Umong forest tunnels", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 60, cost: "free", indoorOutdoor: "outdoor", zone: "ride", openHour: 7, closeHour: 17, lat: 18.783, lng: 98.9516, tip: "Centuries-old tunnel temple in the forest at the foot of Doi Suthep — quiet, cool, rarely crowded." },
  { id: "doi-suthep", city: "chiangmai", area: "Doi Suthep", name: "Wat Phra That Doi Suthep", tag: "EXPLORE", effort: "med", commitment: "dropin", novelty: "familiar", durationMin: 180, cost: "$", indoorOutdoor: "outdoor", zone: "ride", openHour: 6, closeHour: 20, lat: 18.8048, lng: 98.9216, tip: "306 naga-lined steps (or the funicular). Go at opening or near sunset; shared songthaews leave from near the zoo." },
  { id: "sunday-market", city: "chiangmai", area: "Old City", name: "Sunday Walking Street", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 150, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 16, closeHour: 23, days: ["Sun"], lat: 18.7882, lng: 98.9905, tip: "From Tha Phae Gate along Ratchadamnoen. Arrive 5–6 PM before the crush; temple courtyards become food courts." },
  { id: "saturday-market", city: "chiangmai", area: "Wua Lai", name: "Wua Lai Saturday Walking Street", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 120, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 16, closeHour: 23, days: ["Sat"], lat: 18.7802, lng: 98.9862, tip: "Silver-street market just south of the moat — smaller and calmer than Sunday's." },
  { id: "jing-jai", city: "chiangmai", area: "Chang Phueak", name: "Jing Jai farmers' market", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 90, cost: "$", indoorOutdoor: "outdoor", zone: "ride", openHour: 7, closeHour: 13, days: ["Sat", "Sun"], lat: 18.8113, lng: 98.9987, tip: "Weekend-morning crafts and organic produce market — the city's best brunch grazing." },
  { id: "night-bazaar", city: "chiangmai", area: "Chang Klan", name: "Chiang Mai Night Bazaar", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$", indoorOutdoor: "mixed", zone: "ride", openHour: 18, closeHour: 24, eveningOnly: true, lat: 18.7851, lng: 99.0006, tip: "Nightly. Haggle gently; the Anusarn food court at the south end is the best part." },
  { id: "khao-soi", city: "chiangmai", area: "Nimman", name: "Khao Soi Mae Sai", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 40, cost: "$", indoorOutdoor: "indoor", zone: "ride", openHour: 8, closeHour: 16, lat: 18.8048, lng: 98.9799, tip: "Chiang Mai's signature curry noodle soup. Closes mid-afternoon — go for lunch." },
  { id: "nimman", city: "chiangmai", area: "Nimman", name: "Nimman café crawl", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$", indoorOutdoor: "mixed", zone: "ride", openHour: 8, closeHour: 22, lat: 18.799, lng: 98.9675, tip: "The café district; One Nimman and Think Park anchor the area." },
  { id: "thai-massage", city: "chiangmai", area: "Old City", name: "Thai massage (Lila centre)", tag: "RELAX", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 10, closeHour: 22, lat: 18.7891, lng: 98.9888, tip: "Lila centres train women leaving prison — good massage, good cause. Book ahead on weekends." },
  { id: "cooking-class", city: "chiangmai", area: "Farm (hotel pickup)", name: "Thai cooking class (farm half-day)", tag: "LEARN", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 300, cost: "$$", indoorOutdoor: "mixed", zone: "excursion", openHour: 8.5, closeHour: 14.5, lat: 18.76, lng: 98.92, tip: "Most schools collect from your hotel, start with a market tour, and you cook 4–6 dishes.", book: { label: "GetYourGuide", href: gyg("Chiang Mai organic farm Thai cooking class") } },
  { id: "muay-thai", city: "chiangmai", area: "Tha Phae", name: "Muay Thai at Thapae Stadium", tag: "WATCH", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 150, cost: "$$", indoorOutdoor: "indoor", zone: "walkable", openHour: 20, closeHour: 23.75, eveningOnly: true, lat: 18.788, lng: 99.0003, tip: "Fights start ~9 PM; the better bouts come later. Tickets at the door or via your hotel." },
  { id: "doi-inthanon", city: "chiangmai", area: "Doi Inthanon NP", name: "Doi Inthanon + Kew Mae Pan", tag: "EXPERIENCE", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 600, cost: "$$$", indoorOutdoor: "outdoor", zone: "excursion", openHour: 7, closeHour: 18.5, lat: 18.5885, lng: 98.4867, tip: "Kew Mae Pan reopens for the cool season (~Nov–May) and requires a local trailhead guide. Bring a fleece for the summit.", book: { label: "GetYourGuide", href: gyg("Doi Inthanon Kew Mae Pan tour Chiang Mai") } },
  { id: "lamphun", city: "chiangmai", area: "Lamphun", name: "Lamphun + Wiang Kum Kam history day", tag: "LEARN", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 420, cost: "$$", indoorOutdoor: "mixed", zone: "excursion", openHour: 8, closeHour: 17, lat: 18.5745, lng: 99.0087, tip: "Hariphunchai → Lanna in one day: Wat Phra That Hariphunchai plus the excavated city of Wiang Kum Kam.", book: { label: "Search operators", href: gsearch("Lamphun Wiang Kum Kam history day tour Chiang Mai") } },

  // Railay / Krabi
  { id: "railay-west", city: "railay", area: "Railay West", name: "Railay West beach", tag: "RELAX", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 120, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 6, closeHour: 19, lat: 8.0119, lng: 98.8378, tip: "Best swimming around high tide. Railay East is mangrove mud at low tide — swim West." },
  { id: "phra-nang", city: "railay", area: "Phra Nang", name: "Phra Nang beach + Princess Cave", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 150, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 6, closeHour: 19, lat: 8.0058, lng: 98.8382, tip: "Cliff path from Railay East (~15 min). The cave shrine is full of carved offerings — be respectful." },
  { id: "viewpoint", city: "railay", area: "Railay East", name: "Viewpoint & lagoon scramble", tag: "EXPERIENCE", effort: "high", commitment: "dropin", novelty: "unusual", durationMin: 120, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 7, closeHour: 17, dryOnly: true, lat: 8.0083, lng: 98.8389, tip: "Muddy rope climbing. The viewpoint is moderate; the lagoon descent is genuinely hard. Grippy shoes, dry days only." },
  { id: "climbing", city: "railay", area: "Railay", name: "Beginner rock-climbing half-day", tag: "EXPERIENCE", effort: "high", commitment: "reserved", novelty: "unusual", durationMin: 240, cost: "$$", indoorOutdoor: "outdoor", zone: "walkable", openHour: 8, closeHour: 17, dryOnly: true, lat: 8.01, lng: 98.841, tip: "World-class limestone. First-timer half-days run morning or afternoon — pick a shop with recent gear reviews." },
  { id: "kayak-railay", city: "railay", area: "Railay West", name: "Sea kayak around Phra Nang", tag: "EXPERIENCE", effort: "med", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$", indoorOutdoor: "outdoor", zone: "walkable", openHour: 8, closeHour: 17, lat: 8.0105, lng: 98.8365, tip: "Rent on Railay West. Paddle in calm morning water; sea caves are best near high tide." },
  { id: "phi-phi", city: "railay", area: "Koh Phi Phi", name: "Phi Phi speedboat (Maya Bay + Pileh)", tag: "EXPERIENCE", effort: "med", commitment: "reserved", novelty: "familiar", durationMin: 540, cost: "$$$", indoorOutdoor: "outdoor", zone: "excursion", openHour: 7.5, closeHour: 17.5, lat: 7.6782, lng: 98.7653, tip: "Pick an early or small-group boat. Park fee is usually cash and separate; no swimming at Maya Bay beach itself.", book: { label: "GetYourGuide", href: gyg("Phi Phi Maya Bay speedboat tour from Railay Krabi") } },
  { id: "hong-islands", city: "railay", area: "Koh Hong", name: "Hong Islands private longtail", tag: "EXPERIENCE", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 360, cost: "$$$", indoorOutdoor: "outdoor", zone: "excursion", openHour: 8, closeHour: 18.5, lat: 8.0786, lng: 98.6762, tip: "Where the privacy premium pays off. Time the lagoon for mid-tide; stay out for sunset if your boatman agrees.", book: { label: "GetYourGuide", href: gyg("Hong Islands private longtail tour Krabi Railay") } },
  { id: "sunset-west", city: "railay", area: "Railay West", name: "Sunset on Railay West", tag: "WATCH", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 45, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 17.5, closeHour: 18.75, lat: 8.0125, lng: 98.8372, tip: "Sunset is ~6:15 PM in early December. The bars at the north end have the best angle." },
  { id: "beach-massage", city: "railay", area: "Railay East", name: "Beach-side Thai massage", tag: "RELAX", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 60, cost: "$", indoorOutdoor: "mixed", zone: "walkable", openHour: 10, closeHour: 21, lat: 8.0115, lng: 98.8382, tip: "Railay East walkway is cheaper; Railay West costs more but has the view." },
  { id: "fire-show", city: "railay", area: "Railay East", name: "Fire show at a Railay East bar", tag: "WATCH", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 90, cost: "$", indoorOutdoor: "outdoor", zone: "walkable", openHour: 20.5, closeHour: 24, eveningOnly: true, lat: 8.013, lng: 98.8418, tip: "Nightly along the Railay East walkway — free with a drink." },
  { id: "seafood-bbq", city: "railay", area: "Railay Walking Street", name: "Seafood BBQ dinner", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "familiar", durationMin: 90, cost: "$$", indoorOutdoor: "mixed", zone: "walkable", openHour: 17.5, closeHour: 22.5, eveningOnly: true, lat: 8.0118, lng: 98.8395, tip: "Pick your fish by weight; confirm the price per 100 g before it's cooked." },

  // Hidden gems
  { id: "long-bien", kind: "gem", city: "hanoi", area: "Red River", name: "Long Bien Bridge walk", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 60, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 6, closeHour: 19, lat: 21.043, lng: 105.859, tip: "French-built (1899–1902) and bombed repeatedly 1967–72; patched sections are still visible.", how: "Walk the narrow pedestrian edge from the Old Quarter end toward the river island banana farms. Go at sunset; trains still rumble past at walking pace." },
  { id: "cafe-dinh", kind: "gem", city: "hanoi", area: "Old Quarter", name: "Café Đinh (upstairs lake-view café)", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 45, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 7, closeHour: 22, lat: 21.0322, lng: 105.853, tip: "Run by the family behind Café Giảng. Climb the dark stairwell behind a shopfront to find it.", how: "Look for 13 Đinh Tiên Hoàng and go up past the ground-floor shop. Order egg chocolate and take the window bench over the lake." },
  { id: "quang-ba", kind: "gem", city: "hanoi", area: "West Lake", name: "Quảng Bá pre-dawn flower market", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 60, cost: "free", indoorOutdoor: "outdoor", zone: "ride", openHour: 3, closeHour: 6.5, lat: 21.0645, lng: 105.8268, tip: "Wholesale flower market that runs roughly 2–6 AM. It's packed up before the city wakes.", how: "Grab there around 4:30–5 AM, wander, then walk to West Lake for sunrise and a street breakfast." },
  { id: "mosaic-mural", kind: "gem", city: "hanoi", area: "Red River dyke", name: "Ceramic Mosaic Mural walk", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 45, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 6, closeHour: 18, lat: 21.0355, lng: 105.8575, tip: "A ceramic mural running for kilometres along the dyke road, built for Hanoi's 1,000th anniversary (2010).", how: "Walk the stretch near the Long Bien end and pair it with the bridge. Mind the traffic: there's no proper footpath in places." },
  { id: "citadel", city: "hanoi", area: "Ba Dinh", name: "Imperial Citadel of Thang Long", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 90, cost: "$", indoorOutdoor: "mixed", zone: "ride", openHour: 8, closeHour: 17, closed: ["Mon"], lat: 21.0353, lng: 105.84, tip: "UNESCO site. Thirteen centuries of capitals are layered here, and it hides a wartime command bunker (D67).", how: "Start at Doan Mon gate, then find the D67 bunker and the underground war-room tunnels at the back. Few visitors make it that far." },
  { id: "b52-lake", kind: "gem", city: "hanoi", area: "Ba Dinh", name: "B-52 wreck at Hữu Tiệp Lake", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 25, cost: "free", indoorOutdoor: "outdoor", zone: "ride", openHour: 7, closeHour: 19, lat: 21.0418, lng: 105.837, tip: "The tangled remains of a B-52 shot down in December 1972 still sit in a small neighbourhood pond.", how: "It's down a residential alley off Hoàng Hoa Thám. Combine it with the Citadel and Ba Dinh. Be quiet; people live right around it." },
  { id: "tam-coc-bike", kind: "gem", city: "ninhbinh", area: "Tam Coc", name: "Tam Coc rice-field bike loop", tag: "EXPLORE", effort: "med", commitment: "dropin", novelty: "unusual", durationMin: 120, cost: "$", indoorOutdoor: "outdoor", zone: "ride", openHour: 7, closeHour: 17.5, dryOnly: true, lat: 20.215, lng: 105.937, tip: "The country lanes between karsts are the Ninh Binh most tours drive straight past.", how: "Rent bicycles in Tam Coc village and loop toward Bich Dong on the back lanes. It only works if you stay over or your tour has free time." },
  { id: "silver-temple", kind: "gem", city: "chiangmai", area: "Wua Lai", name: "Wat Sri Suphan (Silver Temple)", tag: "LEARN", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 45, cost: "$", indoorOutdoor: "mixed", zone: "walkable", openHour: 6, closeHour: 18, lat: 18.7816, lng: 98.9844, tip: "An ordination hall clad entirely in hand-hammered silver by the Wua Lai silversmith community. Women aren't permitted inside the ordination hall itself.", how: "Go on Saturday late afternoon and roll straight into the Wua Lai market on the same street. Evening lighting makes the silver glow." },
  { id: "monks-trail", kind: "gem", city: "chiangmai", area: "Doi Suthep", name: "Monk's Trail to Wat Pha Lat", tag: "EXPLORE", effort: "med", commitment: "dropin", novelty: "unusual", durationMin: 150, cost: "free", indoorOutdoor: "outdoor", zone: "ride", openHour: 6, closeHour: 17, dryOnly: true, lat: 18.7975, lng: 98.9375, tip: "A forest temple of waterfalls and moss-covered nagas that monks once walked to on the way up Doi Suthep.", how: "Start at the trailhead at the end of Suthep Road (behind CMU). It's about 40 minutes uphill to Wat Pha Lat. Go early, take water, and wear covered shoulders." },
  { id: "baan-kang-wat", kind: "gem", city: "chiangmai", area: "Suthep", name: "Baan Kang Wat artist village", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 75, cost: "free", indoorOutdoor: "outdoor", zone: "ride", openHour: 9, closeHour: 18, closed: ["Mon"], lat: 18.7768, lng: 98.9478, tip: "Studios, ceramics and slow cafés set in a little amphitheatre of wooden houses.", how: "Pair with Wat Umong next door. A Sunday morning crafts market runs here some weeks, so check before you go." },
  { id: "warorot", kind: "gem", city: "chiangmai", area: "Chang Moi", name: "Warorot Market (Kad Luang)", tag: "EAT_DRINK", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 75, cost: "$", indoorOutdoor: "mixed", zone: "ride", openHour: 6, closeHour: 18, lat: 18.79, lng: 99.0007, tip: "The locals' market: northern sausage (sai ua), nam prik, chili pastes and fabric floors upstairs.", how: "Go in the morning, buy sai ua and khanom, then walk to the flower stalls along the river at Ton Lamyai." },
  { id: "tonsai", kind: "gem", city: "railay", area: "Tonsai", name: "Tonsai Beach (climbers' cove)", tag: "RELAX", effort: "med", commitment: "dropin", novelty: "unusual", durationMin: 120, cost: "free", indoorOutdoor: "outdoor", zone: "walkable", openHour: 7, closeHour: 18, lat: 8.0152, lng: 98.8312, tip: "Railay's scruffy, laid-back neighbour, with climbing walls straight off the sand and far fewer day-trippers.", how: "At low tide, walk around the rocks from the north end of Railay West. Otherwise take the short jungle path or a quick longtail. Don't get cut off by the tide on the way back." },
  { id: "diamond-cave", kind: "gem", city: "railay", area: "Railay East", name: "Diamond Cave (Phra Nang Nai)", tag: "EXPLORE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 40, cost: "$", indoorOutdoor: "indoor", zone: "walkable", openHour: 8, closeHour: 17, lat: 8.0137, lng: 98.8424, tip: "A short boardwalk through glittering limestone formations, with a tiny fee and usually almost empty.", how: "Follow the path at the north end of Railay East. It makes a good rainy-hour fallback." },

  // Day trips
  { id: "duong-lam", kind: "daytrip", city: "hanoi", area: "Sơn Tây (~50 km)", name: "Đường Lâm ancient village", tag: "LEARN", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 420, cost: "$$", indoorOutdoor: "outdoor", zone: "excursion", openHour: 8, closeHour: 17, lat: 21.1537, lng: 105.48, tip: "Laterite-brick lanes, centuries-old family houses and the Mong Phu communal house, all far from tour crowds.", how: "Hire a car and driver (or Grab both ways) and add the Sơn Tây citadel. Eat lunch in a family home, which many houses offer." },
  { id: "bat-trang", kind: "daytrip", city: "hanoi", area: "Gia Lâm (~15 km)", name: "Bát Tràng ceramic village", tag: "EXPERIENCE", effort: "low", commitment: "dropin", novelty: "unusual", durationMin: 240, cost: "$", indoorOutdoor: "mixed", zone: "excursion", openHour: 8, closeHour: 17, lat: 20.9765, lng: 105.9125, tip: "Pottery village making ceramics for centuries. Throw your own bowl on a wheel.", how: "About 30–40 min by Grab. Visit the Bát Tràng Pottery Museum, then a family workshop for the wheel. Your piece can be fired and collected later or shipped." },
  { id: "white-temple", kind: "daytrip", city: "chiangmai", area: "Chiang Rai (~3 h)", name: "Chiang Rai White Temple + Blue Temple", tag: "EXPLORE", effort: "med", commitment: "reserved", novelty: "unusual", durationMin: 720, cost: "$$", indoorOutdoor: "outdoor", zone: "excursion", openHour: 7, closeHour: 20, lat: 19.8241, lng: 99.763, tip: "Wat Rong Khun: a modern, surreal art-temple by Chalermchai Kositpipat. It's a long day, about 6 h on the road in total.", how: "Choose a private driver over a big bus tour so you control timing. Arrive at the White Temple at opening, then visit the Blue Temple and Baan Dam." },
  { id: "sticky-falls", kind: "daytrip", city: "chiangmai", area: "Mae Taeng (~1 h)", name: "Bua Thong 'Sticky' Waterfall", tag: "PLAY", effort: "med", commitment: "dropin", novelty: "unusual", durationMin: 240, cost: "free", indoorOutdoor: "outdoor", zone: "excursion", openHour: 8, closeHour: 17, dryOnly: true, lat: 19.0646, lng: 99.077, tip: "Mineral deposits make the rock grippy, so you can literally walk up the waterfall.", how: "Hire a Grab or songthaew for the round trip and ask it to wait. Wear clothes you can get wet. Weekday mornings are quiet." },
  { id: "four-islands", kind: "daytrip", city: "railay", area: "Koh Poda / Chicken / Tup", name: "Four Islands longtail", tag: "EXPERIENCE", effort: "low", commitment: "reserved", novelty: "familiar", durationMin: 360, cost: "$$", indoorOutdoor: "outdoor", zone: "excursion", openHour: 8, closeHour: 16, lat: 7.97, lng: 98.805, tip: "Short hops close to Railay: the Tup sandbar at low tide, snorkeling off Chicken Island, and Poda's beach.", how: "Book a private longtail from Railay West and start before 9 AM to stay ahead of the Ao Nang tour boats. Time Tup for low tide." },
  { id: "emerald-pool", kind: "daytrip", city: "railay", area: "Khlong Thom (~1.5 h)", name: "Emerald Pool + hot springs", tag: "RELAX", effort: "low", commitment: "reserved", novelty: "unusual", durationMin: 480, cost: "$$", indoorOutdoor: "outdoor", zone: "excursion", openHour: 7, closeHour: 17, lat: 7.9257, lng: 99.2624, tip: "A jungle pool, then the warm-stream hot springs, on mainland Krabi.", how: "Arrive at the Emerald Pool by 8:30 AM, before the tour buses. Swim in Blue Pool's neighbour pools, then the hot springs. A private driver is worth it." },
]

export const ACTIVITIES: SeaActivity[] = RAW.map((a) => ({ ...a, lastChecked: "Oct 17, 2026" }))
export const ACTIVITY_BY_ID: Record<string, SeaActivity> = Object.fromEntries(ACTIVITIES.map((a) => [a.id, a]))
export const DAY_BY_KEY: Record<string, TripDay> = Object.fromEntries(DAYS.map((d) => [d.key, d]))

export const TRANSFERS = [
  { route: "Hanoi → Ninh Binh → Hanoi", mode: "Minibus / limousine", tone: "good", body: "~2–2.5 h each way. A hotel-pickup small-group tour beats rail because the stops are spread out.", note: "Pick a premium small group that explicitly lists Bich Dong." },
  { route: "Hanoi → Tuan Chau → cruise", mode: "Limousine van", tone: "warn", body: "8:00–8:30 AM Old Quarter pickup, marina ~11:00–11:30, back in Hanoi ~2:30–3:00 PM next day.", note: "Verify the quoted cruise price includes Hanoi transfers — many don't." },
  { route: "Hanoi → Chiang Mai (Nov 27)", mode: "Regional flight", tone: "good", body: "The Nov 26 buffer night protects this international hop from cruise or road delays.", note: "Don't attempt Ha Long → airport → Chiang Mai on the same day." },
  { route: "Chiang Mai → Krabi (Dec 1)", mode: "Nonstop flight", tone: "good", body: "~2 h nonstop. 7:55 AM, 12:55 PM and 5:05 PM options were showing.", note: "Take the 7:55 AM — it buys most of a Railay afternoon. Buy checked bags in advance (7 kg cabin limit)." },
  { route: "Krabi Airport → Railay", mode: "Road + boat", tone: "warn", body: "Railay has no road access: KBV → Ao Nang pier (~35–50 min) → longtail (~10–20 min).", note: "Ask the hotel for a door-to-door transfer quote; with luggage it's worth it." },
  { route: "Railay → Krabi Airport (Dec 5)", mode: "Boat + road + flight", tone: "risk", body: "With a 9:00 AM flight, early boats, tide, rain and sea state matter more than on arrival.", note: "Pre-book through the hotel and reconfirm the day before. Don't wing this." },
]

export const CHECKLIST = [
  { id: "intl", title: "International EVA flights", note: "Confirm fare, cabin and final routing." },
  { id: "visas", title: "Vietnam e-visa + Thailand arrival card", note: "Official sites only; print the e-visa." },
  { id: "hanoiHotel", title: "Hanoi hotel", note: "Old Quarter / French Quarter convenience." },
  { id: "ninh", title: "Ninh Binh premium small-group", note: "Must include Bich Dong." },
  { id: "cruise", title: "Ha Long overnight cruise", note: "Capella vs Orchid Classic vs Heritage." },
  { id: "hanCnx", title: "Hanoi → Chiang Mai flight", note: "Keep the Nov 26 buffer night." },
  { id: "ele", title: "Ethical elephant half-day", note: "Observation-only programs." },
  { id: "cmHotel", title: "Chiang Mai hotel", note: "Old City vs Nimman tradeoff." },
  { id: "cnxKbv", title: "CNX → KBV 7:55 AM", note: "Add checked baggage before the airport." },
  { id: "railayHotel", title: "Railay hotel", note: "Ask for airport transfer pricing." },
  { id: "phi", title: "Phi Phi small-group speedboat", note: "Verify Railay pickup and park fees." },
  { id: "hong", title: "Hong private longtail", note: "Sunset timing, tide and Railay pickup." },
  { id: "departure", title: "Dec 5 early Railay → KBV transfer", note: "Reconfirm the day before." },
]

export const CRUISES = [
  { tier: "Best overall", name: "Capella", cost: "~$490–550 / couple", body: "Balcony cabins, pool, kayaking/SUP and a cave visit." },
  { tier: "Safe choice", name: "Orchid Classic", cost: "~$350–500 / couple", body: "Established operator, Ao Ech kayaking, good timing back to Hanoi." },
  { tier: "Boutique", name: "Heritage Binh Chuan", cost: "~$400–550 / couple", body: "Smaller and more romantic; strong Vietnamese design and storytelling." },
]

export const BOOKING_LINKS = [
  { label: "Flights: Hanoi → Chiang Mai (Nov 27)", href: "https://www.google.com/travel/flights?q=" + encodeURIComponent("Flights from Hanoi to Chiang Mai on 2026-11-27") },
  { label: "Flights: Chiang Mai → Krabi (Dec 1)", href: "https://www.google.com/travel/flights?q=" + encodeURIComponent("Flights from Chiang Mai to Krabi on 2026-12-01") },
  { label: "Hotels: Hanoi Old Quarter", href: "https://www.booking.com/searchresults.html?ss=Hanoi+Old+Quarter" },
  { label: "Hotels: Chiang Mai Old City", href: "https://www.booking.com/searchresults.html?ss=Chiang+Mai+Old+City" },
  { label: "Hotels: Railay Beach", href: "https://www.booking.com/searchresults.html?ss=Railay+Beach+Krabi" },
  { label: "Vietnam e-visa (official)", href: "https://evisa.gov.vn/" },
]

export const BUDGET = [
  { item: "International flights (2 pax)", low: 2400, high: 3600 },
  { item: "Regional flights (2 legs, 2 pax)", low: 340, high: 680 },
  { item: "Lodging (13 nights)", low: 1180, high: 2800 },
  { item: "Ha Long cruise", low: 400, high: 550 },
  { item: "Excursions (Ninh Binh, elephants, Chiang Mai day, Phi Phi, Hong)", low: 670, high: 1130 },
  { item: "Transfers, Grabs, boats", low: 250, high: 500 },
  { item: "Food & incidentals", low: 800, high: 1700 },
]

/* ===================== engine ===================== */

const DOW_LIST: Dow[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
export function dowOf(key: string): Dow {
  return DOW_LIST[new Date(key + "T12:00:00Z").getUTCDay()]
}

export function fmtHour(h: number): string {
  let hh = Math.floor(h)
  let mm = Math.round((h - hh) * 60)
  if (mm === 60) { hh += 1; mm = 0 }
  const ap = hh % 24 >= 12 ? "PM" : "AM"
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${String(mm).padStart(2, "0")} ${ap}`
}

export function cityAt(day: TripDay, hour: number): CityId {
  return day.cityAfter && hour >= (day.switchHour ?? 24) ? day.cityAfter : day.city
}

export function dayCities(day: TripDay): CityId[] {
  return day.cityAfter ? [day.city, day.cityAfter] : [day.city]
}

export function travelHours(a: SeaActivity): number {
  return a.zone === "walkable" ? 10 / 60 : a.zone === "ride" ? 25 / 60 : 0
}

// Pass/fail availability. Returns the human reason it can't happen at `start`, or null.
export function unavailableReason(
  a: SeaActivity,
  day: TripDay,
  start: number,
  weather: Weather,
  opts: { ignoreOpen?: boolean; ignoreClose?: boolean; ignoreBlocks?: boolean } = {},
): string | null {
  const here = cityAt(day, start)
  if (a.city !== here) return `you're in ${CITIES[here].name} then`
  if (a.onDates && !a.onDates.includes(day.key)) return "only on another date"
  const dow = dowOf(day.key)
  if (a.days && !a.days.includes(dow)) return `only ${a.days.join("/")}`
  if (a.closed?.includes(dow)) return `closed ${dow}s`
  if (a.animal && a.welfare !== "observation") return "fails the elephant welfare rule"
  if (a.eveningOnly && start < 16.5 && !opts.ignoreOpen) return "evening only"
  if (!opts.ignoreOpen && start < a.openHour) return `opens ${fmtHour(a.openHour)}`
  const end = start + a.durationMin / 60
  if (!opts.ignoreClose && end > a.closeHour + 0.25) return `closes ${fmtHour(a.closeHour)}`
  if (weather === "raining" && a.indoorOutdoor === "outdoor") return "outdoor, and it's raining"
  if (a.dryOnly && (weather === "raining" || weather === "rain-soon")) return "needs dry conditions"
  if (!opts.ignoreBlocks) {
    const clash = day.blocks.find((b) => start < b.end && end > b.start)
    if (clash) return `clashes with ${clash.label}`
  }
  return null
}

export interface ScoreLine { label: string; value: number }
export interface LoggedItem { activityId?: string; tag: Tag; today?: boolean }

export function scoreSea(
  a: SeaActivity,
  ctx: { hour: number; weather: Weather; logged: LoggedItem[]; planIds: Set<string>; suggested: Set<string> },
): { score: number; breakdown: ScoreLine[] } {
  const lines: ScoreLine[] = []
  if (ctx.planIds.has(a.id)) lines.push({ label: "on today's plan", value: 3 })
  else if (ctx.suggested.has(a.id)) lines.push({ label: "itinerary pick", value: 2 })
  if (a.novelty === "unusual") lines.push({ label: "novelty", value: 2 })
  if (a.zone === "walkable") lines.push({ label: "walkable", value: 1.5 })
  if (ctx.weather === "rain-soon" && a.indoorOutdoor === "indoor") lines.push({ label: "beats the rain", value: 2 })
  const same = ctx.logged.filter((l) => l.tag === a.tag).length
  if (same > 0) lines.push({ label: `repeats ${a.tag.replace("_", " & ").toLowerCase()} ×${same}`, value: -1.2 * same })
  if (a.effort === "high" && ctx.hour >= 15) lines.push({ label: "high effort, late", value: -2 })
  if (a.commitment === "reserved" && !ctx.planIds.has(a.id)) lines.push({ label: "needs booking", value: -1 })
  if (a.cost === "free") lines.push({ label: "free", value: 0.5 })
  const score = Math.round(lines.reduce((s, l) => s + l.value, 0) * 10) / 10
  return { score, breakdown: lines }
}

export interface SeaCandidate {
  activity: SeaActivity
  score: number
  breakdown: ScoreLine[]
  rationale: string
  slack: number | null
  needsBooking: boolean
  planned: boolean
  wildcard: boolean
}

export function rankSea(ctx: {
  day: TripDay
  hour: number
  weather: Weather
  logged: LoggedItem[]
  planIds: Set<string>
  refine?: string
  indoorOnly?: boolean
}) {
  const city = cityAt(ctx.day, ctx.hour)
  const busy = ctx.day.blocks.find((b) => ctx.hour >= b.start && ctx.hour < b.end) ?? null
  const anchor = ctx.day.blocks.find((b) => b.start > ctx.hour) ?? null
  if (busy || city === "transit") return { city, busy, anchor, candidates: [] as SeaCandidate[] }

  const loggedToday = new Set(ctx.logged.filter((l) => l.today).map((l) => l.activityId))
  const suggested = new Set(ctx.day.suggested)
  let pool = ACTIVITIES.filter((a) => !loggedToday.has(a.id) && !unavailableReason(a, ctx.day, ctx.hour, ctx.weather))
  if (ctx.indoorOnly) pool = pool.filter((a) => a.indoorOutdoor === "indoor")

  let scored: SeaCandidate[] = pool.map((a) => {
    const { score, breakdown } = scoreSea(a, { hour: ctx.hour, weather: ctx.weather, logged: ctx.logged, planIds: ctx.planIds, suggested })
    return {
      activity: a,
      score,
      breakdown,
      rationale: templateRationale(a, ctx.weather),
      slack: anchor ? Math.round(anchor.start * 60 - (ctx.hour * 60 + a.durationMin + travelHours(a) * 60)) : null,
      needsBooking: a.commitment === "reserved" && !ctx.planIds.has(a.id),
      planned: ctx.planIds.has(a.id),
      wildcard: false,
    }
  })

  if (ctx.refine) {
    // Reuses the Honolulu intent matcher — the activity fields it reads are identical.
    const rules = buildRefineRules(ctx.refine)
    if (rules.length) {
      const label = `"${ctx.refine.slice(0, 28)}"`
      scored = scored.map((c) => {
        let adj = 0
        for (const r of rules) adj += r.adj(c.activity as any)
        adj = Math.round(adj * 10) / 10
        return adj ? { ...c, score: Math.round((c.score + adj) * 10) / 10, breakdown: [...c.breakdown, { label, value: adj }] } : c
      })
    }
  }

  scored.sort((x, y) => y.score - x.score)
  const top = scored.slice(0, 3)
  const topTags = new Set(top.map((c) => c.activity.tag))
  const rest = scored.slice(3).filter((c) => c.score >= 0)
  const wild =
    rest.find((c) => c.activity.novelty === "unusual" && !topTags.has(c.activity.tag)) ??
    rest.find((c) => c.activity.novelty === "unusual") ??
    null
  if (wild) wild.wildcard = true
  return { city, busy, anchor, candidates: wild ? [...top, wild] : top }
}

function templateRationale(a: SeaActivity, weather: Weather): string {
  const bits: string[] = []
  if (weather === "rain-soon" && a.indoorOutdoor === "indoor") bits.push("stays dry if the rain arrives")
  else if (a.novelty === "unusual") bits.push("something new for the trip")
  else bits.push("an easy, classic win")
  bits.push(a.zone === "walkable" ? `on foot in ${a.area}` : a.zone === "ride" ? `a short Grab to ${a.area}` : "with hotel pickup")
  if (a.cost === "free") bits.push("and it's free")
  const s = bits.join(", ")
  return s.charAt(0).toUpperCase() + s.slice(1) + "."
}

/* ---------- trip builder: timing ---------- */

export interface Slot { id: string; start: number; end: number; warnings: string[] }

// Lays activities out in the given order around the day's fixed blocks, honoring opening
// hours and travel buffers, and reports every timing problem it finds.
export function scheduleDay(day: TripDay, ids: string[], weather: Weather = "clear"): Slot[] {
  const out: Slot[] = []
  let cursor: number | null = null
  for (const id of ids) {
    const a = ACTIVITY_BY_ID[id]
    if (!a) continue
    const dur = a.durationMin / 60
    const travel = travelHours(a)
    let start: number =
      cursor === null ? Math.max(a.openHour, Math.min(8, a.closeHour - dur - 1)) : Math.max(cursor + travel, a.openHour)
    if (a.eveningOnly) start = Math.max(start, Math.max(a.openHour, 17))
    for (let guard = 0; guard < 8; guard++) {
      const clash = day.blocks.find((b) => start < b.end && start + dur > b.start)
      if (!clash) break
      start = Math.max(start, clash.end + travel)
    }
    start = Math.ceil(start * 4) / 4
    const end = start + dur
    const warnings: string[] = []
    const why = unavailableReason(a, day, start, weather, { ignoreOpen: true, ignoreClose: true, ignoreBlocks: true })
    if (why) warnings.push(why)
    if (end > a.closeHour + 0.25) warnings.push(`runs past close (${fmtHour(a.closeHour)})`)
    if (end > 23.75) warnings.push("very late finish")
    if (a.commitment === "reserved") warnings.push("needs booking")
    out.push({ id, start, end, warnings })
    cursor = end
  }
  return out
}

// Deterministic "draft my day": the itinerary's picks, then gaps filled with the best
// drop-in activities that genuinely fit (open, right city, right weather, no clash).
export function draftDay(day: TripDay, weather: Weather = "clear"): Slot[] {
  if (day.city === "transit") return []
  const cities = dayCities(day)
  const ids = day.suggested.filter((id) => ACTIVITY_BY_ID[id])
  for (let pass = 0; pass < 6; pass++) {
    const sched = scheduleDay(day, ids, weather)
    const busy = [...day.blocks.map((b) => [b.start, b.end]), ...sched.map((s) => [s.start, s.end])].sort((x, y) => x[0] - y[0])
    const gaps: [number, number][] = []
    let t = 8
    for (const [s, e] of busy) {
      if (s - t >= 0.75) gaps.push([t, s])
      t = Math.max(t, e)
    }
    if (22 - t >= 0.75) gaps.push([t, 22])

    let added = false
    for (const [gs, ge] of gaps) {
      const used = ids.map((id) => ({ tag: ACTIVITY_BY_ID[id].tag }))
      const best = ACTIVITIES.filter((a) => !ids.includes(a.id) && cities.includes(a.city) && a.commitment === "dropin")
        .map((a) => ({ a, st: Math.ceil(Math.max(gs + travelHours(a), a.openHour) * 4) / 4 }))
        .filter(({ a, st }) => st + a.durationMin / 60 <= ge && !unavailableReason(a, day, st, weather))
        .map(({ a, st }) => ({ a, st, s: scoreSea(a, { hour: st, weather, logged: used, planIds: new Set(), suggested: new Set() }).score }))
        .sort((x, y) => y.s - x.s)[0]
      if (best) {
        const idx = sched.filter((s) => s.start < best.st).length
        ids.splice(idx, 0, best.a.id)
        added = true
        break
      }
    }
    if (!added) break
  }
  return scheduleDay(day, ids, weather)
}
