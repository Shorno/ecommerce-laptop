-- Custom migration: Product Variant System
-- This is a destructive migration that removes legacy pricing/stock from product
-- and introduces product_option + product_variant tables.

-- 1. Create product_option table
CREATE TABLE IF NOT EXISTS "product_option" (
    "id" serial PRIMARY KEY NOT NULL,
    "product_id" integer NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
    "name" varchar(100) NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "values" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- 2. Create product_variant table
CREATE TABLE IF NOT EXISTS "product_variant" (
    "id" serial PRIMARY KEY NOT NULL,
    "product_id" integer NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
    "sku" varchar(50),
    "price" numeric(10, 2) NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL,
    "in_stock" boolean DEFAULT true NOT NULL,
    "option_values" text,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- 3. Add min_price to product (denormalized display price)
ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "min_price" numeric(10, 2);

-- 4. Drop legacy columns from product
ALTER TABLE "product" DROP COLUMN IF EXISTS "price";
ALTER TABLE "product" DROP COLUMN IF EXISTS "size";
ALTER TABLE "product" DROP COLUMN IF EXISTS "stock_quantity";
ALTER TABLE "product" DROP COLUMN IF EXISTS "in_stock";

-- 5. Add variant_id to cart_item
ALTER TABLE "cart_item" ADD COLUMN IF NOT EXISTS "variant_id" integer NOT NULL DEFAULT 0;
-- Remove the default after adding
ALTER TABLE "cart_item" ALTER COLUMN "variant_id" DROP DEFAULT;
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_variant_id_product_variant_id_fk"
    FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE;

-- 6. Modify order_item: drop product_size, add variant fields
ALTER TABLE "order_item" DROP COLUMN IF EXISTS "product_size";
ALTER TABLE "order_item" ADD COLUMN IF NOT EXISTS "variant_id" integer;
ALTER TABLE "order_item" ADD COLUMN IF NOT EXISTS "variant_label" varchar(150) NOT NULL DEFAULT '';
-- Remove the default after adding
ALTER TABLE "order_item" ALTER COLUMN "variant_label" DROP DEFAULT;

-- 7. Clear existing cart data (schema changed, old items invalid)
DELETE FROM "cart_item";
DELETE FROM "cart";