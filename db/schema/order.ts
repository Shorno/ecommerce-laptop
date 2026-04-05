import {
    pgTable,
    serial,
    varchar,
    decimal,
    timestamp,
    pgEnum,
    integer,
} from "drizzle-orm/pg-core";
import { timestamps } from "@/db/schema/columns.helpers";
import {product} from "@/db/schema/product";
import {InferEnum, relations} from "drizzle-orm";
import {payment} from "@/db/schema/payment";


export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded"
]);

export type OrderStatus = InferEnum<typeof orderStatusEnum>;

export const order = pgTable("order", {
    id: serial("id").primaryKey(),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    userId: varchar("user_id", { length: 255 }).notNull(),

    // Order Status
    status: orderStatusEnum("status").default("pending").notNull(),

    // Pricing
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).default("0").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

    // Contact Info
    customerFullName: varchar("customer_full_name", { length: 200 }).notNull(),
    customerEmail: varchar("customer_email", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 20 }).notNull(),

    // Shipping Address (denormalized for historical record)
    shippingAddressLine: varchar("shipping_address_line", { length: 255 }).notNull(),
    shippingCity: varchar("shipping_city", { length: 100 }).notNull(),
    shippingArea: varchar("shipping_area", { length: 100 }),
    shippingPostalCode: varchar("shipping_postal_code", { length: 20 }).notNull(),
    shippingCountry: varchar("shipping_country", { length: 2 }).default("BD").notNull(),

    // Billing Address (denormalized for historical record)
    // billingFullName: varchar("billing_full_name", { length: 200 }).notNull(),
    // billingPhone: varchar("billing_phone", { length: 20 }).notNull(),
    // billingAddressLine1: varchar("billing_address_line1", { length: 255 }).notNull(),
    // billingAddressLine2: varchar("billing_address_line2", { length: 255 }),
    // billingCity: varchar("billing_city", { length: 100 }).notNull(),
    // billingArea: varchar("billing_area", { length: 100 }),
    // billingPostalCode: varchar("billing_postal_code", { length: 20 }).notNull(),
    // billingCountry: varchar("billing_country", { length: 2 }).default("BD").notNull(),


    // Coupon/Promo
    // couponCode: varchar("coupon_code", { length: 50 }),

    // Timestamps
    confirmedAt: timestamp("confirmed_at"),
    shippedAt: timestamp("shipped_at"),
    deliveredAt: timestamp("delivered_at"),
    cancelledAt: timestamp("cancelled_at"),

    ...timestamps
});


export const orderItem = pgTable("order_item", {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
        .notNull()
        .references(() => order.id, { onDelete: "cascade" }),
    productId: integer("product_id")
        .notNull()
        .references(() => product.id, { onDelete: "restrict" }),

    // Product snapshot at time of order
    productName: varchar("product_name", { length: 150 }).notNull(),
    productSize: varchar("product_size", { length: 50 }).notNull(),
    productImage: varchar("product_image", { length: 255 }).notNull(),

    quantity: integer("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

    ...timestamps
});


export const orderRelations = relations(order, ({ many, one }) => ({
    items: many(orderItem),
    payment: one(payment, {
        fields: [order.id],
        references: [payment.orderId]
    }),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
    order: one(order, {
        fields: [orderItem.orderId],
        references: [order.id]
    }),
    product: one(product, {
        fields: [orderItem.productId],
        references: [product.id]
    })
}));



export type Order = typeof order.$inferSelect;
export type OrderItem = typeof orderItem.$inferSelect;
