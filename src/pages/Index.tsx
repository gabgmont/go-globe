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
import heroImage from "@/assets/hero-missions.jpg";
import missionary1 from "@/assets/missionary-1.jpg";
import missionary2 from "@/assets/missionary-2.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { projects, loading: projectsLoading } = useMissionProjects();

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

  const featuredMissionaries = [
    {
      id: '1',
      name: 'Maria Silva',
      location: 'Maputo, Moçambique',
      mission: 'Desenvolvimento de programas educacionais e capacitação de professores em comunidades rurais.',
      startDate: '2022',
      supporters: 45,
      monthlySupport: 8500,
      avatar: missionary1,
      specialization: 'Educação',
      status: 'active' as const
    },
    {
      id: '2',
      name: 'João Santos',
      location: 'La Paz, Bolívia',
      mission: 'Estabelecimento de centro médico e treinamento de agentes comunitários de saúde.',
      startDate: '2023',
      supporters: 32,
      monthlySupport: 6200,
      avatar: missionary2,
      specialization: 'Saúde',
      status: 'active' as const
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative h-96 lg:h-[500px] overflow-hidden rounded-xl shadow-hero">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-primary-foreground">
                    <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                      Transformando
                      <span className="block text-accent-glow">Vidas ao Redor</span>
                      do Mundo
                    </h2>
                    <p className="text-lg lg:text-xl mb-8 opacity-90">
                      Conecte-se com missionários dedicados e apoie projetos que fazem a diferença em comunidades ao redor do mundo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="hero" size="xl">
                        <Heart className="w-5 h-5" />
                        Começar a Apoiar
                      </Button>
                      <Button variant="secondary" size="xl">
                        <Users className="w-5 h-5" />
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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Projetos em Destaque</h3>
                  <p className="text-muted-foreground">Projetos que precisam da sua ajuda agora</p>
                </div>
                <Button variant="outline" onClick={() => setActiveTab('projetos')}>
                  Ver Todos
                  <ArrowRight className="w-4 h-4" />
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

            {/* Interactive Map */}
            <section className="container mx-auto px-4">
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-2">Mapa Interativo</h3>
                <p className="text-muted-foreground">Veja onde nossos missionários estão atuando</p>
              </div>
              <InteractiveMap />
            </section>

            {/* Featured Missionaries */}
            <section className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Missionários em Destaque</h3>
                  <p className="text-muted-foreground">Conheça quem está fazendo a diferença</p>
                </div>
                <Button variant="outline" onClick={() => setActiveTab('missionarios')}>
                  Ver Todos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredMissionaries.map((missionary) => (
                  <MissionaryCard key={missionary.id} {...missionary} />
                ))}
              </div>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredMissionaries.map((missionary) => (
                  <MissionaryCard key={missionary.id} {...missionary} />
                ))}
              </div>
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
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-8">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-6 h-6" />
            <span className="text-xl font-bold">World Mission Link</span>
          </div>
          <p className="text-primary-foreground/80">
            Conectando corações, transformando vidas © 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
