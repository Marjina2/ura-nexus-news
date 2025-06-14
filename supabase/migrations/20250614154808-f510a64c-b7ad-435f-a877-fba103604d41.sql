
-- Add verification fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone_number TEXT,
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_token TEXT,
ADD COLUMN verification_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verification_completed_at TIMESTAMP WITH TIME ZONE;

-- Create a function to generate verification tokens
CREATE OR REPLACE FUNCTION public.generate_verification_token()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT encode(gen_random_bytes(32), 'hex');
$$;

-- Update the handle_new_user function to require more complete profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create profile for all users, but mark OAuth users as needing completion
  INSERT INTO public.profiles (id, username, country, full_name, avatar_url, phone_number, is_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'country', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', ''),
    NEW.raw_user_meta_data ->> 'phone_number',
    CASE 
      WHEN NEW.raw_user_meta_data ? 'phone_number' AND NEW.raw_user_meta_data ->> 'phone_number' != '' THEN FALSE
      ELSE FALSE
    END
  );
  RETURN NEW;
END;
$$;
