import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsArticleSchema, insertAiGeneratedArticleSchema, insertSpotlightArticleSchema, insertProfileSchema } from "@shared/schema";
import { 
  fetchNewsFromSupabase, 
  fetchCachedArticlesFromSupabase, 
  fetchSpotlightArticlesFromSupabase,
  type SupabaseArticle 
} from "./supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  // Clerk Authentication routes
  app.post("/api/profiles", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(400).json({ error: "Failed to create profile" });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.get("/api/profiles/username/:username", async (req, res) => {
    try {
      const profile = await storage.getProfileByUsername(req.params.username);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateProfile(req.params.id, updates);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // News Articles routes - now using Supabase
  app.get("/api/news-articles", async (req, res) => {
    try {
      const { limit = "50", category = "general", country = "us" } = req.query;
      const articles = await fetchNewsFromSupabase(
        category as string,
        country as string,
        parseInt(limit as string)
      );
      
      // Convert Supabase format to internal format
      const formattedArticles = articles.map((article: SupabaseArticle) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        imageUrl: article.image_url,
        source: article.source,
        author: article.author,
        category: article.category,
        country: article.country,
        language: article.language,
        publishedAt: article.published_at,
        createdAt: article.created_at,
        updatedAt: article.updated_at
      }));
      
      res.json(formattedArticles);
    } catch (error) {
      console.error("Error fetching news articles:", error);
      res.status(500).json({ error: "Failed to fetch news articles" });
    }
  });

  app.get("/api/news-articles/:id", async (req, res) => {
    try {
      const article = await storage.getNewsArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching news article:", error);
      res.status(500).json({ error: "Failed to fetch news article" });
    }
  });

  app.post("/api/news-articles", async (req, res) => {
    try {
      const validatedData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.createNewsArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating news article:", error);
      res.status(400).json({ error: "Failed to create news article" });
    }
  });

  // AI Generated Articles routes
  app.get("/api/ai-articles", async (req, res) => {
    try {
      const { limit = "50", category, country } = req.query;
      const articles = await storage.getAiArticles(
        parseInt(limit as string),
        category as string,
        country as string
      );
      res.json(articles);
    } catch (error) {
      console.error("Error fetching AI articles:", error);
      res.status(500).json({ error: "Failed to fetch AI articles" });
    }
  });

  app.get("/api/ai-articles/:id", async (req, res) => {
    try {
      const article = await storage.getAiArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "AI article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching AI article:", error);
      res.status(500).json({ error: "Failed to fetch AI article" });
    }
  });

  app.post("/api/ai-articles", async (req, res) => {
    try {
      const validatedData = insertAiGeneratedArticleSchema.parse(req.body);
      const article = await storage.createAiArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating AI article:", error);
      res.status(400).json({ error: "Failed to create AI article" });
    }
  });

  // Generate sample AI news (no external API dependencies)
  app.post("/api/generate-ai-news", async (req, res) => {
    try {
      const { category = "general", country = "in" } = req.body;

      // Check if we already have recent articles for this category/country
      const existingArticles = await storage.getAiArticles(5, category, country);
      const recentArticles = existingArticles.filter(article => {
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return new Date(article.created_at) > hourAgo;
      });

      if (recentArticles.length >= 2) {
        return res.json({ 
          message: "Recent articles already exist for this category/country",
          articles: recentArticles 
        });
      }

      // Generate sample article data
      const sampleArticles = [
        {
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Development in ${country === 'in' ? 'India' : country.toUpperCase()}`,
          content: `This is a comprehensive article about recent developments in the ${category} sector. The article covers important aspects of current trends, challenges, and opportunities in the industry.

Key highlights include:
- Significant growth patterns observed in recent months
- New technological advancements and their impact
- Policy changes and their implications
- Expert opinions and market analysis
- Future projections and recommendations

The ${category} sector continues to evolve rapidly with innovative solutions and strategic partnerships driving growth. Industry leaders emphasize the importance of sustainable practices and technological integration.

Market analysis suggests continued expansion with positive indicators across multiple metrics. Stakeholders remain optimistic about future developments and potential opportunities.

Recent data shows consistent improvement in key performance indicators, with particular strength in emerging markets and digital transformation initiatives.

The outlook remains positive with strong fundamentals supporting continued growth and development across the sector.`,
          summary: `A comprehensive overview of recent developments in the ${category} sector, highlighting growth patterns, technological advancements, and future opportunities.`,
          tags: [category, "development", "growth", "technology", "innovation", "market"],
          seo_title: `${category.charAt(0).toUpperCase() + category.slice(1)} Sector Growth and Development`,
          seo_description: `Latest insights on ${category} sector developments, growth trends, and future opportunities.`,
          seo_keywords: [category, "development", "growth", "trends"]
        }
      ];

      const articleData = sampleArticles[0];
      const imageUrl = generateImageUrl(category, articleData.title);

      // Create the article
      const newArticle = await storage.createAiArticle({
        title: articleData.title,
        content: articleData.content,
        summary: articleData.summary,
        category: category,
        country: country,
        author: 'URA News AI',
        tags: articleData.tags,
        image_url: imageUrl,
        seo_title: articleData.seo_title,
        seo_description: articleData.seo_description,
        seo_keywords: articleData.seo_keywords,
        auto_generated: true,
        generation_batch_id: crypto.randomUUID(),
      });

      res.status(201).json({
        success: true,
        article: newArticle,
        message: "AI article generated successfully"
      });

    } catch (error) {
      console.error("Error generating AI news:", error);
      res.status(500).json({ error: "Failed to generate AI news" });
    }
  });

  // Generate sample news from mock sources (no external API dependencies)
  app.post("/api/fetch-external-news", async (req, res) => {
    try {
      const categories = ["general", "business", "entertainment", "health", "science", "sports", "technology"];
      let savedArticles = 0;

      // Generate sample news articles for each category
      for (const category of categories) {
        const sampleArticle = {
          title: `Breaking: ${category.charAt(0).toUpperCase() + category.slice(1)} News Update`,
          description: `Latest developments in the ${category} sector with important updates and insights.`,
          content: `This is breaking news in the ${category} sector. The story covers recent developments and their impact on the industry.

Key points:
- Important announcement regarding sector developments
- Analysis of market trends and implications
- Expert commentary on recent changes
- Future outlook and recommendations

The ${category} industry continues to evolve with new opportunities and challenges emerging regularly.`,
          url: `https://example.com/${category}-news-${Date.now()}`,
          image: generateImageUrl(category, "Breaking News"),
          source: { name: `${category.charAt(0).toUpperCase() + category.slice(1)} Today` },
          publishedAt: new Date().toISOString()
        };

        // Check if similar article exists (simple check by category)
        const existing = await storage.getNewsArticles(5, category);
        const recentExists = existing.some(a => 
          a.category === category && 
          new Date(a.created_at) > new Date(Date.now() - 60 * 60 * 1000)
        );

        if (!recentExists) {
          await storage.createNewsArticle({
            original_title: sampleArticle.title,
            summary: sampleArticle.description,
            full_content: sampleArticle.content,
            image_url: sampleArticle.image,
            source_url: sampleArticle.url,
            category: category,
            source_name: sampleArticle.source.name,
            published_at: new Date(sampleArticle.publishedAt),
          });
          savedArticles++;
        }
      }

      res.json({
        success: true,
        message: `Generated and saved ${savedArticles} sample articles`,
        saved: savedArticles
      });

    } catch (error) {
      console.error("Error generating sample news:", error);
      res.status(500).json({ error: "Failed to generate sample news" });
    }
  });

  // Spotlight Articles routes - using Supabase
  app.get("/api/spotlight-articles", async (req, res) => {
    try {
      const { limit = "5" } = req.query;
      const articles = await fetchSpotlightArticlesFromSupabase(parseInt(limit as string));
      
      // Convert Supabase format to internal format
      const formattedArticles = articles.map((article: SupabaseArticle) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        imageUrl: article.image_url,
        source: article.source,
        author: article.author,
        category: article.category,
        country: article.country,
        language: article.language,
        publishedAt: article.published_at,
        createdAt: article.created_at,
        updatedAt: article.updated_at
      }));
      
      res.json(formattedArticles);
    } catch (error) {
      console.error("Error fetching spotlight articles:", error);
      res.status(500).json({ error: "Failed to fetch spotlight articles" });
    }
  });

  app.get("/api/spotlight-articles/:id", async (req, res) => {
    try {
      const article = await storage.getSpotlightArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Spotlight article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching spotlight article:", error);
      res.status(500).json({ error: "Failed to fetch spotlight article" });
    }
  });

  app.post("/api/spotlight-articles", async (req, res) => {
    try {
      const validatedData = insertSpotlightArticleSchema.parse(req.body);
      const article = await storage.createSpotlightArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating spotlight article:", error);
      res.status(400).json({ error: "Failed to create spotlight article" });
    }
  });

  // Cached Articles routes - using Supabase
  app.get("/api/cached-articles", async (req, res) => {
    try {
      const { limit = "10" } = req.query;
      const articles = await fetchCachedArticlesFromSupabase(parseInt(limit as string));
      
      // Convert Supabase format to internal format
      const formattedArticles = articles.map((article: SupabaseArticle) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        imageUrl: article.image_url,
        source: article.source,
        author: article.author,
        category: article.category,
        country: article.country,
        language: article.language,
        publishedAt: article.published_at,
        createdAt: article.created_at,
        updatedAt: article.updated_at
      }));
      
      res.json(formattedArticles);
    } catch (error) {
      console.error("Error fetching cached articles:", error);
      res.status(500).json({ error: "Failed to fetch cached articles" });
    }
  });

  // Saved Articles routes  
  app.get("/api/saved-articles", async (req, res) => {
    try {
      const { limit = "50" } = req.query;
      const articles = await storage.getSavedArticles(parseInt(limit as string));
      res.json(articles);
    } catch (error) {
      console.error("Error fetching saved articles:", error);
      res.status(500).json({ error: "Failed to fetch saved articles" });
    }
  });

  // News sources routes
  app.get("/api/news-sources", async (req, res) => {
    try {
      const sources = await storage.getActiveNewsSources();
      res.json(sources);
    } catch (error) {
      console.error("Error fetching news sources:", error);
      res.status(500).json({ error: "Failed to fetch news sources" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate image URLs based on category
function generateImageUrl(category: string, title: string): string {
  const keywords = (category + ' ' + title).toLowerCase();
  
  if (keywords.includes('technology') || keywords.includes('tech') || keywords.includes('ai') || keywords.includes('software')) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop';
  }
  if (keywords.includes('business') || keywords.includes('finance') || keywords.includes('economy') || keywords.includes('market')) {
    return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop';
  }
  if (keywords.includes('health') || keywords.includes('medical') || keywords.includes('healthcare')) {
    return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
  }
  if (keywords.includes('sports') || keywords.includes('cricket') || keywords.includes('football')) {
    return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop';
  }
  if (keywords.includes('politics') || keywords.includes('government') || keywords.includes('election')) {
    return 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop';
  }
  if (keywords.includes('entertainment') || keywords.includes('movie') || keywords.includes('bollywood')) {
    return 'https://images.unsplash.com/photo-1489599687945-e138957ad296?w=800&h=600&fit=crop';
  }
  if (keywords.includes('science') || keywords.includes('research') || keywords.includes('study')) {
    return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop';
  }
  
  return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop';
}
