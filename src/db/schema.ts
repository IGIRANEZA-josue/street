import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  compareAtCents: integer("compare_at_cents"),
  category: text("category").notNull(), // tees | hoodies | women | accessories
  gender: text("gender").notNull().default("unisex"), // men | women | unisex
  collections: jsonb("collections").$type<string[]>().notNull().default([]),
  colors: jsonb("colors")
    .$type<{ name: string; garment: string; ink: string }[]>()
    .notNull()
    .default([]),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  badge: text("badge"),
  image: text("image").notNull().default(""),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  printStyle: text("print_style").notNull().default("block"), // block|script|varsity|minimal|outline
  printLines: jsonb("print_lines").$type<string[]>().notNull().default([]),
  stock: integer("stock").notNull().default(20),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("footer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  phone: text("phone").notNull().default(""),
  notes: text("notes").notNull().default(""),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  size: text("size").notNull().default("OS"),
  color: text("color").notNull().default(""),
  qty: integer("qty").notNull(),
  priceCents: integer("price_cents").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull().default("General"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
