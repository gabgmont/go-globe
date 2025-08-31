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

      // Buscar aplicações aprovadas de missionários com dados de apoio
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

      // Buscar dados de apoio para cada missionário
      const missionaryIds = data?.map(app => app.id) || [];
      const { data: supportsData, error: supportsError } = await supabase
        .from('missionary_supports')
        .select('missionary_id, user_id, amount, is_recurring, status')
        .in('missionary_id', missionaryIds);

      if (supportsError) {
        throw supportsError;
      }
      // Calcular estatísticas de apoio para cada missionário
      const supportStats = new Map();
      supportsData?.forEach(support => {
        const missionaryId = support.missionary_id;
        if (!supportStats.has(missionaryId)) {
          supportStats.set(missionaryId, {
            supporters: new Set(),
            monthlySupport: 0
          });
        }

        const stats = supportStats.get(missionaryId);
        stats.supporters.add(support.user_id);
      
        stats.monthlySupport += Number(support.amount);
        
      });

      // Transformar os dados para o formato esperado
      const missionariesData = data?.map(application => {
        const stats = supportStats.get(application.id) || { supporters: new Set(), monthlySupport: 0 };
        
        return {
          id: application.id,
          name: application.name,
          location: application.current_location,
          mission: application.description,
          startDate: new Date(application.start_date).getFullYear().toString(),
          supporters: stats.supporters.size,
          monthlySupport: stats.monthlySupport,
          avatar: application.photo_url || '/placeholder.svg',
          specialization: application.work_category,
          status: 'active' as const
        };
      }) || [];

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