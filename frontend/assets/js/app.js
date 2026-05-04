const app = document.querySelector('#app');
const loader = document.querySelector('#loader');

const views = [
  { id:'rede', label:'Rede', icon:'🌐', group:'Ambiente principal' },
  { id:'escola', label:'Escola', icon:'🏫', group:'Ambiente principal' },
  { id:'coordenacao', label:'Coordenação', icon:'📡', group:'Ambiente principal' },
  { id:'professor', label:'Professor', icon:'🧑‍🏫', group:'Ambiente principal' },
  { id:'familia', label:'Família', icon:'👨‍👩‍👧', group:'Ambiente principal' },
  { id:'estudante', label:'Estudante', icon:'🎒', group:'Ambiente principal' },
  { id:'ambientes', label:'Mapa do Ecossistema', icon:'🧭', group:'Visões 360' },
  { id:'escolas', label:'Visão Escolas', icon:'🏛️', group:'Visões 360' },
  { id:'alunos', label:'Visão Alunos', icon:'🧑‍🎓', group:'Visões 360' },
  { id:'familias', label:'Visão Famílias', icon:'🤝', group:'Visões 360' },
  { id:'professores', label:'Visão Professores', icon:'👥', group:'Visões 360' },
  { id:'diagnosticos', label:'Diagnósticos 360', icon:'🧠', group:'Módulos estratégicos' },
  { id:'marketplace', label:'Marketplace', icon:'🛍️', group:'Módulos estratégicos' },
  { id:'intervencoes', label:'Intervenções', icon:'✨', group:'Módulos estratégicos' },
  { id:'ia', label:'IA Educacional', icon:'🤖', group:'Módulos estratégicos' }
];

const roleEmailMap = {
  rede:'rede@sebfuture.local', escola:'escola@sebfuture.local', coordenacao:'coordenacao@sebfuture.local', professor:'professor@sebfuture.local', familia:'familia@sebfuture.local', estudante:'estudante@sebfuture.local'
};

const accessByRole = {
  rede:['rede','ambientes','escolas','alunos','familias','professores','diagnosticos','marketplace','intervencoes','ia','escola','coordenacao','professor','familia','estudante'],
  escola:['escola','coordenacao','alunos','familias','professores','diagnosticos','intervencoes','ia','marketplace'],
  coordenacao:['coordenacao','alunos','professores','familias','diagnosticos','intervencoes','ia'],
  professor:['professor','alunos','diagnosticos','ia','intervencoes'],
  familia:['familia','estudante','diagnosticos','marketplace','ia'],
  estudante:['estudante','diagnosticos','marketplace','ia']
};

const loginContexts = {
  'rede@sebfuture.local': { title:'🌐 Visão Rede / Diretoria', copy:'Dashboard executivo para benchmarking entre unidades, risco, retenção, marketplace, dados estratégicos e tese de crescimento.', bullets:['Menu amplo com todos os ambientes', 'Indicadores de governança e receita', 'Demo ideal para abrir a apresentação à diretoria'] },
  'escola@sebfuture.local': { title:'🏫 Visão Escola / Direção', copy:'Rotina de unidade com turmas em atenção, famílias prioritárias, professores, planos de ação e comunicação institucional.', bullets:['Menu focado na operação escolar', 'Sem visão de diretoria/rede', 'Pronto para mostrar uso por unidade'] },
  'coordenacao@sebfuture.local': { title:'📡 Visão Coordenação', copy:'Radar pedagógico e socioemocional para transformar sinais fracos em intervenção concreta.', bullets:['Alunos, professores e famílias relevantes', 'Diagnósticos e planos de intervenção', 'Copiloto IA para reuniões e devolutivas'] },
  'professor@sebfuture.local': { title:'🧑‍🏫 Visão Professor', copy:'Ambiente simples para leitura de turma, observações rápidas, plano de aula assistido e recomendações por estudante.', bullets:['Sem menu executivo', 'Foco em sala de aula', 'IA como apoio, não como burocracia'] },
  'familia@sebfuture.local': { title:'👨‍👩‍👧 Visão Família', copy:'Jornada humanizada do filho com orientações claras, alertas relevantes, boletim explicado e serviços de apoio.', bullets:['Mobile-first', 'Comunicação mais clara', 'Marketplace contextual'] },
  'estudante@sebfuture.local': { title:'🎒 Visão Estudante', copy:'Metas, rotina, autoconsciência, conquistas e mentor IA em uma experiência leve e motivadora.', bullets:['Mobile-first', 'Trilhas personalizadas', 'Foco em evolução semanal'] }
};

