CREATE TABLE public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- No public read - only accessible via security definer function
-- Store the SHA-256 hash of the access code
INSERT INTO public.app_config (key, value) 
VALUES ('access_code_hash', encode(sha256(convert_to('islamsaker2026', 'UTF8')), 'hex'));

-- Create a function to verify the code
CREATE OR REPLACE FUNCTION public.verify_access_code(input_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash TEXT;
  input_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM public.app_config WHERE key = 'access_code_hash';
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  input_hash := encode(sha256(convert_to(input_code, 'UTF8')), 'hex');
  RETURN input_hash = stored_hash;
END;
$$;
