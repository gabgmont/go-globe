-- Add unique constraint to prevent duplicate church names
ALTER TABLE public.churches 
ADD CONSTRAINT unique_church_name UNIQUE (name);

-- Create an index for better performance on name searches
CREATE INDEX IF NOT EXISTS idx_churches_name_lower ON public.churches (LOWER(name));