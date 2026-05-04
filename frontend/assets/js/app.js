const app = document.querySelector('#app');
const loader = document.querySelector('#loader');
const state = {
  token: localStorage.getItem('seb_token'),
  user: null,
  data: null,
  currentView: 'home',
  sidebarCollapsed: localStorage.getItem('seb_sidebar') === 'closed',
  chatOpen: false,
  selectedRole: localStorage.getItem('seb_selected_role') || 'rede'
};

const roleEmails = {
  rede: 'rede@sebfuture.local', escola: 'escola@sebfuture.local', coordenacao: 'coordenacao@sebfuture.local',
  professor: 'professor@sebfuture.local', familia: 'familia@sebfuture.local', estudante: 'estudante@sebfuture.local'
};

const roleMeta = {
  rede: { icon:'🌐', label:'Rede / Diretoria', copy:'Governança executiva com benchmarking, riscos, saúde institucional, receita potencial e decisões estratégicas.', modules:['Dashboard executivo','Escolas','Alunos','Famílias','Professores','Diagnósticos','Marketplace','Intervenções','IA'] },
  escola: { icon:'🏫', label:'Escola / Direção', copy:'Visão da unidade escolar, turmas em atenção, famílias com baixa interação e plano de ação operacional.', modules:['Dashboard da escola','Alunos','Famílias','Professores','Diagnósticos','Intervenções','IA'] },
  coordenacao: { icon:'📡', label:'Coordenação Pedagógica', copy:'Radar de turma, estudantes em risco, leitura socioemocional, plano de intervenção e preparação de reuniões.', modules:['Dashboard da coordenação','Alunos','Professores','Diagnósticos','Intervenções','IA'] },
  professor: { icon:'📘', label:'Professor', copy:'Copiloto docente para leitura de turma, observações, plano de aula gamificado e devolutivas humanas.', modules:['Minha turma','Criador de aulas','Alunos','Diagnósticos','IA'] },
  familia: { icon:'👨‍👩‍👧', label:'Família', copy:'Jornada clara do filho, alertas, rotina, boletim explicado por IA e orientações de apoio em casa.', modules:['Jornada do filho','Aluno','Diagnósticos','Marketplace','IA'] },
  estudante: { icon:'🎒', label:'Estudante', copy:'Experiência mobile-first com missões, XP, conquistas, rotina, mentor IA e plano de evolução.', modules:['Meu painel','Gamificação','Diagnósticos','Marketplace','IA'] }
};

const menuByRole = {
  rede: [ ['home','🌐','Rede'], ['ecosystem','🧭','Ecossistema'], ['schools','🏫','Escolas'], ['students','🎒','Alunos'], ['families','👨‍👩‍👧','Famílias'], ['teachers','📘','Professores'], ['diagnostics','🧠','Diagnósticos'], ['marketplace','💎','Marketplace'], ['interventions','✨','Intervenções'], ['ai','🤖','IA Educacional'] ],
  escola: [ ['home','🏫','Escola'], ['ecosystem','🧭','Fluxo da unidade'], ['students','🎒','Alunos'], ['families','👨‍👩‍👧','Famílias'], ['teachers','📘','Professores'], ['diagnostics','🧠','Diagnósticos'], ['interventions','✨','Intervenções'], ['ai','🤖','IA da escola'] ],
  coordenacao: [ ['home','📡','Coordenação'], ['ecosystem','🧭','Fluxo pedagógico'], ['students','🎒','Alunos'], ['teachers','📘','Professores'], ['diagnostics','🧠','Diagnósticos'], ['interventions','✨','Intervenções'], ['ai','🤖','IA pedagógica'] ],
  professor: [ ['home','📘','Professor'], ['lesson-game','🎲','Criar aula'], ['students','🎒','Minha turma'], ['diagnostics','🧠','Diagnósticos'], ['interventions','✨','Ações'], ['ai','🤖','Copiloto docente'] ],
  familia: [ ['home','👨‍👩‍👧','Família'], ['student-journey','🌱','Jornada do filho'], ['students','🎒','Aluno'], ['diagnostics','🧠','Diagnóstico'], ['marketplace','💎','Apoios'], ['ai','🤖','Orientador família'] ],
  estudante: [ ['home','🎒','Estudante'], ['student-game','🎮','Missões e XP'], ['student-journey','🌱','Minha jornada'], ['diagnostics','🧠','Autodiagnóstico'], ['marketplace','💎','Trilhas'], ['ai','🤖','Mentor IA'] ]
};

function showLoader(){ loader.classList.remove('hidden'); }
function hideLoader(){ loader.classList.add('hidden'); }
function escapeHtml(str=''){ return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
function money(v){ return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}); }
function avg(list,key){ return Math.round(list.reduce((s,i)=>s+(Number(i[key])||0),0)/Math.max(list.length,1)); }
function selectedRoleFromEmail(email){ return Object.entries(roleEmails).find(([,v])=>v===email)?.[0] || 'rede'; }
function setTheme(theme){ document.documentElement.dataset.theme = theme; localStorage.setItem('seb_theme', theme); }

