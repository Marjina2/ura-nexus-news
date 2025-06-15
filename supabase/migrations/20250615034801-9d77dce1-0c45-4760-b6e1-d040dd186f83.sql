
-- Table to store automated rephrased news articles
CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_title text NOT NULL,
  rephrased_title text,
  summary text,
  image_url text,
  source_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security (so users only see what's public)
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Anyone can read news_articles (public news feed)
CREATE POLICY "Allow read for all users" ON public.news_articles FOR SELECT USING (true);

-- Only system functions can insert (service role)
CREATE POLICY "Service role insert news" ON public.news_articles FOR INSERT WITH CHECK (auth.role() = 'service_role');
