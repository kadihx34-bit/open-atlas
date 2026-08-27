import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** User-owned GLB metadata. Binary model bytes live in S3; hotspots stay as JSON text. */
export const glbAssets = mysqlTable("glb_assets", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  hotspotsJson: text("hotspotsJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GlbAsset = typeof glbAssets.$inferSelect;
export type InsertGlbAsset = typeof glbAssets.$inferInsert;
