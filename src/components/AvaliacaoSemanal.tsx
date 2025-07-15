
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, startOfWeek, subWeeks, addWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { EvaluationFormData, WeeklyEvaluation } from '@/types/evaluation';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RatingRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingRow: React.FC<RatingRowProps> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
        <Label className="text-sm md:text-base">{label}</Label>
        <div className="flex gap-1 md:gap-2">
            {[1, 2, 3, 4, 5].map(v => (
                <Button 
                    key={v}
                    type="button"
                    variant={value === v ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 rounded-full ${value === v ? 'bg-blue-600' : ''}`}
                    onClick={() => onChange(v)}
                >
                    {v}
                </Button>
            ))}
        </div>
    </div>
);

const initialFormState = {
    aprendizado_semana: {},
    avaliacao_desempenho_pessoal: {},
    desempenho_semanal: {},
    objetivos_proxima_semana: ""
};

export function AvaliacaoSemanal() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [formData, setFormData] = useState<EvaluationFormData>({
    objetivos_semana_anterior: '',
    objetivos_alcancados: false,
    pontos_positivos: [],
    pontos_melhorar: [],
    objetivos_proxima_semana: '',
    humor_semana: 'regular',
    nivel_energia: 3,
    qualidade_sono: 3,
    nivel_estresse: 3,
    alimentacao_qualidade: 3,
    exercicios_frequencia: 3,
    aprendizado_semana: {
      melhor_acontecimento: '',
      maior_desafio: '',
      conselho_mentor: '',
      maior_aprendizado_sabotador: '',
      momento_percebi_sabotando: '',
      nome_semana: '',
      relacao_ultima_semana: ''
    },
    desempenho_semanal: {
      // Saúde
      saude_alimentacao_objetivos: 3,
      saude_recuperacao_fisica: 3,
      saude_bebi_agua: 3,
      saude_mais_energia: 3,
      saude_raspei_lingua: 3,
      // Presença
      presenca_focado_planejei: 3,
      presenca_atitudes_intencionais: 3,
      presenca_atencao_alimentacao: 3,
      presenca_clareza_objetivos: 3,
      presenca_disciplina_consistencia: 3,
      // Físico
      fisico_fui_academia: 3,
      fisico_caminhada_melhor: 3,
      fisico_mobilidade: 3,
      fisico_sono_qualidade: 3,
      fisico_condicionamento_aumentou: 3,
      // Profissional
      profissional_li_livro: 3,
      profissional_fiz_mais_combinado: 3,
      profissional_ajudei_alguem: 3,
      profissional_melhorei_trabalho: 3,
      profissional_assisti_podcast: 3
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    loadWeeklyEvaluation();
  }, [currentWeekStart]);

  const loadWeeklyEvaluation = async () => {
    try {
      // Implementar carregamento da avaliação da semana
      console.log('Carregar avaliação da semana:', format(currentWeekStart, 'dd/MM/yyyy'));
    } catch (error) {
      console.error('Erro ao carregar avaliação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a avaliação da semana.',
        variant: 'destructive'
      });
    }
  };

  const handleNestedChange = (section: keyof EvaluationFormData, field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeekStart, 1);
    if (nextWeek <= new Date()) {
      setCurrentWeekStart(nextWeek);
    }
  };

  const handleSubmit = async () => {
    try {
      // Implementar envio da avaliação
      console.log('Enviando avaliação:', formData);
      toast({
        title: 'Sucesso',
        description: 'Avaliação salva com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a avaliação.',
        variant: 'destructive'
      });
    }
  };

  const weekLabel = `${format(currentWeekStart, 'dd/MM/yyyy')} - ${format(addWeeks(currentWeekStart, 1), 'dd/MM/yyyy')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold">Avaliação Semanal</CardTitle>
            <CardDescription>Reflita sobre sua semana para impulsionar seu progresso.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePreviousWeek}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
            </Button>
            <div className="font-semibold text-center">{weekLabel}</div>
            <Button 
              onClick={handleNextWeek} 
              variant="outline"
              disabled={addWeeks(currentWeekStart, 1) > new Date()}
            >
              Próxima Semana
            </Button>
          </CardContent>
        </Card>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aprendizado da Semana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="O melhor acontecimento da semana passada foi..." value={formData.aprendizado_semana?.melhor_acontecimento || ''} onChange={e => handleNestedChange('aprendizado_semana', 'melhor_acontecimento', e.target.value)} />
              <Textarea placeholder="O maior desafio que enfrentei nessa semana foi..." value={formData.aprendizado_semana?.maior_desafio || ''} onChange={e => handleNestedChange('aprendizado_semana', 'maior_desafio', e.target.value)} />
              <Textarea placeholder="E se eu fosse meu mentor eu diria para mim..." value={formData.aprendizado_semana?.conselho_mentor || ''} onChange={e => handleNestedChange('aprendizado_semana', 'conselho_mentor', e.target.value)} />
              <Textarea placeholder="O maior aprendizado que tive sobre mim foi..." value={formData.aprendizado_semana?.maior_aprendizado_sabotador || ''} onChange={e => handleNestedChange('aprendizado_semana', 'maior_aprendizado_sabotador', e.target.value)} />
              <Textarea placeholder="Qual foi o momento que percebi que estava me sabotando..." value={formData.aprendizado_semana?.momento_percebi_sabotando || ''} onChange={e => handleNestedChange('aprendizado_semana', 'momento_percebi_sabotando', e.target.value)} />
              <Textarea placeholder="O nome que eu dou para a minha semana é..." value={formData.aprendizado_semana?.nome_semana || ''} onChange={e => handleNestedChange('aprendizado_semana', 'nome_semana', e.target.value)} />
              <Textarea placeholder="Como eu me sinto agora com relação a minha última semana..." value={formData.aprendizado_semana?.relacao_ultima_semana || ''} onChange={e => handleNestedChange('aprendizado_semana', 'relacao_ultima_semana', e.target.value)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho Semanal (de 1 a 5)</CardTitle>
              <CardDescription>Dê uma nota para cada área do seu desempenho.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Saúde</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <RatingRow label="Minha alimentação está de acordo com meus objetivos." value={formData.desempenho_semanal?.saude_alimentacao_objetivos} onChange={v => handleNestedChange('desempenho_semanal', 'saude_alimentacao_objetivos', v)} />
                  <RatingRow label="Minha recuperação física e emocional está melhor." value={formData.desempenho_semanal?.saude_recuperacao_fisica} onChange={v => handleNestedChange('desempenho_semanal', 'saude_recuperacao_fisica', v)} />
                  <RatingRow label="Bebi a quantidade de água todos os dias." value={formData.desempenho_semanal?.saude_bebi_agua} onChange={v => handleNestedChange('desempenho_semanal', 'saude_bebi_agua', v)} />
                  <RatingRow label="Me sinto com mais energia." value={formData.desempenho_semanal?.saude_mais_energia} onChange={v => handleNestedChange('desempenho_semanal', 'saude_mais_energia', v)} />
                  <RatingRow label="Raspei a língua todos os dias." value={formData.desempenho_semanal?.saude_raspei_lingua} onChange={v => handleNestedChange('desempenho_semanal', 'saude_raspei_lingua', v)} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle className="text-lg">Presença</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <RatingRow label="Eu me mantive focado da maneira que planejei." value={formData.desempenho_semanal?.presenca_focado_planejei} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_focado_planejei', v)} />
                  <RatingRow label="Minhas atitudes foram intencionais." value={formData.desempenho_semanal?.presenca_atitudes_intencionais} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_atitudes_intencionais', v)} />
                  <RatingRow label="Eu coloquei atenção na alimentação." value={formData.desempenho_semanal?.presenca_atencao_alimentacao} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_atencao_alimentacao', v)} />
                  <RatingRow label="Eu tive clareza sobre meus objetivos." value={formData.desempenho_semanal?.presenca_clareza_objetivos} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_clareza_objetivos', v)} />
                  <RatingRow label="Eu mantive a disciplina e consistência nas minhas tarefas." value={formData.desempenho_semanal?.presenca_disciplina_consistencia} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_disciplina_consistencia', v)} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle className="text-lg">Físico</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <RatingRow label="Fui na academia esta semana." value={formData.desempenho_semanal?.fisico_fui_academia} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_fui_academia', v)} />
                  <RatingRow label="Fiz caminhada e dei meu melhor." value={formData.desempenho_semanal?.fisico_caminhada_melhor} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_caminhada_melhor', v)} />
                  <RatingRow label="Fiz mobilidade todos os dias." value={formData.desempenho_semanal?.fisico_mobilidade} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_mobilidade', v)} />
                  <RatingRow label="Tive sono de qualidade." value={formData.desempenho_semanal?.fisico_sono_qualidade} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_sono_qualidade', v)} />
                  <RatingRow label="Meu condicionamento físico aumentou." value={formData.desempenho_semanal?.fisico_condicionamento_aumentou} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_condicionamento_aumentou', v)} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle className="text-lg">Profissional</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <RatingRow label="Li um livro sobre minha área." value={formData.desempenho_semanal?.profissional_li_livro} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_li_livro', v)} />
                  <RatingRow label="Fiz mais que o combinado." value={formData.desempenho_semanal?.profissional_fiz_mais_combinado} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_fiz_mais_combinado', v)} />
                  <RatingRow label="Ajudei alguém no trabalho." value={formData.desempenho_semanal?.profissional_ajudei_alguem} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_ajudei_alguem', v)} />
                  <RatingRow label="Melhorei minha comunicação." value={formData.desempenho_semanal?.profissional_melhorei_trabalho} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_melhorei_trabalho', v)} />
                  <RatingRow label="Assisti um podcast sobre algum tema da minha área." value={formData.desempenho_semanal?.profissional_assisti_podcast} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_assisti_podcast', v)} />
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objetivos e Ideias para Aplicar na Próxima Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="O que você planeja para a próxima semana?" value={formData.objetivos_proxima_semana || ''} onChange={e => handleNestedChange('objetivos_proxima_semana', '', e.target.value)} />
            </CardContent>
          </Card>

          <div>
            <Label>Como foi seu humor essa semana?</Label>
            <RadioGroup
              value={formData.humor_semana}
              onValueChange={value => handleNestedChange('humor_semana', '', value as WeeklyEvaluation['humor_semana'])}
              className="flex justify-between mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pessimo" id="pessimo" />
                <Label htmlFor="pessimo">Péssimo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ruim" id="ruim" />
                <Label htmlFor="ruim">Ruim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">Regular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bom" id="bom" />
                <Label htmlFor="bom">Bom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="otimo" id="otimo" />
                <Label htmlFor="otimo">Ótimo</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Nível de Energia (1-5)</Label>
            <Slider
              value={[formData.nivel_energia]}
              onValueChange={([value]) => handleNestedChange('nivel_energia', '', value)}
              min={1}
              max={5}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Qualidade do Sono (1-5)</Label>
            <Slider
              value={[formData.qualidade_sono]}
              onValueChange={([value]) => handleNestedChange('qualidade_sono', '', value)}
              min={1}
              max={5}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Nível de Estresse (1-5)</Label>
            <Slider
              value={[formData.nivel_estresse]}
              onValueChange={([value]) => handleNestedChange('nivel_estresse', '', value)}
              min={1}
              max={5}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Qualidade da Alimentação (1-5)</Label>
            <Slider
              value={[formData.alimentacao_qualidade]}
              onValueChange={([value]) => handleNestedChange('alimentacao_qualidade', '', value)}
              min={1}
              max={5}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Frequência de Exercícios (1-5)</Label>
            <Slider
              value={[formData.exercicios_frequencia]}
              onValueChange={([value]) => handleNestedChange('exercicios_frequencia', '', value)}
              min={1}
              max={5}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Objetivos da Semana Anterior</Label>
            <Textarea
              value={formData.objetivos_semana_anterior}
              onChange={e => handleNestedChange('objetivos_semana_anterior', '', e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Objetivos para Próxima Semana</Label>
            <Textarea
              value={formData.objetivos_proxima_semana}
              onChange={e => handleNestedChange('objetivos_proxima_semana', '', e.target.value)}
              className="mt-2"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Salvar Avaliação
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AvaliacaoSemanal;
