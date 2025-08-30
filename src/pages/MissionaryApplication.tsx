import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Upload, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MissionaryApplication = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [churches, setChurches] = useState<Array<{id: string; name: string}>>([]);
  const [openChurchSelector, setOpenChurchSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: null as File | null,
    current_location: '',
    start_date: '',
    work_category: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    presentation_video: null as File | null,
    additional_info: '',
    church_id: ''
  });

  const workCategories = [
    'Evangelização',
    'Ensino e Educação',
    'Assistência Social',
    'Saúde e Medicina',
    'Construção e Desenvolvimento',
    'Tradução Bíblica',
    'Plantação de Igrejas',
    'Ministério Infantil',
    'Ministério Jovem',
    'Outro'
  ];

  useEffect(() => {
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    try {
      const { data, error } = await supabase
        .from('churches')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setChurches(data || []);
    } catch (error) {
      console.error('Error fetching churches:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string | null> => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${user!.id}/${Date.now()}.${fileExtension}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    if (bucket === 'missionary-photos') {
      // For public bucket, return the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      return publicUrl;
    } else {
      // For private bucket, return the file path
      return fileName;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.name || !formData.current_location || !formData.start_date || 
        !formData.work_category || !formData.description) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    setLoading(true);
    try {
      let photoUrl = null;
      let videoUrl = null;

      // Upload photo if provided
      if (formData.photo) {
        photoUrl = await uploadFile(formData.photo, 'missionary-photos', 'profile-photos');
        if (!photoUrl) {
          throw new Error('Falha no upload da foto');
        }
      }

      // Upload video if provided
      if (formData.presentation_video) {
        videoUrl = await uploadFile(formData.presentation_video, 'missionary-videos', 'presentation-videos');
        if (!videoUrl) {
          throw new Error('Falha no upload do vídeo');
        }
      }

      // Insert missionary application data
      const { error } = await supabase
        .from('missionary_applications')
        .insert({
          user_id: user.id,
          name: formData.name,
          photo_url: photoUrl,
          current_location: formData.current_location,
          start_date: formData.start_date,
          work_category: formData.work_category,
          description: formData.description,
          email: formData.email || null,
          phone: formData.phone || null,
          website: formData.website || null,
          presentation_video_url: videoUrl,
          additional_info: formData.additional_info || null,
          church_id: formData.church_id === 'none' ? null : formData.church_id || null,
          status: 'pending'
        });

      if (error) throw error;
      
      toast({
        title: "Aplicação enviada com sucesso!",
        description: "Seu perfil entrou em análise. Você será notificado em breve sobre o status da sua aplicação.",
      });

      // Reset form
      setFormData({
        name: '',
        photo: null,
        current_location: '',
        start_date: '',
        work_category: '',
        description: '',
        email: '',
        phone: '',
        website: '',
        presentation_video: null,
        additional_info: '',
        church_id: ''
      });

    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível enviar sua aplicação. Tente novamente.",
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
                Você precisa estar logado para acessar esta página.
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
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/profile" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao perfil
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Aplicação para Missionário</CardTitle>
              <CardDescription>
                Preencha as informações abaixo para se candidatar como missionário em nossa plataforma.
                Os campos marcados com * são obrigatórios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo">Foto de perfil</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('photo')?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.photo ? formData.photo.name : 'Escolher foto'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localização atual *</Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.current_location}
                      onChange={(e) => handleInputChange('current_location', e.target.value)}
                      placeholder="Cidade, Estado, País ou 'Não informado'"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de início da atuação *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="category">Categoria do trabalho realizado *</Label>
                    <Select 
                      value={formData.work_category} 
                      onValueChange={(value) => handleInputChange('work_category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {workCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="church_id">Instituição Vinculada (opcional)</Label>
                    <Popover open={openChurchSelector} onOpenChange={setOpenChurchSelector}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openChurchSelector}
                          className="w-full justify-between"
                        >
                          {formData.church_id && formData.church_id !== 'none'
                            ? churches.find((church) => church.id === formData.church_id)?.name
                            : "Selecione uma instituição (opcional)"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar instituição..." />
                          <CommandList>
                            <CommandEmpty>Nenhuma instituição encontrada.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value="none"
                                onSelect={() => {
                                  handleInputChange('church_id', 'none');
                                  setOpenChurchSelector(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    formData.church_id === 'none' || !formData.church_id ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                Nenhuma instituição selecionada
                              </CommandItem>
                              {churches.map((church) => (
                                <CommandItem
                                  key={church.id}
                                  value={church.name}
                                  onSelect={() => {
                                    handleInputChange('church_id', church.id);
                                    setOpenChurchSelector(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      formData.church_id === church.id ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  {church.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Descrição do trabalho *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descreva detalhadamente o trabalho missionário que você realiza..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+55 (11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website">Site (opcional)</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://www.seusite.com"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="video">Vídeo de apresentação (opcional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange('presentation_video', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('video')?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.presentation_video ? formData.presentation_video.name : 'Escolher vídeo'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="additionalInfo">Outras experiências e motivações</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additional_info}
                      onChange={(e) => handleInputChange('additional_info', e.target.value)}
                      placeholder="Conte-nos sobre outras experiências relevantes, suas motivações para o trabalho missionário, ou qualquer informação adicional que gostaria de compartilhar..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Enviando...' : 'Enviar aplicação'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => window.history.back()}
                    className="flex-1"
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

export default MissionaryApplication;