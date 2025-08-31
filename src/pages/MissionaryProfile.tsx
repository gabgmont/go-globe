import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Calendar, Users, Heart, MessageCircle, Target, CheckCircle, Clock, DollarSign, Video, Mail, Phone, Globe, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

interface MissionaryData {
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
  bio?: string;
  video?: string;
  email?: string;
  phone?: string;
  website?: string;
  totalGoal: number;
  currentProgress: number;
  projectGoals: Array<{
    id: number;
    title: string;
    goal: number;
    progress: number;
    description: string;
  }>;
}

interface MissionProgressData {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface MissionProjectData {
  id: string;
  name: string;
  description: string;
  financial_goal: number;
  material_goal: number;
  objective_type: string;
  status: string;
  image_url: string;
}

const MissionaryProfile = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'details';
  const { toast } = useToast();
  
  const [missionary, setMissionary] = useState<MissionaryData | null>(null);
  const [missionProgress, setMissionProgress] = useState<MissionProgressData[]>([]);
  const [missionProjects, setMissionProjects] = useState<MissionProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMissionaryData();
  }, [id]);

  const fetchMissionaryData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      // Buscar dados do missionário
      const { data: missionaryData, error: missionaryError } = await supabase
        .from('missionary_applications')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (missionaryError) {
        throw new Error('Missionário não encontrado');
      }

      // Buscar missão associada
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .eq('missionary_application_id', id)
        .single();

      // Buscar progresso da missão
      let progressData: MissionProgressData[] = [];
      if (missionData) {
        const { data: progress, error: progressError } = await supabase
          .from('mission_progress')
          .select('*')
          .eq('mission_id', missionData.id)
          .order('created_at', { ascending: false });

        if (!progressError && progress) {
          progressData = progress;
        }
      }

      // Buscar projetos da missão
      let projectsData: MissionProjectData[] = [];
      if (missionData) {
        const { data: projects, error: projectsError } = await supabase
          .from('mission_projects')
          .select('*')
          .eq('mission_id', missionData.id)
          .eq('status', 'active');

        if (!projectsError && projects) {
          projectsData = projects;
        }
      }

      // Transformar dados para o formato esperado
      const transformedMissionary: MissionaryData = {
        id: missionaryData.id,
        name: missionaryData.name,
        location: missionaryData.current_location,
        mission: missionData?.objectives || missionData?.about || missionaryData.description,
        startDate: new Date(missionaryData.start_date).getFullYear().toString(),
        supporters: Math.floor(Math.random() * 100) + 20, // Temporário
        monthlySupport: Math.floor(Math.random() * 5000) + 3000, // Temporário
        avatar: missionaryData.photo_url || '/placeholder.svg',
        specialization: missionaryData.work_category,
        status: 'active',
        bio: missionaryData.additional_info || '',
        video: missionaryData.presentation_video_url,
        email: missionaryData.email,
        phone: missionaryData.phone,
        website: missionaryData.website,
        totalGoal: projectsData.reduce((sum, project) => sum + (project.financial_goal || 0), 0) || 50000,
        currentProgress: Math.floor(Math.random() * 30000) + 15000, // Temporário
        projectGoals: projectsData.map((project, index) => ({
          id: index + 1,
          title: project.name,
          goal: project.financial_goal || 0,
          progress: Math.floor(Math.random() * (project.financial_goal || 0)), // Temporário
          description: project.description || ''
        }))
      };

      setMissionary(transformedMissionary);
      setMissionProgress(progressData);
      setMissionProjects(projectsData);

    } catch (err: any) {
      console.error('Error fetching missionary data:', err);
      setError(err.message);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do missionário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/30">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-muted-foreground">Carregando dados do missionário...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !missionary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/30">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Missionário não encontrado</h2>
            <p className="text-muted-foreground mb-6">O missionário que você está procurando não foi encontrado ou não está mais ativo.</p>
            <Button onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const supportPlans = [
    { id: 1, name: 'Básico', amount: 50, duration: '6 meses', benefits: ['Relatórios mensais', 'Acesso exclusivo ao blog'] },
    { id: 2, name: 'Parceiro', amount: 100, duration: '12 meses', benefits: ['Relatórios mensais', 'Chamada trimestral', 'Cartão personalizado'] },
    { id: 3, name: 'Patrocinador', amount: 200, duration: '24 meses', benefits: ['Todos os benefícios anteriores', 'Visita presencial', 'Participação em decisões'] }
  ];

  const missionPhases = [
    { phase: 'Preparação', status: 'completed', description: 'Capacitação e planejamento inicial' },
    { phase: 'Implantação', status: 'completed', description: 'Estabelecimento na comunidade' },
    { phase: 'Desenvolvimento', status: 'active', description: 'Execução dos projetos principais' },
    { phase: 'Expansão', status: 'pending', description: 'Ampliação para outras comunidades' }
  ];

  const monthlyUpdates = missionProgress.map(progress => ({
    id: progress.id,
    date: new Date(progress.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    title: progress.title,
    content: progress.description
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-card to-card/95 rounded-xl shadow-card p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 mx-auto lg:mx-0">
                <img src={missionary.avatar} alt={missionary.name} className="w-full h-full object-cover" />
              </div>
              <Badge className={`mt-4 mx-auto lg:mx-0 block w-fit bg-accent text-accent-foreground`}>
                Ativo na Missão
              </Badge>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold mb-2">{missionary.name}</h1>
              <Badge variant="outline" className="mb-4">{missionary.specialization}</Badge>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{missionary.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Desde {missionary.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{missionary.supporters} apoiadores</span>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-6">{missionary.bio}</p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {missionary.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${missionary.email}`}>
                      <Mail className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {missionary.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${missionary.phone}`}>
                      <Phone className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {missionary.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={missionary.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {missionary.video && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={missionary.video} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4" />
                      Ver Apresentação
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0 w-full lg:w-auto">
              <Card className="bg-secondary/50 border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-accent mb-2">R$ {missionary.monthlySupport.toLocaleString()}</div>
                  <div className="text-muted-foreground text-sm mb-4">recebido mensalmente</div>
                  <div className="space-y-2">
                    <Button variant="support" className="w-full">
                      <Heart className="w-4 h-4" />
                      Apoiar Mensalmente
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4" />
                      Enviar Mensagem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Support Plans */}
        <Card className="mb-8 bg-gradient-to-br from-card to-card/95 border-0 shadow-card">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Planos de Apoio</h2>
            <p className="text-center text-muted-foreground">Escolha como você gostaria de apoiar esta missão</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {supportPlans.map((plan) => (
                <Card key={plan.id} className="border-2 border-secondary/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-accent mb-2">R$ {plan.amount}</div>
                    <div className="text-muted-foreground text-sm mb-4">{plan.duration}</div>
                    <ul className="space-y-2 text-sm mb-6">
                      {plan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-accent" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Button variant="support" className="w-full">
                      Escolher Plano
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50">
            <TabsTrigger value="details">Detalhes da Missão</TabsTrigger>
            <TabsTrigger value="updates">Acompanhamento</TabsTrigger>
            <TabsTrigger value="project">Projeto</TabsTrigger>
            <TabsTrigger value="volunteer">Voluntariado</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-card">
              <CardHeader>
                <h3 className="text-xl font-semibold">Detalhes da Missão</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Objetivos da Missão
                  </h4>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-semibold text-foreground mt-3 mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold text-foreground mt-2 mb-1">{children}</h3>,
                        p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                      }}
                    >
                      {missionary.mission || "Nenhum objetivo cadastrado ainda."}
                    </ReactMarkdown>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Fases da Missão</h4>
                  <div className="space-y-4">
                    {missionPhases.map((phase, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          phase.status === 'completed' ? 'bg-accent text-accent-foreground' :
                          phase.status === 'active' ? 'bg-primary text-primary-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {phase.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : phase.status === 'active' ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <Target className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-semibold">{phase.phase}</h5>
                          <p className="text-sm text-muted-foreground">{phase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-card">
              <CardHeader>
                <h3 className="text-xl font-semibold">Acompanhamento Mensal</h3>
                <p className="text-muted-foreground">Últimas atualizações da missão</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {monthlyUpdates.length > 0 ? (
                  monthlyUpdates.map((update) => (
                    <div key={update.id} className="border-l-4 border-primary pl-6 py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{update.date}</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{update.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{update.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhuma atualização disponível ainda.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="project" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-card">
              <CardHeader>
                <h3 className="text-xl font-semibold">Projeto de Arrecadação</h3>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Meta total: R$ {missionary.totalGoal.toLocaleString()}</span>
                  <span className="font-semibold text-accent">
                    {Math.round((missionary.currentProgress / missionary.totalGoal) * 100)}% concluído
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-accent to-accent-glow h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(missionary.currentProgress / missionary.totalGoal) * 100}%` }}
                  />
                </div>
                
                <div className="grid gap-6">
                  {missionary.projectGoals.length > 0 ? (
                    missionary.projectGoals.map((goal) => (
                      <Card key={goal.id} className="border border-secondary/50">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold">{goal.title}</h4>
                            <span className="text-sm text-muted-foreground">
                              {goal.goal > 0 ? Math.round((goal.progress / goal.goal) * 100) : 0}%
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{goal.description}</p>
                          <div className="w-full bg-secondary rounded-full h-2 mb-3">
                            <div 
                              className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full"
                              style={{ width: `${goal.goal > 0 ? (goal.progress / goal.goal) * 100 : 0}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              R$ {goal.progress.toLocaleString()} de R$ {goal.goal.toLocaleString()}
                            </span>
                            <Button variant="support" size="sm">
                              <DollarSign className="w-4 h-4" />
                              Contribuir
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum projeto de arrecadação cadastrado ainda.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteer" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-card">
              <CardHeader>
                <h3 className="text-xl font-semibold">Oportunidades de Voluntariado</h3>
                <p className="text-muted-foreground">Participe diretamente da missão</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <Card className="border border-secondary/50">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2">Educador Voluntário</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        Ajude na capacitação de professores locais e no desenvolvimento de materiais educativos culturalmente apropriados.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">Educação</Badge>
                        <Badge variant="outline">3 meses</Badge>
                        <Badge variant="outline">Presencial</Badge>
                      </div>
                      <Button variant="support" className="w-full">
                        Candidatar-se
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-secondary/50">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2">Suporte Técnico</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        Auxilie na implementação e manutenção de equipamentos tecnológicos e sistemas de comunicação.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">Tecnologia</Badge>
                        <Badge variant="outline">1 mês</Badge>
                        <Badge variant="outline">Híbrido</Badge>
                      </div>
                      <Button variant="support" className="w-full">
                        Candidatar-se
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MissionaryProfile;