-- Create a policy to allow all users to view church names for the application form
CREATE POLICY "Anyone can view church names for applications" 
ON public.churches 
FOR SELECT 
USING (true);