import express from 'express';
import { ecosystem, getDashboard } from '../data/mockData.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ service: 'SEB Future OS API', status: 'online', version: '1.2.0', database: process.env.USE_DATABASE === 'true' ? 'enabled' : 'mocked' });
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
  const { prompt = 'resumo executivo' } = req.body || {};
  res.json({
    mode: 'simulated-ai',
    prompt,
    answer: 'Sugestão IA: priorize comunicação preventiva, plano de ação simples, evidências visuais e acompanhamento semanal. A recomendação combina dados cognitivos, engajamento, presença e interação familiar.',
    nextSteps: ['Gerar devolutiva', 'Criar intervenção', 'Agendar reunião', 'Ofertar serviço no marketplace']
  });
});

export default router;
