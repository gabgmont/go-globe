-- Update the handle_new_church_user function to use "instituição" instead of "igreja"
CREATE OR REPLACE FUNCTION public.handle_new_church_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only create church profile if user_type is 'church'
  IF NEW.raw_user_meta_data->>'user_type' = 'church' THEN
    INSERT INTO public.churches (
      user_id, 
      name, 
      email,
      primary_color,
      secondary_color,
      logo_url
    ) VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'church_name', 'Instituição'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'primary_color', '#3B82F6'),
      COALESCE(NEW.raw_user_meta_data->>'secondary_color', '#1E40AF'),
      NEW.raw_user_meta_data->>'logo_url'
    );
  END IF;
  RETURN NEW;
END;
$$;