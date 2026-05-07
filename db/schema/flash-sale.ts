import {pgTable, serial, varchar, timestamp, boolean, integer, decimal, pgEnum} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/schema/columns.helpers";
import {relations} from "drizzle-orm";
import {product} from "./product";

// ── Enums ──

export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed"]);

// ── Flash Sale Campaign ──

export const flashSale = pgTable("flash_sale", {
    id: serial("id").primaryKey(),
    title: varchar("title", {length: 150}).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps,
});

// ── Flash Sale Items (junction: which products are in which sale) ──

export const flashSaleItem = pgTable("flash_sale_item", {
    id: serial("id").primaryKey(),
    flashSaleId: integer("flash_sale_id")
        .notNull()
        .references(() => flashSale.id, {onDelete: "cascade"}),
    productId: integer("product_id")
        .notNull()
        .references(() => product.id, {onDelete: "cascade"}),
    discountType: discountTypeEnum("discount_type").notNull(),
    discountValue: decimal("discount_value", {precision: 10, scale: 2}).notNull(),
    ...timestamps,
});

// ── Relations ──

export const flashSaleRelations = relations(flashSale, ({many}) => ({
    items: many(flashSaleItem),
}));

export const flashSaleItemRelations = relations(flashSaleItem, ({one}) => ({
    flashSale: one(flashSale, {
        fields: [flashSaleItem.flashSaleId],
        references: [flashSale.id],
    }),
    product: one(product, {
        fields: [flashSaleItem.productId],
        references: [product.id],
    }),
}));

// ── Types ──

export type FlashSale = typeof flashSale.$inferSelect;
export type NewFlashSale = typeof flashSale.$inferInsert;
export type FlashSaleItem = typeof flashSaleItem.$inferSelect;
export type NewFlashSaleItem = typeof flashSaleItem.$inferInsert;
