import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MissionProject {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  progress?: number;
  supporters?: number;
  financial_goal?: number;
  material_goal?: number;
  objective_type?: string;
  status: string;
  created_at: string;
  mission: {
    id: string;
    name: string;
    location?: string;
    category: string;
    user_id: string;
    missionary_application_id?: string;
  };
}

export const useMissionProjects = () => {
  const [projects, setProjects] = useState<MissionProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('mission_projects')
        .select(`
          id,
          name,
          description,
          image_url,
          financial_goal,
          material_goal,
          objective_type,
          status,
          created_at,
          mission_id
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Buscar as informações das missões separadamente
      const missionIds = [...new Set(data?.map(p => p.mission_id) || [])];
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('id, name, location, category, user_id, missionary_application_id')
        .in('id', missionIds);

      if (missionsError) {
        throw missionsError;
      }

      const projectIds = [...new Set(data?.map(p => p.id) || [])];
      const { data: projectContributionData, error: projectContributionError } = await supabase.
        from('project_contributions')
        .select('id, project_id, user_id, amount')
        .in('project_id', projectIds)

      if(projectContributionError) {
        throw projectContributionError;
      }

      const contributionsMap = new Map();
      projectContributionData.forEach(pc => {
        if (contributionsMap.has(pc.project_id)) {
          contributionsMap.set(pc.project_id, contributionsMap.get(pc.project_id) + pc.amount)
        } else {
          contributionsMap.set(pc.project_id, pc.amount)
        }
      })
      
      // Combinar os dados
      const projectsWithMissions = data?.map(project => {
        const mission = missionsData?.find(m => m.id === project.mission_id);
        return {
          ...project,
          progress: contributionsMap.get(project.id),
          supporters: new Set(projectContributionData.filter(pc => pc.project_id == project.id).map(pc => pc.user_id)).size,
          mission: mission || {
            id: project.mission_id,
            name: 'Missão não encontrada',
            location: 'Localização não informada',
            category: 'Categoria não informada',
            user_id: '',
            missionary_application_id: ''
          }
        };
      }) || [];

      setProjects(projectsWithMissions);
    } catch (err: any) {
      console.error('Error fetching mission projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects
  };
};