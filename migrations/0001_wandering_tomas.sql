CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled');--> statement-breakpoint
CREATE TABLE "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"expires_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"cart_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price_at_add" numeric(10, 2) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"image" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sub_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"category_id" integer NOT NULL,
	"image" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sub_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "customer_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"full_name" varchar(200) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"address_line1" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"area" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(2) DEFAULT 'BD' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "featured_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" varchar(255) NOT NULL,
	"title" varchar(100) NOT NULL,
	"subtitle" varchar(100) NOT NULL,
	"cta" varchar(50) NOT NULL,
	"cta_link" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"category_id" integer NOT NULL,
	"sub_category_id" integer,
	"size" varchar(50) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"image" varchar(255) NOT NULL,
	"in_stock" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"customer_full_name" varchar(200) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(20) NOT NULL,
	"shipping_address_line" varchar(255) NOT NULL,
	"shipping_city" varchar(100) NOT NULL,
	"shipping_area" varchar(100),
	"shipping_postal_code" varchar(20) NOT NULL,
	"shipping_country" varchar(2) DEFAULT 'BD' NOT NULL,
	"confirmed_at" timestamp,
	"shipped_at" timestamp,
	"delivered_at" timestamp,
	"cancelled_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "order_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"product_name" varchar(150) NOT NULL,
	"product_size" varchar(50) NOT NULL,
	"product_image" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"transaction_id" varchar(255),
	"payment_method" varchar(50) NOT NULL,
	"payment_provider" varchar(50) DEFAULT 'sslcommerz',
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'BDT' NOT NULL,
	"sender_number" varchar(20),
	"receiver_number" varchar(20),
	"completed_at" timestamp,
	"failed_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_category" ADD CONSTRAINT "sub_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_sub_category_id_sub_category_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE restrict ON UPDATE no action;