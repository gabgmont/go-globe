-- Create churches table
CREATE TABLE public.churches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E40AF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create policies for churches
CREATE POLICY "Churches can view their own data" 
ON public.churches 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Churches can create their own profile" 
ON public.churches 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Churches can update their own profile" 
ON public.churches 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add church_id to missionary_applications
ALTER TABLE public.missionary_applications 
ADD COLUMN church_id UUID REFERENCES public.churches(id);

-- Create policy for churches to view their missionaries
CREATE POLICY "Churches can view their missionaries applications" 
ON public.missionary_applications 
FOR SELECT 
USING (
  church_id IN (
    SELECT id FROM public.churches WHERE user_id = auth.uid()
  )
);

-- Create policy for churches to update missionary applications (approve/reject)
CREATE POLICY "Churches can update their missionaries applications" 
ON public.missionary_applications 
FOR UPDATE 
USING (
  church_id IN (
    SELECT id FROM public.churches WHERE user_id = auth.uid()
  )
);

-- Add trigger for churches updated_at
CREATE TRIGGER update_churches_updated_at
BEFORE UPDATE ON public.churches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new church user
CREATE OR REPLACE FUNCTION public.handle_new_church_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only create church profile if user_type is 'church'
  IF NEW.raw_user_meta_data->>'user_type' = 'church' THEN
    INSERT INTO public.churches (user_id, name, email)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'church_name', 'Igreja'),
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new church users
CREATE TRIGGER on_auth_church_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.raw_user_meta_data->>'user_type' = 'church')
  EXECUTE FUNCTION public.handle_new_church_user();