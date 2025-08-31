-- Create table for project contributions
CREATE TABLE public.project_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID NOT NULL REFERENCES mission_projects(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_contributions ENABLE ROW LEVEL SECURITY;

-- Create policies for project contributions
CREATE POLICY "Users can view their own project contributions" 
ON public.project_contributions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project contributions" 
ON public.project_contributions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project contributions" 
ON public.project_contributions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Project owners can view contributions to their projects" 
ON public.project_contributions 
FOR SELECT 
USING (project_id IN (
  SELECT id FROM mission_projects WHERE user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_contributions_updated_at
BEFORE UPDATE ON public.project_contributions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();