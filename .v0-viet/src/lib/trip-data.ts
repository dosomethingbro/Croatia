export const TRIP = {
  title: "Vietnam + Thailand",
  window: "Nov 19 – Dec 5 · 2026",
  // Departure used for the countdown (SFO, Nov 19 2026, 11:50 PM PT ~= UTC-8)
  departISO: "2026-11-19T23:50:00-08:00",
  returnISO: "2026-12-05T09:00:00+07:00",
}

export const IMG = {
  halong: "/images/halong.jpg",
  hanoi: "/images/hanoi.jpg",
  chiangMai: "/images/chiang-mai.jpg",
  railay: "/images/railay.jpg",
  elephant: "/images/elephant.jpg",
  phiPhi: "/images/phi-phi.jpg",
  ninhBinh: "/images/ninh-binh.jpg",
  pho: "/images/pho.jpg",
} as const

// Wikimedia Commons requires attribution. Shown in the footer.
export const PHOTO_CREDITS: { subject: string; credit: string }[] = [
  { subject: "Ha Long Bay", credit: "Ha Long Bay, Vietnam — Wikimedia Commons (CC BY-SA)" },
  { subject: "Hanoi", credit: "Thê Húc Bridge to Ngọc Sơn Temple — Wikimedia Commons (CC BY-SA)" },
  { subject: "Chiang Mai", credit: "Wat Chedi Luang, Chiang Mai — Wikimedia Commons (CC BY-SA)" },
  { subject: "Railay", credit: "Railay, Krabi — Wikimedia Commons (CC BY-SA)" },
  { subject: "Elephant", credit: "Asian elephant, Thailand — Wikimedia Commons (CC BY-SA)" },
  { subject: "Phi Phi", credit: "Maya Bay, Koh Phi Phi — Wikimedia Commons (CC BY-SA)" },
  { subject: "Ninh Binh", credit: "Trang An, Ninh Binh — Wikimedia Commons (CC BY-SA)" },
  { subject: "Pho", credit: "Vietnamese pho — Wikimedia Commons (CC BY-SA)" },
]

export type RouteStop = {
  name: string
  when: string
  coords: [number, number]
  kind: "origin" | "base" | "excursion" | "cruise" | "beach" | "home"
}

export const ROUTE: RouteStop[] = [
  { name: "San Francisco", when: "Nov 19 · depart 11:50 PM", coords: [37.7749, -122.4194], kind: "origin" },
  { name: "Hanoi", when: "Nov 21–27 · primary Vietnam base", coords: [21.0278, 105.8342], kind: "base" },
  { name: "Ninh Binh", when: "Nov 24 · day trip", coords: [20.2506, 105.9744], kind: "excursion" },
  { name: "Ha Long / Lan Ha Bay", when: "Nov 25–26 · overnight cruise", coords: [20.9101, 107.1839], kind: "cruise" },
  { name: "Chiang Mai", when: "Nov 27–Dec 1 · northern Thailand", coords: [18.7883, 98.9853], kind: "base" },
  { name: "Krabi → Railay", when: "Dec 1–5 · beach base", coords: [8.0119, 98.8378], kind: "beach" },
  { name: "Phi Phi + Hong Islands", when: "Dec 3–4 · boat excursions", coords: [7.7407, 98.7784], kind: "excursion" },
  { name: "Home", when: "Dec 5 · 9:00 AM departure", coords: [37.7749, -122.4194], kind: "home" },
]

export const STATS = [
  { value: "17", label: "calendar days" },
  { value: "2", label: "countries" },
  { value: "4", label: "primary bases" },
  { value: "5–6", label: "major excursions" },
  { value: "1", label: "overnight cruise" },
]

export const TRIP_SHAPE = [
  {
    tag: "Vietnam",
    title: "One hotel base",
    body: "Keep Hanoi as the anchor and do Ninh Binh plus the Ha Long overnight from there. It minimizes luggage moves and lets the city days breathe.",
  },
  {
    tag: "Thailand North",
    title: "Chiang Mai without overloading",
    body: "Keep one elephant half-day, one Old City / market day, and one mountain or history day rather than adding Chiang Rai or Pai.",
  },
  {
    tag: "Thailand South",
    title: "Railay deserves time",
    body: "The big mistake would be leaving Railay every morning. Preserve at least one local Railay / Phra Nang day, then do Phi Phi and Hong.",
  },
]

