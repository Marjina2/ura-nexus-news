
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
    const newsdataApiKey = Deno.env.get('NEWSDATA_API_KEY')
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!newsdataApiKey) {
      throw new Error('NewsData API key not configured')
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Map categories to NewsData.io format
    const categoryMap: { [key: string]: string } = {
      'general': 'top',
      'business': 'business',
      'entertainment': 'entertainment',
      'health': 'health',
      'science': 'science',
      'sports': 'sports',
      'technology': 'technology'
    }

    const mappedCategory = categoryMap[category] || 'top'

    // Fetch news from NewsData.io
    const newsUrl = `https://newsdata.io/api/1/news?apikey=${newsdataApiKey}&country=${country}&category=${mappedCategory}&language=en&size=10&page=${page}`
    
    const newsResponse = await fetch(newsUrl)
    const newsData = await newsResponse.json()

    if (!newsResponse.ok) {
      throw new Error(newsData.message || 'Failed to fetch news from NewsData.io')
    }

    // Transform NewsData.io format to match our expected format
    const transformedArticles = newsData.results?.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.link,
      urlToImage: article.image_url,
      publishedAt: article.pubDate,
      source: {
        name: article.source_id || 'Unknown'
      },
      content: article.content
    })).filter((article: any) => 
      article.title && 
      article.description && 
      article.url &&
      article.title !== '[Removed]' &&
      article.description !== '[Removed]'
    ) || []

    // Enhance top articles (first 3) with Gemini and Google rephrasing, then cache them
    if (page === 1 && geminiApiKey && transformedArticles.length > 0) {
      const topArticles = transformedArticles.slice(0, 3)
      
      for (const article of topArticles) {
        try {
          // Check if article already exists in cache
          const { data: existingArticle } = await supabase
            .from('cached_articles')
            .select('id')
            .eq('url', article.url)
            .single()

          if (!existingArticle) {
            // Enhance with Gemini and Google rephrasing
            const enhancedData = await enhanceWithGeminiAndRephrase(article, geminiApiKey)
            
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
      articles: transformedArticles,
      totalResults: newsData.totalResults || transformedArticles.length,
      status: 'ok'
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

async function enhanceWithGeminiAndRephrase(article: any, geminiApiKey: string) {
  try {
    const prompt = `
    You are an AI news editor specializing in SEO optimization and content enhancement. Please enhance this news article with Google's text rephrasing approach:
    
    Original Title: ${article.title}
    Description: ${article.description}
    Content: ${article.content || article.description}
    
    Instructions:
    1. Rephrase the content using Google's approach: maintain meaning while improving clarity and engagement
    2. Create SEO-optimized versions that sound natural and human-written
    3. Ensure all rephrased content is unique and adds value
    4. Keep factual accuracy while improving readability
    
    Please provide a response in this exact JSON format:
    {
      "enhancedTitle": "An SEO-optimized, engaging title using Google rephrasing techniques",
      "summary": "A clear 2-3 sentence summary rephrased for better engagement and SEO",
      "keyPoints": ["rephrased key point 1", "rephrased key point 2", "rephrased key point 3"],
      "enhancedContent": "Fully rephrased article content with improved structure, readability, and natural language flow while maintaining all original facts",
      "tags": ["relevant", "seo", "keywords"]
    }
    
    Focus on:
    - Natural, human-like rephrasing that passes AI detection
    - SEO-friendly content without keyword stuffing
    - Improved sentence structure and flow
    - Enhanced readability while maintaining journalistic integrity
    - Google's E-A-T (Expertise, Authoritativeness, Trustworthiness) principles
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

  // Fallback enhancement with basic rephrasing
  return {
    enhancedTitle: `Breaking: ${article.title}`,
    summary: `Latest update: ${article.description}`,
    keyPoints: [article.title, `Source: ${article.source.name}`, 'Breaking news update'],
    enhancedContent: `In a recent development, ${article.content || article.description} This story continues to develop as more information becomes available.`,
    tags: ['breaking', 'news', 'latest']
  }
}
