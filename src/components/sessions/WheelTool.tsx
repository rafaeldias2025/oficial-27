import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WheelData {
  name: string;
  value: number;
  color: string;
}

interface WheelToolProps {
  wheelType: 'energia_vital' | 'roda_vida' | 'saude_energia';
  sessionId: string;
  userId: string;
  isSessionActive: boolean;
}

const wheelConfigs = {
  energia_vital: {
    title: 'Roda da Energia Vital',
    areas: ['Espiritual', 'Mental', 'Emocional', 'Físico'],
    questions: [
      'Qual área você considera mais equilibrada e por quê?',
      'Qual área precisa de mais atenção?',
      'O que você pode fazer hoje para melhorar a área mais fraca?'
    ]
  },
  roda_vida: {
    title: 'Roda que Sustenta a Energia Vital',
    areas: ['Profissional', 'Financeiro', 'Família', 'Relacionamento Íntimo', 'Saúde e Energia'],
    questions: [
      'Qual pilar da sua vida está mais sólido?',
      'Qual área está causando mais frustração?',
      'Como você pode fortalecer o pilar mais fraco?'
    ]
  },
  saude_energia: {
    title: 'Roda da Saúde e Energia',
    areas: ['Sono', 'Intestino', 'Atividade Física', 'Alimentação', 'Respiração', 'Água', 'Ausência de Doenças', 'Energia'],
    questions: [
      'Qual hábito de saúde você considera mais forte?',
      'Qual área da sua saúde precisa de mais atenção?',
      'Que decisão você tomará para melhorar sua área mais fraca?'
    ]
  }
};

const getColorByScore = (score: number): string => {
  if (score >= 0 && score <= 3) return '#ef4444'; // vermelho
  if (score >= 4 && score <= 6) return '#eab308'; // amarelo
  if (score >= 7 && score <= 8) return '#84cc16'; // verde claro
  if (score >= 9 && score <= 10) return '#16a34a'; // verde escuro
  return '#6b7280'; // cinza padrão
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">Nota: {data.value}/10</p>
      </div>
    );
  }
  return null;
};

export const WheelTool: React.FC<WheelToolProps> = ({ 
  wheelType, 
  sessionId, 
  userId, 
  isSessionActive 
}) => {
  const { toast } = useToast();
  const config = wheelConfigs[wheelType];
  
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(config.areas.map(area => [area, 0]))
  );
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingResponse, setHasExistingResponse] = useState(false);

  useEffect(() => {
    loadExistingResponse();
  }, [sessionId, wheelType]);

  const loadExistingResponse = async () => {
    try {
      const { data, error } = await supabase
        .from('wheel_responses')
        .select('*')
        .eq('session_id', sessionId)
        .eq('wheel_type', wheelType)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setScores(data.responses as Record<string, number> || {});
        setReflectionAnswers(data.reflection_answers as Record<string, string> || {});
        setHasExistingResponse(true);
      }
    } catch (error) {
      console.error('Erro ao carregar resposta existente:', error);
    }
  };

  const handleScoreChange = (area: string, value: string) => {
    const numValue = Math.max(0, Math.min(10, parseInt(value) || 0));
    setScores(prev => ({ ...prev, [area]: numValue }));
  };

  const handleReflectionChange = (questionIndex: number, value: string) => {
    setReflectionAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const pieData: WheelData[] = config.areas.map(area => ({
    name: area,
    value: scores[area] || 0,
    color: getColorByScore(scores[area] || 0)
  }));

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('wheel_responses')
        .upsert({
          user_id: userId,
          session_id: sessionId,
          wheel_type: wheelType,
          responses: scores,
          reflection_answers: reflectionAnswers,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,session_id,wheel_type'
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Suas respostas foram salvas com sucesso.",
      });
      
      setHasExistingResponse(true);
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas respostas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSessionActive) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Esta ferramenta será liberada no dia da sua sessão.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{config.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Pizza */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Campos de Notas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Avalie cada área (0-10):</h3>
              {config.areas.map((area) => (
                <div key={area} className="flex items-center gap-3">
                  <Label className="flex-1 font-medium">{area}:</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={scores[area] || ''}
                    onChange={(e) => handleScoreChange(area, e.target.value)}
                    className="w-20"
                    placeholder="0"
                  />
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: getColorByScore(scores[area] || 0) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Perguntas de Reflexão */}
      <Card>
        <CardHeader>
          <CardTitle>Reflexões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <Label className="font-medium">{question}</Label>
              <Textarea
                value={reflectionAnswers[index] || ''}
                onChange={(e) => handleReflectionChange(index, e.target.value)}
                placeholder="Escreva sua reflexão aqui..."
                rows={3}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Botão de Salvar */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          size="lg"
          className="min-w-[200px]"
        >
          {isLoading ? 'Salvando...' : hasExistingResponse ? 'Atualizar Respostas' : 'Salvar Respostas'}
        </Button>
      </div>

      {/* Legenda de Cores */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>0-3: Área Crítica</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>4-6: Área de Atenção</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-lime-500 rounded"></div>
              <span>7-8: Área Boa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>9-10: Área Excelente</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};