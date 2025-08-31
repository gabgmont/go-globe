import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
import communityImage from "@/assets/community-impact.jpg";

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
          <div className="space-y-12">
            {/* Hero Section - Full Screen */}
            <section className="relative h-screen overflow-hidden -mx-4 md:-mx-6 lg:-mx-8">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-accent/80" />
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                  <div className="max-w-4xl mx-auto text-primary-foreground">
                    <h1 className="text-hero text-shadow-strong mb-8 leading-[0.9]">
                      TRANSFORMANDO
                      <span className="block bg-gradient-impact bg-clip-text text-transparent">VIDAS</span>
                      <span className="block">PELO MUNDO</span>
                    </h1>
                    <p className="text-vibrant mb-12 opacity-95 max-w-3xl mx-auto text-shadow-strong">
                      Conecte-se com missionários dedicados e apoie projetos que fazem a diferença real em comunidades ao redor do mundo
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Button variant="secondary" size="lg" className="text-lg px-8 py-4 transition-bounce hover:scale-105">
                        <Heart className="w-6 h-6 mr-2" />
                        Começar a Apoiar
                      </Button>
                      <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary transition-bounce hover:scale-105">
                        <Users className="w-6 h-6 mr-2" />
                        Conhecer Missionários
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Scroll indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
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

            {/* Impact Section */}
            <section className="relative overflow-hidden -mx-4 md:-mx-6 lg:-mx-8 py-24">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${communityImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-impact/80" />
              <div className="relative z-10">
                <div className="container mx-auto px-4 text-center">
                  <div className="max-w-4xl mx-auto text-accent-foreground">
                    <h2 className="text-impact text-shadow-strong mb-8">
                      JUNTOS FAZEMOS A
                      <span className="block text-impact-foreground">DIFERENÇA</span>
                    </h2>
                    <p className="text-vibrant mb-8 opacity-95 text-shadow-strong">
                      Cada apoio, cada oração, cada gesto de solidariedade se transforma em esperança e mudança real na vida de milhares de pessoas
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 transition-bounce hover:scale-105">
                        <div className="text-4xl font-black text-white mb-2">150+</div>
                        <div className="text-white font-semibold">Projetos Ativos</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 transition-bounce hover:scale-105">
                        <div className="text-4xl font-black text-white mb-2">50K+</div>
                        <div className="text-white font-semibold">Vidas Impactadas</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 transition-bounce hover:scale-105">
                        <div className="text-4xl font-black text-white mb-2">25</div>
                        <div className="text-white font-semibold">Países Alcançados</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
