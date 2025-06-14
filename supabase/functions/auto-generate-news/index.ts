import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology', 'politics'];
const countries = ['in', 'us', 'gb', 'au', 'ca'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting automated news generation...');
    
    const batchId = crypto.randomUUID();
    const currentTime = new Date();
    const nextGenTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Next hour

    for (const country of countries) {
      for (const category of categories) {
        try {
          console.log(`Generating news for ${category} in ${country}...`);
          
          // Check if we need to generate for this category/country
          const { data: existingArticles } = await supabase
            .from('ai_generated_articles')
            .select('id')
            .eq('category', category)
            .eq('country', country)
            .eq('auto_generated', true)
            .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

          if (existingArticles && existingArticles.length >= 2) {
            console.log(`Skipping ${category}/${country} - already has recent articles`);
            continue;
          }

          // Generate articles for this category
          const articlesToGenerate = 2;
          
          for (let i = 0; i < articlesToGenerate; i++) {
            const prompt = `Generate a fresh, unique news article about ${category} from ${country === 'in' ? 'India' : 'the ' + country.toUpperCase()} region. 

Requirements:
- Title should be compelling and news-worthy
- Content should be 800-1200 words
- Include specific details, quotes, and context
- Make it engaging and informative
- Focus on recent developments
- Include relevant statistics or data points
- Add a compelling summary (150-200 words)
- Suggest 5-7 relevant tags
- Provide SEO-optimized title and description
- Make sure the content feels authentic and well-researched

Format your response as JSON:
{
  "title": "Article title",
  "content": "Full article content with proper formatting",
  "summary": "Article summary",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seo_title": "SEO optimized title",
  "seo_description": "SEO description",
  "seo_keywords": ["keyword1", "keyword2", "keyword3"]
}`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: prompt
                  }]
                }],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 2048,
                }
              })
            });

            if (!response.ok) {
              console.error(`Gemini API error: ${response.status}`);
              continue;
            }

            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
              console.error('No content generated');
              continue;
            }

            try {
              // Clean and parse JSON
              const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
              const articleData = JSON.parse(cleanedText);

              // Generate appropriate image URL
              const imageUrl = generateImageUrl(category, articleData.title);

              // Insert the article
              const { error: insertError } = await supabase
                .from('ai_generated_articles')
                .insert({
                  title: articleData.title,
                  content: articleData.content,
                  summary: articleData.summary,
                  category: category,
                  country: country,
                  author: 'URA News AI',
                  tags: articleData.tags,
                  image_url: imageUrl,
                  seo_title: articleData.seo_title,
                  seo_description: articleData.seo_description,
                  seo_keywords: articleData.seo_keywords,
                  auto_generated: true,
                  generation_batch_id: batchId,
                  next_generation_time: nextGenTime.toISOString()
                });

              if (insertError) {
                console.error('Error inserting article:', insertError);
                continue;
              }

              console.log(`Generated article for ${category}/${country}: ${articleData.title}`);
              
            } catch (parseError) {
              console.error('Error parsing generated content:', parseError);
              continue;
            }
          }
          
        } catch (categoryError) {
          console.error(`Error generating for ${category}/${country}:`, categoryError);
          continue;
        }
      }
    }

    // Clean up old articles (keep only last 50 per category/country)
    for (const country of countries) {
      for (const category of categories) {
        const { data: oldArticles } = await supabase
          .from('ai_generated_articles')
          .select('id')
          .eq('category', category)
          .eq('country', country)
          .eq('auto_generated', true)
          .order('created_at', { ascending: false })
          .range(50, 1000);

        if (oldArticles && oldArticles.length > 0) {
          const idsToDelete = oldArticles.map(article => article.id);
          await supabase
            .from('ai_generated_articles')
            .delete()
            .in('id', idsToDelete);
        }
      }
    }

    console.log('Automated news generation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'News generation completed',
        batchId: batchId,
        timestamp: currentTime.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-generate-news:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateImageUrl(category: string, title: string): string {
  const keywords = (category + ' ' + title).toLowerCase();
  
  if (keywords.includes('technology') || keywords.includes('tech') || keywords.includes('ai') || keywords.includes('software')) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop';
  }
  if (keywords.includes('business') || keywords.includes('finance') || keywords.includes('economy') || keywords.includes('market')) {
    return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop';
  }
  if (keywords.includes('health') || keywords.includes('medical') || keywords.includes('healthcare')) {
    return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
  }
  if (keywords.includes('sports') || keywords.includes('cricket') || keywords.includes('football')) {
    return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop';
  }
  if (keywords.includes('politics') || keywords.includes('government') || keywords.includes('election')) {
    return 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop';
  }
  if (keywords.includes('entertainment') || keywords.includes('movie') || keywords.includes('bollywood')) {
    return 'https://images.unsplash.com/photo-1489599687945-e138957ad296?w=800&h=600&fit=crop';
  }
  if (keywords.includes('science') || keywords.includes('research') || keywords.includes('study')) {
    return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop';
  }
  
  return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop';
}
