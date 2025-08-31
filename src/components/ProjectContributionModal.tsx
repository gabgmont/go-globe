import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart } from 'lucide-react';

interface ProjectContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  projectGoal: number;
  currentProgress: number;
  isMaterialDonation?: boolean;
}

export const ProjectContributionModal = ({
  isOpen,
  onClose,
  projectId,
  projectName,
  projectGoal,
  currentProgress,
  isMaterialDonation = false
}: ProjectContributionModalProps) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.,]/g, '');
    setAmount(value);
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
    
    if (!numericAmount || numericAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para contribuição.",
      });
      return;
    }

    // Verificar se a contribuição não excede a meta
    if (currentProgress + numericAmount > projectGoal) {
      toast({
        variant: "destructive",
        title: "Valor excede a meta",
        description: `A contribuição não pode exceder a meta do projeto. Valor máximo: ${isMaterialDonation ? (projectGoal - currentProgress).toFixed(0) : `R$ ${(projectGoal - currentProgress).toFixed(2)}`}`,
      });
      return;
    }

    if (!isMaterialDonation && numericAmount < 10) {
      toast({
        variant: "destructive",
        title: "Valor mínimo",
        description: "O valor mínimo de contribuição é R$ 10,00.",
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
          payment_method: 'online'
        });

      if (error) throw error;

      toast({
        title: "Contribuição realizada!",
        description: `Obrigado por contribuir para o projeto "${projectName}".`,
      });

      setAmount('');
      onClose();
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

  const remainingAmount = projectGoal - currentProgress;
  const formatCurrency = (value: number) => isMaterialDonation ? value.toFixed(0) : `R$ ${value.toFixed(2)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Contribuir para o Projeto
          </DialogTitle>
          <DialogDescription>
            {projectName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">
              {isMaterialDonation ? 'Quantidade' : 'Valor da contribuição'}
            </Label>
            <Input
              id="amount"
              type="text"
              placeholder={isMaterialDonation ? "Ex: 5" : "Ex: 50,00"}
              value={amount}
              onChange={handleAmountChange}
              className="text-right"
            />
            {!isMaterialDonation && (
              <p className="text-xs text-muted-foreground">
                Valor mínimo: R$ 10,00
              </p>
            )}
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Meta do projeto:</span>
              <span className="font-medium">{formatCurrency(projectGoal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Progresso atual:</span>
              <span className="font-medium">{formatCurrency(currentProgress)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Restante:</span>
              <span className="font-medium text-primary">{formatCurrency(remainingAmount)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleContribute} disabled={loading || !amount}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Contribuição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};