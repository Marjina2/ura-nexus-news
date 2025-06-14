
-- Insert a new spotlight entry for today's date on the Gujarat plane crash

INSERT INTO public.spotlight_news (
  date,
  gemini_topic,
  summary,
  seo_title,
  image_url,
  full_report
) VALUES (
  CURRENT_DATE,
  'Plane crash in Gujarat',
  'A passenger plane crashed in Gujarat today, resulting in significant casualties and emergency response efforts.',
  'Breaking: Plane Crash in Gujarat - Ongoing Rescue Efforts',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop', -- Replace with actual image if you have one
  'On {CURRENT_DATE}, a major plane crash occurred near Gujarat, India. Emergency services responded immediately to the scene, working to rescue survivors and provide aid to victims. The cause of the crash is currently under investigation, and updates will be provided as more information becomes available. Early reports indicate significant casualties, and authorities are urging the public to avoid the area while rescue operations are ongoing.'
);