async function api(path, options = {}){
  const headers = { 'Content-Type':'application/json', ...(options.headers || {}) };
  if(state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(path, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if(!res.ok) throw new Error(data.error || 'Erro na API');
  return data;
}

function initTheme(){ setTheme(localStorage.getItem('seb_theme') || 'dark'); }

async function loadApp(){
  initTheme();
  if(!state.token) return renderLanding();
  try{
    showLoader();
    const me = await api('/api/auth/me');
    state.user = me.user;
    state.data = await api('/api/dashboard');
    state.currentView = defaultViewForRole(state.user.role);
    renderShell();
  }catch(err){
    localStorage.removeItem('seb_token'); state.token = null; renderLanding();
  }finally{ hideLoader(); }
}

function defaultViewForRole(role){ return role === 'estudante' ? 'student-game' : role === 'professor' ? 'lesson-game' : 'home'; }

function renderLanding(){
  app.innerHTML = document.querySelector('#landing-template').innerHTML;
  renderLandingCards();
  bindThemeButtons();
  const email = document.querySelector('#email');
  email.value = roleEmails[state.selectedRole] || roleEmails.rede;
  updateLoginContext();
  email.addEventListener('change', updateLoginContext);
  document.querySelectorAll('[data-scroll-login]').forEach(btn => btn.addEventListener('click',()=>document.querySelector('#login-area').scrollIntoView({behavior:'smooth'})));
  document.querySelectorAll('[data-scroll-ecosystem]').forEach(btn => btn.addEventListener('click',()=>document.querySelector('#ecosystem-map').scrollIntoView({behavior:'smooth'})));
  document.querySelectorAll('[data-landing-role]').forEach(btn => btn.addEventListener('click',()=>selectLandingRole(btn.dataset.landingRole)));
  document.querySelector('#login-form').addEventListener('submit', handleLogin);
}

function renderLandingCards(){
  const wrap = document.querySelector('#landing-ecosystem-cards');
  wrap.innerHTML = Object.entries(roleMeta).map(([role,m])=>`
    <button class="ecosystem-card" data-landing-role="${role}">
      <div class="big-icon">${m.icon}</div>
      <h3>${escapeHtml(m.label)}</h3>
      <p>${escapeHtml(m.copy)}</p>
      <ul>${m.modules.slice(0,4).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>
      <span class="pill">Abrir fluxo ${m.icon}</span>
    </button>`).join('');
}

function selectLandingRole(role){
  state.selectedRole = role;
  localStorage.setItem('seb_selected_role', role);
  document.querySelector('#email').value = roleEmails[role];
  updateLoginContext();
  document.querySelector('#login-area').scrollIntoView({behavior:'smooth'});
}

function updateLoginContext(){
  const email = document.querySelector('#email')?.value || roleEmails.rede;
  const role = selectedRoleFromEmail(email);
  state.selectedRole = role;
  localStorage.setItem('seb_selected_role', role);
  const meta = roleMeta[role];
  document.querySelector('#login-context').innerHTML = `<strong>${meta.icon} ${meta.label}</strong><span>${meta.copy}</span><ul>${meta.modules.slice(0,5).map(m=>`<li>${m}</li>`).join('')}</ul>`;
}

async function handleLogin(event){
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const error = document.querySelector('#login-error');
  error.textContent = '';
  try{
    showLoader();
    const result = await api('/api/auth/login',{method:'POST',body:JSON.stringify({email:form.get('email'),password:form.get('password')})});
    localStorage.setItem('seb_token', result.token);
    state.token = result.token; state.user = result.user; state.data = await api('/api/dashboard');
    state.currentView = defaultViewForRole(state.user.role);
    renderShell();
  }catch(err){ error.textContent = err.message; }
  finally{ hideLoader(); }
}

function bindThemeButtons(){ document.querySelectorAll('[data-theme-choice]').forEach(btn=>btn.addEventListener('click',()=>setTheme(btn.dataset.themeChoice))); }

function renderShell(){
  const role = state.user.role;
  const nav = menuByRole[role] || menuByRole.rede;
  app.innerHTML = `
    <section class="app-shell ${state.sidebarCollapsed?'sidebar-collapsed':''}" id="shell">
      <aside class="side-nav">
        <div class="side-head">
          <div class="side-brand"><span class="brand-mark">S</span><span><strong>SEB Future OS</strong><small>${roleMeta[role].label}</small></span></div>
          <button class="sidebar-toggle" data-toggle-sidebar title="Abrir/fechar menu">☰</button>
        </div>
        <div class="nav-section-label">Ambiente logado</div>
        <nav class="nav-items">${nav.map(([id,icon,label])=>`<button class="nav-link ${state.currentView===id?'active':''}" data-view="${id}" title="${escapeHtml(label)}"><span class="icon">${icon}</span><span class="nav-text">${escapeHtml(label)}</span></button>`).join('')}</nav>
        <div class="side-footer">
          <div class="user-chip"><div class="avatar">${escapeHtml(state.user.avatar)}</div><div class="user-meta"><strong>${escapeHtml(state.user.name)}</strong><small>${escapeHtml(state.user.area)}</small></div></div>
          <button class="btn ghost" data-logout><span>🚪</span><span class="nav-text">Sair</span></button>
        </div>
      </aside>
      <section class="main-area">
        <header class="topbar">
          <button class="sidebar-toggle mobile-only" data-mobile-menu title="Menu">☰</button>
          <div class="topbar-title"><strong>${roleMeta[role].icon} ${roleMeta[role].label}</strong><small>Menus, chatbot e fluxos filtrados por perfil logado.</small></div>
          <div class="topbar-actions">
            <button class="theme-pill" data-theme-choice="light">☀️ Light</button>
            <button class="theme-pill" data-theme-choice="dark">🌙 Dark</button>
            <button class="btn ghost" data-action="demo">Roteiro</button>
            <button class="btn primary" data-action="diagnostic">Diagnóstico 360</button>
          </div>
        </header>
        <main class="page-content" id="page-content">${renderView(state.currentView)}</main>
      </section>
    </section>
    ${renderChatbot()}
    <button class="chatbot-fab" data-toggle-chat title="Assistente IA do ambiente">🤖</button>
  `;
  bindShell();
}

function bindShell(){
  bindThemeButtons();
  document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>{ state.currentView = btn.dataset.view; document.querySelector('#page-content').innerHTML = renderView(state.currentView); renderShell(); }));
  document.querySelector('[data-toggle-sidebar]')?.addEventListener('click',()=>{ state.sidebarCollapsed=!state.sidebarCollapsed; localStorage.setItem('seb_sidebar',state.sidebarCollapsed?'closed':'open'); document.querySelector('#shell').classList.toggle('sidebar-collapsed',state.sidebarCollapsed); });
  document.querySelector('[data-mobile-menu]')?.addEventListener('click',()=>document.querySelector('#shell').classList.toggle('mobile-menu-open'));
  document.querySelector('[data-logout]')?.addEventListener('click',()=>{localStorage.removeItem('seb_token'); state.token=null; state.user=null; state.data=null; renderLanding();});
  document.querySelector('[data-action="diagnostic"]')?.addEventListener('click',simulateDiagnostic);
  document.querySelector('[data-action="demo"]')?.addEventListener('click',()=>openCustomModal('Roteiro da demo executiva', renderDemoScript(), 'pitch guiado'));
  document.querySelector('[data-toggle-chat]')?.addEventListener('click',()=>{state.chatOpen=!state.chatOpen; renderShell();});
  document.querySelector('[data-close-chat]')?.addEventListener('click',()=>{state.chatOpen=false; renderShell();});
  document.querySelector('#chat-form')?.addEventListener('submit',handleChat);
  document.querySelectorAll('[data-quick-prompt]').forEach(btn=>btn.addEventListener('click',()=>sendChat(btn.dataset.quickPrompt)));
  document.querySelector('[data-generate-lesson]')?.addEventListener('click',generateLesson);
  document.querySelector('[data-mentor-student]')?.addEventListener('click',studentMentor);
  document.querySelector('[data-run-diagnostic]')?.addEventListener('click',simulateDiagnostic);
  document.querySelector('[data-ask-ai]')?.addEventListener('click',askPageAi);
}

