-- Create a policy to allow public viewing of active missions
CREATE POLICY "Anyone can view active missions" 
ON public.missions 
FOR SELECT 
USING (status = 'active');