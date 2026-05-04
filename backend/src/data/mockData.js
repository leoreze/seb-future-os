export const users = [
  { id: 'u-rede', name: 'Diretoria SEB Future', email: 'rede@sebfuture.local', password: '123456', role: 'rede', area: 'Gestão Central', avatar: 'RF' },
  { id: 'u-escola', name: 'Direção Escola Jardins', email: 'escola@sebfuture.local', password: '123456', role: 'escola', area: 'Unidade Escolar', avatar: 'EJ' },
  { id: 'u-coord', name: 'Coordenação Pedagógica', email: 'coordenacao@sebfuture.local', password: '123456', role: 'coordenacao', area: 'Coordenação', avatar: 'CP' },
  { id: 'u-prof', name: 'Professor Rafael Lima', email: 'professor@sebfuture.local', password: '123456', role: 'professor', area: 'Professor', avatar: 'RL' },
  { id: 'u-familia', name: 'Família Oliveira', email: 'familia@sebfuture.local', password: '123456', role: 'familia', area: 'Família', avatar: 'FO' },
  { id: 'u-estudante', name: 'Lia Oliveira', email: 'estudante@sebfuture.local', password: '123456', role: 'estudante', area: 'Estudante', avatar: 'LO' }
];

export const ecosystem = {
  productName: 'SEB Future OS',
  tagline: 'Inteligência educacional 360 para conectar rede, escola, família e estudante.',
  environments: [
    { id: 'rede', icon: '🌐', title: 'Rede / Grupo Educacional', audience: 'Diretoria, mantenedores e gestão central', purpose: 'Governança, benchmarking, risco, expansão, receita e saúde institucional.', modules: ['Benchmarking entre unidades', 'Mapa de evasão', 'Marketplace estratégico', 'Alertas executivos'] },
    { id: 'escola', icon: '🏫', title: 'Escola / Direção', audience: 'Diretores e gestores escolares', purpose: 'Operação da unidade, turmas em atenção, famílias e planos de intervenção.', modules: ['Painel da unidade', 'Calendário de ações', 'Relatórios pedagógicos', 'Comunicação inteligente'] },
    { id: 'coordenacao', icon: '📡', title: 'Coordenação Pedagógica', audience: 'Coordenadores e orientação', purpose: 'Radar da turma, estudantes em risco, plano de ação e preparação de reuniões.', modules: ['Radar de turma', 'Mapa socioemocional', 'Histórico de conversas', 'Relatórios IA'] },
    { id: 'professor', icon: '👩‍🏫', title: 'Professor', audience: 'Docentes e especialistas', purpose: 'Apoio à rotina docente com leitura da turma, plano de aula e devolutivas.', modules: ['Plano assistido por IA', 'Observações rápidas', 'Recomendações por aluno', 'Comunicação com coordenação'] },
    { id: 'familia', icon: '👨‍👩‍👧', title: 'Família', audience: 'Responsáveis e cuidadores', purpose: 'Visão simples da jornada do filho, alertas e orientações práticas.', modules: ['Boletim explicado por IA', 'Agenda escolar', 'Orientações em casa', 'Marketplace de apoio'] },
    { id: 'estudante', icon: '🎒', title: 'Estudante', audience: 'Alunos do Fundamental e Ensino Médio', purpose: 'Jornada pessoal, metas, rotina, autodiagnóstico e mentor IA.', modules: ['Metas semanais', 'Rotina de estudos', 'Conquistas', 'Mentor IA'] }
  ],
  schools: [
    { id: 'sch-1', name: 'Unidade Ribeirão', city: 'Ribeirão Preto', students: 1420, teachers: 86, health: 89, engagement: 82, retentionRisk: 8, revenueOpportunity: 124000, status: 'saudável' },
    { id: 'sch-2', name: 'Unidade Jardins', city: 'São Paulo', students: 1180, teachers: 72, health: 76, engagement: 68, retentionRisk: 16, revenueOpportunity: 86000, status: 'atenção' },
    { id: 'sch-3', name: 'Unidade Alphaville', city: 'Barueri', students: 1530, teachers: 94, health: 92, engagement: 87, retentionRisk: 5, revenueOpportunity: 141000, status: 'excelente' },
    { id: 'sch-4', name: 'Unidade Campinas', city: 'Campinas', students: 980, teachers: 61, health: 71, engagement: 64, retentionRisk: 19, revenueOpportunity: 73000, status: 'crítica' }
  ],
  teachers: [
    { id: 't1', name: 'Rafael Lima', subject: 'Matemática', classes: 4, students: 126, engagement: 72, supportNeed: 'médio', aiSuggestion: 'Aplicar trilha curta de revisão e mapa de dúvidas por aula.' },
    { id: 't2', name: 'Marina Costa', subject: 'Língua Portuguesa', classes: 5, students: 148, engagement: 84, supportNeed: 'baixo', aiSuggestion: 'Transformar boas práticas em repertório para outros docentes.' },
    { id: 't3', name: 'Bruno Martins', subject: 'Física', classes: 3, students: 91, engagement: 58, supportNeed: 'alto', aiSuggestion: 'Apoio da coordenação para plano de aula mais visual e checkpoints semanais.' },
    { id: 't4', name: 'Camila Ferraz', subject: 'Biologia', classes: 4, students: 119, engagement: 79, supportNeed: 'baixo', aiSuggestion: 'Ativar projetos interdisciplinares e feedback individual.' }
  ],
  families: [
    { id: 'f1', name: 'Família Oliveira', student: 'Lia Oliveira', interaction: 86, satisfaction: 91, pending: 1, channel: 'WhatsApp + App', need: 'Orientação de rotina de estudos' },
    { id: 'f2', name: 'Família Pedroso', student: 'João Pedro', interaction: 38, satisfaction: 62, pending: 4, channel: 'WhatsApp', need: 'Reunião preventiva e devolutiva humanizada' },
    { id: 'f3', name: 'Família Almeida', student: 'Sofia Almeida', interaction: 92, satisfaction: 94, pending: 0, channel: 'App', need: 'Trilha de alto desempenho' },
    { id: 'f4', name: 'Família Santos', student: 'Miguel Santos', interaction: 51, satisfaction: 70, pending: 3, channel: 'E-mail + App', need: 'Apoio socioemocional e rotina familiar' }
  ],
  classes: [
    { id: '8A', name: '8º Ano A', score: 78, emotional: 66, engagement: 72, riskStudents: 5, teacher: 'Rafael Lima' },
    { id: '9B', name: '9º Ano B', score: 84, emotional: 74, engagement: 81, riskStudents: 2, teacher: 'Marina Costa' },
    { id: '2EM', name: '2ª Série EM', score: 69, emotional: 61, engagement: 58, riskStudents: 8, teacher: 'Bruno Martins' }
  ],
  students: [
    { id: 's1', name: 'Lia Oliveira', className: '8º Ano A', cognitive: 82, emotional: 64, engagement: 77, attendance: 94, risk: 'moderado', nextAction: 'Mentoria leve + rotina de estudos' },
    { id: 's2', name: 'João Pedro', className: '8º Ano A', cognitive: 58, emotional: 52, engagement: 48, attendance: 83, risk: 'alto', nextAction: 'Reunião família + plano de intervenção' },
    { id: 's3', name: 'Sofia Almeida', className: '9º Ano B', cognitive: 91, emotional: 83, engagement: 88, attendance: 98, risk: 'baixo', nextAction: 'Trilha de alto desempenho' },
    { id: 's4', name: 'Miguel Santos', className: '2ª Série EM', cognitive: 63, emotional: 55, engagement: 59, attendance: 89, risk: 'alto', nextAction: 'Apoio socioemocional + reforço' }
  ],
  alerts: [
    { severity: 'critical', icon: '⚠️', title: 'Risco de evasão concentrado', text: 'Unidade Campinas com 19% de estudantes em atenção e queda de interação familiar.' },
    { severity: 'warning', icon: '🧠', title: 'Saúde emocional abaixo da média', text: '2ª Série EM apresenta queda em autocontrole, organização e percepção de apoio.' },
    { severity: 'success', icon: '✨', title: 'Oportunidade de marketplace', text: 'Alta demanda por orientação vocacional e reforço em matemática nas unidades premium.' }
  ],
  interventions: [
    { title: 'Plano Família Presente', target: 'Famílias com baixa interação', status: 'em andamento', impact: '+18% engajamento previsto' },
    { title: 'Mentoria de Organização Semanal', target: 'Estudantes em risco moderado', status: 'sugerido por IA', impact: '-12% risco acadêmico' },
    { title: 'Roteiro de Reunião Pedagógica', target: 'Coordenação + Professores', status: 'pronto para aplicar', impact: '+24% clareza de ações' }
  ],
  diagnostics: [
    { name: 'Diagnóstico Estudante 360', progress: 76, dimensions: ['Cognitivo', 'Organização', 'Relacional', 'Emocional'] },
    { name: 'Diagnóstico Família-Escola', progress: 58, dimensions: ['Comunicação', 'Confiança', 'Participação', 'Clareza'] },
    { name: 'Diagnóstico de Turma', progress: 83, dimensions: ['Desempenho', 'Clima', 'Engajamento', 'Risco'] },
    { name: 'Diagnóstico Docente', progress: 64, dimensions: ['Carga', 'Clareza', 'Apoio', 'Efetividade'] },
    { name: 'Diagnóstico Institucional', progress: 71, dimensions: ['Marca', 'Retenção', 'Satisfação', 'Receita'] }
  ],
  marketplace: [
    { icon: '📚', title: 'Reforço Inteligente', category: 'Aprendizagem', price: 'R$ 189/mês', demand: 'Alta' },
    { icon: '🎯', title: 'Orientação Vocacional', category: 'Jornada', price: 'R$ 249', demand: 'Muito alta' },
    { icon: '🧩', title: 'Psicopedagogia Parceira', category: 'Apoio', price: 'Sob consulta', demand: 'Média' },
    { icon: '🚀', title: 'Trilha ENEM Premium', category: 'Performance', price: 'R$ 329/mês', demand: 'Alta' }
  ]
};

