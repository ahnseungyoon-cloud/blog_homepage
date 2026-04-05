CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read categories
CREATE POLICY "Public categories are viewable by everyone"
ON public.categories
FOR SELECT
TO public
USING (true);

-- Policy: Authenticated users can insert/update/delete categories
CREATE POLICY "Authenticated users can manipulate categories"
ON public.categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert base categories
INSERT INTO public.categories (name) VALUES 
('Next.js'),
('React'),
('Supabase'),
('Frontend'),
('Life')
ON CONFLICT (name) DO NOTHING;
