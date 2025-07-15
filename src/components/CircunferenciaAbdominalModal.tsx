import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Ruler, Save } from 'lucide-react';

interface CircunferenciaAbdominalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (circunferencia: number) => void;
  pesoAtual?: number;
}

export const CircunferenciaAbdominalModal: React.FC<CircunferenciaAbdominalModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  pesoAtual
}) => {
  const [circunferencia, setCircunferencia] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!circunferencia || !user?.id) return;

    const circunferenciaNum = parseFloat(circunferencia);
    if (isNaN(circunferenciaNum) || circunferenciaNum <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para a circunferência",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Buscar perfil do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Perfil não encontrado');

      // Buscar dados de saúde existentes
      const { data: existingData } = await supabase
        .from('dados_saude_usuario')
        .select('*')
        .eq('user_id', profile.id)
        .single();

      // Atualizar ou criar dados de saúde
      const { error } = await supabase
        .from('dados_saude_usuario')
        .upsert({
          user_id: profile.id,
          circunferencia_abdominal_cm: circunferenciaNum,
          peso_atual_kg: pesoAtual || existingData?.peso_atual_kg || 70,
          altura_cm: existingData?.altura_cm || 170,
          meta_peso_kg: existingData?.meta_peso_kg || (pesoAtual || 70),
          data_atualizacao: new Date().toISOString()
        });

      if (error) throw error;

      // Calcular risco cardiometabólico automaticamente
      const { data: profileData } = await supabase
        .from('profiles')
        .select('sexo')
        .eq('id', profile.id)
        .single();

      let riscoCardiometabolico = 'Baixo';
      if (profileData?.sexo) {
        if (profileData.sexo === 'masculino') {
          if (circunferenciaNum >= 102) riscoCardiometabolico = 'Alto';
          else if (circunferenciaNum >= 94) riscoCardiometabolico = 'Moderado';
        } else {
          if (circunferenciaNum >= 88) riscoCardiometabolico = 'Alto';
          else if (circunferenciaNum >= 80) riscoCardiometabolico = 'Moderado';
        }
      }

      toast({
        title: "Dados atualizados!",
        description: `Circunferência: ${circunferenciaNum}cm - Risco: ${riscoCardiometabolico}`,
      });

      onSaved(circunferenciaNum);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar circunferência:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-netflix-card border-netflix-border">
        <DialogHeader>
          <DialogTitle className="text-netflix-text flex items-center gap-2">
            <Ruler className="h-5 w-5 text-instituto-orange" />
            Circunferência Abdominal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-netflix-text-muted text-sm">
            Para completar sua análise após a pesagem, precisamos da sua circunferência abdominal.
            Meça na altura do umbigo, com a fita bem ajustada mas sem apertar.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="circunferencia" className="text-netflix-text">
              Circunferência Abdominal (cm)
            </Label>
            <Input
              id="circunferencia"
              type="number"
              value={circunferencia}
              onChange={(e) => setCircunferencia(e.target.value)}
              placeholder="Ex: 85"
              className="bg-netflix-hover border-netflix-border"
              min="40"
              max="200"
              step="0.1"
            />
          </div>

          {pesoAtual && (
            <div className="p-3 bg-instituto-orange/10 rounded-lg">
              <p className="text-sm text-netflix-text">
                <strong>Peso atual:</strong> {pesoAtual}kg
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 bg-instituto-orange hover:bg-instituto-orange/80"
              disabled={loading || !circunferencia}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};