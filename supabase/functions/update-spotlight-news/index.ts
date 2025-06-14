
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

    // Step 1: Use Gemini to get today's most important topic
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `What is today's most important, headline-worthy news topic in India? Return a JSON object:
{
  "topic": "very concise summary of topic, e.g. 'XYZ Bill Passed'",
  "summary": "1-2 sentences summarizing the importance",
  "query": "short search phrase for Google News, e.g. 'XYZ Bill Indian Parliament'",
  "full_report_prompt": "give me a more detailed summary, timeline & insights"
}
Just the JSON object, no commentary.`
          }]
        }],
        generationConfig: { temperature: 0.2, topK: 1, topP: 1, maxOutputTokens: 400 }
      })
    });

    const geminiData = await geminiResponse.json();
    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid Gemini response');
    }
    let topicData;
    try {
      const text = geminiData.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      topicData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      throw new Error('Failed to parse Gemini response');
    }
    if (!topicData) throw new Error('No topic data from Gemini');

    // Step 2: Use SerpAPI to get headline & image
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

    // Step 3: Lazy-load full_report if needed
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

    // Step 4: Upsert for today's date (so you don't get duplicates/race)
    const { data: existing, error: selectErr } = await supabaseClient
      .from('spotlight_news')
      .select('id')
      .eq('date', formattedDate)
      .maybeSingle();

    let insertRes;
    if (existing?.id) {
      insertRes = await supabaseClient
        .from('spotlight_news')
        .update({
          gemini_topic: topicData.topic,
          summary: topicData.summary,
          seo_title: seoTitle,
          image_url: imageUrl,
          full_report: fullReport,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select().single();
    } else {
      insertRes = await supabaseClient
        .from('spotlight_news')
        .insert([{
          date: formattedDate,
          gemini_topic: topicData.topic,
          summary: topicData.summary,
          seo_title: seoTitle,
          image_url: imageUrl,
          full_report: fullReport
        }])
        .select().single();
    }

    if (insertRes.error) throw insertRes.error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Spotlight news updated for today',
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
