
-- Table to store multiple GNews API keys
CREATE TABLE public.gnews_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key text NOT NULL,
  key_name text,
  is_active boolean DEFAULT true,
  last_used timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Add simple RLS: only admins (backend) can read/write
ALTER TABLE public.gnews_api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage api keys"
  ON public.gnews_api_keys
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
