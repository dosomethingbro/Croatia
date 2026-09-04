import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Live Waikīkī weather + sunset via Open-Meteo (no API key required).
// Maps the forecast into the console's four-state weather model and returns the
// sunset ISO time so the client can run a real countdown. Falls back gracefully.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const lat = url.searchParams.get("lat") || "21.2793"
  const lng = url.searchParams.get("lng") || "-157.8292"

  try {
    const api =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,precipitation,weather_code,is_day` +
      `&hourly=precipitation_probability,weather_code` +
      `&daily=sunrise,sunset&timezone=auto&forecast_days=1&temperature_unit=fahrenheit`

    const res = await fetch(api, { signal: AbortSignal.timeout(6000), next: { revalidate: 0 } })
    if (!res.ok) throw new Error(`open-meteo ${res.status}`)
    const j: any = await res.json()

    const code = j.current?.weather_code ?? 0
    const precipNow = j.current?.precipitation ?? 0
    const tempF = Math.round(j.current?.temperature_2m ?? 0)

    // Next ~2h max precip probability -> "rain-soon".
    const probs: number[] = j.hourly?.precipitation_probability ?? []
    const soon = Math.max(0, ...probs.slice(0, 3))

    let weather: "clear" | "cloudy" | "rain-soon" | "raining"
    if (precipNow > 0.02 || code >= 61) weather = "raining"
    else if (soon >= 55) weather = "rain-soon"
    else if (code >= 2) weather = "cloudy"
    else weather = "clear"

    return NextResponse.json({
      ok: true,
      weather,
      tempF,
      soonProb: soon,
      sunset: j.daily?.sunset?.[0] ?? null,
      sunrise: j.daily?.sunrise?.[0] ?? null,
      timezone: j.timezone ?? "Pacific/Honolulu",
      source: "open-meteo",
    })
  } catch {
    // Graceful fallback — the console still works, driven by the Sim panel.
    return NextResponse.json({
      ok: false,
      weather: "clear",
      tempF: 84,
      soonProb: 0,
      sunset: null,
      sunrise: null,
      timezone: "Pacific/Honolulu",
      source: "fallback",
    })
  }
}
