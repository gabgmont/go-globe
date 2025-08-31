import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Calendar, Users, Heart, MessageCircle, Target, CheckCircle, Clock, DollarSign, Video, Mail, Phone, Globe } from "lucide-react";

const MissionaryProfile = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'details';

  // Mock data - em uma aplicação real, isso viria de uma API
  const missionary = {
    id: id || '1',
    name: 'Ana Santos',
    location: 'Amazônia, Brasil',
    mission: 'Trabalho comunitário com povos indígenas focando em educação infantil e preservação cultural',
    startDate: 'Jan 2023',
    supporters: 45,
    monthlySupport: 3200,
    avatar: '/src/assets/missionary-1.jpg',
    specialization: 'Educação Infantil',
    status: 'active' as const,
    bio: 'Educadora com 8 anos de experiência em comunidades rurais. Formada em Pedagogia e pós-graduada em Educação Intercultural. Apaixonada por preservação cultural e desenvolvimento comunitário.',
    video: 'https://example.com/video',
    email: 'ana.santos@missao.org',
    phone: '+55 11 99999-9999',
    website: 'anasantos.missao.org',
    totalGoal: 50000,
    currentProgress: 28500,
    projectGoals: [
      { id: 1, title: 'Material Escolar', goal: 5000, progress: 4200, description: 'Livros, cadernos e materiais didáticos' },
      { id: 2, title: 'Equipamentos', goal: 15000, progress: 8500, description: 'Computadores e equipamentos audiovisuais' },
      { id: 3, title: 'Estrutura', goal: 30000, progress: 15800, description: 'Construção e reforma da escola' }
    ]
  };

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

  const monthlyUpdates = [
    {
      id: 1,
      date: 'Fevereiro 2024',
      title: 'Progresso na Escola Comunitária',
      content: 'Neste mês conseguimos finalizar a primeira sala de aula e começamos as atividades com 25 crianças da comunidade. A resposta tem sido muito positiva...'
    },
    {
      id: 2,
      date: 'Janeiro 2024',
      title: 'Início das Atividades',
      content: 'Começamos oficialmente o trabalho na comunidade Yawanawá. O processo de integração cultural tem sido fundamental para o sucesso do projeto...'
    }
  ];

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
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4" />
                  Ver Apresentação
                </Button>
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
                  <p className="text-muted-foreground leading-relaxed">{missionary.mission}</p>
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
                {monthlyUpdates.map((update) => (
                  <div key={update.id} className="border-l-4 border-primary pl-6 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{update.date}</span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{update.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{update.content}</p>
                  </div>
                ))}
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
                  {missionary.projectGoals.map((goal) => (
                    <Card key={goal.id} className="border border-secondary/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{goal.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((goal.progress / goal.goal) * 100)}%
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{goal.description}</p>
                        <div className="w-full bg-secondary rounded-full h-2 mb-3">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full"
                            style={{ width: `${(goal.progress / goal.goal) * 100}%` }}
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
                  ))}
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