-- Adicionar campo de renda mensal estimada na tabela missions
ALTER TABLE public.missions 
ADD COLUMN estimated_monthly_income DECIMAL(10,2) DEFAULT 0;