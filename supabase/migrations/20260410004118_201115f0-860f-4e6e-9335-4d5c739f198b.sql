-- Drop the permissive UPDATE policy
DROP POLICY IF EXISTS "Anyone can update counter" ON public.access_counter;

-- Create a secure function to increment the counter
CREATE OR REPLACE FUNCTION public.increment_access_counter()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.access_counter SET count = count + 1 WHERE id = 1;
$$;
