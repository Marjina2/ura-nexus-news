
-- Create table for AI-generated news articles
CREATE TABLE public.ai_generated_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'in',
  author TEXT DEFAULT 'AI News Assistant',
  tags TEXT[],
  image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false
);

-- Add RLS policies for AI generated articles
ALTER TABLE public.ai_generated_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to AI generated articles
CREATE POLICY "Public read access to AI articles" 
  ON public.ai_generated_articles 
  FOR SELECT 
  USING (true);

-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-images', 
  'article-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create policy for public read access to article images
CREATE POLICY "Public read access to article images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images');

-- Create policy for service role to upload images
CREATE POLICY "Service role can upload article images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'article-images' AND auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_ai_articles_category ON public.ai_generated_articles(category);
CREATE INDEX idx_ai_articles_country ON public.ai_generated_articles(country);
CREATE INDEX idx_ai_articles_published_at ON public.ai_generated_articles(published_at DESC);
CREATE INDEX idx_ai_articles_featured ON public.ai_generated_articles(is_featured) WHERE is_featured = true;

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at_ai_articles
  BEFORE UPDATE ON public.ai_generated_articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
