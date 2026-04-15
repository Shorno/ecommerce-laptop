import {boolean, integer, pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/schema/columns.helpers";
import {user} from "@/db/schema/auth-schema";
import {product} from "@/db/schema/product";
import {relations} from "drizzle-orm";

export const review = pgTable("review", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", {length: 255})
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}),
    productId: integer("product_id")
        .notNull()
        .references(() => product.id, {onDelete: "cascade"}),
    rating: integer("rating").notNull(), // 1-5
    title: varchar("title", {length: 200}),
    body: text("body"),
    isApproved: boolean("is_approved").default(false).notNull(),
    ...timestamps
});

export const reviewRelations = relations(review, ({one}) => ({
    user: one(user, {
        fields: [review.userId],
        references: [user.id],
    }),
    product: one(product, {
        fields: [review.productId],
        references: [product.id],
    }),
}));

export type Review = typeof review.$inferSelect;
export type NewReview = typeof review.$inferInsert;
