import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Heart, DollarSign } from 'lucide-react';

interface ProjectContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onContributionSuccess?: () => void;
}

export const ProjectContributionModal = ({
  isOpen,
  onClose,
  projectId,
  projectName,
  onContributionSuccess
}: ProjectContributionModalProps) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Modal state changed - isOpen:', isOpen);
  }, [isOpen]);

  const handleAmountChange = (value: string) => {
    // Remove qualquer caractere que não seja número ou vírgula/ponto
    const cleanValue = value.replace(/[^\d.,]/g, '');
    setAmount(cleanValue);
  };

  const handleContribute = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para contribuir.",
      });
      return;
    }

    const numericAmount = parseFloat(amount.replace(',', '.'));
    
    if (!numericAmount || numericAmount < 10) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "O valor mínimo para contribuição é R$ 10,00.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('project_contributions')
        .insert({
          user_id: user.id,
          project_id: projectId,
          amount: numericAmount,
          status: 'confirmed',
          payment_method: 'digital'
        });

      if (error) throw error;

      toast({
        title: "Contribuição realizada!",
        description: `Obrigado por contribuir com R$ ${numericAmount.toFixed(2)} para ${projectName}!`,
      });

      onContributionSuccess?.();
      onClose();
      setAmount('');
    } catch (error) {
      console.error('Error creating contribution:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar sua contribuição. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Contribuir com Projeto
          </DialogTitle>
          <DialogDescription>
            Faça sua contribuição para <strong>{projectName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor da contribuição</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="amount"
                type="text"
                placeholder="0,00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Valor mínimo: R$ 10,00
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleContribute}
            disabled={loading || !amount}
            className="flex items-center gap-2"
          >
            {loading ? (
              'Processando...'
            ) : (
              <>
                <Heart className="w-4 h-4" />
                Contribuir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};