import {integer, pgTable, serial, varchar, boolean, decimal, text} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/schema/columns.helpers";
import {relations} from "drizzle-orm";
import {category, subCategory} from "./category";
import {brand} from "./brand";

export const product = pgTable("product", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 150}).notNull(),
    slug: varchar("slug", {length: 150}).notNull().unique(),
    categoryId: integer("category_id")
        .notNull()
        .references(() => category.id, {onDelete: "cascade"}),
    subCategoryId: integer("sub_category_id")
        .references(() => subCategory.id, {onDelete: "set null"}),
    brandId: integer("brand_id")
        .references(() => brand.id, {onDelete: "set null"}),

    image: varchar("image", {length: 255}).notNull(),

    isFeatured: boolean("is_featured").default(false).notNull(),

    keyFeatures: text("key_features"),
    description: text("description"),
    specifications: text("specifications"),

    // Denormalized — auto-synced to MIN(variant.price) on save
    minPrice: decimal("min_price", {precision: 10, scale: 2}),

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

export const productOption = pgTable("product_option", {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
        .notNull()
        .references(() => product.id, {onDelete: "cascade"}),
    name: varchar("name", {length: 100}).notNull(),
    position: integer("position").default(0).notNull(),
    values: text("values").notNull(), // JSON string array: ["16GB/512GB","24GB/512GB"]
    ...timestamps
});

export const productVariant = pgTable("product_variant", {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
        .notNull()
        .references(() => product.id, {onDelete: "cascade"}),
    sku: varchar("sku", {length: 50}),
    price: decimal("price", {precision: 10, scale: 2}).notNull(),
    stock: integer("stock").default(0).notNull(),
    inStock: boolean("in_stock").default(true).notNull(),
    optionValues: text("option_values"), // JSON: {"RAM / Storage":"16GB/512GB","Color":"Silver"} or null for default variant
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps
});

// ── Relations ──

export const productRelations = relations(product, ({one, many}) => ({
    category: one(category, {
        fields: [product.categoryId],
        references: [category.id]
    }),
    subCategory: one(subCategory, {
        fields: [product.subCategoryId],
        references: [subCategory.id]
    }),
    brand: one(brand, {
        fields: [product.brandId],
        references: [brand.id]
    }),
    images: many(productImage),
    options: many(productOption),
    variants: many(productVariant),
}));

export const productImageRelations = relations(productImage, ({one}) => ({
    product: one(product, {
        fields: [productImage.productId],
        references: [product.id]
    })
}));

export const productOptionRelations = relations(productOption, ({one}) => ({
    product: one(product, {
        fields: [productOption.productId],
        references: [product.id]
    })
}));

export const productVariantRelations = relations(productVariant, ({one}) => ({
    product: one(product, {
        fields: [productVariant.productId],
        references: [product.id]
    })
}));

export type Product = typeof product.$inferSelect;
export type ProductImage = typeof productImage.$inferSelect;
export type ProductOption = typeof productOption.$inferSelect;
export type ProductVariant = typeof productVariant.$inferSelect;
export type NewProduct = typeof product.$inferInsert;
export type NewProductImage = typeof productImage.$inferInsert;
export type NewProductOption = typeof productOption.$inferInsert;
export type NewProductVariant = typeof productVariant.$inferInsert;

export interface ProductWithRelations extends Product {
    category: {
        name: string;
        slug: string;
    };
    subCategory?: {
        name: string;
    } | null;
    brand?: {
        id: number;
        name: string;
    } | null;
    images?: ProductImage[];
    options?: ProductOption[];
    variants?: ProductVariant[];
}
