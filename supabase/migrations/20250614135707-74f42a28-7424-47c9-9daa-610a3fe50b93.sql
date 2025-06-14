
-- Create table for spotlight articles (today's breaking news)
CREATE TABLE public.spotlight_articles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  event_type text NOT NULL, -- 'breaking', 'revolutionary', 'urgent'
  priority integer DEFAULT 1, -- 1 highest, 5 lowest
  image_url text,
  video_urls text[], -- array of video URLs
  tags text[],
  location text,
  casualties_count integer,
  emergency_contacts jsonb,
  live_updates jsonb[], -- array of timestamped updates
  sources jsonb[], -- credible sources
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '24 hours')
);

-- Add auto-generation tracking to AI articles
ALTER TABLE public.ai_generated_articles 
ADD COLUMN IF NOT EXISTS auto_generated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS generation_batch_id uuid,
ADD COLUMN IF NOT EXISTS next_generation_time timestamp with time zone;

-- Enable RLS
ALTER TABLE public.spotlight_articles ENABLE ROW LEVEL SECURITY;

-- Public read policy for spotlight articles
CREATE POLICY "Anyone can view active spotlight articles" 
  ON public.spotlight_articles 
  FOR SELECT 
  USING (is_active = true AND expires_at > now());

-- Create indexes for performance
CREATE INDEX idx_spotlight_priority ON public.spotlight_articles(priority, created_at DESC) WHERE is_active = true;
CREATE INDEX idx_spotlight_event_type ON public.spotlight_articles(event_type, created_at DESC) WHERE is_active = true;
CREATE INDEX idx_ai_articles_category_country ON public.ai_generated_articles(category, country, created_at DESC);

-- Function to clean up expired spotlight articles
CREATE OR REPLACE FUNCTION public.cleanup_expired_spotlight()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.spotlight_articles 
  SET is_active = false 
  WHERE expires_at <= now() AND is_active = true;
END;
$$;

-- Insert Ahmedabad plane crash spotlight article
INSERT INTO public.spotlight_articles (
  title,
  content,
  summary,
  event_type,
  priority,
  image_url,
  video_urls,
  tags,
  location,
  casualties_count,
  emergency_contacts,
  live_updates,
  sources
) VALUES (
  'Breaking: Aircraft Incident Reported in Ahmedabad - Emergency Response Underway',
  'AHMEDABAD, INDIA - Emergency services are responding to an aircraft incident in the Ahmedabad region. Initial reports suggest significant emergency response has been mobilized to the scene.

**INCIDENT DETAILS:**
• Location: Ahmedabad Airport vicinity
• Time: Developing situation
• Aircraft Type: Under investigation
• Emergency Response: Active deployment of rescue teams

**EMERGENCY RESPONSE:**
Multiple emergency units including fire services, medical teams, and rescue personnel have been dispatched to the location. The Ahmedabad Airport Authority is coordinating with local emergency services to ensure rapid response.

**SAFETY MEASURES:**
• Airport emergency protocols activated
• Medical facilities on standby
• Traffic diversions in affected areas
• Investigation teams being mobilized

**OFFICIAL STATEMENTS:**
Aviation authorities are gathering information and will provide updates as the situation develops. The safety of all individuals involved remains the top priority.

**ONGOING INVESTIGATION:**
• Initial assessment teams deployed
• Flight data analysis in progress
• Witness statements being collected
• Technical investigation initiated

This is a developing story. Updates will be provided as more information becomes available from official sources.',
  'Emergency services responding to aircraft incident in Ahmedabad with full rescue operations underway.',
  'breaking',
  1,
  'https://images.unsplash.com/photo-1544963813-d0c8aed83b37?w=800&h=600&fit=crop',
  ARRAY[
    'https://example.com/emergency-response-live',
    'https://example.com/ahmedabad-incident-coverage'
  ],
  ARRAY['breaking news', 'aircraft incident', 'ahmedabad', 'emergency response', 'aviation safety'],
  'Ahmedabad, Gujarat, India',
  0, -- Will be updated as information becomes available
  '{"emergency_helpline": "+91-79-26860811", "airport_control": "+91-79-26842811", "medical_emergency": "108"}'::jsonb,
  ARRAY[
    '{"timestamp": "' || now()::text || '", "update": "Emergency services deployed to incident location", "source": "Airport Authority"}'
  ]::jsonb[],
  ARRAY[
    '{"name": "Ahmedabad Airport Authority", "type": "official"}',
    '{"name": "Gujarat Emergency Services", "type": "official"}',
    '{"name": "Aviation Safety Board", "type": "official"}'
  ]::jsonb[]
);
