import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

// Shared trip checklist. This dashboard represents a single shared trip, so
// there is one row per checklist item that every viewer reads and writes.
export const checklistState = pgTable("checklist_state", {
  itemId: text("item_id").primaryKey(),
  done: boolean("done").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
