
-- Add full_content column to news_articles table to store complete article content
ALTER TABLE public.news_articles 
ADD COLUMN full_content TEXT;

-- Add index for better performance when searching through content
CREATE INDEX IF NOT EXISTS idx_news_articles_full_content 
ON public.news_articles USING gin(to_tsvector('english', full_content));
