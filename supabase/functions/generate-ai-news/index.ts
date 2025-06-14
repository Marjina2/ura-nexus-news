
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
    const { category, country = 'in', count = 5 } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found')
    }

    // Check if we already have recent articles for this category/country
    const { data: existingArticles } = await supabaseClient
      .from('ai_generated_articles')
      .select('id')
      .eq('category', category)
      .eq('country', country)
      .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()) // 6 hours ago
      .limit(5)

    if (existingArticles && existingArticles.length >= 3) {
      return new Response(
        JSON.stringify({ 
          message: 'Recent articles already exist', 
          count: existingArticles.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const topics = {
      general: ['breaking news', 'current events', 'social issues'],
      politics: ['government policies', 'elections', 'political developments', 'parliamentary sessions'],
      business: ['economic policies', 'startup news', 'market updates', 'corporate developments'],
      technology: ['tech innovations', 'digital India', 'AI developments', 'cybersecurity'],
      sports: ['cricket matches', 'olympics', 'sports achievements', 'tournaments'],
      health: ['healthcare policies', 'medical breakthroughs', 'public health', 'wellness'],
      science: ['space missions', 'research developments', 'climate change', 'innovations'],
      entertainment: ['bollywood', 'regional cinema', 'music', 'cultural events']
    }

    const categoryTopics = topics[category] || topics.general
    const articles = []

    for (let i = 0; i < Math.min(count, 3); i++) {
      const topic = categoryTopics[i % categoryTopics.length]
      const prompt = `Write a comprehensive news article about ${topic} in ${country === 'in' ? 'India' : 'the country'}. 
      
      Requirements:
      - Write a compelling headline (max 80 characters)
      - Create a detailed article with at least 800 words
      - Include realistic quotes from officials or experts
      - Add specific details, dates, and locations
      - Write in journalistic style
      - Include SEO-friendly meta description (max 160 characters)
      - Suggest 5 relevant keywords
      - Make it engaging and informative
      
      Format your response as JSON:
      {
        "title": "Article headline",
        "content": "Full article content with multiple paragraphs",
        "summary": "Brief summary in 2-3 sentences",
        "seo_description": "SEO meta description",
        "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
      }`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      )

      const data = await response.json()
      
      if (data.candidates && data.candidates[0]) {
        const content = data.candidates[0].content.parts[0].text
        
        try {
          // Extract JSON from response
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const articleData = JSON.parse(jsonMatch[0])
            
            // Generate a placeholder image URL
            const imageUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=800&h=600&fit=crop&auto=format`
            
            const article = {
              title: articleData.title,
              content: articleData.content,
              summary: articleData.summary,
              category,
              country,
              image_url: imageUrl,
              seo_title: articleData.title,
              seo_description: articleData.seo_description,
              seo_keywords: articleData.keywords,
              tags: articleData.keywords,
              is_featured: i === 0 // Mark first article as featured
            }

            const { data: inserted } = await supabaseClient
              .from('ai_generated_articles')
              .insert(article)
              .select()
              .single()

            if (inserted) {
              articles.push(inserted)
            }
          }
        } catch (parseError) {
          console.error('Error parsing article JSON:', parseError)
        }
      }

      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        articles,
        count: articles.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
