
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
    
    console.log('Fetching news for category:', category, 'page:', page)
    
    if (!newsdataApiKey) {
      console.error('NewsData API key not configured')
      // Return fallback data instead of throwing error
      return new Response(
        JSON.stringify({ 
          articles: getFallbackArticles(),
          totalResults: 20,
          status: 'ok'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Check for cached articles first (within 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: cachedArticles } = await supabase
      .from('cached_articles')
      .select('*')
      .eq('category', category)
      .gte('created_at', oneHourAgo)
      .order('created_at', { ascending: false })
      .limit(10)

    if (cachedArticles && cachedArticles.length > 0) {
      console.log('Returning cached articles:', cachedArticles.length)
      const transformedCached = cachedArticles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.url_to_image || getUnsplashImage(),
        publishedAt: article.published_at,
        source: {
          name: article.source_name
        },
        content: article.content
      }))

      return new Response(
        JSON.stringify({
          articles: transformedCached,
          totalResults: cachedArticles.length,
          status: 'ok'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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
    
    console.log('Calling NewsData API:', newsUrl.replace(newsdataApiKey, 'HIDDEN'))
    
    const newsResponse = await fetch(newsUrl)
    const newsData = await newsResponse.json()

    if (!newsResponse.ok) {
      console.error('NewsData API error:', newsData)
      // Return fallback data with Unsplash images
      return new Response(
        JSON.stringify({ 
          articles: getFallbackArticles(),
          totalResults: 20,
          status: 'ok'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform NewsData.io format to match our expected format
    const transformedArticles = newsData.results?.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.link,
      urlToImage: article.image_url || getUnsplashImage(),
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

    // If no articles from API, return fallback
    if (transformedArticles.length === 0) {
      return new Response(
        JSON.stringify({ 
          articles: getFallbackArticles(),
          totalResults: 20,
          status: 'ok'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Cache articles for future requests
    for (const article of transformedArticles.slice(0, 5)) {
      try {
        await supabase
          .from('cached_articles')
          .upsert({
            title: article.title,
            description: article.description,
            url: article.url,
            url_to_image: article.urlToImage,
            published_at: article.publishedAt,
            source_name: article.source.name,
            content: article.content,
            category: category,
            created_at: new Date().toISOString()
          }, { onConflict: 'url' })
      } catch (error) {
        console.log('Error caching article:', error)
      }
    }

    const response = {
      articles: transformedArticles,
      totalResults: newsData.totalResults || transformedArticles.length,
      status: 'ok'
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching news:', error)
    
    // Return fallback articles on any error
    return new Response(
      JSON.stringify({ 
        articles: getFallbackArticles(),
        totalResults: 20,
        status: 'ok'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getUnsplashImage(): string {
  const newsImages = [
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop'
  ]
  return newsImages[Math.floor(Math.random() * newsImages.length)]
}

function getFallbackArticles() {
  return [
    {
      title: "India's Tech Sector Shows Strong Growth in Q4 2024",
      description: "The Indian technology sector demonstrates remarkable resilience with significant growth in software exports and digital transformation initiatives across industries.",
      url: "https://example.com/india-tech-growth",
      urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop",
      publishedAt: new Date().toISOString(),
      source: { name: "Tech India Today" },
      content: "India's technology sector continues to show robust growth with increased investments in AI and digital infrastructure."
    },
    {
      title: "Mumbai Metro Expansion Project Reaches New Milestone",
      description: "The ambitious Mumbai Metro expansion project completes another phase, promising improved connectivity for millions of commuters across the metropolitan area.",
      url: "https://example.com/mumbai-metro",
      urlToImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: { name: "Mumbai Mirror" },
      content: "The new metro line will connect key business districts and residential areas, reducing travel time significantly."
    },
    {
      title: "Indian Renewable Energy Sector Attracts Record Investment",
      description: "Solar and wind energy projects in India receive unprecedented funding as the country accelerates its transition to clean energy sources.",
      url: "https://example.com/renewable-energy",
      urlToImage: "https://images.unsplash.com/photo-1508615039623-faacf6976ee8?w=800&h=600&fit=crop",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: { name: "Energy Times" },
      content: "The renewable energy sector in India is experiencing unprecedented growth with government support and private investments."
    },
    {
      title: "Bangalore Emerges as Leading Startup Hub in Asia",
      description: "With over 1000 new startups registered this year, Bangalore strengthens its position as a major technology and innovation center in Asia.",
      url: "https://example.com/bangalore-startups",
      urlToImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      source: { name: "Startup India" },
      content: "The city's ecosystem of incubators, investors, and talent pool continues to attract entrepreneurs from around the world."
    },
    {
      title: "Digital India Initiative Shows Remarkable Progress",
      description: "Government's Digital India program achieves significant milestones in rural connectivity and digital literacy, transforming lives across the country.",
      url: "https://example.com/digital-india",
      urlToImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      source: { name: "Government of India" },
      content: "The initiative has successfully brought digital services to remote villages, enabling better access to education and healthcare."
    }
  ]
}
