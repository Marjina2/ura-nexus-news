
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

    const spotlightDate = new Date();
    const formattedDate = spotlightDate.toISOString().substring(0, 10);

    // Step 1: Use Gemini to get detailed summary and structured spotlight stats
    const geminiPrompt = `
You are a Spotlight news assistant for India.
1. Analyze today's top news and extract the following as a JSON object:
{
  "topic": "very concise summary of topic, e.g. 'Train Crash in Odisha'",
  "summary": "1-2 sentences summarizing the importance",
  "query": "Google News search phrase",
  "full_report_prompt": "Prompt for a detailed summary, timeline, insights",
  "casualties_count": (integer or null, number of deaths if any, else null),
  "survivors_count": (integer or null, number of confirmed survivors if relevant, else null),
  "location": (string or null, city/state/country/event location if known, else null),
  "black_box_found": (true/false/null for air/train/ship disasters, if known, else null),
  "emergency_contacts": (object with label:number pairs, e.g. {"Railways Helpline":"12345"}, or null if not relevant)
}
- Return ONLY this single JSON, no commentary, always respect the structure, always include all keys (use null if unknown).
- If it's not a disaster, set the "casualties_count", "survivors_count", "black_box_found", "emergency_contacts" to null.
`;
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: geminiPrompt }]
        }],
        generationConfig: { temperature: 0.2, topK: 1, topP: 1, maxOutputTokens: 600 }
      })
    });

    const geminiData = await geminiResponse.json();
    let topicData = null;
    if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = geminiData.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          topicData = JSON.parse(jsonMatch[0]);
        } catch {
          throw new Error('Failed to parse Gemini JSON');
        }
      }
    }
    if (!topicData) throw new Error('No topic data from Gemini');
    // fallback for missing keys
    topicData.casualties_count ??= null;
    topicData.survivors_count ??= null;
    topicData.location ??= null;
    topicData.black_box_found ??= null;
    topicData.emergency_contacts ??= null;

    // Step 2: Use SerpAPI to get the top headline & image
    const serpNewsUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(topicData.query + " site:indiatimes.com OR site:ndtv.com")}&tbm=nws&api_key=${serpApiKey}`;
    const serpNewsResponse = await fetch(serpNewsUrl);
    const serpNewsData = await serpNewsResponse.json();
    const firstNews = serpNewsData.news_results?.[0];

    const serpImageUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(topicData.query)}&tbm=isch&api_key=${serpApiKey}&num=1`;
    const serpImageResponse = await fetch(serpImageUrl);
    const serpImageData = await serpImageResponse.json();

    const seoTitle = firstNews?.title || topicData.topic || "Today's Spotlight";
    const imageUrl = serpImageData.images_results?.[0]?.original ||
      firstNews?.thumbnail ||
      "https://images.unsplash.com/photo-1544963813-d0c8aed83b37?w=800&h=600&fit=crop";

    // Step 3: Get full report using Gemini
    let fullReport = "";
    try {
      const reportResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a full summary (3+ paragraphs, include sub-topics and timeline where available):\nTopic: ${topicData.topic}\nPrompt: ${topicData.full_report_prompt}`
            }]
          }],
          generationConfig: { temperature: 0.2, topK: 1, topP: 1, maxOutputTokens: 900 }
        })
      });
      const reportData = await reportResponse.json();
      fullReport = reportData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (e) {
      fullReport = "";
    }

    // Step 4: Upsert spotlight_news for today with all smart details
    const { data: existing, error: selectErr } = await supabaseClient
      .from('spotlight_news')
      .select('id')
      .eq('date', formattedDate)
      .maybeSingle();

    let insertRes;
    const spotlightFields = {
      gemini_topic: topicData.topic,
      summary: topicData.summary,
      seo_title: seoTitle,
      image_url: imageUrl,
      full_report: fullReport,
      casualties_count: topicData.casualties_count,
      survivors_count: topicData.survivors_count,
      location: topicData.location,
      black_box_found: topicData.black_box_found,
      emergency_contacts: topicData.emergency_contacts,
      updated_at: new Date().toISOString()
    };
    if (existing?.id) {
      insertRes = await supabaseClient
        .from('spotlight_news')
        .update(spotlightFields)
        .eq('id', existing.id)
        .select().single();
    } else {
      insertRes = await supabaseClient
        .from('spotlight_news')
        .insert([
          { 
            date: formattedDate,
            ...spotlightFields
          }
        ])
        .select().single();
    }
    if (insertRes.error) throw insertRes.error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Spotlight news updated for today (AI smart details)',
        spotlight: insertRes.data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Spotlight news function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Spotlight news automation failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
