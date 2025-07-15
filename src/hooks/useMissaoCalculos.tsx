import { useMemo } from 'react';
import { MissaoDia } from '@/hooks/useMissaoDia';

export interface DetalhePontuacao {
  categoria: string;
  pergunta: string;
  pontos: number;
  pontosMaximos: number;
  respondida: boolean;
}

export interface PontuacaoCalculada {
  total: number;
  detalhes: DetalhePontuacao[];
}

// Hook focado apenas em cálculos de pontuação
export const useMissaoCalculos = (missao: MissaoDia | null) => {
  const pontuacaoCalculada = useMemo((): PontuacaoCalculada => {
    if (!missao) return { total: 0, detalhes: [] };
    
    const detalhes: DetalhePontuacao[] = [
      {
        categoria: 'Ritual da Manhã',
        pergunta: 'Primeiro líquido consumido',
        pontos: missao.liquido_ao_acordar === 'Água morna com limão' ? 2 :
                missao.liquido_ao_acordar === 'Chá natural' ? 1 :
                missao.liquido_ao_acordar === 'Café puro' || missao.liquido_ao_acordar === 'Outro' ? -1 : 0,
        pontosMaximos: 2,
        respondida: !!missao.liquido_ao_acordar,
      },
      {
        categoria: 'Ritual da Manhã',
        pergunta: 'Práticas de conexão interna',
        pontos: (missao.pratica_conexao?.includes('Oração') ? 2 : 0) +
                (missao.pratica_conexao?.includes('Meditação') ? 2 : 0) +
                (missao.pratica_conexao?.includes('Respiração consciente') ? 2 : 0),
        pontosMaximos: 6,
        respondida: !!missao.pratica_conexao,
      },
      {
        categoria: 'Ritual da Manhã',
        pergunta: 'Energia ao acordar',
        pontos: missao.energia_ao_acordar === 5 ? 3 :
                missao.energia_ao_acordar === 4 ? 2 :
                missao.energia_ao_acordar === 3 ? 1 :
                missao.energia_ao_acordar === 2 ? 0 :
                missao.energia_ao_acordar === 1 ? -1 : 0,
        pontosMaximos: 3,
        respondida: !!missao.energia_ao_acordar,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Horas de sono',
        pontos: missao.sono_horas && missao.sono_horas <= 4 ? -1 :
                missao.sono_horas === 6 ? 1 :
                missao.sono_horas && missao.sono_horas >= 8 ? 2 : 0,
        pontosMaximos: 2,
        respondida: !!missao.sono_horas,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Consumo de água',
        pontos: missao.agua_litros === 'Menos de 500ml' ? -1 :
                missao.agua_litros === '1L' ? 1 :
                missao.agua_litros === '2L' ? 2 :
                missao.agua_litros === '3L ou mais' ? 3 : 0,
        pontosMaximos: 3,
        respondida: !!missao.agua_litros,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Atividade física',
        pontos: missao.atividade_fisica === true ? 2 : 0,
        pontosMaximos: 2,
        respondida: missao.atividade_fisica !== undefined,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Nível de estresse',
        pontos: missao.estresse_nivel === 1 ? 3 :
                missao.estresse_nivel === 2 ? 2 :
                missao.estresse_nivel === 3 ? 1 :
                missao.estresse_nivel === 4 ? 0 :
                missao.estresse_nivel === 5 ? -1 : 0,
        pontosMaximos: 3,
        respondida: !!missao.estresse_nivel,
      },
      {
        categoria: 'Hábitos do Dia',
        pergunta: 'Fome emocional',
        pontos: missao.fome_emocional === true ? -1 :
                missao.fome_emocional === false ? 2 : 0,
        pontosMaximos: 2,
        respondida: missao.fome_emocional !== undefined,
      },
      {
        categoria: 'Mente & Emoções',
        pergunta: 'Gratidão',
        pontos: missao.gratidao ? 1 : 0,
        pontosMaximos: 1,
        respondida: !!missao.gratidao,
      },
      {
        categoria: 'Mente & Emoções',
        pergunta: 'Pequena vitória',
        pontos: missao.pequena_vitoria && missao.pequena_vitoria.trim() ? 2 : 0,
        pontosMaximos: 2,
        respondida: !!missao.pequena_vitoria?.trim(),
      },
      {
        categoria: 'Mente & Emoções',
        pergunta: 'Intenção para amanhã',
        pontos: missao.intencao_para_amanha ? 1 : 0,
        pontosMaximos: 1,
        respondida: !!missao.intencao_para_amanha,
      },
      {
        categoria: 'Mente & Emoções',
        pergunta: 'Avaliação do dia',
        pontos: missao.nota_dia === 5 ? 4 :
                missao.nota_dia === 4 ? 3 :
                missao.nota_dia === 3 ? 2 :
                missao.nota_dia === 2 ? 1 :
                missao.nota_dia === 1 ? 0 : 0,
        pontosMaximos: 4,
        respondida: !!missao.nota_dia,
      },
    ];

    const total = detalhes.reduce((sum, item) => sum + item.pontos, 0);
    return { total, detalhes };
  }, [missao]);

  const progresso = useMemo(() => {
    if (!missao) return 0;
    
    const campos = [
      missao.liquido_ao_acordar,
      missao.pratica_conexao,
      missao.energia_ao_acordar,
      missao.sono_horas,
      missao.agua_litros,
      missao.atividade_fisica,
      missao.estresse_nivel,
      missao.fome_emocional,
      missao.gratidao,
      missao.pequena_vitoria,
      missao.intencao_para_amanha,
      missao.nota_dia
    ];
    
    const preenchidos = campos.filter(campo => 
      campo !== undefined && campo !== null && campo !== ""
    ).length;
    
    return Math.round((preenchidos / campos.length) * 100);
  }, [missao]);

  return {
    pontuacaoCalculada,
    progresso
  };
};