-- Update the church creation policy to work with triggers
DROP POLICY IF EXISTS "Churches can create their own profile" ON public.churches;

-- Create a new policy that allows the trigger function to insert
CREATE POLICY "Churches can create their own profile" 
ON public.churches 
FOR INSERT 
WITH CHECK (true);

-- Update the handle_new_church_user function to ensure proper data insertion
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
      COALESCE(NEW.raw_user_meta_data->>'church_name', 'Igreja'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'primary_color', '#3B82F6'),
      COALESCE(NEW.raw_user_meta_data->>'secondary_color', '#1E40AF'),
      NEW.raw_user_meta_data->>'logo_url'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate a more specific policy that works after the trigger has run
CREATE POLICY "Churches can manage their own data" 
ON public.churches 
FOR ALL 
USING (auth.uid() = user_id);