import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "./db";
import {
  profiles,
  newsArticles,
  aiGeneratedArticles,
  spotlightArticles,
  cachedArticles,
  savedArticles,
  gnewsApiKeys,
  newsSources,
  type Profile,
  type InsertProfile,
  type NewsArticle,
  type InsertNewsArticle,
  type AiGeneratedArticle,
  type InsertAiGeneratedArticle,
  type SpotlightArticle,
  type InsertSpotlightArticle,
  type CachedArticle,
  type InsertCachedArticle,
  type SavedArticle,
  type InsertSavedArticle,
  type GnewsApiKey,
  type NewsSource,
} from "@shared/schema";

export interface IStorage {
  // Profile/User methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined>;

  // News Articles methods
  getNewsArticles(limit?: number, category?: string): Promise<NewsArticle[]>;
  getNewsArticleById(id: string): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: string, updates: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined>;
  deleteNewsArticle(id: string): Promise<boolean>;

  // AI Generated Articles methods
  getAiArticles(limit?: number, category?: string, country?: string): Promise<AiGeneratedArticle[]>;
  getAiArticleById(id: string): Promise<AiGeneratedArticle | undefined>;
  createAiArticle(article: InsertAiGeneratedArticle): Promise<AiGeneratedArticle>;
  updateAiArticle(id: string, updates: Partial<InsertAiGeneratedArticle>): Promise<AiGeneratedArticle | undefined>;
  deleteAiArticle(id: string): Promise<boolean>;

  // Spotlight Articles methods
  getSpotlightArticles(limit?: number): Promise<SpotlightArticle[]>;
  getActiveSpotlightArticles(): Promise<SpotlightArticle[]>;
  getSpotlightArticleById(id: string): Promise<SpotlightArticle | undefined>;
  createSpotlightArticle(article: InsertSpotlightArticle): Promise<SpotlightArticle>;
  updateSpotlightArticle(id: string, updates: Partial<InsertSpotlightArticle>): Promise<SpotlightArticle | undefined>;
  deleteSpotlightArticle(id: string): Promise<boolean>;

  // Cached Articles methods
  getCachedArticles(limit?: number, category?: string): Promise<CachedArticle[]>;
  getCachedArticleById(id: string): Promise<CachedArticle | undefined>;
  createCachedArticle(article: InsertCachedArticle): Promise<CachedArticle>;
  updateCachedArticle(id: string, updates: Partial<InsertCachedArticle>): Promise<CachedArticle | undefined>;
  deleteCachedArticle(id: string): Promise<boolean>;

  // Saved Articles methods
  getSavedArticles(limit?: number): Promise<SavedArticle[]>;
  getSavedArticleById(id: string): Promise<SavedArticle | undefined>;
  createSavedArticle(article: InsertSavedArticle): Promise<SavedArticle>;
  updateSavedArticle(id: string, updates: Partial<InsertSavedArticle>): Promise<SavedArticle | undefined>;
  deleteSavedArticle(id: string): Promise<boolean>;

  // GNews API Keys methods
  getActiveGnewsApiKeys(): Promise<GnewsApiKey[]>;
  updateGnewsApiKeyUsage(id: string): Promise<void>;

  // News Sources methods
  getActiveNewsSources(): Promise<NewsSource[]>;
}

