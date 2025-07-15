
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DadosFisicosExistentes } from '@/components/forms/DadosFisicosExistentes';
import { DadosFisicosIniciais } from '@/components/forms/DadosFisicosIniciais';

interface DadosFisicosFormData {
  dataNascimento: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  pesoAtual: number;
  altura: number;
  circunferenciaAbdominal: number;
}

export const DadosFisicosForm = () => {
  const { user } = useAuth();
  const [existingData, setExistingData] = useState<any>(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkExistingData();
  }, [user]);

  const checkExistingData = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data: existingPhysicalData } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', profile.id)
        .single();

      if (existingPhysicalData) {
        setExistingData(existingPhysicalData);
        setHasExistingData(true);
      }
    } catch (error) {
      console.error('Erro ao verificar dados existentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: DadosFisicosFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar os dados');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      // Salvar na tabela dados_saude_usuario
      const { error: saudeError } = await supabase
        .from('dados_saude_usuario')
        .upsert({
          user_id: profile.id,
          peso_atual_kg: Number(data.pesoAtual),
          altura_cm: Number(data.altura),
          circunferencia_abdominal_cm: Number(data.circunferenciaAbdominal),
          meta_peso_kg: Number(data.pesoAtual)
        });

      if (saudeError) throw saudeError;

      // Salvar dados físicos permanentes
      const { error: fisicosError } = await supabase
        .from('dados_fisicos_usuario')
        .upsert({
          user_id: profile.id,
          nome_completo: 'Nome do Usuário',
          data_nascimento: data.dataNascimento,
          sexo: data.sexo,
          peso_atual_kg: Number(data.pesoAtual),
          altura_cm: Number(data.altura),
          circunferencia_abdominal_cm: Number(data.circunferenciaAbdominal),
          meta_peso_kg: Number(data.pesoAtual)
        });

      if (fisicosError) throw fisicosError;

      toast.success('Dados físicos salvos permanentemente! Não será necessário preencher novamente.');
      
      setHasExistingData(true);
      checkExistingData();
      
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error('Erro ao salvar dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange mx-auto"></div>
          <p className="text-muted-foreground mt-4">Verificando dados existentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {hasExistingData ? (
          <DadosFisicosExistentes 
            existingData={existingData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <DadosFisicosIniciais 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};
