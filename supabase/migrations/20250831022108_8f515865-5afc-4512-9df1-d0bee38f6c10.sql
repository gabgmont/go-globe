-- Criar tabela de apoios aos missionários
CREATE TABLE public.missionary_supports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  missionary_id UUID NOT NULL REFERENCES missionary_applications(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.missionary_supports ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Users can view their own supports" 
ON public.missionary_supports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own supports" 
ON public.missionary_supports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supports" 
ON public.missionary_supports 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Missionários podem ver apoios recebidos
CREATE POLICY "Missionaries can view supports received" 
ON public.missionary_supports 
FOR SELECT 
USING (missionary_id IN (
  SELECT id FROM missionary_applications 
  WHERE user_id = auth.uid()
));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_missionary_supports_updated_at
BEFORE UPDATE ON public.missionary_supports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();