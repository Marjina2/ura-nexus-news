
-- Add a cleanup function to remove unverified users after 1 day
CREATE OR REPLACE FUNCTION public.cleanup_unverified_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete profiles of unverified users older than 1 day
  DELETE FROM public.profiles 
  WHERE is_verified = false 
  AND created_at < NOW() - INTERVAL '1 day';
  
  -- Delete auth users who don't have profiles (unverified users)
  DELETE FROM auth.users 
  WHERE id NOT IN (SELECT id FROM public.profiles)
  AND created_at < NOW() - INTERVAL '1 day';
END;
$$;

-- Add email domain validation function
CREATE OR REPLACE FUNCTION public.is_valid_email_domain(email_address TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  domain TEXT;
  blocked_domains TEXT[] := ARRAY[
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'temp-mail.org',
    'throwaway.email', 'yopmail.com', 'maildrop.cc', 'getnada.com',
    'tempmail.net', 'sharklasers.com', 'grr.la', 'guerrillamailblock.com',
    'fakeinbox.com', 'getairmail.com', 'spamgourmet.com', 'mytrashmail.com'
  ];
BEGIN
  -- Extract domain from email
  domain := LOWER(SPLIT_PART(email_address, '@', 2));
  
  -- Check if domain is in blocked list
  IF domain = ANY(blocked_domains) THEN
    RETURN FALSE;
  END IF;
  
  -- Check for common temporary email patterns
  IF domain LIKE '%temp%' OR domain LIKE '%trash%' OR domain LIKE '%fake%' 
     OR domain LIKE '%disposable%' OR domain LIKE '%throwaway%' 
     OR domain LIKE '%guerrilla%' OR domain LIKE '%spam%' THEN
    RETURN FALSE;
  END IF;
  
  -- Ensure domain has a proper structure
  IF LENGTH(domain) < 4 OR domain NOT LIKE '%.%' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Add a trigger to validate emails on user creation
CREATE OR REPLACE FUNCTION public.validate_user_email()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate email domain
  IF NOT public.is_valid_email_domain(NEW.email) THEN
    RAISE EXCEPTION 'Invalid or temporary email domain not allowed';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for email validation
DROP TRIGGER IF EXISTS validate_email_on_signup ON auth.users;
CREATE TRIGGER validate_email_on_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.validate_user_email();

-- Update RLS policies to require verification for reading news
CREATE POLICY "Only verified users can read news articles" 
  ON public.news_articles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_verified = true
    )
  );

CREATE POLICY "Only verified users can read spotlight news" 
  ON public.spotlight_news 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_verified = true
    )
  );
