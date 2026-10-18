// Companion history for each stop: the dark and the pinnacle moments that rippled outward.
// Every event is pinned to a real place so the map can fly to it, link its consequences
// (`links`) across cities, and turn its `sites` into stops on a buildable tour.

import type { CityId } from "@/lib/sea"

export type HistoryKind = "dark" | "pinnacle" | "legend"

export interface HistoryEvent {
  id: string
  city: Exclude<CityId, "transit">
  year: string
  sort: number
  kind: HistoryKind
  title: string
  place: string
  lat: number
  lng: number
  summary: string
  ripple: string
  links: string[]
  sites: string[]
  facts: string[]
  wiki: string
}

export const HISTORY: HistoryEvent[] = [
  // Ninh Binh
  {
    id: "nb-caves", city: "ninhbinh", year: "c. 30,000 years ago", sort: -30000, kind: "pinnacle",
    title: "People in the Tràng An caves", place: "Tràng An karst", lat: 20.2559, lng: 105.9179,
    summary: "Digs in Tràng An's caves found evidence that people lived here for roughly 30,000 years, adapting each time rising seas flooded the karst.",
    ripple: "That evidence is a big part of why UNESCO listed the Tràng An Landscape Complex in 2014. It was Vietnam's first site recognized for both nature and culture.",
    links: [], sites: ["trang-an"],
    facts: ["Kong: Skull Island (2017) filmed around Tràng An and Tam Cốc, and its film-set 'tribal village' is still on the boat route."],
    wiki: "Tràng An Scenic Landscape Complex",
  },
  {
    id: "nb-968", city: "ninhbinh", year: "968", sort: 968, kind: "pinnacle",
    title: "Đinh Bộ Lĩnh founds Đại Cồ Việt", place: "Hoa Lư ancient capital", lat: 20.2864, lng: 105.9061,
    summary: "After ending the 'Anarchy of the 12 Warlords', Đinh Bộ Lĩnh declared himself emperor and made Hoa Lư, walled in by limestone, the capital of an independent kingdom.",
    ripple: "Hoa Lư stayed the capital for 42 years, until the court moved to Thăng Long (Hanoi) in 1010.",
    links: ["hn-1010"], sites: ["hoa-lu"],
    facts: ["Đinh Tiên Hoàng was assassinated in 979. Lê Hoàn, who took power after him, defeated a Song invasion in 981."],
    wiki: "Hoa Lư",
  },
  {
    id: "nb-war", city: "ninhbinh", year: "1965–1972", sort: 1965, kind: "dark",
    title: "Bombing the north–south lifeline", place: "Ninh Bình on Highway 1", lat: 20.2506, lng: 105.9745,
    summary: "Ninh Bình was a choke point on Highway 1 and the north–south railway, so US air campaigns bombed it again and again. Caves across the karst sheltered people and supplies.",
    ripple: "The rebuilt road and rail corridor now carries the visitor traffic that keeps Tràng An's rowing villages going.",
    links: ["hn-1972"], sites: ["bich-dong"],
    facts: ["Several pagodas built into caves in the province doubled as shelters during the bombing years."],
    wiki: "Ninh Bình",
  },

  // Hanoi
  {
    id: "hn-1010", city: "hanoi", year: "1010", sort: 1010, kind: "pinnacle",
    title: "Lý Thái Tổ founds Thăng Long", place: "Imperial Citadel of Thăng Long", lat: 21.0353, lng: 105.84,
    summary: "Emperor Lý Thái Tổ moved the capital from Hoa Lư to a new site he named Thăng Long, 'Ascending Dragon'. Legend says he saw a dragon rise over the Red River.",
    ripple: "Hanoi became Vietnam's political centre for most of the next thousand years. Digs at the Citadel have found palace layers from the 7th to the 19th century.",
    links: [], sites: ["citadel", "mosaic-mural"],
    facts: ["The ceramic mosaic mural on the Red River dyke was built for Hanoi's 1,000th anniversary in 2010.", "UNESCO listed the Citadel's central sector in 2010."],
    wiki: "Imperial Citadel of Thăng Long",
  },
  {
    id: "hn-1789", city: "hanoi", year: "1789", sort: 1789, kind: "pinnacle",
    title: "Quang Trung routs the Qing army", place: "Đống Đa mound", lat: 21.0128, lng: 105.8269,
    summary: "During Tết 1789, Emperor Quang Trung force-marched north and surprised the Qing army occupying Thăng Long, at Ngọc Hồi and Đống Đa.",
    ripple: "It ended the Qing intervention. The victory is still marked every year on the 5th day of Tết at the Đống Đa festival.",
    links: [], sites: [],
    facts: ["Tradition holds the Đống Đa mound was raised over the fallen Qing soldiers."],
    wiki: "Battle of Ngọc Hồi-Đống Đa",
  },
  {
    id: "hn-1896", city: "hanoi", year: "1896", sort: 1896, kind: "dark",
    title: "The French build Hỏa Lò", place: "Hỏa Lò Prison", lat: 21.0253, lng: 105.8466,
    summary: "The colonial government built the Maison Centrale to hold Vietnamese political prisoners in brutal, overcrowded conditions. The guillotine on display was used here.",
    ripple: "Many future revolutionary leaders were jailed and radicalized here. Later, as the 'Hanoi Hilton', it held American POWs, John McCain among them.",
    links: ["hn-1945", "hn-1973"], sites: ["hoa-lo"],
    facts: ["Most of the prison was torn down in the 1990s. The surviving gatehouse is the museum, and a tower block stands on the rest.", "The museum tells the official Vietnamese account, especially of the POW era."],
    wiki: "Hỏa Lò Prison",
  },
  {
    id: "hn-famine", city: "hanoi", year: "1944–1945", sort: 1944, kind: "dark",
    title: "The famine of 1945", place: "Red River Delta", lat: 21.012, lng: 105.862,
    summary: "Under Japanese occupation and French administration, rice seizures, forced crop changes, war damage and floods brought famine to the north. Estimates of the dead run from about 400,000 to 2 million.",
    ripple: "The famine drove mass support to the Việt Minh, who broke open rice granaries. That led directly to the August Revolution.",
    links: ["hn-1945"], sites: [],
    facts: ["The famine is still a defining memory in northern families and appears in many Vietnamese novels and films."],
    wiki: "Vietnamese famine of 1945",
  },
  {
    id: "hn-1945", city: "hanoi", year: "2 Sep 1945", sort: 1945.7, kind: "pinnacle",
    title: "Declaration of Independence", place: "Ba Đình Square", lat: 21.0368, lng: 105.8346,
    summary: "Hồ Chí Minh read Vietnam's Declaration of Independence to a huge crowd. It opened by quoting the US Declaration of Independence.",
    ripple: "France came back to retake its colony, and the First Indochina War followed (1946–54).",
    links: ["hn-1954"], sites: [],
    facts: ["His mausoleum now stands on the square. It closes for maintenance at times each year, and visitors must dress conservatively and stay quiet."],
    wiki: "Proclamation of Independence of the Democratic Republic of Vietnam",
  },
  {
    id: "hn-1954", city: "hanoi", year: "10 Oct 1954", sort: 1954, kind: "pinnacle",
    title: "Liberation of the Capital", place: "Long Biên Bridge", lat: 21.043, lng: 105.859,
    summary: "After the French defeat at Điện Biên Phủ and the Geneva Accords, French troops pulled out of Hanoi, the last of them over Long Biên Bridge, and Việt Minh troops marched in.",
    ripple: "Vietnam was split at the 17th parallel, and about a million people moved from north to south. That set the stage for the American War.",
    links: ["hl-1964"], sites: ["long-bien"],
    facts: ["10 October is still celebrated as Hanoi's Liberation Day."],
    wiki: "Long Biên Bridge",
  },
  {
    id: "hn-1972", city: "hanoi", year: "18–29 Dec 1972", sort: 1972.9, kind: "dark",
    title: "The Christmas Bombings", place: "Khâm Thiên street", lat: 21.0195, lng: 105.8365,
    summary: "For twelve days, US B-52s flew the heaviest bombing raids of the war against Hanoi and Hải Phòng. Khâm Thiên street was flattened on 26 December, and Bạch Mai Hospital was hit.",
    ripple: "Air defences brought down a number of B-52s. Within weeks the Paris Peace Accords were signed (January 1973) and US POWs began coming home.",
    links: ["hn-1973"], sites: ["b52-lake", "long-bien"],
    facts: ["Vietnam's official count for Hanoi is about 1,600 civilians killed.", "Vietnam calls the campaign 'Điện Biên Phủ in the air'.", "A memorial stands on Khâm Thiên street."],
    wiki: "Operation Linebacker II",
  },
  {
    id: "hn-1973", city: "hanoi", year: "Feb–Mar 1973", sort: 1973, kind: "pinnacle",
    title: "Operation Homecoming", place: "Gia Lâm airport", lat: 21.0405, lng: 105.886,
    summary: "591 American POWs were released after the Paris Peace Accords. Most were flown out of Hanoi's Gia Lâm airport.",
    ripple: "It closed America's combat chapter in Vietnam. Full diplomatic relations didn't follow until 1995.",
    links: ["hn-1986"], sites: ["hoa-lo"],
    facts: ["Hỏa Lò's museum displays items it says belonged to American prisoners."],
    wiki: "Operation Homecoming",
  },
  {
    id: "hn-1986", city: "hanoi", year: "1986", sort: 1986, kind: "pinnacle",
    title: "Đổi Mới: the renovation", place: "Ba Đình political quarter", lat: 21.0372, lng: 105.8375,
    summary: "The 6th Party Congress launched Đổi Mới ('renovation'), allowing private business, foreign investment and market prices.",
    ripple: "It took Vietnam from one of the world's poorest countries to one of its fastest-growing economies, and opened it to tourism like yours.",
    links: [], sites: [],
    facts: ["Hanoi's café and street-food boom took off after Đổi Mới legalized small private business."],
    wiki: "Đổi Mới",
  },

  // Ha Long / Lan Ha
  {
    id: "hl-938", city: "halong", year: "938", sort: 938, kind: "pinnacle",
    title: "Ngô Quyền's stakes at Bạch Đằng", place: "Bạch Đằng River", lat: 20.93, lng: 106.78,
    summary: "Ngô Quyền drove iron-tipped stakes into the riverbed. The Southern Han fleet sailed in at high tide, and when the tide fell their ships were impaled and wrecked.",
    ripple: "It ended roughly a thousand years of Chinese rule over northern Vietnam.",
    links: ["hl-1288"], sites: [],
    facts: ["Vietnamese commanders reused the same tidal trap 350 years later."],
    wiki: "Battle of Bạch Đằng (938)",
  },
  {
    id: "hl-1288", city: "halong", year: "1288", sort: 1288, kind: "pinnacle",
    title: "Trần Hưng Đạo sinks the Mongol fleet", place: "Bạch Đằng River (Quảng Yên)", lat: 20.915, lng: 106.8,
    summary: "Using the same stake-and-tide trap, Trần Hưng Đạo destroyed the Yuan (Mongol) fleet during the third Mongol invasion.",
    ripple: "It was one of the few defeats Kublai Khan's empire ever suffered. Trần Hưng Đạo is revered as a national saint, with temples across Vietnam.",
    links: [], sites: [],
    facts: ["Archaeologists have dug up the battle's stake fields near Quảng Yên."],
    wiki: "Battle of Bạch Đằng (1288)",
  },
  {
    id: "hl-1964", city: "halong", year: "Aug 1964", sort: 1964, kind: "dark",
    title: "The Gulf of Tonkin incident", place: "Gulf of Tonkin", lat: 20.2, lng: 107.2,
    summary: "USS Maddox clashed with North Vietnamese torpedo boats on 2 August. A second attack reported on 4 August almost certainly never happened, as declassified NSA records later showed.",
    ripple: "Congress passed the Gulf of Tonkin Resolution, giving President Johnson power to escalate. It opened the way to full US war in Vietnam.",
    links: ["hl-1972", "hn-1972"], sites: [],
    facts: ["Your cruise sails the northern edge of this same gulf."],
    wiki: "Gulf of Tonkin incident",
  },
  {
    id: "hl-1972", city: "halong", year: "May 1972", sort: 1972.4, kind: "dark",
    title: "Mining Hải Phòng harbour", place: "Hải Phòng approaches", lat: 20.86, lng: 106.69,
    summary: "Operation Pocket Money mined the approaches to Hải Phòng, North Vietnam's main port, cutting off supplies by sea.",
    ripple: "Together with the Linebacker bombing, it forced both sides back to the Paris talks.",
    links: ["hn-1972"], sites: [],
    facts: ["After the Paris Accords, the US Navy cleared the mines in Operation End Sweep (1973)."],
    wiki: "Operation Pocket Money",
  },
  {
    id: "hl-1979", city: "halong", year: "1978–1979", sort: 1978, kind: "dark",
    title: "The boat people leave the north", place: "Hạ Long / Hải Phòng coast", lat: 20.95, lng: 107.07,
    summary: "As tensions with China rose, large numbers of ethnic-Chinese Vietnamese left northern ports in crowded boats. Many headed for Hong Kong, and many died at sea.",
    ripple: "It set off an international refugee crisis and led to the 1979 Geneva conference on Indochinese refugees.",
    links: [], sites: [],
    facts: ["Hong Kong held Vietnamese refugees in camps until the last one closed in 2000."],
    wiki: "Vietnamese boat people",
  },
  {
    id: "hl-1994", city: "halong", year: "1994", sort: 1994, kind: "pinnacle",
    title: "Ha Long becomes World Heritage", place: "Ha Long Bay", lat: 20.91, lng: 107.18,
    summary: "UNESCO listed Ha Long Bay for its scenery and later for its geology. In 2023 the listing grew to include Cát Bà and Lan Hạ.",
    ripple: "Mass cruise tourism followed, which is why the better cruises now head for quieter Lan Hạ.",
    links: [], sites: ["cruise-kayak", "cave-visit"],
    facts: ["The bay has roughly 1,600 limestone islands and islets."],
    wiki: "Hạ Long Bay",
  },

  // Chiang Mai
  {
    id: "cm-1296", city: "chiangmai", year: "1296", sort: 1296, kind: "pinnacle",
    title: "Mangrai founds Chiang Mai", place: "Old City (Wat Chiang Man)", lat: 18.7939, lng: 98.9895,
    summary: "King Mangrai founded the 'new city' as the capital of the Lanna kingdom, inside the square moat you still drive around today.",
    ripple: "Lanna grew into a distinct northern kingdom whose script, temple style and dialect survive today.",
    links: [], sites: ["wat-phra-singh"],
    facts: ["Wat Chiang Man is said to be where Mangrai lived while the city was being built, which makes it Chiang Mai's oldest temple."],
    wiki: "Mangrai",
  },
  {
    id: "cm-1545", city: "chiangmai", year: "1545", sort: 1545, kind: "dark",
    title: "Earthquake topples Wat Chedi Luang", place: "Wat Chedi Luang", lat: 18.787, lng: 98.9867,
    summary: "An earthquake brought down the top of the great chedi, once the tallest structure in Lanna and the home of the Emerald Buddha.",
    ripple: "The Emerald Buddha was moved to Luang Prabang in 1552 and now sits in Bangkok's Wat Phra Kaew. A jade replica stands in Chiang Mai's chedi.",
    links: [], sites: ["wat-chedi-luang"],
    facts: ["The chedi's partial restoration in the 1990s is still debated, because some of the new work doesn't match Lanna style."],
    wiki: "Wat Chedi Luang",
  },
  {
    id: "cm-1558", city: "chiangmai", year: "1558", sort: 1558, kind: "dark",
    title: "The Burmese conquest", place: "Tha Phae Gate", lat: 18.7877, lng: 98.9933,
    summary: "Bayinnaung's Burmese army took Chiang Mai, beginning about two centuries of Burmese control and repeated war.",
    ripple: "Lanna was devastated, and Chiang Mai was left largely abandoned for about 20 years in the late 1700s until Kawila rebuilt it.",
    links: ["cm-1796"], sites: ["silver-temple"],
    facts: ["Burmese influence still shows in some temples, especially in Wua Lai's crafts and nearby Burmese-style wats."],
    wiki: "Lan Na",
  },
  {
    id: "cm-1796", city: "chiangmai", year: "1796", sort: 1796, kind: "pinnacle",
    title: "Kawila brings the city back", place: "Old City walls", lat: 18.7883, lng: 98.9853,
    summary: "Allied with Siam, Kawila pushed out the Burmese and moved people back into the empty city, often resettling war captives from other regions.",
    ripple: "Northern Thailand's mixed communities trace back to this resettlement. Lanna became a Siamese tributary and was fully absorbed in the early 1900s.",
    links: [], sites: ["silver-temple", "warorot"],
    facts: ["The Wua Lai silversmiths are often described as descendants of artisans resettled in this era."],
    wiki: "Kawila",
  },
  {
    id: "cm-1921", city: "chiangmai", year: "1921–22", sort: 1921, kind: "pinnacle",
    title: "The railway arrives", place: "Chiang Mai railway station", lat: 18.7845, lng: 99.0167,
    summary: "The northern line from Bangkok reached Chiang Mai, cutting a river journey of several weeks down to about a day.",
    ripple: "It tied Lanna's economy to Bangkok and, eventually, to mass tourism.",
    links: [], sites: ["warorot"],
    facts: ["Warorot Market grew as the trading hub for goods moving between the river, the railway and the hill country."],
    wiki: "Chiang Mai railway station",
  },
  {
    id: "cm-1989", city: "chiangmai", year: "1989", sort: 1989, kind: "dark",
    title: "The logging ban leaves elephants jobless", place: "Mae Taeng valley", lat: 19.2165, lng: 98.8584,
    summary: "After deadly floods in 1988 were blamed on deforestation, Thailand banned commercial logging. Thousands of working elephants and their mahouts lost their living almost overnight.",
    ripple: "Elephants were pushed into street begging, riding camps and shows. In response, welfare-focused sanctuaries appeared, such as Elephant Nature Park in the 1990s. That's why your observation-only rule matters.",
    links: [], sites: ["elephant"],
    facts: ["Experts say 'no riding' isn't enough on its own. Bathing and hand-feeding programs can still involve harsh training."],
    wiki: "Elephants in Thailand",
  },

  // Railay / Krabi
  {
    id: "rl-legend", city: "railay", year: "Legend", sort: 0, kind: "legend",
    title: "Phra Nang, the sea princess", place: "Phra Nang Cave", lat: 8.0058, lng: 98.8382,
    summary: "Local legend says a princess lost at sea lives on in the cave. Fishermen leave offerings for fertility and a safe catch, including hundreds of carved wooden phalluses.",
    ripple: "It's one of the few places where the peninsula's fishing-village roots still show.",
    links: [], sites: ["phra-nang"],
    facts: ["Leave the offerings alone. The shrine is still active."],
    wiki: "Railay Beach",
  },
  {
    id: "rl-1980s", city: "railay", year: "Late 1980s", sort: 1988, kind: "pinnacle",
    title: "Climbers discover Railay", place: "Railay East walls", lat: 8.01, lng: 98.841,
    summary: "Foreign climbers started bolting the limestone in the late 1980s, turning a fishing and coconut area into one of the world's best-known sport-climbing spots.",
    ripple: "It shaped Railay's backpacker and climbing culture, with Tonsai as its scruffy base camp.",
    links: [], sites: ["climbing", "tonsai"],
    facts: ["Salt air corrodes bolts fast, so local groups rebolt routes with titanium."],
    wiki: "Railay Beach",
  },
  {
    id: "rl-2000", city: "railay", year: "2000", sort: 2000, kind: "pinnacle",
    title: "The Beach makes Maya Bay famous", place: "Maya Bay, Phi Phi Leh", lat: 7.6782, lng: 98.7653,
    summary: "The Leonardo DiCaprio film turned Maya Bay into a global icon. At its peak, thousands of people a day crowded the small beach.",
    ripple: "The crowds and boats destroyed much of the coral, setting up the bay's closure in 2018.",
    links: ["rl-2018"], sites: ["phi-phi"],
    facts: ["The film crew's landscaping of the beach caused controversy and a lawsuit in Thailand."],
    wiki: "Maya Bay",
  },
  {
    id: "rl-2004", city: "railay", year: "26 Dec 2004", sort: 2004, kind: "dark",
    title: "The Indian Ocean tsunami", place: "Phi Phi Don isthmus", lat: 7.7407, lng: 98.7784,
    summary: "Waves hit Phi Phi Don's narrow isthmus from both bays and destroyed much of the village. Thailand's death toll was more than 5,000, including around 2,000 foreign visitors.",
    ripple: "It led to the Indian Ocean Tsunami Warning System (2006), which is behind the blue evacuation-route signs you'll see across Krabi and Phi Phi.",
    links: [], sites: ["phi-phi"],
    facts: ["Phi Phi was rebuilt in only a few years. Some say it came back denser than before."],
    wiki: "2004 Indian Ocean earthquake and tsunami",
  },
  {
    id: "rl-2018", city: "railay", year: "2018–2022", sort: 2018, kind: "pinnacle",
    title: "Maya Bay closes to heal", place: "Maya Bay", lat: 7.6795, lng: 98.766,
    summary: "The bay was closed so its reefs and blacktip reef sharks could recover. Replanted coral and returning sharks made it a rare tourism recovery story.",
    ripple: "It reopened in 2022 with daily visitor caps, no boats in the bay and no swimming. That's why your Phi Phi tour lands at the back and you walk in.",
    links: [], sites: ["phi-phi"],
    facts: ["Blacktip reef sharks returned to the bay's shallows within months of the closure."],
    wiki: "Maya Bay",
  },
]

