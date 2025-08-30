-- Remove material_unit column from mission_projects table
ALTER TABLE public.mission_projects 
DROP COLUMN material_unit;