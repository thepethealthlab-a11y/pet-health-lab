CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Backfill existing auth users missing app rows
INSERT INTO public.users (id, email)
SELECT au.id, au.email FROM auth.users au
LEFT JOIN public.users u ON u.id = au.id
WHERE u.id IS NULL;

INSERT INTO public.profiles (id, display_name)
SELECT au.id, COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1))
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;