function renderView(view){
  const d = state.data;
  const role = state.user.role;
  if(view==='ecosystem') return renderEcosystemFlow();
  if(view==='schools') return renderSchoolsView();
  if(view==='students') return renderStudentsView();
  if(view==='families') return renderFamiliesView();
  if(view==='teachers') return renderTeachersView();
  if(view==='diagnostics') return renderDiagnosticsView();
  if(view==='marketplace') return renderMarketplaceView();
  if(view==='interventions') return renderInterventionsView();
  if(view==='ai') return renderAiView();
  if(view==='student-game') return renderStudentGame();
  if(view==='student-journey') return renderStudentJourney();
  if(view==='lesson-game') return renderLessonGame();
  return renderHome(role,d);
}

function renderHome(role,d){
  const m = roleMeta[role];
  return `
    <section class="hero-panel">
      <span class="badge">${m.icon} experiência ativa</span>
      <h2>${escapeHtml(d.title || m.label)}</h2>
      <p>${escapeHtml(d.subtitle || m.copy)}</p>
      <div class="hero-actions"><button class="btn primary" data-run-diagnostic>Simular diagnóstico</button><button class="btn glass" data-action="demo">Como apresentar</button></div>
    </section>
    <section class="stats-grid">${d.stats.map(statCard).join('')}</section>
    <section class="content-grid">
      <div class="content-panel"><div class="panel-head"><h3>${escapeHtml(d.primaryListTitle || 'Prioridades')}</h3><span class="pill">dados mockados</span></div>${renderPrimaryList(d.listType)}</div>
      <aside class="content-panel"><h3>IA contextual do ambiente</h3><p>${chatIntro(role)}</p>${d.alerts.map(alertCard).join('')}</aside>
    </section>
    ${renderRoleSpecificHome(role)}
  `;
}