export type Day = { date: string; loc: string; title: string; body: string }

export const ITINERARY: Day[] = [
  { date: "Nov 19", loc: "SAN FRANCISCO", title: "Departure", body: "SFO around 8:30–9:00 PM · international flight 11:50 PM." },
  { date: "Nov 20", loc: "IN TRANSIT", title: "Flying", body: "International travel day." },
  { date: "Nov 21", loc: "HANOI", title: "Arrival + Old Quarter", body: "Arrive 11:35 AM · hotel by ~1:30 PM · Hoan Kiem Lake · Ngoc Son · food / coffee." },
  { date: "Nov 22", loc: "HANOI", title: "History + food", body: "Hoa Lo Prison · French Quarter · Michelin-recognized pho · evening motorcycle food tour." },
  { date: "Nov 23", loc: "HANOI", title: "Temples + city", body: "Tran Quoc Pagoda · Temple of Literature · cafés · Train Street / rooftop." },
  { date: "Nov 24", loc: "NINH BINH", title: "Full-day excursion", body: "Hoa Lu + Trang An + Bich Dong + Mua Cave. Small-group / limousine tour preferred." },
  { date: "Nov 25", loc: "HA LONG / LAN HA", title: "Overnight cruise", body: "Hanoi pickup ~8:00 AM · marina ~11:00 AM · embark before noon · kayaking · sunset · dinner." },
  { date: "Nov 26", loc: "HA LONG → HANOI", title: "Cruise morning + Hanoi", body: "Sunrise · cave / boat activity · brunch · disembark late morning · Hanoi ~2:30–3:00 PM on Orchid-style schedule." },
  { date: "Nov 27", loc: "HANOI → CHIANG MAI", title: "International regional flight", body: "Easy Hanoi morning · airport ~1 PM · flight around 3:30 PM · Chiang Mai dinner." },
  { date: "Nov 28", loc: "CHIANG MAI", title: "Ethical elephant half-day", body: "Observation-first, no riding, bathing, shows or forced interaction. Massage / pool afterward." },
  { date: "Nov 29", loc: "CHIANG MAI", title: "Old City + Sunday Market", body: "Wat Phra Singh · Wat Chedi Luang · cafés · Sunday Walking Street in evening." },
  { date: "Nov 30", loc: "CHIANG MAI", title: "Choose your final excursion", body: "Option A: Doi Inthanon + Kew Mae Pan. Option B: Lamphun + Wiang Kum Kam history day. Muay Thai at night if energy allows." },
  { date: "Dec 1", loc: "CHIANG MAI → KRABI → RAILAY", title: "Morning flight strongly preferred", body: "7:55 AM → 9:55 AM CNX–KBV target · road transfer · longtail / hotel transfer to Railay · beach afternoon." },
  { date: "Dec 2", loc: "RAILAY", title: "Stay local", body: "Railay West · Phra Nang · kayak · viewpoint if conditions are good · massage · sunset." },
  { date: "Dec 3", loc: "PHI PHI", title: "Shared premium / small-group speedboat", body: "Maya Bay · Pileh Lagoon · snorkeling · Phi Phi Don. Verify Railay pickup logistics." },
  { date: "Dec 4", loc: "HONG ISLANDS", title: "Private longtail", body: "Lagoon · snorkeling · beach time · sunset. Better place to spend for privacy than Phi Phi." },
  { date: "Dec 5", loc: "RAILAY → KBV", title: "Departure day", body: "Pre-arrange hotel boat + road transfer. Build a large weather / sea-state buffer for a 9:00 AM flight." },
]

export type TransferTone = "neutral" | "good" | "warn" | "risk"

export type Transfer = {
  tag: string
  mode: string
  route: string
  body: string
  pills: string[]
  note: { tone: TransferTone; label: string; text: string }
}

