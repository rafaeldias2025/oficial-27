export interface WeeklyEvaluation {
  id: string;
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  objetivos_semana_anterior: string;
  objetivos_alcancados: boolean;
  motivo_nao_alcancado?: string;
  pontos_positivos: string[];
  pontos_melhorar: string[];
  objetivos_proxima_semana: string;
  notas_adicionais?: string;
  humor_semana: 'otimo' | 'bom' | 'regular' | 'ruim' | 'pessimo';
  nivel_energia: number; // 1-5
  qualidade_sono: number; // 1-5
  nivel_estresse: number; // 1-5
  alimentacao_qualidade: number; // 1-5
  exercicios_frequencia: number; // 1-5
  created_at: string;
  updated_at: string;
}

export interface EvaluationFormData {
  objetivos_semana_anterior: string;
  objetivos_alcancados: boolean;
  motivo_nao_alcancado?: string;
  pontos_positivos: string[];
  pontos_melhorar: string[];
  objetivos_proxima_semana: string;
  notas_adicionais?: string;
  humor_semana: WeeklyEvaluation['humor_semana'];
  nivel_energia: number;
  qualidade_sono: number;
  nivel_estresse: number;
  alimentacao_qualidade: number;
  exercicios_frequencia: number;
  aprendizado_semana: {
    melhor_acontecimento: string;
    maior_desafio: string;
    conselho_mentor: string;
    maior_aprendizado_sabotador: string;
    momento_percebi_sabotando: string;
    nome_semana: string;
    relacao_ultima_semana: string;
  };
  desempenho_semanal: {
    // Saúde
    saude_alimentacao_objetivos: number;
    saude_recuperacao_fisica: number;
    saude_bebi_agua: number;
    saude_mais_energia: number;
    saude_raspei_lingua: number;
    // Presença
    presenca_focado_planejei: number;
    presenca_atitudes_intencionais: number;
    presenca_atencao_alimentacao: number;
    presenca_clareza_objetivos: number;
    presenca_disciplina_consistencia: number;
    // Físico
    fisico_fui_academia: number;
    fisico_caminhada_melhor: number;
    fisico_mobilidade: number;
    fisico_sono_qualidade: number;
    fisico_condicionamento_aumentou: number;
    // Profissional
    profissional_li_livro: number;
    profissional_fiz_mais_combinado: number;
    profissional_ajudei_alguem: number;
    profissional_melhorei_trabalho: number;
    profissional_assisti_podcast: number;
  };
}

export interface EvaluationStats {
  totalEvaluations: number;
  completionRate: number;
  averageEnergy: number;
  averageSleep: number;
  averageStress: number;
  averageNutrition: number;
  averageExercise: number;
  moodDistribution: Record<WeeklyEvaluation['humor_semana'], number>;
  objectivesAchievedRate: number;
}

export interface EvaluationChartData {
  date: string;
  energia: number;
  sono: number;
  estresse: number;
  alimentacao: number;
  exercicios: number;
} 