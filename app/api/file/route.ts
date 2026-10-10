import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// The Blob store is public, so photos are stored with their full public URL in the
// `pathname` column. This route keeps the stable /api/file?pathname=... contract the
// frontend uses: if it already has a full URL, redirect straight to it; otherwise
// treat the value as a legacy pathname and 404 (no private store to read from).
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname")
  if (!pathname) return NextResponse.json({ error: "Missing pathname" }, { status: 400 })

  if (/^https?:\/\//i.test(pathname)) {
    return NextResponse.redirect(pathname, 302)
  }

  // Legacy value that isn't a full URL — nothing to serve from a public store.
  return new NextResponse("Not found", { status: 404 })
}