export const TRANSFERS: Transfer[] = [
  {
    tag: "VIETNAM · DAY TRIP",
    mode: "MINIBUS / LIMOUSINE",
    route: "Hanoi → Ninh Binh → Hanoi",
    body: "Ninh Binh is roughly 2–2.5 hours from Hanoi. For this itinerary, a hotel-pickup small-group tour is simpler than rail because you want multiple dispersed stops in one day.",
    pills: ["~110 km south", "full day", "hotel pickup"],
    note: { tone: "good", label: "Recommended:", text: "premium small group that explicitly lists Hoa Lu + Trang An + Bich Dong + Mua Cave. Do not assume Bich Dong is included." },
  },
  {
    tag: "VIETNAM · CRUISE TRANSFER",
    mode: "LIMOUSINE VAN",
    route: "Hanoi → Tuan Chau → Cruise",
    body: "Orchid's current 2D1N schedule uses an 8:00–8:30 AM Old Quarter pickup, marina arrival around 11:00–11:30, and return to Hanoi around 2:30–3:00 PM the following day. Their transfer is an add-on.",
    pills: ["~3 hours", "cruise operator transfer", "Tuan Chau"],
    note: { tone: "warn", label: "Watch:", text: "verify whether your quoted cruise price includes Hanoi transfers. Many attractive room rates do not." },
  },
  {
    tag: "VIETNAM → THAILAND",
    mode: "FLIGHT",
    route: "Hanoi → Chiang Mai",
    body: "Keep the cruise return on Nov 26 and fly on Nov 27. That full overnight buffer in Hanoi protects the international connection from cruise / road delays.",
    pills: ["buffer night", "airport by ~1 PM", "regional international"],
    note: { tone: "good", label: "Good itinerary design:", text: "do not attempt Ha Long → airport → Chiang Mai on the same day." },
  },
  {
    tag: "THAILAND · DOMESTIC",
    mode: "NONSTOP FLIGHT",
    route: "Chiang Mai (CNX) → Krabi (KBV)",
    body: "Thai AirAsia currently markets nonstop CNX–KBV service at about two hours. Your search showed 7:55–9:55 AM, 12:55–2:55 PM and 5:05–7:05 PM options for Dec 1.",
    pills: ["~2h flight", "7 kg cabin allowance check", "buy checked baggage early"],
    note: { tone: "good", label: "Pick:", text: "7:55 AM. The small fare premium buys almost a full extra Railay afternoon." },
  },
  {
    tag: "THAILAND · CRITICAL TRANSFER",
    mode: "ROAD + BOAT",
    route: "Krabi Airport → Railay",
    body: "Railay is road-inaccessible. Plan this as one connected transfer, not two unrelated rides: KBV → Ao Nang / appropriate pier → boat → Railay hotel.",
    pills: ["road ~35–50 min", "boat ~10–20 min", "weather dependent"],
    note: { tone: "warn", label: "Best practice:", text: "ask your Railay hotel for a door-to-door transfer quote. With luggage, this is worth comparing against DIY taxi + public longtail." },
  },
  {
    tag: "THAILAND · HIGHEST RISK",
    mode: "BOAT + ROAD + FLIGHT",
    route: "Railay → Krabi Airport · Dec 5",
    body: "A 9:00 AM flight makes this the most operationally sensitive transfer. Early boats, tides, rain and sea state matter more than on arrival day.",
    pills: ["pre-book only", "large buffer", "hotel coordination"],
    note: { tone: "risk", label: "Do not wing this.", text: "Arrange the transfer through the hotel or a verified operator before the trip and reconfirm the day before." },
  },
]

export type Verdict = "pick" | "skip" | "consider"

export const TRANSFER_MATRIX: { leg: string; diy: string; private: string; rec: string; verdict: Verdict; reason: string }[] = [
  { leg: "Hanoi airport → hotel", diy: "Grab / taxi", private: "Hotel transfer", rec: "Either", verdict: "consider", reason: "Arrival fatigue may make hotel pickup worth a small premium." },
  { leg: "Hanoi → Ninh Binh", diy: "Train / bus", private: "Small-group tour van", rec: "Operator", verdict: "pick", reason: "Multiple sites make a packaged day more efficient." },
  { leg: "Hanoi → Ha Long", diy: "Independent shuttle", private: "Cruise limousine", rec: "Cruise operator", verdict: "pick", reason: "Aligns directly with embarkation time." },
  { leg: "Hanoi → HAN", diy: "Grab", private: "Hotel car", rec: "Either", verdict: "consider", reason: "Leave a large buffer for international departure." },
  { leg: "CNX → Chiang Mai hotel", diy: "Airport taxi / Grab", private: "Hotel transfer", rec: "DIY", verdict: "pick", reason: "Easy, short urban transfer." },
  { leg: "Chiang Mai excursions", diy: "Rent car / scooter", private: "Guide / tour", rec: "Tour", verdict: "pick", reason: "Better for elephant ethics and Doi Inthanon logistics." },
  { leg: "KBV → Railay", diy: "Taxi + public longtail", private: "Hotel through-transfer", rec: "Compare, favor hotel", verdict: "pick", reason: "Luggage + boat connection make through-ticketing valuable." },
  { leg: "Railay → KBV at dawn", diy: "Public boat + taxi", private: "Pre-arranged hotel transfer", rec: "Hotel / private", verdict: "pick", reason: "Flight protection outweighs savings." },
]

