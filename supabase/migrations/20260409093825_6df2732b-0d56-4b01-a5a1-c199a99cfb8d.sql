
CREATE TABLE public.access_counter (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.access_counter (id, count) VALUES (1, 0);

ALTER TABLE public.access_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read counter" ON public.access_counter FOR SELECT USING (true);
CREATE POLICY "Anyone can update counter" ON public.access_counter FOR UPDATE USING (true) WITH CHECK (true);
