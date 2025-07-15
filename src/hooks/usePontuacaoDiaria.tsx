import { useState, useEffect } from 'react';
import { subDays, format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { WeeklyRanking } from '@/types/points';

export interface PontuacaoDiaria {
  id: string;
  user_id: string;
  data: string;
  pontos_liquido_manha: number;
  pontos_conexao_interna: number;
  pontos_energia_acordar: number;
  pontos_sono: number;
  pontos_agua: number;
  pontos_atividade_fisica: number;
  pontos_estresse: number;
  pontos_fome_emocional: number;
  pontos_gratidao: number;
  pontos_pequena_vitoria: number;
  pontos_intencao_amanha: number;
  pontos_avaliacao_dia: number;
  total_pontos_dia: number;
  categoria_dia: 'baixa' | 'medio' | 'excelente';
  created_at: string;
  updated_at: string;
}

interface RankingData {
  userId: string;
  name: string;
  avatar?: string;
  pontos_dia: number[];
  media_semanal: number;
  posicao: number;
  streak: number;
}

interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
}

export function usePontuacaoDiaria() {
  const [pontuacao, setPontuacao] = useState<PontuacaoDiaria[]>([]);
  const [ranking, setRanking] = useState<WeeklyRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPontuacao();
    }
  }, [user]);

  const fetchPontuacao = async () => {
    try {
      setIsLoading(true);
      const dataInicial = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('pontuacao_diaria')
        .select('*')
        .eq('user_id', user?.id)
        .gte('data', dataInicial)
        .order('data', { ascending: true });

      if (error) throw error;

      setPontuacao(data as PontuacaoDiaria[] || []);
      await fetchRanking();
    } catch (error) {
      console.error('Erro ao buscar pontuação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRanking = async () => {
    try {
      const { data, error } = await supabase
        .from('pontuacao_diaria')
        .select(`
          user_id,
          total_pontos_dia,
          data,
          users:profiles!inner(
            name,
            avatar_url
          )
        `)
        .gte('data', format(subDays(new Date(), 7), 'yyyy-MM-dd'));

      if (error) throw error;

      // Agrupar pontuação por usuário
      const rankingAgrupado = (data || []).reduce((acc: Record<string, RankingData>, item: any) => {
        const userId = item.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            userId,
            name: item.users?.name || 'Usuário',
            avatar: item.users?.avatar_url,
            pontos_dia: [],
            media_semanal: 0,
            posicao: 0,
            streak: 0
          };
        }
        acc[userId].pontos_dia.push(item.total_pontos_dia);
        return acc;
      }, {});

      // Calcular média e ordenar
      const rankingFinal = Object.values(rankingAgrupado)
        .map((user) => ({
          ...user,
          media_semanal: user.pontos_dia.reduce((a, b) => a + b, 0) / user.pontos_dia.length
        }))
        .sort((a, b) => b.media_semanal - a.media_semanal)
        .map((user, index) => ({
          userId: user.userId,
          name: user.name,
          avatar: user.avatar,
          weeklyPoints: Math.round(user.media_semanal),
          position: index + 1,
          streak: user.streak,
          weekStartDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
          weekEndDate: format(new Date(), 'yyyy-MM-dd'),
          categories: {}
        }));

      setRanking(rankingFinal);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    }
  };

  const pontuacaoHoje = pontuacao.find(p => p.data === format(new Date(), 'yyyy-MM-dd'));
  const historicoPontuacao = pontuacao;
  const rankingSemanal = ranking;
  const isLoadingHoje = isLoading;
  const isLoadingHistorico = isLoading;
  const isLoadingRanking = isLoading;
  
  const getFeedbackPontuacao = (pontos: number) => {
    if (pontos >= 100) {
      return {
        emoji: '🏆',
        mensagem: 'Excelente! Você está no topo da sua jornada!',
        categoria: 'excelente' as const
      };
    } else if (pontos >= 60) {
      return {
        emoji: '👏',
        mensagem: 'Muito bem! Continue assim!',
        categoria: 'medio' as const
      };
    } else {
      return {
        emoji: '💪',
        mensagem: 'Vamos com tudo! Cada passo conta!',
        categoria: 'baixa' as const
      };
    }
  };

  return {
    pontuacao,
    ranking,
    isLoading,
    fetchPontuacao,
    pontuacaoHoje,
    historicoPontuacao,
    rankingSemanal,
    isLoadingHoje,
    isLoadingHistorico,
    isLoadingRanking,
    getFeedbackPontuacao
  };
}