export type BookLink = { label: string; href: string }

export type Excursion = {
  rank?: string
  region: string
  title: string
  cost: string
  score: string
  body: string
  image?: string
  links?: BookLink[]
}

const gmapsTour = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`
const gyg = (q: string) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}`

export const EXCURSIONS: Excursion[] = [
  { rank: "#1", region: "VIETNAM", title: "Ninh Binh", cost: "~$130–180 / couple", score: "9.8 / 10", body: "Hoa Lu + Trang An + Bich Dong + Mua Cave. History and landscape in one day.", image: IMG.ninhBinh, links: [{ label: "GetYourGuide", href: gyg("Ninh Binh Trang An Mua Cave day tour from Hanoi") }, { label: "Search operators", href: gmapsTour("Ninh Binh premium small group tour Hoa Lu Trang An Bich Dong Mua Cave") }] },
  { rank: "#2", region: "THAILAND", title: "Ethical elephants", cost: "~$110–220 / couple", score: "10 / 10 welfare filter", body: "Half-day observation-first program. No riding, shows, bathing, forced touching or staged interaction.", image: IMG.elephant, links: [{ label: "GetYourGuide", href: gyg("Chiang Mai ethical elephant sanctuary observation no riding") }, { label: "Search sanctuaries", href: gmapsTour("Chiang Mai high welfare elephant sanctuary observation only no riding") }] },
  { rank: "#3", region: "THAILAND", title: "Doi Inthanon", cost: "~$180–250 / couple", score: "9.6 / 10", body: "Private or premium small-group. Kew Mae Pan, waterfalls, summit and pagodas.", links: [{ label: "GetYourGuide", href: gyg("Doi Inthanon national park Kew Mae Pan tour Chiang Mai") }] },
  { region: "THAILAND", title: "Lamphun + Wiang Kum Kam", cost: "~$120–220 / couple", score: "9.0 / 10", body: "Best alternative to Doi Inthanon if you want a deeper Hariphunchai → Lanna history day.", links: [{ label: "Search operators", href: gmapsTour("Lamphun Wiang Kum Kam history day tour Chiang Mai") }] },
  { region: "THAILAND", title: "Phi Phi", cost: "~$110–180 / couple", score: "9.4 / 10", body: "Shared premium / small-group speedboat. Private pricing usually isn't worth the jump for two.", image: IMG.phiPhi, links: [{ label: "GetYourGuide", href: gyg("Phi Phi Maya Bay speedboat tour from Railay Krabi") }] },
  { region: "THAILAND", title: "Hong Islands", cost: "~$200–300 / couple", score: "9.8 / 10", body: "Private longtail is where the privacy premium pays off: lagoon, beaches, snorkeling and sunset.", links: [{ label: "GetYourGuide", href: gyg("Hong Islands private longtail tour Krabi Railay") }] },
]

