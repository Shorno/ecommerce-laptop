import {decimal, integer, pgTable, serial, timestamp, varchar} from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers";
import {product} from "@/db/schema/product";
import { relations } from "drizzle-orm";


export const cart = pgTable("cart", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }),
    expiresAt: timestamp("expires_at"),
    ...timestamps
});

export const cartItem = pgTable("cart_item", {
    id: serial("id").primaryKey(),
    cartId: integer("cart_id")
        .notNull()
        .references(() => cart.id, { onDelete: "cascade" }),
    productId: integer("product_id")
        .notNull()
        .references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    priceAtAdd: decimal("price_at_add", { precision: 10, scale: 2 }).notNull(),
    ...timestamps
});

export const cartRelations = relations(cart, ({ many }) => ({
    items: many(cartItem),
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
    cart: one(cart, {
        fields: [cartItem.cartId],
        references: [cart.id],
    }),
    product: one(product, {
        fields: [cartItem.productId],
        references: [product.id],
    }),
}));
