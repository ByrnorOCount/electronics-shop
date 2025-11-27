-- This file provides a complete snapshot of the database schema.
-- It is intended for documentation and reference purposes only.
-- Do not execute this file directly if you are using the Knex migration system.
-- Last updated after: 20251114121700_add_password_changed_at_to_users.js

-- Drop tables in reverse order of creation to handle foreign key constraints
DROP TABLE IF EXISTS "support_ticket_replies";
DROP TABLE IF EXISTS "support_tickets";
DROP TABLE IF EXISTS "notifications";
DROP TABLE IF EXISTS "wishlists";
DROP TABLE IF EXISTS "cart_items";
DROP TABLE IF EXISTS "order_items";
DROP TABLE IF EXISTS "orders";
DROP TABLE IF EXISTS "products";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "categories";

-- Table: categories
CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "description" VARCHAR(255),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: users
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password_hash" VARCHAR(255),
  "role" VARCHAR(255) NOT NULL DEFAULT 'user' CHECK (role IN ('Customer', 'Staff', 'Admin', 'user', 'staff', 'admin')),
  "is_verified" BOOLEAN DEFAULT false,
  "email_verification_token" VARCHAR(255),
  "password_reset_token" VARCHAR(255),
  "password_reset_expires" TIMESTAMPTZ,
  "password_changed_at" TIMESTAMPTZ,
  "otp_hash" VARCHAR(255),
  "otp_expires" TIMESTAMPTZ,
  "provider" VARCHAR(255) NOT NULL DEFAULT 'local', -- 'local', 'google', 'facebook', etc.
  "provider_id" VARCHAR(255),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("provider", "provider_id")
);

-- Table: products
CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10, 2) NOT NULL, 
  "stock" INTEGER NOT NULL DEFAULT 0,
  "image_url" VARCHAR(255),
  "category_id" INTEGER REFERENCES "categories"("id") ON DELETE SET NULL,
  "is_featured" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: orders
CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "total_amount" DECIMAL(10, 2) NOT NULL,
  "status" VARCHAR(255) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  "shipping_address" TEXT NOT NULL,
  "payment_method" VARCHAR(255) NOT NULL DEFAULT 'cod',
  "payment_details" JSONB,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: order_items
CREATE TABLE "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" INTEGER REFERENCES "products"("id") ON DELETE SET NULL,
  "quantity" INTEGER NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL
);

-- Table: cart_items
CREATE TABLE "cart_items" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("user_id", "product_id")
);

-- Table: wishlists
CREATE TABLE "wishlists" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  UNIQUE ("user_id", "product_id")
);

-- Table: notifications
CREATE TABLE "notifications" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "link" VARCHAR(255),
  "is_read" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: support_tickets
CREATE TABLE "support_tickets" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "subject" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL,
  "status" VARCHAR(255) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Closed', 'open', 'in_progress', 'closed')),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: support_ticket_replies
CREATE TABLE "support_ticket_replies" (
  "id" SERIAL PRIMARY KEY,
  "ticket_id" INTEGER NOT NULL REFERENCES "support_tickets"("id") ON DELETE CASCADE,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
