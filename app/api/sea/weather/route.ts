import { NextResponse } from "next/server"
import { CITIES, type CityId } from "@/lib/sea"

export const dynamic = "force-dynamic"

// Live weather for the active city via Open-Meteo (no key). Returns the console's
// four-state weather model plus a 7-day outlook, sunrise and sunset.
export async function GET(req: Request) {
  const id = (new URL(req.url).searchParams.get("city") || "hanoi") as CityId
  const city = CITIES[id] && id !== "transit" ? CITIES[id] : CITIES.hanoi
  const [lat, lng] = city.center

  try {
    const api =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,precipitation,weather_code` +
      `&hourly=precipitation_probability` +
      `&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
      `&timezone=auto&forecast_days=7`
    const res = await fetch(api, { signal: AbortSignal.timeout(6000), cache: "no-store" })
    if (!res.ok) throw new Error(`open-meteo ${res.status}`)
    const j: any = await res.json()

    const code = j.current?.weather_code ?? 0
    const precipNow = j.current?.precipitation ?? 0
    const nowIdx = Math.max(0, (j.hourly?.time ?? []).findIndex((t: string) => t >= (j.current?.time ?? "")))
    const soon = Math.max(0, ...((j.hourly?.precipitation_probability ?? []).slice(nowIdx, nowIdx + 3) as number[]))

    let weather: "clear" | "cloudy" | "rain-soon" | "raining"
    if (precipNow > 0.05 || (code >= 61 && code <= 99)) weather = "raining"
    else if (soon >= 55) weather = "rain-soon"
    else if (code >= 2) weather = "cloudy"
    else weather = "clear"

    const d = j.daily ?? {}
    const outlook = (d.time ?? []).map((t: string, i: number) => ({
      date: t,
      hi: Math.round(d.temperature_2m_max?.[i] ?? 0),
      lo: Math.round(d.temperature_2m_min?.[i] ?? 0),
      rain: d.precipitation_probability_max?.[i] ?? 0,
      code: d.weather_code?.[i] ?? 0,
    }))

    return NextResponse.json({
      ok: true,
      city: city.id,
      weather,
      tempC: Math.round(j.current?.temperature_2m ?? 0),
      soonProb: soon,
      sunrise: d.sunrise?.[0] ?? null,
      sunset: d.sunset?.[0] ?? null,
      outlook,
      source: "open-meteo",
    })
  } catch {
    return NextResponse.json({ ok: false, city: city.id, weather: "clear", tempC: null, soonProb: 0, sunrise: null, sunset: null, outlook: [], source: "fallback" })
  }
}