export const EXCURSION_MATRIX: { option: string; time: string; bestFor: string; decision: string; verdict: Verdict; tradeoff: string }[] = [
  { option: "Ninh Binh", time: "Full day", bestFor: "History + scenery", decision: "Book", verdict: "pick", tradeoff: "Long day, but absolutely worth it." },
  { option: "Ha Long overnight", time: "2D1N", bestFor: "Luxury + landscape", decision: "Book", verdict: "pick", tradeoff: "Spend enough for a good cabin, not ultra-luxury." },
  { option: "Elephant observation", time: "Half / ¾ day", bestFor: "Wildlife", decision: "Book only high-welfare", verdict: "pick", tradeoff: "Do not compromise welfare for a shorter schedule." },
  { option: "Doi Inthanon", time: "Full day", bestFor: "Mountain nature", decision: "Book if nature wins", verdict: "consider", tradeoff: "Another long vehicle day." },
  { option: "Lamphun + Wiang Kum Kam", time: "½–full day", bestFor: "History", decision: "Alternative", verdict: "consider", tradeoff: "Less dramatic scenery than Doi Inthanon." },
  { option: "Chiang Rai", time: "12–14h", bestFor: "Temples", decision: "Skip", verdict: "skip", tradeoff: "Too much road time for this itinerary." },
  { option: "Pai", time: "Very long day", bestFor: "Mountain town", decision: "Skip", verdict: "skip", tradeoff: "Better as an overnight destination." },
  { option: "Phi Phi", time: "Full day", bestFor: "Iconic islands", decision: "Book", verdict: "pick", tradeoff: "Crowds; choose an early / smaller group if possible." },
  { option: "Hong Islands", time: "½–full day", bestFor: "Lagoon + private boat", decision: "Book", verdict: "pick", tradeoff: "Check tide and Railay pickup." },
  { option: "Four Islands", time: "½ day", bestFor: "Easy boat day", decision: "Skip if Phi Phi + Hong", verdict: "skip", tradeoff: "Too much repetition." },
]

export type Cruise = { rank?: string; tier: string; name: string; cost: string; score: string; body: string; link?: BookLink }

export const CRUISES: Cruise[] = [
  { rank: "#1", tier: "BEST OVERALL", name: "Capella", cost: "~$490–550 / couple", score: "9.6 / 10", body: "Best blend of room quality, private balcony, pool, kayaking/SUP, cave experience and genuinely fun onboard amenities.", link: { label: "Search Capella cruise", href: gmapsTour("Capella Cruise Lan Ha Bay 2D1N booking") } },
  { rank: "#2", tier: "SAFE CHOICE", name: "Orchid Classic", cost: "~$350–500 / couple", score: "9.4 / 10", body: "Strong itinerary, established operator, kayaking at Ao Ech, Cat Ba / Trung Trang cave, good timing back to Hanoi.", link: { label: "Search Orchid Classic", href: gmapsTour("Orchid Classic Cruise Ha Long 2D1N booking") } },
  { rank: "#3", tier: "BOUTIQUE", name: "Heritage Binh Chuan", cost: "~$400–550 / couple", score: "9.4 / 10", body: "Smaller, more romantic and more Vietnamese in design / storytelling. Better if atmosphere matters more than resort amenities.", link: { label: "Search Heritage cruise", href: gmapsTour("Heritage Binh Chuan Cruise Lan Ha Bay booking") } },
  { tier: "VALUE", name: "Orchid Trendy", cost: "~$300–450 / couple", score: "9.0 / 10", body: "Good fallback if Classic or Capella pricing jumps. Same general route logic without paying for the top tier.", link: { label: "Search Orchid Trendy", href: gmapsTour("Orchid Trendy Cruise Ha Long booking") } },
  { tier: "BIG SHIP", name: "Grand Pioneers", cost: "~$420–550+", score: "8.9 / 10", body: "Large suites and impressive ship amenities, but less intimate. More floating-resort, less boutique expedition.", link: { label: "Search Grand Pioneers", href: gmapsTour("Grand Pioneers Cruise Ha Long booking") } },
  { tier: "SKIP FOR THIS TRIP", name: "Ultra-luxury 3D2N", cost: "$1,500+ / couple", score: "Wrong fit", body: "Beautiful, but it breaks the itinerary and gives poor incremental value versus a strong ~$500 2D1N product." },
]

export type BookingResource = { group: string; items: BookLink[] }

