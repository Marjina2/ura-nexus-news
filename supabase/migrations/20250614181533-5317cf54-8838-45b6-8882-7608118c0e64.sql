
-- Add smart structured fields for detailed spotlight stats to spotlight_news
ALTER TABLE public.spotlight_news
  ADD COLUMN IF NOT EXISTS casualties_count integer,
  ADD COLUMN IF NOT EXISTS survivors_count integer,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS black_box_found boolean,
  ADD COLUMN IF NOT EXISTS emergency_contacts jsonb;