let state = { token:localStorage.getItem('seb_future_token'), user:JSON.parse(localStorage.getItem('seb_future_user') || 'null'), active:localStorage.getItem('seb_future_active') || null, data:null };

function showLoader(){loader.classList.remove('hidden')} function hideLoader(){loader.classList.add('hidden')}
function escapeHtml(str=''){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function money(value){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(value)}
function percentAvg(items,field){return Math.round(items.reduce((sum,item)=>sum+Number(item[field]||0),0)/Math.max(items.length,1))}
function allowedViews(){return accessByRole[state.user?.role] || accessByRole.rede}
function isAllowed(id){return allowedViews().includes(id)}
function viewMeta(id){return views.find(v=>v.id===id) || views[0]}

async function api(path, options={}){
  const response = await fetch(path,{...options,headers:{'Content-Type':'application/json',...(state.token?{Authorization:`Bearer ${state.token}`}:{}) ,...(options.headers||{})}});
  const data = await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

function renderLogin(){
  app.innerHTML = document.querySelector('#login-template').innerHTML;
  const select = document.querySelector('#email');
  const renderContext = () => {
    const ctx = loginContexts[select.value];
    document.querySelector('#login-context').innerHTML = `<strong>${ctx.title}</strong><p>${ctx.copy}</p><ul>${ctx.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
  };
  select.addEventListener('change', renderContext);
  renderContext();
  document.querySelector('#login-form').addEventListener('submit', async (event)=>{
    event.preventDefault(); showLoader(); document.querySelector('#login-error').textContent='';
    try{
      const payload = Object.fromEntries(new FormData(event.currentTarget));
      const result = await api('/api/auth/login',{method:'POST',body:JSON.stringify(payload)});
      state.token=result.token; state.user=result.user; state.active=result.user.role;
      localStorage.setItem('seb_future_token',state.token); localStorage.setItem('seb_future_user',JSON.stringify(state.user)); localStorage.setItem('seb_future_active',state.active);
      await loadApp();
    }catch(error){ document.querySelector('#login-error').textContent=error.message; }
    finally{ hideLoader(); }
  });
}

async function loadApp(){
  if(!state.token) return renderLogin();
  showLoader();
  try{
    const me = await api('/api/auth/me'); state.user=me.user; state.data=await api('/api/dashboard');
    if(!state.active || !isAllowed(state.active)) state.active = state.user.role;
    localStorage.setItem('seb_future_active', state.active);
    renderShell();
  }catch(error){ logout(false); }
  finally{ hideLoader(); }
}

function logout(render=true){
  state={token:null,user:null,active:null,data:null};
  ['seb_future_token','seb_future_user','seb_future_active'].forEach(k=>localStorage.removeItem(k));
  if(render) renderLogin();
}

function switchView(id){
  if(!isAllowed(id)) return openCustomModal('Acesso restrito', `<p>Este menu não pertence ao perfil <strong>${escapeHtml(environmentLabel(state.user.role))}</strong>. Entre com outro tipo de usuário na tela de login para visualizar esse ambiente.</p>`, 'permissão por ambiente');
  state.active=id; localStorage.setItem('seb_future_active',id); renderShell();
}

function renderShell(){
  const activeItem=viewMeta(state.active);
  const menuViews = views.filter(v=>isAllowed(v.id));
  const groups = [...new Set(menuViews.map(v=>v.group))];
  app.innerHTML = `
    <section class="app-shell">
      <aside class="side-nav">
        <div class="nav-logo"><div class="brand-mark">S</div><div><strong>SEB Future OS</strong><span>v1.2 • ${escapeHtml(environmentLabel(state.user.role))}</span></div></div>
        ${groups.map(group=>`<div class="nav-group-title">${group}</div>${menuViews.filter(v=>v.group===group).map(item=>`<button class="nav-item ${item.id===state.active?'active':''}" data-nav="${item.id}"><span>${item.icon}</span>${item.label}</button>`).join('')}`).join('')}
        <div class="user-mini"><div class="avatar">${escapeHtml(state.user?.avatar||'U')}</div><div><strong>${escapeHtml(state.user?.name||'Usuário')}</strong><br><small>${escapeHtml(state.user?.area||'')}</small></div></div>
      </aside>
      <section class="workspace">
        <header class="topbar"><div><span class="badge">${activeItem.icon} ${activeItem.label}</span><h3>${escapeHtml(state.data?.product||'SEB Future OS')}</h3></div><div class="topbar-actions"><button class="icon-btn" title="Alertas" data-modal="alerts">🔔</button><button class="icon-btn" title="Roteiro" data-modal="demo">▶️</button><button class="btn" id="logout">Sair</button></div></header>
        <div id="view"></div><div class="footer-spacer"></div>
      </section>
    </section>`;
  document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.nav)));
  document.querySelector('#logout').addEventListener('click',()=>logout());
  document.querySelectorAll('[data-modal]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.modal)));
  renderView();
}

function renderView(){
  const view=document.querySelector('#view');
  const roleViews=['rede','escola','coordenacao','professor','familia','estudante'];
  if(roleViews.includes(state.active)) view.innerHTML = roleEnvironmentView(state.active);
  else view.innerHTML = specialView(state.active);
  bindActions();
}

function roleEnvironmentView(role){
  const data= role === state.user.role ? state.data : buildCrossRoleData(role);
  return `<section class="hero-panel"><span class="badge">${environmentIcon(role)} ${environmentLabel(role)}</span><h2>${escapeHtml(data.title)}</h2><p>${escapeHtml(data.subtitle)}</p><div class="hero-actions"><button class="btn primary" data-action="diagnostic">Rodar diagnóstico 360</button><button class="btn gold" data-action="ai">Gerar insight IA</button><button class="btn" data-action="intervention">Criar intervenção</button></div></section><section class="stats-grid">${data.stats.map(statCard).join('')}</section><section class="content-grid"><div class="content-panel"><div class="panel-head"><h3>${escapeHtml(data.primaryListTitle)}</h3><span class="pill">dados simulados</span></div>${renderPrimaryList(data)}</div><div class="content-panel"><div class="panel-head"><h3>Alertas inteligentes</h3><span class="pill">IA ativa</span></div><div class="item-list">${data.alerts.map(alertCard).join('')}</div></div></section>${['familia','estudante'].includes(role)?renderMobilePreview(data):''}`;
}

function buildCrossRoleData(role){ return { ...state.data, title: titleByRole(role), subtitle: subtitleByRole(role), stats: statsByRole(role), primaryListTitle: primaryTitleByRole(role), listType: listTypeByRole(role), student: state.data.students[0] }; }
function titleByRole(role){return ({rede:'Ambiente da Rede',escola:'Ambiente da Escola',coordenacao:'Ambiente da Coordenação',professor:'Ambiente do Professor',familia:'Ambiente da Família',estudante:'Ambiente do Estudante'})[role]}
function subtitleByRole(role){return ({rede:'Visão executiva de saúde educacional, riscos, benchmarking e oportunidades comerciais.',escola:'Unidade em tempo real com turmas em atenção, famílias, professores e planos de ação.',coordenacao:'Radar pedagógico e socioemocional para transformar diagnóstico em intervenção.',professor:'Leitura da turma, plano de aula assistido por IA e devolutivas mais humanas.',familia:'Visão simples, clara e humanizada da jornada do filho dentro da escola.',estudante:'Metas, autoconsciência, rotina de estudo, conquistas e mentor IA mobile-first.'})[role]}
function statsByRole(role){return ({rede:[{label:'Saúde média da rede',value:'82%',trend:'+6%',icon:'💠'},{label:'Famílias engajadas',value:'76%',trend:'+11%',icon:'👨‍👩‍👧'},{label:'Risco de evasão',value:'12%',trend:'-4%',icon:'🛡️'},{label:'Receita potencial',value:'R$ 424k',trend:'+18%',icon:'💎'}],escola:[{label:'Turmas em atenção',value:'3',trend:'-1',icon:'🏫'},{label:'Estudantes em risco',value:'15',trend:'+2',icon:'🧭'},{label:'Famílias ativas',value:'68%',trend:'+7%',icon:'💬'},{label:'Planos ativos',value:'9',trend:'+4',icon:'📌'}],coordenacao:[{label:'Radar da turma',value:'78',trend:'+5',icon:'📡'},{label:'Alertas críticos',value:'4',trend:'-2',icon:'⚠️'},{label:'Reuniões sugeridas',value:'7',trend:'+3',icon:'🗓️'},{label:'Relatórios IA',value:'12',trend:'+8',icon:'🤖'}],professor:[{label:'Engajamento da turma',value:'72%',trend:'+9%',icon:'🔥'},{label:'Alunos em atenção',value:'5',trend:'-1',icon:'👀'},{label:'Atividades sugeridas',value:'14',trend:'+6',icon:'🧪'},{label:'Observações rápidas',value:'28',trend:'+12',icon:'📝'}],familia:[{label:'Evolução semanal',value:'82%',trend:'+8%',icon:'🌱'},{label:'Rotina cumprida',value:'4/5',trend:'+1',icon:'✅'},{label:'Alertas importantes',value:'2',trend:'novo',icon:'🔔'},{label:'Orientações IA',value:'6',trend:'+3',icon:'💡'}],estudante:[{label:'Foco da semana',value:'Matemática',trend:'prioridade',icon:'🎯'},{label:'Sequência ativa',value:'6 dias',trend:'+2',icon:'⚡'},{label:'Conquistas',value:'12',trend:'+4',icon:'🏆'},{label:'Bem-estar',value:'74%',trend:'+5%',icon:'💚'}]})[role]}
function primaryTitleByRole(role){return ({rede:'Benchmarking entre escolas',escola:'Turmas prioritárias',coordenacao:'Estudantes que precisam de ação',professor:'Leitura rápida da turma',familia:'Jornada da Lia',estudante:'Plano de evolução'})[role]}
function listTypeByRole(role){return ({rede:'schools',escola:'classes',coordenacao:'students',professor:'studentsShort',familia:'student',estudante:'student'})[role]}

function statCard(stat){return `<article class="stat-card"><div class="stat-icon">${stat.icon}</div><span>${escapeHtml(stat.label)}</span><b>${escapeHtml(stat.value)}</b><span class="trend">${escapeHtml(stat.trend)}</span></article>`}
function alertCard(alert){return `<article class="alert ${alert.severity}"><span>${alert.icon}</span><div><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.text)}</p></div></article>`}
function renderPrimaryList(data){ if(data.listType==='schools')return renderSchools(data.schools); if(data.listType==='classes')return renderClasses(data.classes); if(data.listType==='students')return renderStudents(data.students); if(data.listType==='studentsShort')return renderStudents(data.students.slice(0,3)); if(data.listType==='student')return renderStudentJourney(data.student); return ''; }
function renderSchools(schools){return `<div class="item-list">${schools.map(s=>`<article class="data-row"><div class="data-row-icon">🏫</div><div><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.city)} • ${s.students} alunos • ${s.teachers} professores • risco ${s.retentionRisk}%</small><div class="meter"><i style="width:${s.health}%"></i></div></div><span class="pill">${money(s.revenueOpportunity)}</span></article>`).join('')}</div>`}
function renderClasses(classes){return `<div class="item-list">${classes.map(c=>`<article class="data-row"><div class="data-row-icon">📊</div><div><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.teacher)} • desempenho ${c.score}% • ${c.riskStudents} estudantes em atenção</small><div class="meter"><i style="width:${c.engagement}%"></i></div></div><span class="pill">clima ${c.emotional}%</span></article>`).join('')}</div>`}
function renderStudents(students){return `<div class="item-list">${students.map(s=>`<article class="data-row"><div class="data-row-icon">🎒</div><div><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.className)} • risco ${escapeHtml(s.risk)} • presença ${s.attendance}% • emocional ${s.emotional}%</small><div class="meter"><i style="width:${s.engagement}%"></i></div></div><span class="pill">${escapeHtml(s.nextAction)}</span></article>`).join('')}</div>`}
function renderFamilies(families){return `<div class="item-list">${families.map(f=>`<article class="data-row"><div class="data-row-icon">🤝</div><div><strong>${escapeHtml(f.name)}</strong><small>${escapeHtml(f.student)} • interação ${f.interaction}% • satisfação ${f.satisfaction}% • ${escapeHtml(f.channel)}</small><div class="meter"><i style="width:${f.interaction}%"></i></div></div><span class="pill">${escapeHtml(f.need)}</span></article>`).join('')}</div>`}
function renderTeachers(teachers){return `<div class="item-list">${teachers.map(t=>`<article class="data-row"><div class="data-row-icon">🧑‍🏫</div><div><strong>${escapeHtml(t.name)}</strong><small>${escapeHtml(t.subject)} • ${t.classes} turmas • ${t.students} alunos • apoio ${escapeHtml(t.supportNeed)}</small><div class="meter"><i style="width:${t.engagement}%"></i></div></div><span class="pill">${escapeHtml(t.aiSuggestion)}</span></article>`).join('')}</div>`}
function renderStudentJourney(s){return `<div class="item-list"><article class="data-row"><div class="data-row-icon">🌱</div><div><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.className)} • diagnóstico em evolução</small><div class="meter"><i style="width:${s.cognitive}%"></i></div></div><span class="pill">${s.cognitive}% cognitivo</span></article><article class="data-row"><div class="data-row-icon">💚</div><div><strong>Bem-estar e rotina</strong><small>Organização semanal, autoconsciência e apoio familiar.</small><div class="meter"><i style="width:${s.emotional}%"></i></div></div><span class="pill">${s.emotional}% emocional</span></article><article class="data-row"><div class="data-row-icon">🤖</div><div><strong>Recomendação IA</strong><small>${escapeHtml(s.nextAction)}</small></div><span class="pill">ação sugerida</span></article></div>`}
function renderMobilePreview(data){const s=data.student;return `<section class="mobile-preview"><div><span class="badge">mobile-first</span><h2>Experiência desenhada para uso diário</h2><p>A família e o estudante acessam uma visão simples, visual e acionável, sem linguagem técnica de sistema escolar.</p></div><div class="phone-frame"><div class="phone-screen"><span class="pill">Hoje</span><h3>Olá, ${escapeHtml(s.name.split(' ')[0])}</h3><div class="phone-card"><strong>🎯 Meta da semana</strong><p>Organizar rotina e revisar Matemática por 25 minutos.</p></div><div class="phone-card"><strong>💚 Bem-estar</strong><p>${s.emotional}% • tendência de melhora com acompanhamento.</p></div><div class="phone-card"><strong>🤖 Mentor IA</strong><p>${escapeHtml(s.nextAction)}</p></div></div></div></section>`}

function specialView(type){
  const data=state.data; const meta=viewMeta(type);
  let subtitle='Visão estratégica do ecossistema simulada com dados mockados e foco em apresentação executiva.'; let content='';
  if(type==='ambientes') content=`<section class="env-grid">${data.environments.map(env=>`<article class="env-card"><div class="icon">${env.icon}</div><h3>${escapeHtml(env.title)}</h3><p><strong>${escapeHtml(env.audience)}</strong></p><p>${escapeHtml(env.purpose)}</p><ul>${env.modules.map(m=>`<li>${escapeHtml(m)}</li>`).join('')}</ul></article>`).join('')}</section>`;
  if(type==='escolas') content=`<section class="stats-grid">${[{icon:'🏛️',label:'Unidades',value:String(data.schools.length),trend:'rede demo'},{icon:'🎒',label:'Alunos mapeados',value:String(data.schools.reduce((s,i)=>s+i.students,0)),trend:'+ visão 360'},{icon:'💎',label:'Oportunidade',value:money(data.schools.reduce((s,i)=>s+i.revenueOpportunity,0)),trend:'marketplace'},{icon:'⚠️',label:'Risco médio',value:`${percentAvg(data.schools,'retentionRisk')}%`,trend:'prevenção'}].map(statCard).join('')}</section><section class="content-grid"><div class="content-panel"><div class="panel-head"><h3>Unidades da rede</h3><span class="pill">benchmarking</span></div>${renderSchools(data.schools)}</div><div class="content-panel"><h3>Leitura executiva</h3><p>Compare unidades, priorize apoio, enxergue risco e identifique oportunidades de receita por escola.</p>${alertCard(data.alerts[0])}</div></section>`;
  if(type==='alunos') content=`<section class="stats-grid">${[{icon:'🧑‍🎓',label:'Alunos no radar',value:String(data.students.length),trend:'amostra demo'},{icon:'⚠️',label:'Risco alto',value:String(data.students.filter(s=>s.risk==='alto').length),trend:'ação urgente'},{icon:'💚',label:'Emocional médio',value:`${percentAvg(data.students,'emotional')}%`,trend:'monitorado'},{icon:'✅',label:'Presença média',value:`${percentAvg(data.students,'attendance')}%`,trend:'saudável'}].map(statCard).join('')}</section><section class="content-grid"><div class="content-panel"><div class="panel-head"><h3>Radar de alunos</h3><span class="pill">jornada individual</span></div>${renderStudents(data.students)}</div><div class="content-panel"><h3>Intervenções por perfil</h3><p>Cada aluno carrega leitura cognitiva, emocional, comportamental e de engajamento. A IA sugere a próxima ação.</p>${alertCard(data.alerts[1])}</div></section>`;
  if(type==='familias') content=`<section class="stats-grid">${[{icon:'🤝',label:'Famílias monitoradas',value:String(data.families.length),trend:'amostra demo'},{icon:'💬',label:'Interação média',value:`${percentAvg(data.families,'interaction')}%`,trend:'+ relacionamento'},{icon:'⭐',label:'Satisfação média',value:`${percentAvg(data.families,'satisfaction')}%`,trend:'NPS futuro'},{icon:'🔔',label:'Pendências',value:String(data.families.reduce((s,i)=>s+i.pending,0)),trend:'priorizar'}].map(statCard).join('')}</section><section class="content-grid"><div class="content-panel"><div class="panel-head"><h3>Relacionamento família-escola</h3><span class="pill">mobile-first</span></div>${renderFamilies(data.families)}</div><div class="content-panel"><h3>Uso na demo</h3><p>A família deixa de receber mensagens genéricas e passa a receber orientação contextual, humanizada e acionável.</p>${alertCard(data.alerts[2])}</div></section>`;
  if(type==='professores') content=`<section class="stats-grid">${[{icon:'🧑‍🏫',label:'Docentes ativos',value:String(data.teachers.length),trend:'amostra demo'},{icon:'🔥',label:'Engajamento médio',value:`${percentAvg(data.teachers,'engagement')}%`,trend:'turmas'},{icon:'📚',label:'Turmas',value:String(data.teachers.reduce((s,i)=>s+i.classes,0)),trend:'operação'},{icon:'🤖',label:'Sugestões IA',value:String(data.teachers.length),trend:'uma por docente'}].map(statCard).join('')}</section><section class="content-grid"><div class="content-panel"><div class="panel-head"><h3>Apoio ao professor</h3><span class="pill">copiloto docente</span></div>${renderTeachers(data.teachers)}</div><div class="content-panel"><h3>Valor estratégico</h3><p>O professor recebe clareza de turma, atividades sugeridas, devolutivas e comunicação com coordenação.</p>${alertCard(data.alerts[1])}</div></section>`;
  if(type==='diagnosticos') content=`<div class="content-grid"><div class="content-panel"><div class="panel-head"><h3>Diagnósticos ativos</h3><button class="btn primary" data-run-diagnostic>Simular diagnóstico</button></div><div class="item-list">${data.diagnostics.map(d=>`<article class="data-row"><div class="data-row-icon">🧠</div><div><strong>${d.name}</strong><small>${d.dimensions.join(' • ')}</small><div class="meter"><i style="width:${d.progress}%"></i></div></div><span class="pill">${d.progress}%</span></article>`).join('')}</div></div><div class="content-panel"><h3>Saídas da IA</h3><p>Insights, scores, alertas, recomendações, devolutivas personalizadas, trilhas e relatórios executivos.</p>${alertCard(data.alerts[1])}</div></div>`;
  if(type==='marketplace') content=`<div class="content-panel"><div class="panel-head"><h3>Ofertas estratégicas</h3><span class="pill">receita adicional</span></div><div class="market-grid">${data.marketplace.map(m=>`<article class="market-card"><div class="icon">${m.icon}</div><h3>${m.title}</h3><p>${m.category}</p><strong>${m.price}</strong><br><span class="pill">demanda ${m.demand}</span></article>`).join('')}</div></div>`;
  if(type==='intervencoes') content=`<div class="content-grid"><div class="content-panel"><div class="panel-head"><h3>Planos sugeridos</h3><button class="btn gold" data-create-intervention>Criar intervenção</button></div><div class="item-list">${data.interventions.map(i=>`<article class="data-row"><div class="data-row-icon">✨</div><div><strong>${i.title}</strong><small>${i.target} • ${i.status}</small></div><span class="pill">${i.impact}</span></article>`).join('')}</div></div><div class="content-panel"><h3>Fluxo operacional</h3><p>Alerta → diagnóstico → plano de ação → comunicação → acompanhamento → evidência de impacto.</p>${alertCard(data.alerts[0])}</div></div>`;
  if(type==='ia') content=`<div class="content-grid"><div class="content-panel"><h3>Copiloto IA</h3><p>Digite uma situação educacional e veja uma resposta simulada para demo.</p><label>Prompt<textarea id="ai-prompt" class="input-area">Gerar plano de ação para turma com queda de engajamento e baixa interação familiar.</textarea></label><br><button class="btn primary" data-ask-ai>Gerar resposta IA</button></div><div class="content-panel" id="ai-output"><h3>Resposta</h3><p>O resultado aparecerá aqui.</p></div></div>`;
  return `<section class="hero-panel"><span class="badge">${meta.icon} ${meta.label}</span><h2>${escapeHtml(meta.label)}</h2><p>${subtitle}</p></section>${content}`;
}

function bindActions(){
  document.querySelector('[data-action="diagnostic"]')?.addEventListener('click',()=>simulateDiagnostic());
  document.querySelector('[data-action="ai"]')?.addEventListener('click',()=>askAi('gerar insight executivo do ambiente atual'));
  document.querySelector('[data-action="intervention"]')?.addEventListener('click',()=>openModal('intervention'));
  document.querySelector('[data-run-diagnostic]')?.addEventListener('click',()=>simulateDiagnostic());
  document.querySelector('[data-create-intervention]')?.addEventListener('click',()=>openModal('intervention'));
  document.querySelector('[data-ask-ai]')?.addEventListener('click',async()=>{const prompt=document.querySelector('#ai-prompt').value;const result=await api('/api/ai/mentor',{method:'POST',body:JSON.stringify({prompt})});document.querySelector('#ai-output').innerHTML=`<h3>Resposta IA simulada</h3><p>${escapeHtml(result.answer)}</p><div class="item-list">${result.nextSteps.map(step=>`<div class="alert success"><span>✅</span><div><strong>${escapeHtml(step)}</strong><p>Próxima ação recomendada.</p></div></div>`).join('')}</div>`});
}
async function simulateDiagnostic(){showLoader();try{const result=await api('/api/diagnostics/simulate',{method:'POST',body:JSON.stringify({audience:state.user.role,dimension:'engajamento e saúde educacional'})});openCustomModal('Diagnóstico 360 gerado',`<p>${escapeHtml(result.insight)}</p><div class="item-list">${result.recommendations.map(r=>`<div class="alert success"><span>✨</span><div><strong>${escapeHtml(r)}</strong><p>Recomendação acionável para o próximo ciclo.</p></div></div>`).join('')}</div>`,'score 78 • risco moderado')}finally{hideLoader()}}
async function askAi(prompt){showLoader();try{const result=await api('/api/ai/mentor',{method:'POST',body:JSON.stringify({prompt})});openCustomModal('Insight IA Educacional',`<p>${escapeHtml(result.answer)}</p><div class="hero-actions">${result.nextSteps.map(s=>`<span class="pill">${escapeHtml(s)}</span>`).join('')}</div>`,'copiloto estratégico')}finally{hideLoader()}}
function openModal(type){ if(type==='alerts')return openCustomModal('Alertas do ambiente',state.data.alerts.map(alertCard).join(''),'inteligência ativa'); if(type==='demo')return openCustomModal('Roteiro rápido da demo',`<p><strong>Comece pelo login:</strong> selecione Rede, Escola, Coordenação, Professor, Família ou Estudante. Cada perfil exibe um menu diferente e telas próprias.</p><p><strong>Pitch:</strong> mostre como a mesma plataforma entrega governança para a rede, ação para a escola, clareza para a família e evolução para o aluno.</p>`,'pitch de 5 minutos'); if(type==='intervention')return openCustomModal('Nova intervenção sugerida',`<p><strong>Plano:</strong> Jornada Preventiva de Engajamento.</p><p><strong>Acionadores:</strong> baixa interação familiar, queda emocional e risco acadêmico moderado.</p><p><strong>Saída:</strong> mensagem para família, tarefa para coordenação, trilha para estudante e acompanhamento por 14 dias.</p>`,'ação pronta') }
function openCustomModal(title,body,badge='detalhe'){const modal=document.createElement('div');modal.className='modal-backdrop';modal.innerHTML=`<article class="modal-card"><span class="badge">${escapeHtml(badge)}</span><h2>${escapeHtml(title)}</h2>${body}<div class="modal-actions"><button class="btn primary" data-close>Fechar</button></div></article>`;modal.addEventListener('click',event=>{if(event.target===modal || event.target.dataset.close!==undefined) modal.remove()});document.body.appendChild(modal)}
function environmentIcon(role){return ({rede:'🌐',escola:'🏫',coordenacao:'📡',professor:'🧑‍🏫',familia:'👨‍👩‍👧',estudante:'🎒'})[role]||'🧭'}
function environmentLabel(role){return ({rede:'Rede / Diretoria',escola:'Escola / Direção',coordenacao:'Coordenação Pedagógica',professor:'Professor',familia:'Família',estudante:'Estudante'})[role]||'Ambiente'}

loadApp();
