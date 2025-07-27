import { pgTable, text, serial, integer, boolean, timestamp, uuid, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Profiles table (user authentication and profiles)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  username: text("username").notNull().unique(),
  full_name: text("full_name"),
  country: text("country").notNull(),
  avatar_url: text("avatar_url"),
  phone_number: text("phone_number"),
  email_verified: boolean("email_verified").default(false),
  is_verified: boolean("is_verified").default(false),
  verification_token: text("verification_token"),
  verification_sent_at: timestamp("verification_sent_at"),
  verification_completed_at: timestamp("verification_completed_at"),
  email_verification_token: text("email_verification_token"),
  email_verification_sent_at: timestamp("email_verification_sent_at"),
  connected_devices: jsonb("connected_devices"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// News sources table
export const newsSources = pgTable("news_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// News articles table (from external sources)
export const newsArticles = pgTable("news_articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  original_title: text("original_title").notNull(),
  rephrased_title: text("rephrased_title"),
  summary: text("summary"),
  full_content: text("full_content"),
  excerpt: text("excerpt"),
  image_url: text("image_url"),
  source_url: text("source_url"),
  original_url: text("original_url"),
  source_name: text("source_name").default("Unknown"),
  source_id: integer("source_id").references(() => newsSources.id),
  author: text("author"),
  category: text("category"),
  region: text("region"),
  status: text("status"),
  scraped_at: timestamp("scraped_at"),
  rephrased_at: timestamp("rephrased_at"),
  published_at: timestamp("published_at"),
  created_at: timestamp("created_at").defaultNow(),
});

// AI Generated articles table
export const aiGeneratedArticles = pgTable("ai_generated_articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  category: text("category").notNull(),
  country: text("country").default("in"),
  author: text("author"),
  tags: text("tags").array(),
  image_url: text("image_url"),
  seo_title: text("seo_title"),
  seo_description: text("seo_description"),
  seo_keywords: text("seo_keywords").array(),
  auto_generated: boolean("auto_generated").default(false),
  generation_batch_id: text("generation_batch_id"),
  next_generation_time: timestamp("next_generation_time"),
  is_featured: boolean("is_featured").default(false),
  view_count: integer("view_count").default(0),
  published_at: timestamp("published_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Cached articles table
export const cachedArticles = pgTable("cached_articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  enhanced_content: text("enhanced_content"),
  enhanced_title: text("enhanced_title"),
  url: text("url").notNull(),
  url_to_image: text("url_to_image"),
  source_name: text("source_name").notNull(),
  category: text("category"),
  summary: text("summary"),
  key_points: text("key_points").array(),
  tags: text("tags").array(),
  seo_optimized: boolean("seo_optimized").default(false),
  published_at: timestamp("published_at").notNull(),
  cached_at: timestamp("cached_at").defaultNow(),
});

// Saved articles table
export const savedArticles = pgTable("saved_articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  url: text("url").notNull(),
  image_url: text("image_url"),
  source_name: text("source_name"),
  category: text("category"),
  view_count: integer("view_count").default(0),
  published_at: timestamp("published_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Spotlight articles table (breaking news)
export const spotlightArticles = pgTable("spotlight_articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  event_type: text("event_type").notNull(),
  location: text("location"),
  casualties_count: integer("casualties_count"),
  image_url: text("image_url"),
  video_urls: text("video_urls").array(),
  tags: text("tags").array(),
  sources: jsonb("sources").array(),
  live_updates: jsonb("live_updates").array(),
  emergency_contacts: jsonb("emergency_contacts"),
  priority: integer("priority").default(1),
  is_active: boolean("is_active").default(true),
  expires_at: timestamp("expires_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Spotlight news table
export const spotlightNews = pgTable("spotlight_news", {
  id: uuid("id").primaryKey().defaultRandom(),
  gemini_topic: text("gemini_topic").notNull(),
  date: text("date").notNull(),
  location: text("location"),
  casualties_count: integer("casualties_count"),
  survivors_count: integer("survivors_count"),
  black_box_found: boolean("black_box_found"),
  summary: text("summary"),
  full_report: text("full_report"),
  image_url: text("image_url"),
  seo_title: text("seo_title"),
  emergency_contacts: jsonb("emergency_contacts"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// GNews API keys table
export const gnewsApiKeys = pgTable("gnews_api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  api_key: text("api_key").notNull(),
  key_name: text("key_name"),
  is_active: boolean("is_active").default(true),
  last_used: timestamp("last_used"),
  created_at: timestamp("created_at").defaultNow(),
});

// Scraper configuration table
export const scraperConfig = pgTable("scraper_config", {
  id: serial("id").primaryKey(),
  is_active: boolean("is_active").default(true),
  interval_minutes: integer("interval_minutes"),
  indian_articles_per_source: integer("indian_articles_per_source").default(5),
  international_articles_per_source: integer("international_articles_per_source").default(3),
  enable_categorization: boolean("enable_categorization").default(true),
  extract_full_content: boolean("extract_full_content").default(true),
  last_run_at: timestamp("last_run_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  created_at: true,
});

export const insertAiGeneratedArticleSchema = createInsertSchema(aiGeneratedArticles).omit({
  id: true,
  created_at: true,
  updated_at: true,
  published_at: true,
});

export const insertSpotlightArticleSchema = createInsertSchema(spotlightArticles).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertCachedArticleSchema = createInsertSchema(cachedArticles).omit({
  id: true,
  cached_at: true,
});

export const insertSavedArticleSchema = createInsertSchema(savedArticles).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export type AiGeneratedArticle = typeof aiGeneratedArticles.$inferSelect;
export type InsertAiGeneratedArticle = z.infer<typeof insertAiGeneratedArticleSchema>;

export type SpotlightArticle = typeof spotlightArticles.$inferSelect;
export type InsertSpotlightArticle = z.infer<typeof insertSpotlightArticleSchema>;

export type CachedArticle = typeof cachedArticles.$inferSelect;
export type InsertCachedArticle = z.infer<typeof insertCachedArticleSchema>;

export type SavedArticle = typeof savedArticles.$inferSelect;
export type InsertSavedArticle = z.infer<typeof insertSavedArticleSchema>;

export type NewsSource = typeof newsSources.$inferSelect;
export type SpotlightNews = typeof spotlightNews.$inferSelect;
export type GnewsApiKey = typeof gnewsApiKeys.$inferSelect;
export type ScraperConfig = typeof scraperConfig.$inferSelect;
