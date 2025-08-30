-- Create a policy to allow public viewing of active mission projects
CREATE POLICY "Anyone can view active mission projects" 
ON public.mission_projects 
FOR SELECT 
USING (status = 'active');