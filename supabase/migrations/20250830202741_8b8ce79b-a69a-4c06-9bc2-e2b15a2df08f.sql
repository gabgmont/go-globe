-- Create table for monthly progress reports
CREATE TABLE public.mission_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Create table for mission projects
CREATE TABLE public.mission_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for mission_progress
CREATE POLICY "Users can view progress of their own missions" 
ON public.mission_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create progress for their own missions" 
ON public.mission_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update progress of their own missions" 
ON public.mission_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete progress of their own missions" 
ON public.mission_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for mission_projects
CREATE POLICY "Users can view projects of their own missions" 
ON public.mission_projects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects for their own missions" 
ON public.mission_projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update projects of their own missions" 
ON public.mission_projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete projects of their own missions" 
ON public.mission_projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_mission_progress_updated_at
BEFORE UPDATE ON public.mission_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mission_projects_updated_at
BEFORE UPDATE ON public.mission_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();