import express from 'express';
import { ecosystem, getDashboard } from '../data/mockData.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ service: 'SEB Future OS API', status: 'online', version: '1.3.0', database: process.env.USE_DATABASE === 'true' ? 'enabled' : 'mocked' });
});

router.get('/dashboard', requireAuth, (req, res) => {
  res.json(getDashboard(req.user.role));
});

router.get('/ecosystem', requireAuth, (_req, res) => {
  res.json(ecosystem);
});

router.post('/diagnostics/simulate', requireAuth, (req, res) => {
  const { audience = 'estudante', dimension = 'engajamento' } = req.body || {};
  res.json({
    id: `diag-${Date.now()}`,
    audience,
    dimension,
    score: 78,
    risk: 'moderado',
    insight: `A IA identificou queda leve em ${dimension}, com oportunidade de ação preventiva para ${audience}.`,
    recommendations: [
      'Criar plano de acompanhamento por 14 dias.',
      'Enviar devolutiva humanizada para família e coordenação.',
      'Ativar trilha personalizada no ambiente do estudante.'
    ]
  });
});


router.post('/ai/mentor', requireAuth, (req, res) => {
  const { prompt = 'resumo executivo', role = req.user.role } = req.body || {};
  const roleAnswers = {
    rede: 'Sugestão IA executiva: apresente a tese como plataforma proprietária de inteligência e receita. Priorize risco de evasão, benchmarking entre unidades, percepção de valor das famílias e marketplace como nova linha comercial.',
    escola: 'Sugestão IA para escola: transforme alertas em uma agenda semanal de ação. Priorize turmas críticas, famílias com baixa interação e devolutivas simples para reduzir ruído operacional.',
    coordenacao: 'Sugestão IA pedagógica: comece pelo radar da turma, separe fatores cognitivos e socioemocionais, gere plano de intervenção de 14 dias e prepare roteiro objetivo para reunião com família.',
    professor: 'Sugestão IA docente: converta o conteúdo em missão gamificada com abertura real, desafio por níveis, checkpoint rápido e evidência de aprendizagem no final da aula.',
    familia: 'Sugestão IA para família: explique a jornada do aluno em linguagem simples e indique uma ação prática de apoio em casa para esta semana, sem tom de cobrança.',
    estudante: 'Sugestão IA estudante: escolha uma missão pequena, ganhe XP por consistência e use pausas curtas. O foco é progresso visível, não perfeição.'
  };
  res.json({
    mode: 'simulated-ai',
    prompt,
    role,
    answer: roleAnswers[role] || roleAnswers.rede,
    nextSteps: ['Gerar devolutiva', 'Criar intervenção', 'Registrar evidência', 'Acompanhar evolução']
  });
});

router.post('/ai/chat', requireAuth, (req, res) => {
  const { message = '', role = req.user.role } = req.body || {};
  const clean = String(message).trim();
  const answers = {
    rede: `Leitura executiva: para "${clean}", eu mostraria 3 blocos: risco, oportunidade e decisão. Use benchmarking das escolas, potencial de marketplace e impacto em retenção para sustentar a tese.`,
    escola: `Plano da escola: para "${clean}", recomendo listar turmas em atenção, famílias prioritárias e uma ação de comunicação clara para os próximos 7 dias.`,
    coordenacao: `Coordenação: para "${clean}", comece pelo diagnóstico da turma, crie hipótese pedagógica, defina responsável e acompanhe evidência semanal.`,
    professor: `Professor: para "${clean}", transforme em desafio de aula com missão, níveis, checkpoint e devolutiva final. Isso aumenta participação e reduz improviso.`,
    familia: `Família: para "${clean}", a orientação é simples: uma conversa curta, uma rotina visível e um reforço positivo. A escola deve traduzir dados em ação prática.`,
    estudante: `Mentor IA: para "${clean}", vamos criar uma missão pequena: 20 minutos de foco, uma pausa, uma pergunta para o professor e +90 XP ao concluir.`
  };
  res.json({ mode: 'simulated-chat', role, answer: answers[role] || answers.rede });
});

export default router;
