-- Fix timestamp column names: migration used snake_case but Drizzle schema uses camelCase
ALTER TABLE "product_option" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "product_option" RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "product_variant" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "product_variant" RENAME COLUMN "updated_at" TO "updatedAt";