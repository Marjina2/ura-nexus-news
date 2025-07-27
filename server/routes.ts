import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsArticleSchema, insertAiGeneratedArticleSchema, insertSpotlightArticleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // News Articles routes
  app.get("/api/news-articles", async (req, res) => {
    try {
      const { limit = "50", category } = req.query;
      const articles = await storage.getNewsArticles(
        parseInt(limit as string), 
        category as string
      );
      res.json(articles);
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

  // Auto-generate AI news (replacement for Supabase function)
  app.post("/api/generate-ai-news", async (req, res) => {
    try {
      const { category = "general", country = "in" } = req.body;
      const geminiApiKey = process.env.GEMINI_API_KEY;
      
      if (!geminiApiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

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

      const prompt = `Generate a fresh, unique news article about ${category} from ${country === 'in' ? 'India' : country.toUpperCase()} region.

Requirements:
- Title should be compelling and news-worthy
- Content should be 800-1200 words
- Include specific details, quotes, and context
- Make it engaging and informative
- Focus on recent developments
- Include relevant statistics or data points
- Add a compelling summary (150-200 words)
- Suggest 5-7 relevant tags
- Provide SEO-optimized title and description
- Make sure the content feels authentic and well-researched

Format your response as JSON:
{
  "title": "Article title",
  "content": "Full article content with proper formatting",
  "summary": "Article summary",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seo_title": "SEO optimized title",
  "seo_description": "SEO description",
  "seo_keywords": ["keyword1", "keyword2", "keyword3"]
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        return res.status(500).json({ error: "Gemini API error" });
      }

      const result = await response.json();
      const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        return res.status(500).json({ error: "No content generated" });
      }

      // Clean and parse JSON
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const articleData = JSON.parse(cleanedText);

      // Generate appropriate image URL based on category
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

  // Fetch news from external sources (replacement for auto-publish-gnews)
  app.post("/api/fetch-external-news", async (req, res) => {
    try {
      const serpApiKey = process.env.SERP_API_KEY;
      
      if (!serpApiKey) {
        return res.status(500).json({ error: "SERP_API_KEY not configured" });
      }

      // Get active GNews API keys
      const apiKeys = await storage.getActiveGnewsApiKeys();
      if (apiKeys.length === 0) {
        return res.status(500).json({ error: "No active GNews API keys configured" });
      }

      const categories = ["general", "business", "entertainment", "health", "science", "sports", "technology"];
      let savedArticles = 0;

      for (const category of categories) {
        for (const keyObj of apiKeys) {
          try {
            const url = `https://gnews.io/api/v4/top-headlines?token=${keyObj.api_key}&lang=en&max=10&topic=${category}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data?.articles && data.articles.length > 0) {
              // Update key usage
              await storage.updateGnewsApiKeyUsage(keyObj.id);

              // Process and save articles
              for (const article of data.articles) {
                // Check if article already exists
                const existing = await storage.getNewsArticles(1);
                const exists = existing.some(a => a.source_url === article.url);
                
                if (!exists) {
                  await storage.createNewsArticle({
                    original_title: article.title || "",
                    summary: article.description || '',
                    full_content: article.content || article.description || '',
                    image_url: article.image && !article.image.includes("pixel") ? article.image : null,
                    source_url: article.url,
                    category: category,
                    source_name: article.source?.name || "Unknown",
                    published_at: article.publishedAt ? new Date(article.publishedAt) : new Date(),
                  });
                  savedArticles++;
                }
              }
              break; // Use first working API key
            }
          } catch (error) {
            console.error(`Error fetching ${category} with key ${keyObj.id}:`, error);
            continue;
          }
        }
      }

      res.json({
        success: true,
        message: `Fetched and saved ${savedArticles} new articles`,
        saved: savedArticles
      });

    } catch (error) {
      console.error("Error fetching external news:", error);
      res.status(500).json({ error: "Failed to fetch external news" });
    }
  });

  // Spotlight Articles routes
  app.get("/api/spotlight-articles", async (req, res) => {
    try {
      const { active } = req.query;
      let articles;
      
      if (active === 'true') {
        articles = await storage.getActiveSpotlightArticles();
      } else {
        articles = await storage.getSpotlightArticles();
      }
      
      res.json(articles);
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

  // Cached Articles routes
  app.get("/api/cached-articles", async (req, res) => {
    try {
      const { limit = "50", category } = req.query;
      const articles = await storage.getCachedArticles(
        parseInt(limit as string),
        category as string
      );
      res.json(articles);
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
