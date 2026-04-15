import {pgTable, text, varchar} from "drizzle-orm/pg-core"
import {timestamps} from "@/db/schema/columns.helpers"

/**
 * Key-value store for site-wide settings.
 * Each row stores one setting identified by a unique key.
 */
export const storeSetting = pgTable("store_setting", {
    key: varchar("key", {length: 100}).primaryKey(),
    value: text("value").notNull().default(""),
    ...timestamps,
})

export type StoreSetting = typeof storeSetting.$inferSelect
