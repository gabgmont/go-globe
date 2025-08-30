-- Fix storage policies for missionary uploads

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own missionary photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own missionary photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own missionary photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own missionary videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own missionary videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own missionary videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own missionary videos" ON storage.objects;

-- Create corrected policies for missionary photos (public bucket)
CREATE POLICY "Users can upload their own missionary photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'missionary-photos' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can update their own missionary photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'missionary-photos' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can delete their own missionary photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'missionary-photos' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Create corrected policies for missionary videos (private bucket)
CREATE POLICY "Users can view their own missionary videos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'missionary-videos' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can upload their own missionary videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'missionary-videos' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can update their own missionary videos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'missionary-videos' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can delete their own missionary videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'missionary-videos' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);