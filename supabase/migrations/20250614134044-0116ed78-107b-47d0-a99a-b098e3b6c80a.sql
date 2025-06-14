
-- Create table for saved articles that users have opened
CREATE TABLE public.saved_articles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  content text,
  url text NOT NULL,
  image_url text,
  published_at timestamp with time zone,
  source_name text,
  category text DEFAULT 'general',
  view_count integer DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(url)
);

-- Create table for user bookmarks
CREATE TABLE public.user_bookmarks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_url text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  source_name text,
  bookmarked_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_url)
);

-- Enable RLS on both tables
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies for saved_articles (public read, but only system can insert)
CREATE POLICY "Anyone can view saved articles" 
  ON public.saved_articles 
  FOR SELECT 
  USING (true);

-- Policies for user_bookmarks (users can only see their own bookmarks)
CREATE POLICY "Users can view their own bookmarks" 
  ON public.user_bookmarks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
  ON public.user_bookmarks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.user_bookmarks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_article_views(article_url text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.saved_articles 
  SET view_count = view_count + 1, updated_at = now()
  WHERE url = article_url;
END;
$$;
