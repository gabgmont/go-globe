-- Update storage policies to allow unauthenticated uploads for church logos during signup

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload church logos" ON storage.objects;

-- Create new policy that allows unauthenticated uploads for church logos
CREATE POLICY "Allow uploads to church logos during signup" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'church-logos'
);