"use client"

import { useEffect } from "react"

// The actual app is the static single-file experience at /dubrovnik.html.
// This root route immediately forwards there so the v0 preview (which loads "/")
// lands on the app instead of an empty React route.
export default function Home() {
  useEffect(() => {
    window.location.replace("/dubrovnik.html")
  }, [])

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D131A",
        color: "#C9C2B4",
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      <p>
        Loading&hellip; <a href="/dubrovnik.html" style={{ color: "#C9A24B" }}>Enter</a>
      </p>
    </main>
  )
}
