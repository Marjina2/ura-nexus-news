-- SQL script to create necessary tables in Supabase for news platform
-- Run this in your Supabase SQL Editor

-- Create articles table for main news content
CREATE TABLE IF NOT EXISTS public.articles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    content text,
    url text,
    image_url text,
    source text,
    author text,
    category text DEFAULT 'general',
    country text DEFAULT 'us',
    language text DEFAULT 'en',
    published_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create cached_articles table for cached news content
CREATE TABLE IF NOT EXISTS public.cached_articles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    content text,
    url text,
    image_url text,
    source text,
    author text,
    category text DEFAULT 'general',
    country text DEFAULT 'us',
    language text DEFAULT 'en',
    published_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    cache_expires_at timestamp with time zone
);

-- Create spotlight_articles table for featured/breaking news
CREATE TABLE IF NOT EXISTS public.spotlight_articles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    content text,
    url text,
    image_url text,
    source text,
    author text,
    category text DEFAULT 'general',
    country text DEFAULT 'us',
    language text DEFAULT 'en',
    published_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    priority integer DEFAULT 1
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_country ON public.articles(country);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cached_articles_category ON public.cached_articles(category);
CREATE INDEX IF NOT EXISTS idx_cached_articles_country ON public.cached_articles(country);
CREATE INDEX IF NOT EXISTS idx_cached_articles_created_at ON public.cached_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cached_articles_cache_expires ON public.cached_articles(cache_expires_at);

CREATE INDEX IF NOT EXISTS idx_spotlight_articles_active ON public.spotlight_articles(is_active);
CREATE INDEX IF NOT EXISTS idx_spotlight_articles_priority ON public.spotlight_articles(priority DESC);
CREATE INDEX IF NOT EXISTS idx_spotlight_articles_published_at ON public.spotlight_articles(published_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cached_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spotlight_articles ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (since this is news content)
CREATE POLICY "Allow public read access on articles" ON public.articles
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on cached_articles" ON public.cached_articles
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on spotlight_articles" ON public.spotlight_articles
    FOR SELECT USING (true);

-- Create policies for authenticated insert/update (for admin functions)
CREATE POLICY "Allow authenticated insert on articles" ON public.articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on cached_articles" ON public.cached_articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on spotlight_articles" ON public.spotlight_articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cached_articles_updated_at BEFORE UPDATE ON public.cached_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spotlight_articles_updated_at BEFORE UPDATE ON public.spotlight_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.articles (title, description, content, source, author, category, country) VALUES
('Sample Technology News', 'Latest technology developments and innovations', 'This is a comprehensive article about technology trends...', 'Tech News', 'Tech Reporter', 'technology', 'us'),
('Sample Business News', 'Important business and economic updates', 'This article covers recent business developments...', 'Business Today', 'Business Reporter', 'business', 'us'),
('Sample Health News', 'Health and wellness updates', 'This article discusses health trends and medical news...', 'Health Times', 'Health Reporter', 'health', 'us');

INSERT INTO public.cached_articles (title, description, content, source, author, category, country, cache_expires_at) VALUES
('Cached Tech Article', 'Cached technology news for quick access', 'This is a cached article for faster loading...', 'Tech Cache', 'Tech Author', 'technology', 'us', now() + interval '1 day'),
('Cached Business Article', 'Cached business news', 'This is a cached business article...', 'Business Cache', 'Business Author', 'business', 'us', now() + interval '1 day');

INSERT INTO public.spotlight_articles (title, description, content, source, author, category, country, is_active, priority) VALUES
('Breaking News: Major Technology Breakthrough', 'Important technology breakthrough announced', 'This is a spotlight article about a major technology breakthrough...', 'Spotlight News', 'Spotlight Reporter', 'technology', 'us', true, 1),
('Spotlight: Market Update', 'Important market developments', 'This spotlight article covers major market movements...', 'Market Watch', 'Market Reporter', 'business', 'us', true, 2);