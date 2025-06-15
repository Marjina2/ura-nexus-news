
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const serpApiKey = Deno.env.get('SERP_API_KEY');

    if (!geminiApiKey) throw new Error('GEMINI_API_KEY missing');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // --- 1. Fetch all active API keys and select current by least recently used (LRU) ---
    const { data: apiKeys, error: keysError } = await supabase
      .from('gnews_api_keys')
      .select('*')
      .eq('is_active', true)
      .order('last_used', { ascending: true });

    if (keysError || !apiKeys || apiKeys.length === 0)
      throw new Error('No GNews API keys configured');

    // Helper to fetch using available API keys, rotates if error
    async function fetchArticlesFromAnyKey(category, max) {
      let lastError;
      for (let i = 0; i < apiKeys.length; i++) {
        const keyObj = apiKeys[i];
        const key = keyObj.api_key;
        let qParam = category && category !== 'all' ? `&topic=${encodeURIComponent(category)}` : '';
        const url = `https://gnews.io/api/v4/top-headlines?token=${key}&lang=en&max=${max}${qParam}`;
        try {
          const resp = await fetch(url);
          const data = await resp.json();
          if (data?.articles && data.articles.length > 0) {
            // Update key usage timestamp
            await supabase.from('gnews_api_keys')
              .update({ last_used: new Date().toISOString() })
              .eq('id', keyObj.id);
            return data.articles;
          }
          lastError = data?.errors || data?.message || 'Unknown empty articles error';
        } catch (e) {
          lastError = e.message || e.toString();
        }
      }
      throw new Error("All GNews APIs failed: " + lastError);
    }

    // --- 2. For each category, fetch 10 articles ---
    const categories = [
      "general", "business", "entertainment", "health", "science", "sports", "technology"
    ];
    let allArticles = [];
    for (const cat of categories) {
      let articles = [];
      try {
        articles = await fetchArticlesFromAnyKey(cat, 10);
      } catch (e) {
        console.log(`Error fetching ${cat}:`, e);
      }
      if (articles) {
        // Attach category info
        articles.forEach(a => allArticles.push({ ...a, category: cat }));
      }
    }

    // --- 3. Deduplicate by source URL/title ---
    const seenUrls = new Set();
    const dedupedArticles = [];
    for (const art of allArticles) {
      const url = art.url || art.source_url;
      if (!url || seenUrls.has(url)) continue;
      seenUrls.add(url);

      // Avoid very low-res/pixelated images
      let image_url = art.image || art.image_url || null;
      if (image_url && (image_url.includes("pixel") || image_url.includes("placeholder"))) {
        image_url = null;
      }

      // Prefer full content, fallback order
      let full_content = art.content || art.full_content || art.description || '';
      if (full_content.length < 100 && art.description?.length > full_content.length) {
        full_content = art.description;
      }

      dedupedArticles.push({
        original_title: art.title || "",
        rephrased_title: null,
        summary: art.description || '',
        full_content,
        image_url,
        source_url: url,
        category: art.category,
        created_at: art.publishedAt || art.created_at || new Date().toISOString(),
      });
    }

    // --- 4. Insert into news_articles ---
    let inserted = 0;
    for (const insertObj of dedupedArticles) {
      // Only insert if not present already (dedup by source_url)
      const { data: exists, error: selectErr } = await supabase
        .from('news_articles')
        .select('id')
        .eq('source_url', insertObj.source_url)
        .maybeSingle();
      if (!exists) {
        const { error: insError } = await supabase
          .from('news_articles')
          .insert([insertObj]);
        if (!insError) inserted++;
      }
    }

    return new Response(
      JSON.stringify({ ok: true, saved: inserted, articles_fetched: dedupedArticles.length }),
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
