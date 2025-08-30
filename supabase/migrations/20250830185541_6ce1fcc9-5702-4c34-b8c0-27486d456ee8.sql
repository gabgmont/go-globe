-- Create missionary applications table
CREATE TABLE public.missionary_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo_url TEXT,
  current_location TEXT NOT NULL,
  start_date DATE NOT NULL,
  work_category TEXT NOT NULL,
  description TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website TEXT,
  presentation_video_url TEXT,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.missionary_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for missionary applications
CREATE POLICY "Users can view their own applications" 
ON public.missionary_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" 
ON public.missionary_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.missionary_applications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_missionary_applications_updated_at
BEFORE UPDATE ON public.missionary_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for missionary content
INSERT INTO storage.buckets (id, name, public) VALUES ('missionary-photos', 'missionary-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('missionary-videos', 'missionary-videos', false);

-- Create policies for missionary photos (public)
CREATE POLICY "Missionary photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'missionary-photos');

CREATE POLICY "Users can upload their own missionary photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'missionary-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own missionary photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'missionary-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own missionary photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'missionary-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for missionary videos (private)
CREATE POLICY "Users can view their own missionary videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'missionary-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own missionary videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'missionary-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own missionary videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'missionary-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own missionary videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'missionary-videos' AND auth.uid()::text = (storage.foldername(name))[1]);