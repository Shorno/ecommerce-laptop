import {pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/schema/columns.helpers";
import {user} from "@/db/schema/auth-schema";
import {relations} from "drizzle-orm";

export const customerAddress = pgTable("customer_address", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 200 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    addressLine: varchar("address_line1", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    area: varchar("area", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    country: varchar("country", { length: 2 }).default("BD").notNull(),

    ...timestamps
});


export const customerAddressRelations = relations(customerAddress, ({ one }) => ({
    user: one(user, {
        fields: [customerAddress.userId],
        references: [user.id],
    }),
}));

export type CustomerAddress = typeof customerAddress.$inferSelect
