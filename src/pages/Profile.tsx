import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, MapPin, Briefcase, Plus } from 'lucide-react';

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [loading, setLoading] = useState(false);
  const [missionaryApplication, setMissionaryApplication] = useState<any>(null);
  const [loadingApplication, setLoadingApplication] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMissionaryApplication();
    }
  }, [user]);

  const fetchMissionaryApplication = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('missionary_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching missionary application:', error);
      } else {
        setMissionaryApplication(data);
      }
    } catch (error) {
      console.error('Error fetching missionary application:', error);
    } finally {
      setLoadingApplication(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Em análise', variant: 'secondary' as const },
      approved: { label: 'Aprovado', variant: 'default' as const },
      rejected: { label: 'Rejeitado', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Acesso negado</CardTitle>
              <CardDescription>
                Você precisa estar logado para acessar seu perfil.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.display_name || ''} />
              <AvatarFallback className="text-2xl">
                {profile?.display_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nome de exibição</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar alterações'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={signOut}
                  >
                    Sair
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {loadingApplication ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  Carregando informações...
                </div>
              </CardContent>
            </Card>
          ) : missionaryApplication ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Minha Aplicação Missionária</CardTitle>
                    {getStatusBadge(missionaryApplication.status)}
                  </div>
                  <CardDescription>
                    Sua aplicação foi enviada em {new Date(missionaryApplication.created_at).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{missionaryApplication.current_location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{missionaryApplication.work_category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Desde {new Date(missionaryApplication.start_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  {missionaryApplication.photo_url && (
                    <div className="flex justify-center">
                      <img 
                        src={missionaryApplication.photo_url} 
                        alt="Foto do missionário" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-2">Descrição do trabalho:</h4>
                    <p className="text-sm text-muted-foreground">
                      {missionaryApplication.description}
                    </p>
                  </div>

                  {missionaryApplication.additional_info && (
                    <div>
                      <h4 className="font-medium mb-2">Informações adicionais:</h4>
                      <p className="text-sm text-muted-foreground">
                        {missionaryApplication.additional_info}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Novo Projeto
                  </CardTitle>
                  <CardDescription>
                    Compartilhe um novo projeto ou trabalho missionário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => window.location.href = '/missionary-application'}
                    className="w-full"
                    variant="outline"
                  >
                    Adicionar novo projeto
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tornar-se Missionário</CardTitle>
                <CardDescription>
                  Compartilhe sua vocação e experiência missionária
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => window.location.href = '/missionary-application'}
                  className="w-full"
                  variant="default"
                >
                  Quero ser um missionário
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;