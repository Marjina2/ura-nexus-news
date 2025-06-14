
-- Create the spotlight_news table for daily prominent news
create table public.spotlight_news (
  id uuid not null default gen_random_uuid() primary key,
  date date not null unique,
  gemini_topic text not null,
  summary text,
  seo_title text,
  image_url text,
  full_report text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.spotlight_news enable row level security;

-- Anyone can read spotlight news
create policy "Allow read for all users" on public.spotlight_news
  for select using (true);

-- Only service roles can insert/update (for serverless function)
create policy "Service role insert/update spotlight" on public.spotlight_news
  for insert with check (auth.role() = 'service_role');
create policy "Service role update spotlight" on public.spotlight_news
  for update using (auth.role() = 'service_role');