export class DatabaseStorage implements IStorage {
  // Profile/User methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getProfileByUsername(username: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.username, username)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values([profile]).returning();
    return result[0];
  }

  async updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db.update(profiles).set({ ...updates, updated_at: new Date() }).where(eq(profiles.id, id)).returning();
    return result[0];
  }

  // News Articles methods
  async getNewsArticles(limit = 50, category?: string): Promise<NewsArticle[]> {
    if (category && category !== 'all') {
      return db.select().from(newsArticles)
        .where(eq(newsArticles.category, category))
        .orderBy(desc(newsArticles.created_at))
        .limit(limit);
    }
    
    return db.select().from(newsArticles)
      .orderBy(desc(newsArticles.created_at))
      .limit(limit);
  }

  async getNewsArticleById(id: string): Promise<NewsArticle | undefined> {
    const result = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
    return result[0];
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const result = await db.insert(newsArticles).values(article).returning();
    return result[0];
  }

  async updateNewsArticle(id: string, updates: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> {
    const result = await db.update(newsArticles).set(updates).where(eq(newsArticles.id, id)).returning();
    return result[0];
  }

  async deleteNewsArticle(id: string): Promise<boolean> {
    const result = await db.delete(newsArticles).where(eq(newsArticles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // AI Generated Articles methods
  async getAiArticles(limit = 50, category?: string, country?: string): Promise<AiGeneratedArticle[]> {
    const conditions = [];
    if (category && category !== 'all') {
      conditions.push(eq(aiGeneratedArticles.category, category));
    }
    if (country) {
      conditions.push(eq(aiGeneratedArticles.country, country));
    }
    
    if (conditions.length > 0) {
      return db.select().from(aiGeneratedArticles)
        .where(and(...conditions))
        .orderBy(desc(aiGeneratedArticles.created_at))
        .limit(limit);
    }
    
    return db.select().from(aiGeneratedArticles)
      .orderBy(desc(aiGeneratedArticles.created_at))
      .limit(limit);
  }

  async getAiArticleById(id: string): Promise<AiGeneratedArticle | undefined> {
    const result = await db.select().from(aiGeneratedArticles).where(eq(aiGeneratedArticles.id, id)).limit(1);
    return result[0];
  }

  async createAiArticle(article: InsertAiGeneratedArticle): Promise<AiGeneratedArticle> {
    const result = await db.insert(aiGeneratedArticles).values(article).returning();
    return result[0];
  }

  async updateAiArticle(id: string, updates: Partial<InsertAiGeneratedArticle>): Promise<AiGeneratedArticle | undefined> {
    const result = await db.update(aiGeneratedArticles).set({ ...updates, updated_at: new Date() }).where(eq(aiGeneratedArticles.id, id)).returning();
    return result[0];
  }

  async deleteAiArticle(id: string): Promise<boolean> {
    const result = await db.delete(aiGeneratedArticles).where(eq(aiGeneratedArticles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Spotlight Articles methods
  async getSpotlightArticles(limit = 10): Promise<SpotlightArticle[]> {
    return db.select().from(spotlightArticles).orderBy(desc(spotlightArticles.created_at)).limit(limit);
  }

  async getActiveSpotlightArticles(): Promise<SpotlightArticle[]> {
    return db.select().from(spotlightArticles)
      .where(and(eq(spotlightArticles.is_active, true)))
      .orderBy(desc(spotlightArticles.priority), desc(spotlightArticles.created_at));
  }

  async getSpotlightArticleById(id: string): Promise<SpotlightArticle | undefined> {
    const result = await db.select().from(spotlightArticles).where(eq(spotlightArticles.id, id)).limit(1);
    return result[0];
  }

  async createSpotlightArticle(article: InsertSpotlightArticle): Promise<SpotlightArticle> {
    const result = await db.insert(spotlightArticles).values(article).returning();
    return result[0];
  }

  async updateSpotlightArticle(id: string, updates: Partial<InsertSpotlightArticle>): Promise<SpotlightArticle | undefined> {
    const result = await db.update(spotlightArticles).set({ ...updates, updated_at: new Date() }).where(eq(spotlightArticles.id, id)).returning();
    return result[0];
  }

  async deleteSpotlightArticle(id: string): Promise<boolean> {
    const result = await db.delete(spotlightArticles).where(eq(spotlightArticles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Cached Articles methods
  async getCachedArticles(limit = 50, category?: string): Promise<CachedArticle[]> {
    if (category && category !== 'all') {
      return db.select().from(cachedArticles)
        .where(eq(cachedArticles.category, category))
        .orderBy(desc(cachedArticles.cached_at))
        .limit(limit);
    }
    
    return db.select().from(cachedArticles)
      .orderBy(desc(cachedArticles.cached_at))
      .limit(limit);
  }

  async getCachedArticleById(id: string): Promise<CachedArticle | undefined> {
    const result = await db.select().from(cachedArticles).where(eq(cachedArticles.id, id)).limit(1);
    return result[0];
  }

  async createCachedArticle(article: InsertCachedArticle): Promise<CachedArticle> {
    const result = await db.insert(cachedArticles).values(article).returning();
    return result[0];
  }

  async updateCachedArticle(id: string, updates: Partial<InsertCachedArticle>): Promise<CachedArticle | undefined> {
    const result = await db.update(cachedArticles).set(updates).where(eq(cachedArticles.id, id)).returning();
    return result[0];
  }

  async deleteCachedArticle(id: string): Promise<boolean> {
    const result = await db.delete(cachedArticles).where(eq(cachedArticles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Saved Articles methods
  async getSavedArticles(limit = 50): Promise<SavedArticle[]> {
    return db.select().from(savedArticles).orderBy(desc(savedArticles.created_at)).limit(limit);
  }

  async getSavedArticleById(id: string): Promise<SavedArticle | undefined> {
    const result = await db.select().from(savedArticles).where(eq(savedArticles.id, id)).limit(1);
    return result[0];
  }

  async createSavedArticle(article: InsertSavedArticle): Promise<SavedArticle> {
    const result = await db.insert(savedArticles).values(article).returning();
    return result[0];
  }

  async updateSavedArticle(id: string, updates: Partial<InsertSavedArticle>): Promise<SavedArticle | undefined> {
    const result = await db.update(savedArticles).set({ ...updates, updated_at: new Date() }).where(eq(savedArticles.id, id)).returning();
    return result[0];
  }

  async deleteSavedArticle(id: string): Promise<boolean> {
    const result = await db.delete(savedArticles).where(eq(savedArticles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // GNews API Keys methods
  async getActiveGnewsApiKeys(): Promise<GnewsApiKey[]> {
    return db.select().from(gnewsApiKeys)
      .where(eq(gnewsApiKeys.is_active, true))
      .orderBy(gnewsApiKeys.last_used);
  }

  async updateGnewsApiKeyUsage(id: string): Promise<void> {
    await db.update(gnewsApiKeys)
      .set({ last_used: new Date() })
      .where(eq(gnewsApiKeys.id, id));
  }

  // News Sources methods
  async getActiveNewsSources(): Promise<NewsSource[]> {
    return db.select().from(newsSources)
      .where(eq(newsSources.is_active, true))
      .orderBy(newsSources.name);
  }
}

export const storage = new DatabaseStorage();
