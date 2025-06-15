
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
    // Securely get all keys
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const newsdataApiKey = Deno.env.get('NEWSDATA_API_KEY');
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const serpApiKey = Deno.env.get('SERP_API_KEY');
    if (!newsdataApiKey || !geminiApiKey) {
      throw new Error('API keys for NewsData/Gemini are missing.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch the latest article from NewsData.io (India, top news)
    const ndUrl = `https://newsdata.io/api/1/news?apikey=${newsdataApiKey}&country=in&language=en&category=top&size=5`;
    const ndResponse = await fetch(ndUrl);
    const ndData = await ndResponse.json();

    let foundArticle = null;
    if (ndData?.results?.length) {
      for (const article of ndData.results) {
        // Choose article with decent content
        const contentLength = (article.content || article.description || '').length;
        if (contentLength < 100) continue; // skip too short
        foundArticle = article;
        break;
      }
    }
    if (!foundArticle) throw new Error("No suitable news article found from NewsData.io");

    const { title, content, description, link, image_url } = foundArticle;

    // 2. Use Gemini to rephrase
    let rephrasedTitle = title;
    let summary = description || '';
    let geminiSuccess = false;
    try {
      const geminiPrompt = `Rephrase the following news article for publishing on a modern news site. Keep it neutral and clear:\n\nTitle: ${title}\nContent: ${(content || description || '')}`;
      const geminiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: { temperature: 0.3, topK: 1, topP: 1, maxOutputTokens: 350 }
        }),
      });
      const geminiData = await geminiResp.json();
      if (geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        summary = geminiData.candidates[0].content.parts[0].text.trim();
        geminiSuccess = true;
        // Optionally Gemini can rephrase the title specifically:
        const geminiTitleResp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `Rephrase this news headline for a modern news site, keep it under 10 words:\n\n${title}` }] }],
              generationConfig: { temperature: 0.25, topK: 1, topP: 1, maxOutputTokens: 25 }
            })
        });
        const gtitle = await geminiTitleResp.json();
        if (gtitle?.candidates?.[0]?.content?.parts?.[0]?.text) {
          rephrasedTitle = gtitle.candidates[0].content.parts[0].text.trim();
        }
      }
    } catch (e) {
      geminiSuccess = false;
      // fallback below
    }

    // 3. Optionally improve image with SerpAPI, else fallback to NewsData image, else Pexels
    let finalImage = image_url || null;
    if (serpApiKey) {
      try {
        const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(title)} site:bbc.com OR site:cnn.com OR site:ndtv.com&tbm=nws&api_key=${serpApiKey}`;
        const serpRes = await fetch(serpUrl);
        const serpData = await serpRes.json();
        const newsImg = serpData.news_results?.find(
          (res: any) => res.thumbnail && res.thumbnail.startsWith('http')
        )?.thumbnail;
        if (newsImg) finalImage = newsImg;
        // Optionally check image-search
        if (!finalImage) {
          const serpImageUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(title)}&tbm=isch&api_key=${serpApiKey}&num=1`;
          const serpImgRes = await fetch(serpImageUrl);
          const serpImgData = await serpImgRes.json();
          const img = serpImgData.images_results?.find((i: any) => i.original)?.original;
          if (img) finalImage = img;
        }
      } catch (e) {
        // No SerpAPI fallback
      }
    }
    // Fallback: Use Pexels/Pixabay API (skipped here), or standard Unsplash
    if (!finalImage) {
      finalImage = "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop";
    }

    // 4. Insert into Supabase news_articles, fallback to newsdata-only if Gemini failed
    const toInsert = {
      original_title: title,
      rephrased_title: rephrasedTitle,
      summary,
      image_url: finalImage,
      source_url: link,
      created_at: new Date().toISOString(),
    };
    const { error: insError, data: insData } = await supabase
      .from('news_articles')
      .insert([ toInsert ]);
    if (insError) throw insError;

    return new Response(JSON.stringify({
      ok: true,
      message: "News article fetched, rephrased, and saved.",
      data: toInsert,
      usedGemini: geminiSuccess,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error("auto-publish-news error", err);
    return new Response(
      JSON.stringify({ error: true, details: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
