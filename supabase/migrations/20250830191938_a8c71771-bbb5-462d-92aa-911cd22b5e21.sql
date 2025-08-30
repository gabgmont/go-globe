-- Add missionary_application_id to missions table
ALTER TABLE public.missions 
ADD COLUMN missionary_application_id UUID REFERENCES public.missionary_applications(id);

-- Update existing missions to link to missionary applications
UPDATE public.missions 
SET missionary_application_id = (
  SELECT id 
  FROM public.missionary_applications 
  WHERE missionary_applications.user_id = missions.user_id 
  ORDER BY created_at DESC 
  LIMIT 1
) 
WHERE missionary_application_id IS NULL;