function statCard(s){ return `<article class="stat-card"><div class="icon">${s.icon}</div><span>${escapeHtml(s.label)}</span><b>${escapeHtml(s.value)}</b><span class="pill">${escapeHtml(s.trend)}</span></article>`; }
function alertCard(a){ return `<article class="alert ${a.severity || 'success'}"><span>${a.icon}</span><div><strong>${escapeHtml(a.title)}</strong><p>${escapeHtml(a.text)}</p></div></article>`; }

function renderPrimaryList(type){
  if(type==='schools') return renderSchools(state.data.schools);
  if(type==='classes') return renderClasses(state.data.classes);
  if(type==='students'||type==='studentsShort') return renderStudents(state.data.students, type==='studentsShort');
  if(type==='student') return renderStudentJourneyMini();
  return renderSchools(state.data.schools);
}
function renderSchools(list){ return `<div class="item-list">${list.map(s=>`<article class="data-row"><div class="data-row-icon">🏫</div><div><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.city)} • ${s.students} alunos • ${s.teachers} professores</small><div class="meter"><i style="width:${s.health}%"></i></div></div><span class="pill">${s.health}% saúde</span></article>`).join('')}</div>`; }
function renderClasses(list){ return `<div class="item-list">${list.map(c=>`<article class="data-row"><div class="data-row-icon">📚</div><div><strong>${escapeHtml(c.name)}</strong><small>${c.teacher} • ${c.riskStudents} alunos em atenção</small><div class="meter"><i style="width:${c.engagement}%"></i></div></div><span class="pill">${c.engagement}% eng.</span></article>`).join('')}</div>`; }
function renderStudents(list, short=false){ return `<div class="item-list">${list.map(s=>`<article class="data-row"><div class="data-row-icon">🎒</div><div><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.className)} • risco ${escapeHtml(s.risk)} • ${escapeHtml(s.nextAction)}</small>${short?'':`<div class="meter"><i style="width:${s.engagement}%"></i></div>`}</div><span class="pill">${s.engagement}% eng.</span></article>`).join('')}</div>`; }
function renderFamiliesList(list){ return `<div class="item-list">${list.map(f=>`<article class="data-row"><div class="data-row-icon">👨‍👩‍👧</div><div><strong>${escapeHtml(f.name)}</strong><small>${escapeHtml(f.student)} • ${escapeHtml(f.need)} • ${escapeHtml(f.channel)}</small><div class="meter"><i style="width:${f.interaction}%"></i></div></div><span class="pill">${f.interaction}% interação</span></article>`).join('')}</div>`; }
function renderTeachersList(list){ return `<div class="item-list">${list.map(t=>`<article class="data-row"><div class="data-row-icon">📘</div><div><strong>${escapeHtml(t.name)}</strong><small>${escapeHtml(t.subject)} • ${t.classes} turmas • ${escapeHtml(t.aiSuggestion)}</small><div class="meter"><i style="width:${t.engagement}%"></i></div></div><span class="pill">${t.engagement}% eng.</span></article>`).join('')}</div>`; }

function renderRoleSpecificHome(role){
  if(role==='estudante') return renderStudentGame();
  if(role==='professor') return renderLessonGame();
  if(role==='familia') return renderStudentJourney();
  return renderEcosystemFlow(true);
}

