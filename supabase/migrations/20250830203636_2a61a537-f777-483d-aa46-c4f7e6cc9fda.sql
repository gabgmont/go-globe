-- Add new columns to mission_projects table for objective types and goals
ALTER TABLE public.mission_projects 
ADD COLUMN objective_type text CHECK (objective_type IN ('financial', 'material')),
ADD COLUMN financial_goal numeric,
ADD COLUMN material_goal numeric,
ADD COLUMN material_unit text;