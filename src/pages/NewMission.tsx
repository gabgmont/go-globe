import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const NewMission = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [missionaryApplication, setMissionaryApplication] = useState<any>(null);
  const [loadingApplication, setLoadingApplication] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    about: '',
    objectives: ''
  });

  const categories = [
    'Evangelização',
    'Assistência Social',
    'Educação',
    'Saúde',
    'Construção/Reforma',
    'Capacitação',
    'Outro'
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !missionaryApplication) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('missions')
        .insert({
          user_id: user.id,
          missionary_application_id: missionaryApplication.id,
          name: formData.name,
          category: formData.category,
          location: formData.location || null,
          about: formData.about,
          objectives: formData.objectives
        });

      if (error) throw error;

      toast({
        title: "Missão criada",
        description: "Sua nova missão foi cadastrada com sucesso.",
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error creating mission:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar a missão.",
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
                Você precisa estar logado para criar uma missão.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (loadingApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Carregando informações...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!missionaryApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Aplicação necessária</CardTitle>
              <CardDescription>
                Você precisa ter uma aplicação de missionário aprovada para criar missões.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/missionary-application')}
                className="w-full"
              >
                Fazer aplicação missionária
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao perfil
            </Button>
            <h1 className="text-3xl font-bold">Nova Missão</h1>
            <p className="text-muted-foreground mt-2">
              Compartilhe sua nova missão com a comunidade
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Missão</CardTitle>
              <CardDescription>
                Preencha as informações sobre sua nova missão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Missão</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome da sua missão"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select 
                    required
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização (opcional)</Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Onde sua missão está localizada"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">Sobre a Missão</Label>
                  <Textarea
                    id="about"
                    required
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    placeholder="Descreva sua missão, o contexto e as necessidades"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives">Objetivos da Missão</Label>
                  <Textarea
                    id="objectives"
                    required
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    placeholder="Quais são os objetivos e metas da sua missão?"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Criando...' : 'Criar Missão'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewMission;