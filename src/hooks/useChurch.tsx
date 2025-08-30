import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Church {
  id: string;
  user_id: string;
  name: string;
  email: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
}

interface MissionaryApplication {
  id: string;
  name: string;
  email: string | null;
  status: string;
  work_category: string;
  current_location: string;
  photo_url: string | null;
  created_at: string;
}

export const useChurch = () => {
  const [church, setChurch] = useState<Church | null>(null);
  const [missionaries, setMissionaries] = useState<MissionaryApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchChurch = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setChurch(data);
    } catch (error) {
      console.error('Error fetching church:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMissionaries = async (churchId: string) => {
    try {
      const { data, error } = await supabase
        .from('missionary_applications')
        .select('id, name, email, status, work_category, current_location, photo_url, created_at')
        .eq('church_id', churchId);

      if (error) throw error;
      setMissionaries(data || []);
    } catch (error) {
      console.error('Error fetching missionaries:', error);
    }
  };

  const approveMissionary = async (missionaryId: string) => {
    try {
      const { error } = await supabase
        .from('missionary_applications')
        .update({ status: 'approved' })
        .eq('id', missionaryId);

      if (error) throw error;

      toast({
        title: "Missionário aprovado",
        description: "O missionário foi aprovado com sucesso!",
      });

      // Refresh missionaries list
      if (church) {
        fetchMissionaries(church.id);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o missionário.",
      });
    }
  };

  const rejectMissionary = async (missionaryId: string) => {
    try {
      const { error } = await supabase
        .from('missionary_applications')
        .update({ status: 'rejected' })
        .eq('id', missionaryId);

      if (error) throw error;

      toast({
        title: "Missionário rejeitado",
        description: "O missionário foi rejeitado.",
      });

      // Refresh missionaries list
      if (church) {
        fetchMissionaries(church.id);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o missionário.",
      });
    }
  };

  const updateChurch = async (updates: Partial<Church>) => {
    try {
      const { error } = await supabase
        .from('churches')
        .update(updates)
        .eq('id', church?.id);

      if (error) throw error;

      if (church) {
        setChurch({ ...church, ...updates });
      }

      toast({
        title: "Instituição atualizada",
        description: "Os dados da instituição foram atualizados com sucesso!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados da instituição.",
      });
    }
  };

  const signUpChurch = async (
    email: string, 
    password: string, 
    name: string, 
    primaryColor: string, 
    secondaryColor: string,
    logoFile?: File
  ) => {
    try {
      let logoUrl = null;

      // Upload logo if provided
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = fileName; // Remove o prefixo church-logos pois já está no bucket

        const { error: uploadError } = await supabase.storage
          .from('church-logos')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('church-logos')
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            user_type: 'church',
            church_name: name,
            primary_color: primaryColor,
            secondary_color: secondaryColor,
            logo_url: logoUrl,
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: error.message,
        });
      } else {
        toast({
          title: "Cadastro realizado",
          description: "Instituição cadastrada com sucesso! Redirecionando...",
        });
        // Redirecionar automaticamente para o perfil da instituição
        setTimeout(() => {
          window.location.href = '/church-profile';
        }, 1500);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  useEffect(() => {
    if (church) {
      fetchMissionaries(church.id);
    }
  }, [church]);

  return {
    church,
    missionaries,
    loading,
    fetchChurch,
    fetchMissionaries,
    approveMissionary,
    rejectMissionary,
    updateChurch,
    signUpChurch,
  };
};