# SEB Future OS v1.1 — Protótipo funcional premium

Protótipo navegável para demonstração executiva de um ecossistema educacional 360, web-first e mobile-first.

## O que vem pronto

- Node.js + Express
- Autenticação com JWT
- PostgreSQL opcional
- Dados mockados para demonstração
- Login funcional
- Dashboard da Rede
- Visão consolidada de todos os ambientes
- Visão Escolas / Unidades
- Visão Alunos
- Visão Famílias
- Visão Professores
- Ambiente da Escola
- Ambiente da Coordenação
- Ambiente do Professor
- Ambiente da Família
- Ambiente do Estudante
- Diagnósticos 360
- Marketplace Educacional
- IA Educacional simulada
- Central de Intervenções
- Design system em CSS
- Layout premium responsivo/mobile-first

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

## Usuários de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Rede / Diretoria | rede@sebfuture.local | 123456 |
| Escola | escola@sebfuture.local | 123456 |
| Coordenação | coordenacao@sebfuture.local | 123456 |
| Professor | professor@sebfuture.local | 123456 |
| Família | familia@sebfuture.local | 123456 |
| Estudante | estudante@sebfuture.local | 123456 |

## PostgreSQL opcional

Por padrão o projeto usa dados mockados em memória (`USE_DATABASE=false`).
Para testar PostgreSQL:

1. Configure `DATABASE_URL` no `.env`
2. Altere `USE_DATABASE=true`
3. Rode:

```bash
npm run db:init
npm run dev
```

## Estrutura

```txt
backend/
  src/
    config/
    data/
    middleware/
    routes/
frontend/
  assets/css/design-system.css
  assets/js/app.js
  index.html
docs/
  roteiro-demo.md
  arquitetura.md
```

## Observação

Esta v1.1 é um protótipo de alta fidelidade visual e fluxo. Não usa API externa de IA. As respostas de IA são simuladas para apresentação e validação estratégica.


## Atualização v1.2 — ambientes separados por perfil

Esta versão adiciona:

- Login premium com copywriting executivo e ilustrações animadas em CSS.
- Seleção de tipo de acesso antes do login.
- Menus filtrados por perfil logado: Rede, Escola, Coordenação, Professor, Família e Estudante.
- Estrutura visual separada para cada ambiente/persona.
- Ajustes de espaçamento vertical entre cards, painéis, dashboards e listas.
- Contexto de demo no login para explicar o valor de cada ambiente.

### Perfis de demo

Todos usam a senha `123456`:

- `rede@sebfuture.local` — vê todos os ambientes e módulos estratégicos.
- `escola@sebfuture.local` — vê operação escolar, coordenação, alunos, famílias, professores, diagnósticos, intervenções, IA e marketplace.
- `coordenacao@sebfuture.local` — vê coordenação, alunos, professores, famílias, diagnósticos, intervenções e IA.
- `professor@sebfuture.local` — vê professor, alunos, diagnósticos, intervenções e IA.
- `familia@sebfuture.local` — vê família, estudante, diagnósticos, marketplace e IA.
- `estudante@sebfuture.local` — vê estudante, diagnósticos, marketplace e IA.


## v1.3.1.0 — Landing premium, ecossistema clicável e gamificação

Novidades desta versão:

- Landing page premium com animação visual do ecossistema.
- Mapa clicável dos ambientes: Rede, Escola, Coordenação, Professor, Família e Estudante.
- Login contextual por persona, preservando JWT e mocks.
- Menus filtrados por ambiente logado.
- Menu lateral colapsável: aberto com texto e ícones, fechado apenas com ícones.
- Alternância visual Light/Dark com persistência em localStorage.
- Scrollbars estilizadas no documento, listas, menu, modal e chatbot.
- Chatbot contextual simulado para cada área/persona.
- Experiência gamificada para estudante: missões, XP, conquistas e mentor IA.
- Criador gamificado de aulas para professor: tema, objetivo, perfil da turma, plano gerado e recompensas.
- Fluxos principais por experiência, sem dependência de API externa de IA.

Perfis de demo:

- rede@sebfuture.local
- escola@sebfuture.local
- coordenacao@sebfuture.local
- professor@sebfuture.local
- familia@sebfuture.local
- estudante@sebfuture.local

Senha para todos: `123456`
