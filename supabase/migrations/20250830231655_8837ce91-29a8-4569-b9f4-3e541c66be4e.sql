-- Criar política para permitir que qualquer pessoa veja aplicações aprovadas de missionários
CREATE POLICY "Anyone can view approved missionary applications" 
ON public.missionary_applications 
FOR SELECT 
USING (status = 'approved');