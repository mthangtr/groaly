-- Migration: Auto-sync auth.users to public.users
-- Ensures every authenticated user has a corresponding row in public.users
-- This fixes the foreign key constraint issue for notes/tasks

-- Function to handle new user creation/update
CREATE OR REPLACE FUNCTION public.handle_auth_user_sync()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.created_at, NOW()),
    COALESCE(NEW.updated_at, NOW())
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_sync ON auth.users;
CREATE TRIGGER on_auth_user_sync
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_sync();

-- Add RLS policy for INSERT on users table (needed for trigger to work)
DROP POLICY IF EXISTS users_insert_own ON public.users;
CREATE POLICY users_insert_own ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Backfill: Sync existing auth.users to public.users
INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  raw_user_meta_data->>'avatar_url',
  COALESCE(created_at, NOW()),
  COALESCE(updated_at, NOW())
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = EXCLUDED.updated_at;

-- Add helpful comments
COMMENT ON FUNCTION public.handle_auth_user_sync() IS 
  'Automatically syncs auth.users to public.users table on INSERT/UPDATE';
COMMENT ON TRIGGER on_auth_user_sync ON auth.users IS 
  'Syncs new/updated users from auth.users to public.users to satisfy foreign key constraints';
