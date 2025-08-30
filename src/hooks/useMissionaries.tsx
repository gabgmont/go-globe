import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Missionary {
  id: string;
  name: string;
  location: string;
  mission: string;
  startDate: string;
  supporters: number;
  monthlySupport: number;
  avatar: string;
  specialization: string;
  status: 'active' | 'preparing' | 'returning';
}

export const useMissionaries = () => {
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissionaries = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar aplicações aprovadas de missionários
      const { data, error: fetchError } = await supabase
        .from('missionary_applications')
        .select(`
          id,
          name,
          current_location,
          description,
          start_date,
          photo_url,
          work_category,
          status
        `)
        .eq('status', 'approved')
        .order('start_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transformar os dados para o formato esperado
      const missionariesData = data?.map(application => ({
        id: application.id,
        name: application.name,
        location: application.current_location,
        mission: application.description,
        startDate: new Date(application.start_date).getFullYear().toString(),
        supporters: Math.floor(Math.random() * 100) + 20, // Temporário até implementar sistema de apoio
        monthlySupport: Math.floor(Math.random() * 5000) + 3000, // Temporário até implementar sistema de apoio
        avatar: application.photo_url || '/placeholder.svg',
        specialization: application.work_category,
        status: 'active' as const
      })) || [];

      setMissionaries(missionariesData);
    } catch (err: any) {
      console.error('Error fetching missionaries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionaries();
  }, []);

  return {
    missionaries,
    loading,
    error,
    refetch: fetchMissionaries
  };
};