
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    
    if (!newsApiKey) {
      throw new Error('NewsAPI key not configured')
    }

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
