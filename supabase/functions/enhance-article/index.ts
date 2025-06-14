
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
    const { title, description, content, url } = await req.json()
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    const prompt = `
    You are an AI news editor. Please enhance this news article with the following:
    
    Original Title: ${title}
    Description: ${description}
    Content: ${content || description}
    
    Please provide a response in this exact JSON format:
    {
      "enhancedTitle": "An improved, engaging title",
      "summary": "A clear 2-3 sentence summary",
      "keyPoints": ["point 1", "point 2", "point 3"],
      "enhancedContent": "Enhanced article content with better structure and readability",
      "tags": ["tag1", "tag2", "tag3"]
    }
    
    Make the content more engaging while maintaining accuracy. Focus on clarity and readability.
    `

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`
    
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
    
    if (!geminiResponse.ok) {
      throw new Error(geminiData.error?.message || 'Failed to enhance article')
    }

    const enhancedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!enhancedText) {
      throw new Error('No enhanced content received from Gemini')
    }

    // Try to parse the JSON response from Gemini
    let enhancedData
    try {
      enhancedData = JSON.parse(enhancedText)
    } catch (e) {
      // If parsing fails, create a basic enhanced structure
      enhancedData = {
        enhancedTitle: title,
        summary: description,
        keyPoints: [title],
        enhancedContent: content || description,
        tags: ['news']
      }
    }

    return new Response(
      JSON.stringify(enhancedData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error enhancing article:', error)
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
