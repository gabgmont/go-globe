-- Remove duplicate policies and keep only the necessary ones
DROP POLICY IF EXISTS "Churches can view their own data" ON public.churches;
DROP POLICY IF EXISTS "Churches can manage their own data" ON public.churches;

-- Keep the essential policies
-- The "Churches can update their own profile" and "Churches can create their own profile" policies remain
-- The new "Anyone can view church names for applications" policy allows public access to church names