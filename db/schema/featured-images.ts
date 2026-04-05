import {pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/schema/columns.helpers";

export const featuredImages = pgTable("featured_images", {
    id: serial("id").primaryKey(),
    image: varchar("image", {length: 255}).notNull(),
    title: varchar("title", {length: 100}).notNull(),
    subtitle: varchar("subtitle", {length: 100}).notNull(),
    cta: varchar("cta", {length: 50}).notNull(),
    ctaLink: varchar("cta_link", {length: 255}).notNull(),
    ...timestamps
});


export type FeaturedImage = typeof featuredImages.$inferSelect