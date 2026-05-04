# Arquitetura — SEB Future OS v1

## Objetivo da v1

Criar um protótipo funcional de alta fidelidade visual, navegável e demonstrável para apresentação executiva do ecossistema educacional 360.

## Camadas

### Frontend

- `frontend/index.html`
- `frontend/assets/css/design-system.css`
- `frontend/assets/js/app.js`

Aplicação SPA simples, sem build obrigatório, para reduzir fricção de instalação e facilitar demonstração local.

### Backend

- `backend/src/server.js`
- `backend/src/routes/auth.routes.js`
- `backend/src/routes/api.routes.js`
- `backend/src/middleware/auth.js`
- `backend/src/data/mockData.js`

API Express com autenticação JWT, endpoints de dashboard, ecossistema, diagnóstico simulado e mentor IA simulado.

### Dados

Na v1, os dados principais estão mockados em `mockData.js`.

PostgreSQL é opcional via:

```env
USE_DATABASE=true
DATABASE_URL=postgresql://...
```

## Endpoints

```txt
POST /api/auth/login
GET  /api/auth/me
GET  /api/health
GET  /api/dashboard
GET  /api/ecosystem
POST /api/diagnostics/simulate
POST /api/ai/mentor
```

## Perfis de acesso

- Rede / Diretoria
- Escola
- Coordenação
- Professor
- Família
- Estudante

## Próximos passos técnicos

1. Separar telas em módulos por rota.
2. Persistir diagnósticos no PostgreSQL.
3. Criar cadastro real de estudantes, famílias, turmas e escolas.
4. Criar engine de diagnóstico 360.
5. Integrar API de IA para devolutivas e planos de ação.
6. Criar relatórios PDF executivos.
7. Criar painel administrativo de marketplace.
8. Implementar permissões granulares por perfil.
