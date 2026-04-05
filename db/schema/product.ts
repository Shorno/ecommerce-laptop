import {integer, pgTable, serial, varchar, boolean, decimal} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/schema/columns.helpers";
import {relations} from "drizzle-orm";
import {category, subCategory} from "./category";

export const product = pgTable("product", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 150}).notNull(),
    slug: varchar("slug", {length: 150}).notNull().unique(),
    categoryId: integer("category_id")
        .notNull()
        .references(() => category.id, {onDelete: "cascade"}),
    subCategoryId: integer("sub_category_id")
        .references(() => subCategory.id, {onDelete: "set null"}),

    size: varchar("size", {length: 50}).notNull(),
    price: decimal("price", {precision: 10, scale: 2}).notNull(),

    stockQuantity: integer("stock_quantity").default(0).notNull(),

    image: varchar("image", {length: 255}).notNull(),


    inStock: boolean("in_stock").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),

    ...timestamps
});

export const productImage = pgTable("product_image", {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
        .notNull()
        .references(() => product.id, {onDelete: "cascade"}),
    imageUrl: varchar("image_url", {length: 255}).notNull(),
    ...timestamps
});

export const productRelations = relations(product, ({one, many}) => ({
    category: one(category, {
        fields: [product.categoryId],
        references: [category.id]
    }),
    subCategory: one(subCategory, {
        fields: [product.subCategoryId],
        references: [subCategory.id]
    }),
    images: many(productImage)
}));

export const productImageRelations = relations(productImage, ({one}) => ({
    product: one(product, {
        fields: [productImage.productId],
        references: [product.id]
    })
}));

export type Product = typeof product.$inferSelect;
export type ProductImage = typeof productImage.$inferSelect;
export type NewProduct = typeof product.$inferInsert;
export type NewProductImage = typeof productImage.$inferInsert;

export interface ProductWithRelations extends Product {
    category: {
        name: string;
        slug: string;
    };
    subCategory?: {
        name: string;
    } | null;
    images?: ProductImage[];
}
