
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const serpApiKey = Deno.env.get('SERP_API_KEY');

    if (!geminiApiKey || !serpApiKey) {
      throw new Error('Missing required API keys');
    }

    console.log('Starting spotlight update process...');

    // Step 1: Get current major news topics from Gemini
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a news analyst. Identify the top 1 most groundbreaking, urgent, or breaking news story happening RIGHT NOW today that would be considered spotlight-worthy. 

Focus on:
- Breaking news events
- Major political developments
- Natural disasters or emergencies
- Revolutionary technological breakthroughs
- Major economic events
- Significant global incidents

Return ONLY a JSON object with this exact structure:
{
  "title": "Brief, compelling headline (max 80 characters)",
  "query": "Search query for finding more details and images (2-4 keywords)",
  "event_type": "breaking|urgent|trending",
  "priority": 1,
  "location": "City, Country (if applicable)",
  "summary": "2-3 sentence summary of why this is groundbreaking"
}

Make it current, urgent, and newsworthy for today.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 1,
          maxOutputTokens: 300,
        }
      })
    });

    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', geminiData);

    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid Gemini API response');
    }

    let newsData;
    try {
      const responseText = geminiData.candidates[0].content.parts[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        newsData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in Gemini response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse news data from Gemini');
    }

    console.log('Parsed news data:', newsData);

    // Step 2: Get images and additional headlines from SERP API
    const serpResponse = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(newsData.query + ' breaking news')}&tbm=nws&api_key=${serpApiKey}&num=5`);
    const serpData = await serpResponse.json();

    console.log('SERP API response:', serpData);

    // Get image from SERP Images API
    const imageResponse = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(newsData.query)}&tbm=isch&api_key=${serpApiKey}&num=1`);
    const imageData = await imageResponse.json();

    const imageUrl = imageData.images_results?.[0]?.original || 'https://images.unsplash.com/photo-1544963813-d0c8aed83b37?w=800&h=600&fit=crop';

    // Step 3: Create comprehensive content
    const newsArticles = serpData.news_results || [];
    let content = `**BREAKING:** ${newsData.title}\n\n`;
    
    content += `**SITUATION UPDATE:**\n${newsData.summary}\n\n`;
    
    if (newsArticles.length > 0) {
      content += `**LATEST DEVELOPMENTS:**\n`;
      newsArticles.slice(0, 3).forEach((article, index) => {
        content += `• ${article.title}\n`;
      });
      content += `\n`;
    }

    content += `**CURRENT STATUS:**\nThis is a developing story with ongoing updates. Our team is monitoring the situation closely and will provide real-time updates as new information becomes available.\n\n`;
    
    content += `**SOURCES:**\nInformation compiled from multiple verified news sources and real-time reporting.`;

    // Step 4: Deactivate old spotlight articles
    await supabaseClient
      .from('spotlight_articles')
      .update({ is_active: false })
      .eq('is_active', true);

    // Step 5: Insert new spotlight article
    const newSpotlight = {
      title: newsData.title,
      content: content,
      summary: newsData.summary,
      event_type: newsData.event_type || 'breaking',
      priority: newsData.priority || 1,
      image_url: imageUrl,
      video_urls: [],
      tags: newsData.query.split(' ').filter(tag => tag.length > 2),
      location: newsData.location || '',
      casualties_count: 0,
      emergency_contacts: {},
      live_updates: [
        {
          timestamp: new Date().toISOString(),
          update: "Spotlight article automatically generated from current breaking news",
          source: "AI News System"
        }
      ],
      sources: newsArticles.slice(0, 3).map(article => ({
        name: article.source || 'News Source',
        type: 'verified',
        url: article.link || ''
      })),
      is_active: true,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    const { data: insertData, error: insertError } = await supabaseClient
      .from('spotlight_articles')
      .insert([newSpotlight])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Successfully created new spotlight article:', insertData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Spotlight updated successfully',
        article: insertData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating spotlight:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update spotlight', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