function renderEcosystemFlow(compact=false){
  const steps = {
    rede:['Mapa da rede','Risco e expansão','Investimento e marketplace','Decisão executiva'],
    escola:['Painel da unidade','Turmas em atenção','Plano de intervenção','Comunicação institucional'],
    coordenacao:['Radar de turma','Diagnóstico 360','Reunião com família','Acompanhamento'],
    professor:['Leitura da turma','Aula gamificada','Observações rápidas','Devolutiva'],
    familia:['Resumo do filho','Orientação IA','Apoio em casa','Serviços recomendados'],
    estudante:['Missões semanais','Mentor IA','XP e conquistas','Evolução pessoal']
  }[state.user.role] || [];
  return `<section class="content-panel"><div class="panel-head"><h3>Fluxo da experiência: ${roleMeta[state.user.role].label}</h3><span class="pill">clicável na demo</span></div><div class="experience-flow">${steps.map((s,i)=>`<article class="flow-step"><b>0${i+1}</b><h3>${escapeHtml(s)}</h3><p>${flowCopy(s)}</p></article>`).join('')}</div></section>${compact?'':`<section class="content-grid"><div class="content-panel"><h3>Mapa do produto</h3>${renderLandingEnvironmentCards()}</div><aside class="content-panel"><h3>Como vender a tese</h3><p>Mostre que o produto não é um app escolar: é uma camada proprietária de inteligência, relacionamento e receita para o grupo educacional.</p>${alertCard(state.data.alerts[2])}</aside></section>`}`;
}
function renderLandingEnvironmentCards(){ return `<div class="item-list">${state.data.environments.map(e=>`<article class="data-row"><div class="data-row-icon">${e.icon}</div><div><strong>${escapeHtml(e.title)}</strong><small>${escapeHtml(e.purpose)}</small></div><span class="pill">${escapeHtml(e.audience.split(',')[0])}</span></article>`).join('')}</div>`; }
function flowCopy(step){ return `Etapa simulada com dados mockados, microcopy contextual, ações rápidas e apoio de IA para transformar leitura em decisão.`; }

function renderSchoolsView(){ return `<section class="hero-panel"><span class="badge">🏫 Rede escolar</span><h2>Visão das escolas e benchmarking interno</h2><p>Comparativo entre unidades, saúde institucional, engajamento, risco de retenção e oportunidade comercial.</p></section><section class="stats-grid">${[
  {icon:'🏫',label:'Unidades',value:String(state.data.schools.length),trend:'ativas'}, {icon:'🎒',label:'Alunos',value:String(state.data.schools.reduce((s,i)=>s+i.students,0)),trend:'monitorados'}, {icon:'⚠️',label:'Risco médio',value:`${avg(state.data.schools,'retentionRisk')}%`,trend:'prevenção'}, {icon:'💎',label:'Receita potencial',value:money(state.data.schools.reduce((s,i)=>s+i.revenueOpportunity,0)),trend:'marketplace'}].map(statCard).join('')}</section><section class="content-panel">${renderSchools(state.data.schools)}</section>`; }
