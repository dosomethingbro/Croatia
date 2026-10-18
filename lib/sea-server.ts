import { pool } from "@/lib/db"

export const SEA_TRIP = "sea"
export const PEOPLE = new Set(["tobi", "luke"])
export const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

// Same optional passphrase gate as Honolulu: set SEA_TRIP_SECRET (or the shared
// HONOLULU_TRIP_SECRET) to require a matching `x-trip-key` header on writes.
export function writeAllowed(req: Request): boolean {
  const secret = process.env.SEA_TRIP_SECRET || process.env.HONOLULU_TRIP_SECRET
  if (!secret) return true
  return req.headers.get("x-trip-key") === secret
}

export async function q<T = any>(text: string, params: unknown[] = []): Promise<T[]> {
  const res = await pool.query(text, params)
  return res.rows as T[]
}
