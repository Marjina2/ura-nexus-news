
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { category = 'general', page = 1, country = 'in' } = await req.json()
    const newsApiKey = Deno.env.get('NEWSAPI_KEY')
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!newsApiKey) {
      throw new Error('NewsAPI key not configured')
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Fetch news from NewsAPI
    const newsUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=10&apiKey=${newsApiKey}`
    
    const newsResponse = await fetch(newsUrl)
    const newsData = await newsResponse.json()

    if (!newsResponse.ok) {
      throw new Error(newsData.message || 'Failed to fetch news')
    }

    // Filter out articles with null/undefined content
    const validArticles = newsData.articles.filter((article: any) => 
      article.title && 
      article.description && 
      article.url &&
      article.title !== '[Removed]' &&
      article.description !== '[Removed]'
    )

    // Enhance top articles (first 3) with Gemini and cache them
    if (page === 1 && geminiApiKey && validArticles.length > 0) {
      const topArticles = validArticles.slice(0, 3)
      
      for (const article of topArticles) {
        try {
          // Check if article already exists in cache
          const { data: existingArticle } = await supabase
            .from('cached_articles')
            .select('id')
            .eq('url', article.url)
            .single()

          if (!existingArticle) {
            // Enhance with Gemini
            const enhancedData = await enhanceWithGemini(article, geminiApiKey)
            
            // Insert into cache
            await supabase
              .from('cached_articles')
              .insert({
                title: article.title,
                description: article.description,
                url: article.url,
                url_to_image: article.urlToImage,
                published_at: article.publishedAt,
                source_name: article.source.name,
                content: article.content,
                enhanced_title: enhancedData.enhancedTitle,
                enhanced_content: enhancedData.enhancedContent,
                summary: enhancedData.summary,
                key_points: enhancedData.keyPoints,
                tags: enhancedData.tags,
                seo_optimized: true,
                category: category
              })
          }
        } catch (error) {
          console.log('Error caching article:', article.url, error)
          // Continue with other articles if one fails
        }
      }
    }

    const response = {
      articles: validArticles,
      totalResults: newsData.totalResults,
      status: newsData.status
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error fetching news:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

async function enhanceWithGemini(article: any, geminiApiKey: string) {
  try {
    const prompt = `
    You are an AI news editor specializing in SEO optimization. Please enhance this news article:
    
    Original Title: ${article.title}
    Description: ${article.description}
    Content: ${article.content || article.description}
    
    Please provide a response in this exact JSON format:
    {
      "enhancedTitle": "An SEO-optimized, engaging title that includes relevant keywords",
      "summary": "A clear 2-3 sentence summary optimized for search engines",
      "keyPoints": ["point 1", "point 2", "point 3"],
      "enhancedContent": "Enhanced article content with better structure, readability, and SEO optimization",
      "tags": ["relevant", "seo", "keywords"]
    }
    
    Focus on:
    - SEO-friendly titles with relevant keywords
    - Clear, engaging content structure
    - Improved readability while maintaining accuracy
    - Relevant tags for better categorization
    `

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    const geminiData = await geminiResponse.json()
    const enhancedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (enhancedText) {
      try {
        return JSON.parse(enhancedText)
      } catch (e) {
        console.log('Failed to parse Gemini response, using fallback')
      }
    }
  } catch (error) {
    console.log('Gemini enhancement failed:', error)
  }

  // Fallback enhancement
  return {
    enhancedTitle: article.title,
    summary: article.description,
    keyPoints: [article.title],
    enhancedContent: article.content || article.description,
    tags: ['news', 'breaking']
  }
}