const flights = (from: string, to: string, date: string) =>
  `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${from} to ${to} on ${date}`)}`

export const BOOKING_RESOURCES: BookingResource[] = [
  {
    group: "Flights",
    items: [
      { label: "SFO → Hanoi (Nov 19)", href: flights("San Francisco", "Hanoi", "2026-11-19") },
      { label: "Hanoi → Chiang Mai (Nov 27)", href: flights("Hanoi", "Chiang Mai", "2026-11-27") },
      { label: "Chiang Mai → Krabi (Dec 1)", href: flights("Chiang Mai", "Krabi", "2026-12-01") },
      { label: "Krabi → SFO (Dec 5)", href: flights("Krabi", "San Francisco", "2026-12-05") },
    ],
  },
  {
    group: "Lodging",
    items: [
      { label: "Hanoi Old Quarter hotels", href: "https://www.booking.com/searchresults.html?ss=Hanoi+Old+Quarter" },
      { label: "Chiang Mai Old City hotels", href: "https://www.booking.com/searchresults.html?ss=Chiang+Mai+Old+City" },
      { label: "Railay Beach hotels", href: "https://www.booking.com/searchresults.html?ss=Railay+Beach+Krabi" },
    ],
  },
  {
    group: "Tours & activities",
    items: [
      { label: "GetYourGuide — Vietnam", href: gyg("Hanoi Ninh Binh Ha Long tours") },
      { label: "GetYourGuide — Chiang Mai", href: gyg("Chiang Mai tours elephants Doi Inthanon") },
      { label: "GetYourGuide — Krabi", href: gyg("Krabi Phi Phi Hong Islands tours") },
    ],
  },
]

export const CRUISE_DECISION = [
  "Require private balcony and a genuinely comfortable cabin.",
  "Prefer Lan Ha / Ha Long + Lan Ha route with kayaking rather than pure sightseeing.",
  "Verify Hanoi round-trip transfer cost before comparing totals.",
  "Check cancellation policy for weather-related cruise disruption.",
  "Target roughly $400–550 for two; only exceed that for a clear room / itinerary upgrade.",
]

export type Destination = {
  slug: string
  name: string
  country: "Vietnam" | "Thailand"
  when: string
  dates: string
  tagline: string
  intro: string
  image: string
  coords: [number, number]
  highlights: { title: string; body: string }[]
  food: string[]
  logistics: { title: string; body: string }[]
  history: string
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "hanoi",
    name: "Hanoi",
    country: "Vietnam",
    when: "Nov 21–27",
    dates: "Primary Vietnam base · 5 nights",
    tagline: "Thousand-year capital and the anchor for every Vietnam day",
    intro:
      "Keep Hanoi as the single Vietnam base. The Old Quarter and French Quarter put you within walking distance of the lake, food streets and the major history sites, and both the Ninh Binh day trip and the Ha Long overnight run out and back from here.",
    image: IMG.hanoi,
    coords: [21.0278, 105.8342],
    highlights: [
      { title: "Hoan Kiem Lake & Ngoc Son", body: "Start here on arrival day — a gentle, walkable orientation to the Old Quarter with a temple on the water." },
      { title: "Hoa Lo Prison", body: "French colonial and later American-POW history in one surviving site. A dense, sobering half-morning." },
      { title: "Temple of Literature", body: "Vietnam's first university (1070). Pair with Tran Quoc Pagoda and the West Lake cafés." },
      { title: "Motorbike food tour", body: "The most efficient way to eat across the city at night — book an established small-group operator." },
    ],
    food: ["Michelin-recognized pho", "Bun cha (Obama-style)", "Egg coffee at a Train Street café", "Banh mi from a busy corner cart"],
    logistics: [
      { title: "Getting in", body: "Airport is ~45 min from the Old Quarter. Grab or a pre-arranged hotel car both work; favor the hotel car after the long-haul arrival." },
      { title: "Getting around", body: "The center is walkable. Use Grab (car or bike) for anything beyond ~1.5 km." },
    ],
    history: "Founded as Thăng Long in 1010, Hanoi has been a political center through dynastic, colonial and modern eras — which is why its history sites layer empire, occupation and war within a few blocks.",
  },
  {
    slug: "chiang-mai",
    name: "Chiang Mai",
    country: "Thailand",
    when: "Nov 27–Dec 1",
    dates: "Northern Thailand base · 4 nights",
    tagline: "Lanna moat-and-temple city with the trip's nature and elephant days",
    intro:
      "Chiang Mai is the northern base. Keep it to one elephant half-day, one Old City / market day, and one mountain-or-history day rather than overloading it with Chiang Rai or Pai side trips.",
    image: IMG.chiangMai,
    coords: [18.7883, 98.9853],
    highlights: [
      { title: "Ethical elephant half-day", body: "Observation-first only — no riding, bathing, shows or forced interaction. This is the welfare non-negotiable of the trip." },
      { title: "Old City temples", body: "Wat Phra Singh and Wat Chedi Luang inside the moat, easily done on foot between cafés." },
      { title: "Sunday Walking Street", body: "If your dates include a Sunday, the Ratchadamnoen market is the best single evening in the city." },
      { title: "Doi Inthanon", body: "Thailand's highest peak — Kew Mae Pan nature trail, waterfalls and the twin royal pagodas." },
    ],
    food: ["Khao soi (northern curry noodles)", "Sai ua (Chiang Mai sausage)", "Nimman café brunch", "Night-market grilled skewers"],
    logistics: [
      { title: "Getting in", body: "Short flight from Hanoi with a buffer night before. Airport to Old City is a quick, cheap Grab/taxi." },
      { title: "Excursions", body: "Use a guide/tour for elephants and Doi Inthanon rather than self-driving — better ethics and logistics." },
    ],
    history: "Founded by King Mangrai in 1296 as the Lanna capital; the surviving moat and gates trace the planned old city, layered later with Burmese conquest and resettlement.",
  },
  {
    slug: "railay",
    name: "Krabi → Railay",
    country: "Thailand",
    when: "Dec 1–5",
    dates: "Southern beach base · 4 nights",
    tagline: "Road-inaccessible limestone peninsula for the trip's beach finale",
    intro:
      "Railay is the beach base and a place worth actually staying in rather than day-tripping from. Preserve at least one local Railay / Phra Nang day, then do Phi Phi and the Hong Islands as boat excursions.",
    image: IMG.railay,
    coords: [8.0119, 98.8378],
    highlights: [
      { title: "Railay West & Phra Nang", body: "Two of the best beaches in Thailand, plus the Princess Cave and a viewpoint/lagoon scramble for the fit." },
      { title: "Phi Phi speedboat", body: "Maya Bay, Pileh Lagoon and snorkeling. Choose an early or smaller-group boat to beat the crowds." },
      { title: "Hong Islands longtail", body: "A private longtail is where the privacy premium pays off — lagoon, quiet beaches and sunset." },
      { title: "Rock climbing / kayaking", body: "Railay is a world-famous climbing spot; even beginners can do a guided half-day." },
    ],
    food: ["Fresh seafood BBQ on the beach", "Massaman curry", "Southern-style tom yum", "Fruit shakes from a beach shack"],
    logistics: [
      { title: "Getting in", body: "Krabi airport → pier → longtail/hotel boat. Book this as ONE connected transfer through your hotel; Railay has no road access." },
      { title: "Departure day", body: "The Dec 5 dawn transfer is the trip's highest-risk leg — pre-book through the hotel and build a big weather/tide buffer for a 9:00 AM flight." },
    ],
    history: "The modern resort landscape sits on very recent disaster memory — the 2004 Indian Ocean tsunami reshaped the nearby islands and the region's evacuation infrastructure.",
  },
]

export type HistoryItem = { era: string; title: string; body: string; dark?: boolean }

export const HISTORY: HistoryItem[] = [
  { era: "HANOI · 1010", title: "Thăng Long becomes the imperial capital", body: "The foundation of Hanoi's long role as a political center and a starting node for dynastic Vietnam." },
  { era: "HANOI · 1896–20TH C.", title: "Hỏa Lò Prison", body: "French colonial imprisonment, revolutionary memory and later American POW history in one surviving site.", dark: true },
  { era: "BẠCH ĐẰNG · 938 / 1288", title: "Two defining river victories", body: "Ngô Quyền in 938 and Trần Hưng Đạo in 1288 make the river system near the Ha Long region central to Vietnamese military memory." },
  { era: "CHIANG MAI · 1296", title: "Founding of the Lanna capital", body: "Mangrai's planned city explains the surviving moat, gates and temple geography." },
  { era: "CHIANG MAI · 1558–18TH C.", title: "Burmese rule, warfare and depopulation", body: "A darker layer beneath the tourist image of the Old City: imperial conquest, frontier war, flight and later resettlement.", dark: true },
  { era: "PHI PHI · 2004", title: "Indian Ocean tsunami", body: "The modern resort landscape overlays a very recent disaster history of mass death, rebuilding and new evacuation infrastructure.", dark: true },
]

export type ChecklistItem = { id: string; title: string; note: string }

export const CHECKLIST: ChecklistItem[] = [
  { id: "intl", title: "International EVA flights", note: "Confirm fare, cabin and final routing." },
  { id: "hanoiHotel", title: "Hanoi hotel", note: "Old Quarter / French Quarter convenience." },
  { id: "ninh", title: "Ninh Binh premium small-group", note: "Must include Bich Dong." },
  { id: "cruise", title: "Ha Long overnight cruise", note: "Capella vs Orchid Classic vs Heritage." },
  { id: "hanCnx", title: "Hanoi → Chiang Mai flight", note: "Keep the Nov 26 buffer night." },
  { id: "ele", title: "Ethical elephant half-day", note: "Hands-off / welfare-first only." },
  { id: "cmHotel", title: "Chiang Mai hotel", note: "Old City / Nimman tradeoff." },
  { id: "cnxKbv", title: "CNX → KBV 7:55 AM", note: "Add checked baggage before airport." },
  { id: "railayHotel", title: "Railay hotel", note: "Ask for airport transfer pricing." },
  { id: "phi", title: "Phi Phi small-group speedboat", note: "Verify Railay pickup / park fees." },
  { id: "hong", title: "Hong private longtail", note: "Sunset timing + tide + Railay pickup." },
  { id: "departure", title: "Dec 5 early Railay → KBV transfer", note: "Reconfirm day before; do not rely on walk-up boat." },
]

export const SOURCE_NOTES =
  "Vietnam Tourism currently describes Ninh Binh as roughly 2.5 hours southwest of Hanoi and recommends arranging day tours in advance. Orchid's current 2D1N itinerary lists 8:00–8:30 AM Hanoi pickup, 11:00–11:30 marina arrival and roughly 2:30–3:00 PM Hanoi return the next day, with the transfer not included in the base cruise service. AirAsia currently markets nonstop Chiang Mai–Krabi flights at about 1h55–2h and notes a 7 kg cabin-baggage limit before purchased checked baggage. Exact Nov/Dec schedules, fares, sea transfers and tour inclusions must be rechecked before booking."

// NEW FEATURE: budget estimator (low/high per-couple USD ranges)
export type BudgetLine = { category: string; item: string; low: number; high: number; note: string }

export const BUDGET: BudgetLine[] = [
  { category: "Flights", item: "International EVA (round-trip, 2 pax)", low: 2400, high: 3600, note: "Depends on cabin and booking window." },
  { category: "Flights", item: "Hanoi → Chiang Mai (2 pax)", low: 220, high: 420, note: "Regional international, 1 stop or nonstop." },
  { category: "Flights", item: "Chiang Mai → Krabi (2 pax)", low: 120, high: 260, note: "Thai AirAsia nonstop; add checked bags." },
  { category: "Lodging", item: "Hanoi hotel (5 nights)", low: 400, high: 900, note: "Old Quarter / French Quarter 4★." },
  { category: "Lodging", item: "Chiang Mai hotel (4 nights)", low: 280, high: 700, note: "Old City / Nimman." },
  { category: "Lodging", item: "Railay hotel (4 nights)", low: 500, high: 1200, note: "Beachfront premium adds up." },
  { category: "Excursions", item: "Ninh Binh day trip", low: 130, high: 180, note: "Premium small-group." },
  { category: "Excursions", item: "Ha Long overnight cruise", low: 400, high: 550, note: "Capella / Orchid Classic tier." },
  { category: "Excursions", item: "Ethical elephant half-day", low: 110, high: 220, note: "High-welfare only." },
  { category: "Excursions", item: "Doi Inthanon (or Lamphun)", low: 120, high: 250, note: "Choose one final Chiang Mai day." },
  { category: "Excursions", item: "Phi Phi speedboat", low: 110, high: 180, note: "Shared premium / small-group." },
  { category: "Excursions", item: "Hong Islands private longtail", low: 200, high: 300, note: "Privacy premium worth it." },
  { category: "Ground + food", item: "Transfers, Grabs, boats", low: 250, high: 500, note: "Airport, cruise, Railay boat transfers." },
  { category: "Ground + food", item: "Food & incidentals (17 days)", low: 800, high: 1700, note: "Street food to occasional splurge." },
]
