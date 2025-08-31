import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { StatsSection } from "@/components/StatsSection";
import { FilterSection } from "@/components/FilterSection";
import { ProjectCard } from "@/components/ProjectCard";
import { MissionaryCard } from "@/components/MissionaryCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ArrowRight, Globe, Target, Users, Heart } from "lucide-react";
import { useMissionProjects } from "@/hooks/useMissionProjects";
import { useMissionaries } from "@/hooks/useMissionaries";
import heroImage from "@/assets/hero-fullscreen.jpg";
import callToActionBg from "@/assets/call-to-action-bg.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { projects, loading: projectsLoading } = useMissionProjects();
  const { missionaries, loading: missionariesLoading } = useMissionaries();

  // Mock data
  const featuredProjects = [
    {
      id: '1',
      title: 'Escola Comunitária em Moçambique',
      location: 'Maputo, Moçambique',
      description: 'Construção de uma escola para 200 crianças em comunidade carente, incluindo materiais didáticos e treinamento de professores locais.',
      category: 'Educação',
      progress: 45000,
      goal: 120000,
      supporters: 89,
      urgent: true
    },
    {
      id: '2',
      title: 'Centro Médico Rural na Bolívia',
      location: 'La Paz, Bolívia',
      description: 'Estabelecimento de clínica médica em área rural, fornecendo cuidados básicos de saúde e programas de prevenção.',
      category: 'Saúde',
      progress: 78000,
      goal: 95000,
      supporters: 156
    },
    {
      id: '3',
      title: 'Programa de Alimentação no Camboja',
      location: 'Siem Reap, Camboja',
      description: 'Fornecimento de refeições nutritivas para crianças em situação de vulnerabilidade e educação nutricional para famílias.',
      category: 'Assistência Social',
      progress: 23000,
      goal: 60000,
      supporters: 67
    }
  ];


  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                  <div className="max-w-4xl mx-auto text-white">
                    <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight font-display animate-fade-in">
                      <span className="text-white">TRANSFORMANDO</span>
                      <span className="block text-primary-glow">
                        VIDAS
                      </span>
                      <span className="block text-5xl lg:text-7xl text-white">
                        AO REDOR DO MUNDO
                      </span>
                    </h1>
                    <p className="text-xl lg:text-2xl mb-12 font-medium text-white/90 animate-fade-in delay-100">
                      Conecte-se com missionários dedicados e apoie projetos que fazem a diferença real em comunidades ao redor do mundo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-200">
                      <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 shadow-vibrant animate-pulse-glow font-semibold">
                        <Heart className="w-6 h-6 mr-2" />
                        Começar a Apoiar Agora
                      </Button>
                      <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold">
                        <Users className="w-6 h-6 mr-2" />
                        Conhecer Missionários
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <StatsSection />

            {/* Featured Projects */}
            <section className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <div className="animate-fade-in">
                  <h3 className="text-4xl lg:text-5xl font-black mb-4 font-display text-foreground">
                    Projetos em <span className="text-primary">Destaque</span>
                  </h3>
                  <p className="text-lg text-muted-foreground font-medium">Projetos que precisam da sua ajuda agora</p>
                </div>
                <Button variant="outline" onClick={() => setActiveTab('projetos')} className="border-2 hover:border-primary hover:text-primary font-semibold">
                  Ver Todos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              {projectsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-48 rounded-t-lg mb-4"></div>
                      <div className="space-y-2">
                        <div className="bg-muted h-4 rounded w-3/4"></div>
                        <div className="bg-muted h-3 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {projects.slice(0, 4).map((project) => (
                      <CarouselItem key={project.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <ProjectCard
                          id={project.id}
                          title={project.name}
                          location={project.mission?.location || 'Localização não informada'}
                          description={project.description || ''}
                          category={project.mission?.category || 'Categoria não informada'}
                          progress={0} // Será implementado quando houver sistema de doações
                          goal={project.financial_goal || project.material_goal || 0}
                          supporters={0} // Será implementado quando houver sistema de doações
                          image={project.image_url}
                          urgent={false}
                          missionaryId={project.mission?.user_id}
                          objectiveType={project.objective_type}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum projeto encontrado no momento.</p>
                </div>
              )}
            </section>

            {/* Call to Action Section */}
            <section className="relative min-h-[400px] overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${callToActionBg})` }}
              />
              <div className="absolute inset-0 bg-primary/90" />
              <div className="relative z-10 container mx-auto px-4 py-20 text-center">
                <div className="max-w-3xl mx-auto text-white">
                  <h2 className="text-5xl lg:text-6xl font-black mb-6 font-display animate-fade-in text-white">
                    JUNTOS SOMOS MAIS FORTES
                  </h2>
                  <p className="text-xl lg:text-2xl mb-8 font-medium text-white/95 animate-fade-in delay-100">
                    Cada pequena ação gera um grande impacto. Faça parte dessa transformação global e ajude a construir um mundo melhor para todos.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold">
                      <Target className="w-6 h-6 mr-2" />
                      Fazer Doação
                    </Button>
                    <Button size="lg" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 font-semibold">
                      <Globe className="w-6 h-6 mr-2" />
                      Ser Voluntário
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Missionaries */}
            <section className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <div className="animate-fade-in">
                  <h3 className="text-4xl lg:text-5xl font-black mb-4 font-display text-foreground">
                    Missionários em <span className="text-secondary">Destaque</span>
                  </h3>
                  <p className="text-lg text-muted-foreground font-medium">Conheça quem está fazendo a diferença</p>
                </div>
                <Button variant="outline" onClick={() => setActiveTab('missionarios')} className="border-2 hover:border-secondary hover:text-secondary font-semibold">
                  Ver Todos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              {missionariesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-64 rounded-lg mb-4"></div>
                      <div className="space-y-2">
                        <div className="bg-muted h-4 rounded w-3/4"></div>
                        <div className="bg-muted h-3 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : missionaries.length > 0 ? (
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {missionaries.slice(0, 4).map((missionary) => (
                      <CarouselItem key={missionary.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <MissionaryCard key={missionary.id} {...missionary} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum missionário encontrado no momento.</p>
                </div>
              )}
            </section>
          </div>
        );

      case 'projetos':
        return (
          <div className="space-y-6">
            <FilterSection 
              activeFilters={activeFilters} 
              onFilterChange={setActiveFilters} 
            />
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Todos os Projetos</h2>
                <p className="text-muted-foreground">Descubra projetos que precisam do seu apoio</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.name}
                    location={project.mission?.location || 'Localização não informada'}
                    description={project.description || ''}
                    category={project.mission?.category || 'Categoria não informada'}
                    progress={0}
                    goal={project.financial_goal || project.material_goal || 0}
                    supporters={0}
                    image={project.image_url}
                    urgent={false}
                    missionaryId={project.mission?.user_id}
                    objectiveType={project.objective_type}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'missionarios':
        return (
          <div className="space-y-6">
            <FilterSection 
              activeFilters={activeFilters} 
              onFilterChange={setActiveFilters} 
            />
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Nossos Missionários</h2>
                <p className="text-muted-foreground">Conheça e apoie nossos missionários</p>
              </div>
              {missionariesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-64 rounded-lg mb-4"></div>
                      <div className="space-y-2">
                        <div className="bg-muted h-4 rounded w-3/4"></div>
                        <div className="bg-muted h-3 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : missionaries.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {missionaries.map((missionary) => (
                    <MissionaryCard key={missionary.id} {...missionary} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum missionário encontrado no momento.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'missoes':
        return (
          <div className="container mx-auto px-4 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Oportunidades de Missão</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Faça parte da mudança. Descubra oportunidades de voluntariado e missões ao redor do mundo.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Missões de Curto Prazo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Participe de missões de 1 semana a 6 meses em diversos países.
                  </p>
                  <div className="space-y-2">
                    <Badge>Construção</Badge>
                    <Badge>Educação</Badge>
                    <Badge>Saúde</Badge>
                  </div>
                  <Button variant="support" className="w-full">
                    Ver Oportunidades
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Missões de Longo Prazo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Comprometa-se com missões de 1 a 5 anos em projetos transformadores.
                  </p>
                  <div className="space-y-2">
                    <Badge>Plantação de Igrejas</Badge>
                    <Badge>Desenvolvimento</Badge>
                    <Badge>Liderança</Badge>
                  </div>
                  <Button variant="support" className="w-full">
                    Inscrever-se
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'apoio':
        return (
          <div className="container mx-auto px-4 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Como Apoiar</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Existem várias formas de fazer a diferença na vida de missionários e comunidades ao redor do mundo.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Apoio Mensal</h3>
                  <p className="text-muted-foreground mb-4">
                    Sustente um missionário com contribuições mensais regulares.
                  </p>
                  <Button variant="support" className="w-full">
                    Começar Apoio
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Apoio a Projetos</h3>
                  <p className="text-muted-foreground mb-4">
                    Contribua para projetos específicos e veja o impacto direto.
                  </p>
                  <Button variant="default" className="w-full">
                    Ver Projetos
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="bg-impact/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-impact" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Voluntariado</h3>
                  <p className="text-muted-foreground mb-4">
                    Use suas habilidades para apoiar missões e projetos.
                  </p>
                  <Button variant="impact" className="w-full">
                    Se Voluntariar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="transition-smooth">
        {renderContent()}
      </main>
      
    </div>
  );
};

export default Index;
