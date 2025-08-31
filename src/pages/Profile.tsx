import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, MapPin, Briefcase, Plus, X, Eye, Heart, CreditCard } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [loading, setLoading] = useState(false);
  const [missionaryApplication, setMissionaryApplication] = useState<any>(null);
  const [loadingApplication, setLoadingApplication] = useState(true);
  const [activeMission, setActiveMission] = useState<any>(null);
  const [loadingMission, setLoadingMission] = useState(true);
  const [mySupports, setMySupports] = useState<any[]>([]);
  const [loadingSupports, setLoadingSupports] = useState(true);
  const { toast } = useToast();

  // Check if user is church admin and redirect
  useEffect(() => {
    const checkIfChurchUser = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('churches')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data) {
          // User is a church admin, redirect to church profile
          navigate('/church-profile');
        }
      } catch (error) {
        console.error('Error checking church user:', error);
      }
    };

    if (user) {
      checkIfChurchUser();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchMissionaryApplication();
      fetchActiveMission();
      fetchMySupports();
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

  const fetchActiveMission = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          missionary_applications!inner (
            name,
            current_location,
            work_category
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching active mission:', error);
      } else {
        setActiveMission(data);
      }
    } catch (error) {
      console.error('Error fetching active mission:', error);
    } finally {
      setLoadingMission(false);
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

  const handleEndMission = async () => {
    if (!user || !activeMission) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: 'completed' })
        .eq('id', activeMission.id);

      if (error) throw error;

      toast({
        title: "Missão encerrada",
        description: "Sua missão foi encerrada com sucesso.",
      });

      // Atualizar a missão ativa
      setActiveMission(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível encerrar a missão.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMySupports = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('missionary_supports')
        .select(`
          *,
          missionary_applications!inner (
            name,
            photo_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMySupports(data || []);
    } catch (error) {
      console.error('Error fetching supports:', error);
    } finally {
      setLoadingSupports(false);
    }
  };

  const handleCancelRecurringSupport = async (supportId: string) => {
    try {
      const { error } = await supabase
        .from('missionary_supports')
        .update({ status: 'cancelled' })
        .eq('id', supportId);

      if (error) throw error;

      toast({
        title: "Contribuição cancelada",
        description: "Sua contribuição recorrente foi cancelada com sucesso.",
      });

      // Refresh supports list
      fetchMySupports();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível cancelar a contribuição.",
      });
    }
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
        <div className="w-full mx-auto space-y-8">
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
         
          {/* Seção de Minhas Contribuições */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Minhas Contribuições
              </CardTitle>
              <CardDescription>
                Acompanhe suas contribuições realizadas para missões
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSupports ? (
                <div className="text-center text-muted-foreground py-4">
                  Carregando contribuições...
                </div>
              ) : mySupports.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Você ainda não fez nenhuma contribuição</p>
                  <p className="text-sm">Que tal apoiar uma missão hoje?</p>
                </div>
              ) : (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="one-time">Únicas</TabsTrigger>
                    <TabsTrigger value="recurring">Recorrentes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Missionário</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mySupports.map((support) => (
                          <TableRow key={support.id}>
                            <TableCell className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={support.missionary_applications.photo_url} />
                                <AvatarFallback>
                                  {support.missionary_applications.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{support.missionary_applications.name}</span>
                            </TableCell>
                            <TableCell>R$ {Number(support.amount).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={support.is_recurring ? "default" : "secondary"}>
                                {support.is_recurring ? "Recorrente" : "Única"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                support.status === 'confirmed' ? "default" :
                                support.status === 'cancelled' ? "destructive" : "secondary"
                              }>
                                {support.status === 'confirmed' ? 'Confirmado' :
                                 support.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(support.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              {support.is_recurring && support.status !== 'cancelled' && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      Cancelar
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancelar contribuição recorrente</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja cancelar esta contribuição recorrente? 
                                        Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleCancelRecurringSupport(support.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Confirmar cancelamento
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="one-time">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Missionário</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mySupports.filter(support => !support.is_recurring).map((support) => (
                          <TableRow key={support.id}>
                            <TableCell className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={support.missionary_applications.photo_url} />
                                <AvatarFallback>
                                  {support.missionary_applications.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{support.missionary_applications.name}</span>
                            </TableCell>
                            <TableCell>R$ {Number(support.amount).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                support.status === 'confirmed' ? "default" :
                                support.status === 'cancelled' ? "destructive" : "secondary"
                              }>
                                {support.status === 'confirmed' ? 'Confirmado' :
                                 support.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(support.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="recurring">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Missionário</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mySupports.filter(support => support.is_recurring).map((support) => (
                          <TableRow key={support.id}>
                            <TableCell className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={support.missionary_applications.photo_url} />
                                <AvatarFallback>
                                  {support.missionary_applications.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{support.missionary_applications.name}</span>
                            </TableCell>
                            <TableCell>R$ {Number(support.amount).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                support.status === 'confirmed' ? "default" :
                                support.status === 'cancelled' ? "destructive" : "secondary"
                              }>
                                {support.status === 'confirmed' ? 'Confirmado' :
                                 support.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(support.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              {support.status !== 'cancelled' && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      Cancelar
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancelar contribuição recorrente</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja cancelar esta contribuição recorrente? 
                                        Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleCancelRecurringSupport(support.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Confirmar cancelamento
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              )}
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
                  <div className="flex gap-4">
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

              {loadingMission ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                      Carregando informações da missão...
                    </div>
                  </CardContent>
                </Card>
              ) : activeMission ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{activeMission.name}</CardTitle>
                        <CardDescription>
                          Criada em {new Date(activeMission.created_at).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/mission/${activeMission.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={loading}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Encerrar missão
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Encerrar missão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja encerrar esta missão? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleEndMission}
                                disabled={loading}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {loading ? 'Encerrando...' : 'Encerrar missão'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{activeMission.category}</span>
                      </div>
                      {activeMission.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{activeMission.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Sobre a missão:</h4>
                      <p className="text-sm text-muted-foreground">
                        {activeMission.about}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Objetivos:</h4>
                      <p className="text-sm text-muted-foreground">
                        {activeMission.objectives}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Nova Missão
                    </CardTitle>
                    <CardDescription>
                      Compartilhe uma nova missão ou trabalho missionário
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => window.location.href = '/new-mission'}
                      className="w-full"
                      variant="outline"
                    >
                      Criar nova missão
                    </Button>
                  </CardContent>
                </Card>
              )}
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
      <Footer />
    </div>
  );
};

export default Profile;