export const HISTORY_BY_ID: Record<string, HistoryEvent> = Object.fromEntries(HISTORY.map((h) => [h.id, h]))

export interface CityGuide {
  explore: string
  culture: string[]
  localView: string
}

export const GUIDES: Record<Exclude<CityId, "transit">, CityGuide> = {
  hanoi: {
    explore: "Stay in the Old Quarter and explore on foot early, before the heat and traffic build. Use Grab for West Lake, Ba Đình and the Citadel. Hanoi lives on the sidewalk, and tiny plastic stools usually mean good food.",
    culture: [
      "Hand money and cards over with both hands. It's a small courtesy that people notice.",
      "Bargain in markets with a smile. Shops with marked prices don't haggle.",
      "Don't touch people's heads, and don't point with your feet.",
      "War history here is told from the Vietnamese side. Listen, and skip the political arguments.",
    ],
    localView: "Hanoians are mostly warm and curious toward visitors, Americans included, especially younger people. Older residents remember the war, but hostility is rare. Overtourism friction centres on Train Street and loud groups in residential alleys.",
  },
  ninhbinh: {
    explore: "Pair the headline sites (Tràng An, Mua Cave) with a bike loop on the back lanes of Tam Cốc. Go early or late to avoid the midday tour buses.",
    culture: [
      "The rowers, often women from local villages, are paid little, so tip them directly.",
      "Pagodas are active places of worship. Speak quietly and keep shoulders covered.",
    ],
    localView: "Tourism has changed village incomes fast. Most locals welcome visitors who spend in family homestays and cafés rather than only on bus tours.",
  },
  halong: {
    explore: "Spend your time in Lan Hạ (via Cát Bà) rather than central Ha Long. It has fewer boats and better kayaking. Let the crew decide timing around tides.",
    culture: [
      "Floating-village communities were largely moved onshore in 2014. Visits now are mostly reconstructed or day-only.",
      "Tip the crew at the end in an envelope rather than handing cash to individuals.",
    ],
    localView: "The cruise economy is the region's main employer. Crews are proud of the bay and will share stories if you ask about their home islands.",
  },
  chiangmai: {
    explore: "Explore the Old City temples on foot in the mornings, Nimman cafés in the afternoon, and the markets at night. Use red songthaews or Grab to reach the mountains.",
    culture: [
      "Take shoes off for temples and homes, and cover shoulders and knees.",
      "Women shouldn't touch monks or hand things to them directly. Place offerings down instead.",
      "The monarchy is deeply respected and protected by law, so avoid jokes or criticism.",
      "Monk Chat is an invitation to ask anything. Monks are glad to practise English.",
    ],
    localView: "Chiang Mai likes slow travellers and digital nomads but is tired of 'elephant-ride' tourism and burning-season indifference. Visitors who eat local and ask about Lanna get a warm welcome.",
  },
  railay: {
    explore: "Railay is all about tides. Plan the beaches, Tonsai crossings and lagoon trips around them, and use longtails for anything beyond walking distance.",
    culture: [
      "Krabi is largely Muslim. Dress modestly away from the beach, especially around villages.",
      "Leave Phra Nang Cave offerings alone. The shrine is still active.",
      "Topless sunbathing is illegal and offensive here.",
    ],
    localView: "Locals depend on tourism but resent day-trip crowds that leave trash. Small longtail operators value direct, respectful bookings over big-agency deals.",
  },
}
