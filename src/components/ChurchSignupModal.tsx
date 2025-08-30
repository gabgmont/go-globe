import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChurch } from '@/hooks/useChurch';
import { Upload } from 'lucide-react';

interface ChurchSignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChurchSignupModal = ({ open, onOpenChange }: ChurchSignupModalProps) => {
  const { signUpChurch } = useChurch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUpChurch(
      formData.email,
      formData.password,
      formData.name,
      formData.primaryColor,
      formData.secondaryColor,
      logoFile || undefined
    );

    setLoading(false);

    if (!error) {
      onOpenChange(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
      });
      setLogoFile(null);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Igreja</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="church-name">Nome da Igreja</Label>
            <Input
              id="church-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo da igreja"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="church-email">Email</Label>
            <Input
              id="church-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@igreja.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="church-password">Senha</Label>
            <Input
              id="church-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Senha segura"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="church-logo">Logo da Igreja</Label>
            <div className="relative">
              <Input
                id="church-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <Label 
                htmlFor="church-logo"
                className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {logoFile ? logoFile.name : 'Clique para selecionar logo'}
                  </span>
                </div>
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Cor Primária</Label>
              <Input
                id="primary-color"
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Cor Secundária</Label>
              <Input
                id="secondary-color"
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="h-10"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Cadastrando...' : 'Cadastrar Igreja'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};