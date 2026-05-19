
-- 1. Server-side free-tier pet limit
CREATE OR REPLACE FUNCTION public.enforce_pet_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pet_count INT;
  user_plan TEXT;
BEGIN
  SELECT COUNT(*) INTO pet_count FROM public.pets WHERE user_id = NEW.user_id;
  SELECT subscription_status INTO user_plan FROM public.users WHERE id = NEW.user_id;

  IF pet_count >= 1 AND COALESCE(user_plan, 'free') = 'free' THEN
    RAISE EXCEPTION 'Free plan is limited to 1 pet. Upgrade to add more.'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_pet_limit_trigger ON public.pets;
CREATE TRIGGER enforce_pet_limit_trigger
  BEFORE INSERT ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.enforce_pet_limit();

REVOKE EXECUTE ON FUNCTION public.enforce_pet_limit() FROM PUBLIC, anon, authenticated;

-- 2. Lock down usage_tracking writes
DROP POLICY IF EXISTS "Users can update own usage" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users can create own usage" ON public.usage_tracking;

CREATE UNIQUE INDEX IF NOT EXISTS usage_tracking_user_feature_month_key
  ON public.usage_tracking (user_id, feature, month);

CREATE OR REPLACE FUNCTION public.increment_usage(p_feature TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  current_month TEXT := to_char(now(), 'YYYY-MM');
  new_count INT;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  INSERT INTO public.usage_tracking (user_id, feature, month, count)
  VALUES (uid, p_feature, current_month, 1)
  ON CONFLICT (user_id, feature, month) DO UPDATE
    SET count = public.usage_tracking.count + 1
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_usage(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_usage(TEXT) TO authenticated;

-- 3. Lock down SECURITY DEFINER helpers from public/anon API surface
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
