"use server"

import { db } from "@/lib/db"
import { checklistState } from "@/lib/db/schema"
import { CHECKLIST } from "@/lib/trip-data"

const VALID_IDS = new Set(CHECKLIST.map((c) => c.id))

export async function getChecklist(): Promise<Record<string, boolean>> {
  const rows = await db.select().from(checklistState)
  const map: Record<string, boolean> = {}
  for (const row of rows) {
    if (VALID_IDS.has(row.itemId)) map[row.itemId] = row.done
  }
  return map
}

export async function setChecklistItem(itemId: string, done: boolean): Promise<Record<string, boolean>> {
  // Validate against known item ids so arbitrary rows can't be written.
  if (!VALID_IDS.has(itemId)) {
    throw new Error("Unknown checklist item")
  }

  await db
    .insert(checklistState)
    .values({ itemId, done, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: checklistState.itemId,
      set: { done, updatedAt: new Date() },
    })

  return getChecklist()
}
