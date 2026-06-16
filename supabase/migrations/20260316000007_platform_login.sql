-- Platform superadmin login: username (or email) only — no school ID

CREATE OR REPLACE FUNCTION resolve_platform_login_email(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT p.email INTO v_email
  FROM profiles p
  WHERE p.role = 'superadmin'
    AND p.active = true
    AND (
      lower(p.username) = lower(trim(p_username))
      OR lower(p.email) = lower(trim(p_username))
    );
  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION resolve_platform_login_email(TEXT) TO anon, authenticated;
