import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChurch } from '@/hooks/useChurch';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X, Edit, Save, User, Mail, MapPin, Briefcase } from 'lucide-react';

export default function ChurchProfile() {
  const { user, signOut } = useAuth();
  const { church, missionaries, loading, fetchChurch, approveMissionary, rejectMissionary, updateChurch } = useChurch();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    primaryColor: '',
    secondaryColor: '',
  });

  useEffect(() => {
    if (user) {
      fetchChurch(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (church) {
      setEditData({
        name: church.name,
        primaryColor: church.primary_color,
        secondaryColor: church.secondary_color,
      });
    }
  }, [church]);

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;

    let h: number, s: number;

    if (diff === 0) {
      h = s = 0;
    } else {
      s = l > 0.5 ? diff / (2 - sum) : diff / sum;

      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / diff + 2) / 6;
          break;
        case b:
          h = ((r - g) / diff + 4) / 6;
          break;
        default:
          h = 0;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Em análise",
      approved: "Aprovado",
      rejected: "Rejeitado",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const handleSaveChanges = async () => {
    await updateChurch({
      name: editData.name,
      primary_color: editData.primaryColor,
      secondary_color: editData.secondaryColor,
    });
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
              <p className="text-muted-foreground mb-4">
                Você precisa estar logado como instituição para acessar esta página.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading || !church) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background to-secondary/20"
      style={{
        '--primary': hexToHsl(church.primary_color),
        '--secondary': hexToHsl(church.secondary_color),
      } as React.CSSProperties}
    >
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Church Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações da Instituição</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
            >
              {editMode ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {editMode ? 'Salvar' : 'Editar'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={church.logo_url || ''} alt={church.name} />
                <AvatarFallback className="text-lg font-semibold">
                  {church.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                {editMode ? (
                  <div className="space-y-2">
                    <Label htmlFor="church-name">Nome da Instituição</Label>
                    <Input
                      id="church-name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold">{church.name}</h2>
                )}
                <p className="text-muted-foreground">{church.email}</p>
              </div>
            </div>

            {editMode && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={editData.primaryColor}
                    onChange={(e) => setEditData({ ...editData, primaryColor: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Cor Secundária</Label>
                  <Input
                    id="secondary-color"
                    type="color"
                    value={editData.secondaryColor}
                    onChange={(e) => setEditData({ ...editData, secondaryColor: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Missionaries List */}
        <Card>
          <CardHeader>
            <CardTitle>Missionários Vinculados ({missionaries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {missionaries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum missionário vinculado ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {missionaries.map((missionary) => (
                  <div key={missionary.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={missionary.photo_url || ''} alt={missionary.name} />
                          <AvatarFallback>
                            {missionary.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{missionary.name}</span>
                          </div>
                          
                          {missionary.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{missionary.email}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{missionary.current_location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{missionary.work_category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(missionary.status)}
                        
                        {missionary.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approveMissionary(missionary.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectMissionary(missionary.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-6">
            <Button onClick={signOut} variant="outline" className="w-full">
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}