import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  coins: integer("coins").default(1250).notNull(),
  trialEndsAt: timestamp("trial_ends_at"),
  paypalSubscriptionId: text("paypal_subscription_id"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "plugin" | "mod"
  platform: text("platform").notNull(), // "bukkit" | "spigot" | "forge" | "fabric"
  components: jsonb("components").default('[]').notNull(),
  generatedCode: text("generated_code"),
  aiModel: text("ai_model"), // "claude" | "gemini" | "gpt"
  templateId: varchar("template_id"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(), // "beginner" | "intermediate" | "advanced"
  rating: integer("rating").default(0).notNull(),
  downloads: integer("downloads").default(0).notNull(),
  components: jsonb("components").default('[]').notNull(),
  code: text("code").notNull(),
  imageUrl: text("image_url"),
  isPremium: boolean("is_premium").default(false).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const aiGenerations = pgTable("ai_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: varchar("project_id").references(() => projects.id),
  aiModel: text("ai_model").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  coinsCost: integer("coins_cost").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const adViews = pgTable("ad_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  coinsEarned: integer("coins_earned").notNull(),
  adProvider: text("ad_provider").notNull(),
  viewedAt: timestamp("viewed_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  type: true,
  platform: true,
  components: true,
  templateId: true,
});

export const insertAiGenerationSchema = createInsertSchema(aiGenerations).pick({
  projectId: true,
  aiModel: true,
  prompt: true,
  coinsCost: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type AiGeneration = typeof aiGenerations.$inferSelect;
export type AdView = typeof adViews.$inferSelect;
