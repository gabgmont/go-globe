-- Create storage policies for church/institution logos

-- Create the church-logos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('church-logos', 'church-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create policies for church logo uploads
CREATE POLICY "Anyone can view church logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'church-logos');

CREATE POLICY "Authenticated users can upload church logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'church-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own church logos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'church-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own church logos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'church-logos' 
  AND auth.role() = 'authenticated'
);