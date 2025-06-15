
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const gnewsApiKey = Deno.env.get('GNEWS_API_KEY');
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const serpApiKey = Deno.env.get('SERP_API_KEY');

    if (!gnewsApiKey || !geminiApiKey) {
      throw new Error('API keys for GNews/Gemini are missing.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch 8 India news + 2 global news
    const fetchArticles = async (q: string | null, max: number) => {
      const baseUrl = `https://gnews.io/api/v4/top-headlines?token=${gnewsApiKey}&lang=en&max=${max}`;
      const params = q ? `&q=${encodeURIComponent(q)}` : '';
      const url = baseUrl + params;
      const resp = await fetch(url);
      const data = await resp.json();
      if (!data.articles || data.articles.length === 0) throw new Error("No GNews articles found");
      return data.articles;
    };

    // 8 articles about India
    const indiaArticles = await fetchArticles("India", 8);
    // 2 global
    const globalArticles = await fetchArticles(null, 2);

    const fullArticles = [...indiaArticles, ...globalArticles].slice(0, 10);

    // 2. For each article: Gemini rephrase & summary, SerpAPI image
    const results = [];
    for (const art of fullArticles) {
      const { title, description, content, url, image, publishedAt } = art;
      let rephrasedTitle = title;
      let summary = description || '';
      let geminiSuccess = false;

      // Gemini for summary
      try {
        const geminiPrompt = `Rephrase the following news article for a modern news platform. Use clear, neutral language. Summarize in 80 words or less:\n\nTitle: ${title}\nContent: ${(content || description || '')}`;
        const geminiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
            generationConfig: { temperature: 0.3, topK: 1, topP: 1, maxOutputTokens: 320 },
          }),
        });
        const geminiData = await geminiResp.json();
        if (geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
          summary = geminiData.candidates[0].content.parts[0].text.trim();
          geminiSuccess = true;
          // Try a Gemini-rephrased title
          const titlePrompt = `Rephrase this headline for a news site in less than 10 words:\n\n${title}`;
          const geminiTitleResp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: titlePrompt }] }],
                generationConfig: { temperature: 0.25, topK: 1, topP: 1, maxOutputTokens: 25 },
              }),
          });
          const gtitle = await geminiTitleResp.json();
          if (gtitle?.candidates?.[0]?.content?.parts?.[0]?.text) {
            rephrasedTitle = gtitle.candidates[0].content.parts[0].text.trim();
          }
        }
      } catch (e) {
        geminiSuccess = false;
        // fallback continues...
      }

      // Use SerpAPI for best image if possible
      let finalImage = image || null;
      if (serpApiKey) {
        try {
          const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(title)} site:bbc.com OR site:cnn.com OR site:ndtv.com&tbm=nws&api_key=${serpApiKey}`;
          const serpRes = await fetch(serpUrl);
          const serpData = await serpRes.json();
          const newsImg = serpData.news_results?.find(
            (res: any) => res.thumbnail && res.thumbnail.startsWith('http')
          )?.thumbnail;
          if (newsImg) finalImage = newsImg;
          if (!finalImage) {
            const serpImageUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(title)}&tbm=isch&api_key=${serpApiKey}&num=1`;
            const serpImgRes = await fetch(serpImageUrl);
            const serpImgData = await serpImgRes.json();
            const img = serpImgData.images_results?.find((i: any) => i.original)?.original;
            if (img) finalImage = img;
          }
        } catch (e) {
          // fallback continues...
        }
      }
      if (!finalImage) {
        finalImage = "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop";
      }

      // 3. Insert into news_articles
      const insertObj = {
        original_title: title || "",
        rephrased_title: rephrasedTitle,
        summary,
        image_url: finalImage,
        source_url: url,
        created_at: publishedAt || new Date().toISOString(),
      };

      const { error: insError } = await supabase
        .from('news_articles')
        .insert([insertObj]);
      if (insError) throw insError;

      results.push({ ...insertObj, geminiSuccess });
    }

    return new Response(
      JSON.stringify({ ok: true, saved: results.length, articles: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error("auto-publish-gnews error", err);
    return new Response(
      JSON.stringify({ error: true, details: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
