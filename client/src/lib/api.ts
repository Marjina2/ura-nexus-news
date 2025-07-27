// API client for the news platform
import type {
  NewsArticle,
  AiGeneratedArticle,
  SpotlightArticle,
  CachedArticle,
  SavedArticle,
  Profile,
  InsertProfile,
  InsertNewsArticle,
  InsertAiGeneratedArticle,
  InsertSpotlightArticle
} from "@shared/schema";

const API_BASE = "/api";

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Profile methods
  async createProfile(profile: InsertProfile): Promise<Profile> {
    return this.request<Profile>("/profiles", {
      method: "POST",
      body: JSON.stringify(profile),
    });
  }

  async getProfile(id: string): Promise<Profile> {
    return this.request<Profile>(`/profiles/${id}`);
  }

  async getProfileByUsername(username: string): Promise<Profile> {
    return this.request<Profile>(`/profiles/username/${username}`);
  }

  async updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile> {
    return this.request<Profile>(`/profiles/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // News Articles methods
  async getNewsArticles(limit = 50, category?: string): Promise<NewsArticle[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (category) params.append("category", category);
    
    return this.request<NewsArticle[]>(`/news-articles?${params}`);
  }

  async getNewsArticle(id: string): Promise<NewsArticle> {
    return this.request<NewsArticle>(`/news-articles/${id}`);
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    return this.request<NewsArticle>("/news-articles", {
      method: "POST",
      body: JSON.stringify(article),
    });
  }

  // AI Generated Articles methods
  async getAiArticles(limit = 50, category?: string, country?: string): Promise<AiGeneratedArticle[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (category) params.append("category", category);
    if (country) params.append("country", country);
    
    return this.request<AiGeneratedArticle[]>(`/ai-articles?${params}`);
  }

  async getAiArticle(id: string): Promise<AiGeneratedArticle> {
    return this.request<AiGeneratedArticle>(`/ai-articles/${id}`);
  }

  async createAiArticle(article: InsertAiGeneratedArticle): Promise<AiGeneratedArticle> {
    return this.request<AiGeneratedArticle>("/ai-articles", {
      method: "POST",
      body: JSON.stringify(article),
    });
  }

  async generateAiNews(category = "general", country = "in"): Promise<{ success: boolean; article: AiGeneratedArticle; message: string }> {
    return this.request("/generate-ai-news", {
      method: "POST",
      body: JSON.stringify({ category, country }),
    });
  }

  // Spotlight Articles methods
  async getSpotlightArticles(active?: boolean): Promise<SpotlightArticle[]> {
    const params = active ? "?active=true" : "";
    return this.request<SpotlightArticle[]>(`/spotlight-articles${params}`);
  }

  async getSpotlightArticle(id: string): Promise<SpotlightArticle> {
    return this.request<SpotlightArticle>(`/spotlight-articles/${id}`);
  }

  async createSpotlightArticle(article: InsertSpotlightArticle): Promise<SpotlightArticle> {
    return this.request<SpotlightArticle>("/spotlight-articles", {
      method: "POST",
      body: JSON.stringify(article),
    });
  }

  // Cached Articles methods
  async getCachedArticles(limit = 50, category?: string): Promise<CachedArticle[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (category) params.append("category", category);
    
    return this.request<CachedArticle[]>(`/cached-articles?${params}`);
  }

  // Saved Articles methods
  async getSavedArticles(limit = 50): Promise<SavedArticle[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    return this.request<SavedArticle[]>(`/saved-articles?${params}`);
  }

  // External news fetching
  async fetchExternalNews(): Promise<{ success: boolean; message: string; saved: number }> {
    return this.request("/fetch-external-news", {
      method: "POST",
    });
  }
}

export const apiClient = new ApiClient();