function renderStudentsView(){ return `<section class="hero-panel"><span class="badge">🎒 Jornada do aluno</span><h2>Alunos, risco e plano de evolução</h2><p>Leitura cognitiva, emocional, frequência, engajamento, risco e próxima ação sugerida.</p></section><section class="content-grid"><div class="content-panel">${renderStudents(state.data.students)}</div><aside class="content-panel"><h3>Resumo IA</h3><p>${state.user.role==='estudante'?'Seu mentor priorizou pequenas missões para evoluir com consistência.':'A IA prioriza intervenção preventiva antes de o problema virar crise pedagógica.'}</p>${alertCard(state.data.alerts[1])}</aside></section>`; }
function renderFamiliesView(){ return `<section class="hero-panel"><span class="badge">👨‍👩‍👧 Relacionamento</span><h2>Famílias, comunicação e orientação prática</h2><p>Transforma mensagens genéricas em acompanhamento claro, humano e acionável.</p></section><section class="content-panel">${renderFamiliesList(state.data.families)}</section>`; }
function renderTeachersView(){ return `<section class="hero-panel"><span class="badge">📘 Corpo docente</span><h2>Professores, turmas e apoio pedagógico</h2><p>Copiloto docente para aumentar clareza, reduzir sobrecarga e padronizar boas práticas.</p></section><section class="content-panel">${renderTeachersList(state.data.teachers)}</section>`; }
function renderDiagnosticsView(){ return `<section class="hero-panel"><span class="badge">🧠 Diagnósticos 360</span><h2>O coração analítico do ecossistema</h2><p>Diagnósticos por estudante, família, turma, professor, escola e instituição.</p><div class="hero-actions"><button class="btn primary" data-run-diagnostic>Simular diagnóstico IA</button></div></section><section class="content-grid"><div class="content-panel"><div class="item-list">${state.data.diagnostics.map(d=>`<article class="data-row"><div class="data-row-icon">🧠</div><div><strong>${escapeHtml(d.name)}</strong><small>${d.dimensions.join(' • ')}</small><div class="meter"><i style="width:${d.progress}%"></i></div></div><span class="pill">${d.progress}%</span></article>`).join('')}</div></div><aside class="content-panel"><h3>Saídas automáticas</h3><p>Scores, alertas, devolutivas, recomendações, planos de ação, relatórios executivos e trilhas por persona.</p>${alertCard(state.data.alerts[0])}</aside></section>`; }
function renderMarketplaceView(){ return `<section class="hero-panel"><span class="badge">💎 Marketplace educacional</span><h2>Nova fonte de receita e percepção de valor</h2><p>Ofertas de reforço, mentoria, orientação, psicopedagogia, ENEM, experiências e parceiros.</p></section><section class="content-panel"><div class="market-grid">${state.data.marketplace.map(m=>`<article class="market-card"><div class="icon">${m.icon}</div><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.category)}</p><strong>${escapeHtml(m.price)}</strong><br><span class="pill">demanda ${escapeHtml(m.demand)}</span></article>`).join('')}</div></section>`; }
function renderInterventionsView(){ return `<section class="hero-panel"><span class="badge">✨ Central de intervenção</span><h2>Do alerta ao plano de ação</h2><p>Cada risco vira uma ação coordenada entre escola, família, estudante, professor e coordenação.</p></section><section class="content-grid"><div class="content-panel"><div class="item-list">${state.data.interventions.map(i=>`<article class="data-row"><div class="data-row-icon">✨</div><div><strong>${escapeHtml(i.title)}</strong><small>${escapeHtml(i.target)} • ${escapeHtml(i.status)}</small></div><span class="pill">${escapeHtml(i.impact)}</span></article>`).join('')}</div></div><aside class="content-panel"><h3>Fluxo operacional</h3><div class="timeline"><div class="timeline-item"><strong>Alerta</strong><small>Risco detectado</small></div><div class="timeline-item"><strong>Diagnóstico</strong><small>IA explica causa provável</small></div><div class="timeline-item"><strong>Ação</strong><small>Plano e responsáveis</small></div><div class="timeline-item"><strong>Evidência</strong><small>Acompanhamento de impacto</small></div></div></aside></section>`; }
function renderAiView(){ return `<section class="hero-panel"><span class="badge">🤖 IA contextual</span><h2>Copiloto do ambiente ${roleMeta[state.user.role].label}</h2><p>${chatIntro(state.user.role)}</p></section><section class="content-grid"><div class="content-panel"><label>Prompt para a IA<textarea id="ai-prompt">${defaultPrompt(state.user.role)}</textarea></label><br><button class="btn primary" data-ask-ai>Gerar resposta simulada</button></div><aside class="content-panel" id="ai-output"><h3>Resposta</h3><p>A resposta aparecerá aqui com recomendações e próximos passos.</p></aside></section>`; }
function renderStudentJourney(){ return `<section class="hero-panel"><span class="badge">🌱 Jornada personalizada</span><h2>Rotina, emoções, presença e evolução semanal</h2><p>Uma visão simples para estudante e família entenderem o que fazer agora.</p></section><section class="content-grid"><div class="content-panel">${renderStudentJourneyMini()}</div><aside class="mobile-preview"><div class="phone-frame"><div class="phone-top"><strong>Lia Oliveira</strong><span>🎒</span></div><div class="quest-card"><span class="quest-icon">✅</span><div><strong>Rotina da semana</strong><small>4 de 5 metas concluídas</small></div><span class="pill">+80XP</span></div><div class="quest-card"><span class="quest-icon">💚</span><div><strong>Bem-estar</strong><small>Respiração + organização</small></div><span class="pill">74%</span></div><div class="bottom-tabs"><button>🏠 Início</button><button>🎮 XP</button><button>🤖 IA</button><button>💎 Trilhas</button></div></div></aside></section>`; }
function renderStudentJourneyMini(){ return `<div class="timeline"><div class="timeline-item"><strong>Segunda</strong><small>Revisão de matemática + check emocional</small></div><div class="timeline-item"><strong>Quarta</strong><small>Meta de leitura e organização de tarefas</small></div><div class="timeline-item"><strong>Sexta</strong><small>Feedback IA para família e coordenação</small></div><div class="timeline-item"><strong>Próxima ação</strong><small>Mentoria leve + rotina de estudos</small></div></div>`; }
function renderStudentGame(){ return `<section class="hero-panel"><span class="badge">🎮 Gamificação com mentor IA</span><h2>Missões semanais para evoluir sem pressão.</h2><p>O estudante ganha XP, desbloqueia conquistas e recebe ajuda da IA para transformar estudo em progresso visível.</p></section><section class="game-grid"><div class="xp-card"><h3>Level 7 • Exploradora do Conhecimento</h3><div class="xp-ring"><div>2.840<br>XP</div></div><p>Faltam 320 XP para desbloquear a conquista “Mente Organizada”.</p><div class="badge-row"><span class="achievement">🏆 6 dias de foco</span><span class="achievement">🧠 Revisão ativa</span><span class="achievement">💚 Check emocional</span></div></div><div class="content-panel"><div class="panel-head"><h3>Missões sugeridas pela IA</h3><button class="btn primary" data-mentor-student>Mentor IA</button></div><div class="item-list"><article class="quest-card"><span class="quest-icon">🎯</span><div><strong>Resolver 8 desafios de matemática</strong><small>Microtrilha de 18 minutos</small></div><span class="pill">+120XP</span></article><article class="quest-card"><span class="quest-icon">📚</span><div><strong>Resumo relâmpago de ciências</strong><small>Use mapa mental e explique em voz alta</small></div><span class="pill">+90XP</span></article><article class="quest-card"><span class="quest-icon">💬</span><div><strong>Pedir ajuda antes da prova</strong><small>Enviar dúvida para professor ou mentor</small></div><span class="pill">+70XP</span></article><article class="quest-card"><span class="quest-icon">💚</span><div><strong>Check-in emocional</strong><small>Respiração + nota de energia</small></div><span class="pill">+40XP</span></article></div></div></section><section class="content-panel" id="student-mentor-output"><h3>Mentor IA</h3><p>Clique em “Mentor IA” para gerar um apoio motivacional contextual.</p></section>`; }
function renderLessonGame(){ return `<section class="hero-panel"><span class="badge">🎲 Professor • criador gamificado de aulas</span><h2>Transforme uma aula em missão pedagógica.</h2><p>O professor informa tema, objetivo e perfil da turma. A IA simulada entrega roteiro, dinâmica, checkpoints, evidências e XP docente.</p></section><section class="lesson-builder"><div class="content-panel"><div class="builder-form"><label>Tema da aula<input id="lesson-topic" value="Frações e proporcionalidade na vida real"></label><label>Objetivo<input id="lesson-goal" value="Aumentar engajamento e reduzir dúvidas recorrentes"></label><label>Perfil da turma<select id="lesson-profile"><option>Turma com engajamento médio e 5 alunos em atenção</option><option>Turma acelerada e competitiva</option><option>Turma com baixa participação familiar</option></select></label><button class="btn primary" data-generate-lesson>Gerar aula gamificada →</button></div><div class="reward-strip"><span>⚡ +180 XP docente</span><span>🏅 Badge Aula Ativa</span><span>🤖 IA pedagógica</span></div></div><div class="lesson-output" id="lesson-output"><h3>Plano gerado</h3><p>O roteiro da aula aparecerá aqui com etapas, atividade, checkpoint e devolutiva.</p></div></section>`; }

