-- Create a trigger to validate email domains on auth.users
-- This will prevent users from signing up with temporary email domains
CREATE OR REPLACE FUNCTION public.validate_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email domain
  IF NOT public.is_valid_email_domain(NEW.email) THEN
    RAISE EXCEPTION 'Invalid or temporary email domain not allowed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users for email validation
DROP TRIGGER IF EXISTS validate_email_on_signup ON auth.users;
CREATE TRIGGER validate_email_on_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_user_email();

-- Update the profiles table to track email verification status
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verification_token text,
ADD COLUMN IF NOT EXISTS email_verification_sent_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS connected_devices jsonb DEFAULT '[]'::jsonb;