export function getDashboard(role) {
  const base = {
    product: ecosystem.productName,
    tagline: ecosystem.tagline,
    alerts: ecosystem.alerts,
    marketplace: ecosystem.marketplace,
    diagnostics: ecosystem.diagnostics,
    interventions: ecosystem.interventions,
    environments: ecosystem.environments,
    schools: ecosystem.schools,
    students: ecosystem.students,
    families: ecosystem.families,
    teachers: ecosystem.teachers,
    classes: ecosystem.classes
  };
  const views = {
    rede: {
      title: 'Ambiente da Rede',
      subtitle: 'Visão executiva de saúde educacional, riscos, benchmarking e oportunidades comerciais.',
      stats: [
        { label: 'Saúde média da rede', value: '82%', trend: '+6%', icon: '💠' },
        { label: 'Famílias engajadas', value: '76%', trend: '+11%', icon: '👨‍👩‍👧' },
        { label: 'Risco de evasão', value: '12%', trend: '-4%', icon: '🛡️' },
        { label: 'Receita potencial', value: 'R$ 424k', trend: '+18%', icon: '💎' }
      ],
      primaryListTitle: 'Benchmarking entre escolas',
      listType: 'schools'
    },
    escola: {
      title: 'Ambiente da Escola',
      subtitle: 'Unidade em tempo real com turmas em atenção, famílias, professores e planos de ação.',
      stats: [
        { label: 'Turmas em atenção', value: '3', trend: '-1', icon: '🏫' },
        { label: 'Estudantes em risco', value: '15', trend: '+2', icon: '🧭' },
        { label: 'Famílias ativas', value: '68%', trend: '+7%', icon: '💬' },
        { label: 'Planos ativos', value: '9', trend: '+4', icon: '📌' }
      ],
      primaryListTitle: 'Turmas prioritárias',
      listType: 'classes'
    },
    coordenacao: {
      title: 'Ambiente da Coordenação',
      subtitle: 'Radar pedagógico e socioemocional para transformar diagnóstico em intervenção.',
      stats: [
        { label: 'Radar da turma', value: '78', trend: '+5', icon: '📡' },
        { label: 'Alertas críticos', value: '4', trend: '-2', icon: '⚠️' },
        { label: 'Reuniões sugeridas', value: '7', trend: '+3', icon: '🗓️' },
        { label: 'Relatórios IA', value: '12', trend: '+8', icon: '🤖' }
      ],
      primaryListTitle: 'Estudantes que precisam de ação',
      listType: 'students'
    },
    professor: {
      title: 'Ambiente do Professor',
      subtitle: 'Leitura da turma, plano de aula assistido por IA e devolutivas mais humanas.',
      stats: [
        { label: 'Engajamento da turma', value: '72%', trend: '+9%', icon: '🔥' },
        { label: 'Alunos em atenção', value: '5', trend: '-1', icon: '👀' },
        { label: 'Atividades sugeridas', value: '14', trend: '+6', icon: '🧪' },
        { label: 'Observações rápidas', value: '28', trend: '+12', icon: '📝' }
      ],
      primaryListTitle: 'Leitura rápida da turma',
      listType: 'studentsShort'
    },
    familia: {
      title: 'Ambiente da Família',
      subtitle: 'Uma visão simples, clara e humanizada da jornada do filho dentro da escola.',
      stats: [
        { label: 'Evolução semanal', value: '82%', trend: '+8%', icon: '🌱' },
        { label: 'Rotina cumprida', value: '4/5', trend: '+1', icon: '✅' },
        { label: 'Alertas importantes', value: '2', trend: 'novo', icon: '🔔' },
        { label: 'Orientações IA', value: '6', trend: '+3', icon: '💡' }
      ],
      student: ecosystem.students[0],
      primaryListTitle: 'Jornada da Lia',
      listType: 'student'
    },
    estudante: {
      title: 'Ambiente do Estudante',
      subtitle: 'Metas, autoconsciência, rotina de estudo, conquistas e mentor IA mobile-first.',
      stats: [
        { label: 'Foco da semana', value: 'Matemática', trend: 'prioridade', icon: '🎯' },
        { label: 'Sequência ativa', value: '6 dias', trend: '+2', icon: '⚡' },
        { label: 'Conquistas', value: '12', trend: '+4', icon: '🏆' },
        { label: 'Bem-estar', value: '74%', trend: '+5%', icon: '💚' }
      ],
      student: ecosystem.students[0],
      primaryListTitle: 'Plano de evolução',
      listType: 'student'
    }
  };
  return { ...base, ...(views[role] || views.rede) };
}