function renderChatbot(){
  if(!state.user || !state.chatOpen) return '';
  const role = state.user.role;
  const qs = quickPrompts(role);
  return `<aside class="chatbot-panel"><div class="chat-head"><div><strong>🤖 Assistente ${roleMeta[role].label}</strong><small>${chatIntro(role)}</small></div><button class="chat-close" data-close-chat>×</button></div><div class="chat-messages" id="chat-messages"><div class="chat-bubble bot">${initialChat(role)}</div></div><div class="quick-prompts">${qs.map(q=>`<button data-quick-prompt="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join('')}</div><form class="chat-form" id="chat-form"><input id="chat-input" placeholder="Pergunte ao assistente..." autocomplete="off"><button>Enviar</button></form></aside>`;
}
function chatIntro(role){ return ({rede:'Prioriza risco, crescimento, benchmarking e tese executiva.',escola:'Ajuda a organizar operação, planos e comunicação da unidade.',coordenacao:'Apoia leitura pedagógica, socioemocional e intervenção.',professor:'Ajuda a planejar aulas, devolutivas e ações por turma.',familia:'Traduz dados escolares em orientação prática para casa.',estudante:'Motiva estudo com missões, XP e autoconsciência.'})[role]; }
function initialChat(role){ return ({rede:'Posso resumir riscos da rede, oportunidades de marketplace e argumentos para diretoria.',escola:'Posso sugerir prioridades da unidade, famílias para contato e plano de intervenção.',coordenacao:'Posso montar roteiro de reunião, plano por turma e leitura socioemocional.',professor:'Posso transformar sua aula em uma missão gamificada com checkpoints.',familia:'Posso explicar a jornada do seu filho em linguagem simples e prática.',estudante:'Posso te ajudar a ganhar XP, organizar estudos e manter o foco sem pressão.'})[role]; }
function quickPrompts(role){ return ({rede:['Resumo executivo','Risco da rede','Receita marketplace'],escola:['Plano da unidade','Famílias prioritárias','Mensagem institucional'],coordenacao:['Plano de intervenção','Roteiro de reunião','Alunos em risco'],professor:['Criar aula gamificada','Atividade rápida','Devolutiva família'],familia:['Como ajudar em casa','Explicar boletim','Rotina semanal'],estudante:['Criar missão','Me motivar','Organizar estudos']})[role]; }
async function handleChat(e){ e.preventDefault(); const input=document.querySelector('#chat-input'); const text=input.value.trim(); if(!text) return; input.value=''; await sendChat(text); }
async function sendChat(text){
  const box=document.querySelector('#chat-messages'); if(!box) return;
  box.insertAdjacentHTML('beforeend',`<div class="chat-bubble user">${escapeHtml(text)}</div>`); box.scrollTop=box.scrollHeight;
  const result=await api('/api/ai/chat',{method:'POST',body:JSON.stringify({message:text,role:state.user.role})});
  box.insertAdjacentHTML('beforeend',`<div class="chat-bubble bot">${escapeHtml(result.answer)}</div>`); box.scrollTop=box.scrollHeight;
}
async function simulateDiagnostic(){ showLoader(); try{ const r=await api('/api/diagnostics/simulate',{method:'POST',body:JSON.stringify({audience:state.user.role,dimension:'engajamento, aprendizagem e relacionamento'})}); openCustomModal('Diagnóstico 360 gerado',`<p>${escapeHtml(r.insight)}</p><div class="item-list">${r.recommendations.map(x=>`<div class="alert success"><span>✨</span><div><strong>${escapeHtml(x)}</strong><p>Recomendação acionável para o próximo ciclo.</p></div></div>`).join('')}</div>`,'score 78 • risco moderado'); } finally { hideLoader(); } }
async function askPageAi(){ const prompt=document.querySelector('#ai-prompt')?.value || defaultPrompt(state.user.role); const output=document.querySelector('#ai-output'); const r=await api('/api/ai/mentor',{method:'POST',body:JSON.stringify({prompt,role:state.user.role})}); output.innerHTML=`<h3>Resposta IA simulada</h3><p>${escapeHtml(r.answer)}</p><div class="item-list">${r.nextSteps.map(s=>`<div class="alert success"><span>✅</span><div><strong>${escapeHtml(s)}</strong><p>Próxima ação recomendada para este ambiente.</p></div></div>`).join('')}</div>`; }
function defaultPrompt(role){ return ({rede:'Gerar resumo executivo para diretoria sobre riscos, diferenciação e receita adicional.',escola:'Criar plano de ação para uma escola com famílias pouco engajadas.',coordenacao:'Montar intervenção para turma com queda socioemocional e acadêmica.',professor:'Criar uma aula gamificada para turma com baixo engajamento.',familia:'Explicar como posso apoiar meu filho em casa esta semana.',estudante:'Criar missões de estudo para eu ganhar XP e me preparar melhor.'})[role]; }
function generateLesson(){ const topic=document.querySelector('#lesson-topic').value; const goal=document.querySelector('#lesson-goal').value; const profile=document.querySelector('#lesson-profile').value; document.querySelector('#lesson-output').innerHTML=`<span class="badge">Aula gerada • +180 XP</span><h3>Missão: ${escapeHtml(topic)}</h3><p><strong>Objetivo:</strong> ${escapeHtml(goal)}</p><div class="timeline"><div class="timeline-item"><strong>1. Abertura cinematográfica</strong><small>Problema real de 3 minutos para ativar curiosidade.</small></div><div class="timeline-item"><strong>2. Desafio em times</strong><small>${escapeHtml(profile)}. Divida em grupos e entregue 3 níveis de desafio.</small></div><div class="timeline-item"><strong>3. Checkpoint IA</strong><small>Professor registra dúvidas rápidas e a IA sugere reforço imediato.</small></div><div class="timeline-item"><strong>4. Evidência de aprendizagem</strong><small>Aluno envia resposta curta: “onde usaria isso fora da escola?”.</small></div></div><div class="reward-strip"><span>🏅 Badge Aula Ativa</span><span>🎯 Engajamento previsto +14%</span><span>💬 Devolutiva pronta</span></div>`; }
function studentMentor(){ document.querySelector('#student-mentor-output').innerHTML=`<h3>Mentor IA da Lia</h3><p>Hoje a melhor estratégia é uma missão pequena, visual e com vitória rápida: 18 minutos de matemática, 5 minutos de pausa e depois explicar uma questão em voz alta. Você ganha XP por consistência, não por perfeição.</p><div class="reward-strip"><span>🎯 Missão recomendada</span><span>⚡ +120 XP</span><span>💚 sem pressão</span></div>`; }
function openCustomModal(title,body,badge='detalhe'){ const modal=document.createElement('div'); modal.className='modal-backdrop'; modal.innerHTML=`<article class="modal-card"><span class="badge">${escapeHtml(badge)}</span><h2>${escapeHtml(title)}</h2>${body}<div class="modal-actions"><button class="btn primary" data-close>Fechar</button></div></article>`; modal.addEventListener('click',ev=>{ if(ev.target===modal || ev.target.dataset.close!==undefined) modal.remove(); }); document.body.appendChild(modal); }
function renderDemoScript(){ return `<p><strong>1.</strong> Comece pela landing e clique nos nós do ecossistema para mostrar que a tese é multiambiente.</p><p><strong>2.</strong> Faça login como Rede para apresentar visão executiva, escolas, riscos e marketplace.</p><p><strong>3.</strong> Entre como Professor para mostrar aula gamificada. Depois como Estudante para mostrar missões, XP e mentor IA.</p><p><strong>4.</strong> Abra o chatbot contextual e mostre que cada persona recebe suporte diferente.</p>`; }

loadApp();
