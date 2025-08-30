import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Save, Plus, Calendar, Briefcase } from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  category: string;
  location: string;
  about: string;
  objectives: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface Progress {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

const MissionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [mission, setMission] = useState<Mission | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [editedMission, setEditedMission] = useState<Partial<Mission>>({});
  const [newProgress, setNewProgress] = useState({ title: '', description: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  const categories = [
    'Evangelização',
    'Educação',
    'Saúde',
    'Assistência Social',
    'Construção',
    'Agricultura',
    'Desenvolvimento Comunitário',
    'Capacitação Profissional'
  ];

  useEffect(() => {
    if (user && id) {
      fetchMissionData();
    }
  }, [user, id]);

  const fetchMissionData = async () => {
    try {
      // Fetch mission
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (missionError) throw missionError;

      setMission(missionData);
      setEditedMission(missionData);

      // Fetch progress
      const { data: progressData, error: progressError } = await supabase
        .from('mission_progress')
        .select('*')
        .eq('mission_id', id)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (progressError) throw progressError;
      setProgress(progressData || []);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('mission_projects')
        .select('*')
        .eq('mission_id', id)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

    } catch (error) {
      console.error('Error fetching mission data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados da missão',
        variant: 'destructive',
      });
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMission = async () => {
    if (!mission || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('missions')
        .update({
          name: editedMission.name || mission.name,
          category: editedMission.category || mission.category,
          location: editedMission.location || mission.location,
          about: editedMission.about || mission.about,
          objectives: editedMission.objectives || mission.objectives,
        })
        .eq('id', mission.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMission({ ...mission, ...editedMission });
      toast({
        title: 'Sucesso',
        description: 'Missão atualizada com sucesso',
      });
    } catch (error) {
      console.error('Error updating mission:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar missão',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddProgress = async () => {
    if (!newProgress.title || !newProgress.description || !user) return;

    try {
      const { data, error } = await supabase
        .from('mission_progress')
        .insert({
          mission_id: id,
          title: newProgress.title,
          description: newProgress.description,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setProgress([data, ...progress]);
      setNewProgress({ title: '', description: '' });
      setShowProgressDialog(false);
      toast({
        title: 'Sucesso',
        description: 'Acompanhamento adicionado com sucesso',
      });
    } catch (error) {
      console.error('Error adding progress:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar acompanhamento',
        variant: 'destructive',
      });
    }
  };

  const handleAddProject = async () => {
    if (!newProject.name || !user) return;

    try {
      const { data, error } = await supabase
        .from('mission_projects')
        .insert({
          mission_id: id,
          name: newProject.name,
          description: newProject.description,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setProjects([data, ...projects]);
      setNewProject({ name: '', description: '' });
      setShowProjectDialog(false);
      toast({
        title: 'Sucesso',
        description: 'Projeto adicionado com sucesso',
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar projeto',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Você precisa estar logado para acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Carregando dados da missão...</p>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Missão não encontrada.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              className="w-full mt-4"
            >
              Voltar ao perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button
            onClick={handleSaveMission}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>

        {/* Mission Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detalhes da Missão</CardTitle>
            <CardDescription>
              Edite as informações principais da sua missão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Missão</Label>
                <Input
                  id="name"
                  value={editedMission.name || ''}
                  onChange={(e) => setEditedMission({ ...editedMission, name: e.target.value })}
                  placeholder="Nome da missão"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  value={editedMission.category || ''}
                  onChange={(e) => setEditedMission({ ...editedMission, category: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={editedMission.location || ''}
                onChange={(e) => setEditedMission({ ...editedMission, location: e.target.value })}
                placeholder="Localização da missão"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">Sobre</Label>
              <Textarea
                id="about"
                value={editedMission.about || ''}
                onChange={(e) => setEditedMission({ ...editedMission, about: e.target.value })}
                placeholder="Descrição da missão"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="objectives" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="objectives">Objetivos</TabsTrigger>
            <TabsTrigger value="progress">Acompanhamento Mensal</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
          </TabsList>

          {/* Objectives Tab */}
          <TabsContent value="objectives" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Objetivos da Missão</CardTitle>
                <CardDescription>
                  Descreva os objetivos e metas da sua missão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editedMission.objectives || ''}
                  onChange={(e) => setEditedMission({ ...editedMission, objectives: e.target.value })}
                  placeholder="Descreva os objetivos da missão"
                  rows={6}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Acompanhamentos Mensais</h3>
              <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Acompanhamento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Acompanhamento</DialogTitle>
                    <DialogDescription>
                      Adicione um novo relatório de acompanhamento mensal
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="progress-title">Título</Label>
                      <Input
                        id="progress-title"
                        value={newProgress.title}
                        onChange={(e) => setNewProgress({ ...newProgress, title: e.target.value })}
                        placeholder="Título do acompanhamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="progress-description">Descrição</Label>
                      <Textarea
                        id="progress-description"
                        value={newProgress.description}
                        onChange={(e) => setNewProgress({ ...newProgress, description: e.target.value })}
                        placeholder="Descreva o progresso da missão"
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowProgressDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddProgress}>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {progress.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Nenhum acompanhamento registrado ainda
                  </CardContent>
                </Card>
              ) : (
                progress.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Projetos da Missão</h3>
              <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Projeto</DialogTitle>
                    <DialogDescription>
                      Adicione um novo projeto à sua missão
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Nome do Projeto</Label>
                      <Input
                        id="project-name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="Nome do projeto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-description">Descrição</Label>
                      <Textarea
                        id="project-description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Descreva o projeto"
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddProject}>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Nenhum projeto cadastrado ainda
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            Status: {project.status}
                          </span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {new Date(project.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    {project.description && (
                      <CardContent>
                        <p className="text-sm">{project.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MissionEdit;