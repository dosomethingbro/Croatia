"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { ROUTE, type RouteStop } from "@/lib/trip-data"
import { useEffect } from "react"

const KIND_COLOR: Record<RouteStop["kind"], string> = {
  origin: "#9da7b2",
  base: "#80aef7",
  excursion: "#f0c36c",
  cruise: "#62c6bd",
  beach: "#73d69a",
  home: "#9da7b2",
}

// Only the in-country Asian stops get plotted (skip trans-Pacific SF endpoints)
const ASIA_STOPS = ROUTE.filter((s) => s.kind !== "origin" && s.kind !== "home")

function markerIcon(color: string, label: number) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:26px;height:26px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:${color};
      box-shadow:0 4px 12px rgba(0,0,0,.5);
      display:flex;align-items:center;justify-content:center;
      border:2px solid rgba(255,255,255,.85);">
      <span style="transform:rotate(45deg);font-size:12px;font-weight:800;color:#0c0f13;">${label}</span>
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 24],
    popupAnchor: [0, -22],
  })
}

function FitBounds({ stops }: { stops: RouteStop[] }) {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds(stops.map((s) => s.coords))
    map.fitBounds(bounds, { padding: [48, 48] })
  }, [map, stops])
  return null
}

export default function RouteMap() {
  return (
    <MapContainer
      center={[15, 103]}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Polyline
        positions={ASIA_STOPS.map((s) => s.coords)}
        pathOptions={{ color: "#80aef7", weight: 2.5, opacity: 0.85, dashArray: "6 8" }}
      />
      {ASIA_STOPS.map((s, i) => (
        <Marker key={s.name} position={s.coords} icon={markerIcon(KIND_COLOR[s.kind], i + 1)}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <strong>{s.name}</strong>
              <br />
              <span style={{ color: "#555" }}>{s.when}</span>
            </div>
          </Popup>
        </Marker>
      ))}
      <FitBounds stops={ASIA_STOPS} />
    </MapContainer>
  )
}
