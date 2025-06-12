
-- Create a table for cached top articles
CREATE TABLE public.cached_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL UNIQUE,
  url_to_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  source_name TEXT NOT NULL,
  content TEXT,
  enhanced_title TEXT,
  enhanced_content TEXT,
  summary TEXT,
  key_points TEXT[],
  tags TEXT[],
  seo_optimized BOOLEAN DEFAULT false,
  cached_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  category TEXT DEFAULT 'general'
);

-- Create index for better performance
CREATE INDEX idx_cached_articles_published_at ON public.cached_articles(published_at DESC);
CREATE INDEX idx_cached_articles_category ON public.cached_articles(category);

-- Enable RLS (make it public readable since these are cached news articles)
ALTER TABLE public.cached_articles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to cached articles" 
  ON public.cached_articles 
  FOR SELECT 
  USING (true);

-- Create storage bucket for article images and content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article-cache', 'article-cache', true);

-- Create policy for public access to article cache bucket
CREATE POLICY "Allow public access to article cache bucket" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'article-cache');
