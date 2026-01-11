# 📋 README - Sistema de Ponto Eletrônico

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Vite + React)            │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Funcionário │  │  Encarregado │  │   Admin   │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│         │                  │                │        │
│         └──────────────────┴────────────────┘        │
│                         │                            │
│                    Supabase Client                   │
└──────────────────────────┼──────────────────────────┘
                           │
                           ▼
        ┌─────────────────────────────────┐
        │     OPÇÃO 1: Supabase Direto    │
        │  (Cliente conecta ao Supabase)  │
        └─────────────────────────────────┘
                           │
                           ▼
        ┌─────────────────────────────────┐
        │    OPÇÃO 2: Backend NestJS      │
        │   (API intermediária opcional)  │
        │  ┌────────────────────────────┐ │
        │  │  Auth  │ Users │ Records  │ │
        │  └────────────────────────────┘ │
        └─────────────────────────────────┘
                           │
                           ▼
        ┌─────────────────────────────────┐
        │      SUPABASE (PostgreSQL)      │
        │  ┌────────────────────────────┐ │
        │  │ users │ time_records │ ... │ │
        │  └────────────────────────────┘ │
        └─────────────────────────────────┘
```

## 🎯 Configuração Atual

### ✅ O que está pronto

1. **Frontend (React + Vite)**

   - ✅ Interface completa para Funcionário e Encarregado
   - ✅ Sistema de login com auditoria
   - ✅ Registro de ponto integrado com Supabase
   - ✅ Histórico de pontos com filtros
   - ✅ Dashboard com estatísticas
   - ✅ Tema dark/light

2. **Banco de Dados (Supabase)**

   - ✅ 6 tabelas criadas (users, time_records, shifts, etc)
   - ✅ 4 usuários de teste
   - ✅ Sistema de auditoria de login
   - ✅ 12 queries prontas para análise
   - ✅ Schema SQL completo documentado

3. **Backend (NestJS) - OPCIONAL**
   - ✅ Estrutura modular criada
   - ✅ Integração com Supabase
   - ✅ Endpoints REST completos
   - ⚠️ Pode usar ou não (frontend funciona direto)

## 🚀 Como Iniciar

### Opção 1: Apenas Frontend + Supabase (Recomendado para começar)

#### 1. Configurar Supabase

Siga o guia: [`SETUP_DATABASE.md`](SETUP_DATABASE.md)

Resumo:

```bash
# 1. Criar projeto no Supabase
# 2. Executar SQL do arquivo: supabase-schema-complete.sql
# 3. Obter credenciais em Settings > API
```

#### 2. Configurar Frontend

```bash
# Na raiz do projeto
cp .env.local.example .env.local

# Editar .env.local com suas credenciais:
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=sua-anon-key
```

#### 3. Instalar e Rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

**Login de teste**:

- Admin: `admin` / `admin123`
- Funcionário: `funcionario1` / `func123`

---

### Opção 2: Frontend + Backend + Supabase (Completo)

#### 1. Configurar Supabase

Mesmo processo da Opção 1

#### 2. Configurar Backend

Siga o guia: [`meu-saas-backend/SETUP_BACKEND.md`](meu-saas-backend/SETUP_BACKEND.md)

```bash
cd meu-saas-backend
npm install
cp .env.example .env
# Editar .env com credenciais Supabase
npm run start:dev
```

Backend rodará em: http://localhost:3000/api

#### 3. Configurar Frontend

```bash
# Na raiz do projeto
cp .env.local.example .env.local

# Editar .env.local:
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=sua-anon-key
# VITE_API_URL=http://localhost:3000/api
```

#### 4. Rodar Frontend

```bash
npm install
npm run dev
```

## 📂 Estrutura do Projeto

```
prefeiturarelatorioponto/
├── src/                          # Frontend React
│   ├── components/               # Componentes UI
│   ├── modules/                  # Módulos (employee, manager)
│   ├── pages/                    # Páginas principais
│   ├── lib/                      # Bibliotecas
│   │   ├── supabaseClient.ts    # Cliente Supabase
│   │   └── supabaseAuth.ts      # Funções de autenticação
│   └── hooks/                    # React hooks customizados
│
├── meu-saas-backend/             # Backend NestJS (opcional)
│   ├── src/
│   │   ├── auth/                 # Autenticação
│   │   ├── users/                # Gerenciamento de usuários
│   │   ├── time-records/         # Registros de ponto
│   │   └── supabase/             # Cliente Supabase
│   └── SETUP_BACKEND.md
│
├── supabase-schema-complete.sql  # Schema do banco
├── SETUP_DATABASE.md             # Guia de setup do banco
├── .env.local.example            # Exemplo variáveis frontend
└── README.md                     # Este arquivo
```

## 🔑 Variáveis de Ambiente

### Frontend (`.env.local`)

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3000/api  # Apenas se usar backend
VITE_MODE=development
```

### Backend (`meu-saas-backend/.env`)

```env
PORT=3000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
```

## 👥 Usuários de Teste

| Username     | Senha    | Role          | Descrição               |
| ------------ | -------- | ------------- | ----------------------- |
| admin        | admin123 | ADMINISTRADOR | Acesso total ao sistema |
| encarregado1 | enc123   | SUPERVISOR    | Gerencia funcionários   |
| funcionario1 | func123  | VIGILANTE     | Registra pontos         |
| funcionario2 | func123  | VIGIA         | Registra pontos         |

## 📊 Banco de Dados

### Tabelas

1. **users** - Usuários do sistema
2. **time_records** - Registros de ponto
3. **shifts** - Escalas de trabalho
4. **notifications** - Notificações
5. **security_codes** - Códigos de segurança
6. **login_audit** - Auditoria de login

Ver schema completo em: `supabase-schema-complete.sql`

## 🧪 Testes

### Testar Login

```bash
# Frontend
1. Abra http://localhost:5173
2. Digite: admin / admin123
3. Clique em "Entrar"

# Backend (se estiver usando)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Testar Registro de Ponto

```bash
# Frontend
1. Faça login como funcionario1
2. Vá em "Registro de Ponto"
3. Clique em "Registrar Entrada"

# Backend
curl -X POST http://localhost:3000/api/time-records/punch \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-xxxx",
    "punchType":"ENTRADA",
    "location":{"latitude":-23.5505,"longitude":-46.6333}
  }'
```

## 🔧 Scripts Disponíveis

### Frontend

```bash
npm run dev          # Rodar em desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

### Backend

```bash
npm run start:dev    # Rodar em desenvolvimento
npm run build        # Compilar TypeScript
npm run start:prod   # Rodar em produção
npm run test         # Rodar testes
```

## 🐛 Troubleshooting

### Frontend não conecta ao Supabase

- ✅ Verifique se `.env.local` existe
- ✅ Confirme que as variáveis estão corretas
- ✅ Reinicie o servidor: `npm run dev`

### Backend não inicia

- ✅ Verifique `.env` em `meu-saas-backend/`
- ✅ Instale dependências: `npm install`
- ✅ Verifique logs do terminal

### Erro "Table does not exist"

- ✅ Execute o SQL no Supabase (ver `SETUP_DATABASE.md`)

### Login não funciona

- ✅ Verifique se executou o SQL completo
- ✅ Teste com: `admin` / `admin123`
- ✅ Veja logs do console do navegador

## 🔒 Segurança

### Desenvolvimento

- ✅ RLS desabilitado no Supabase (facilita testes)
- ✅ Senhas com hash SHA-256
- ✅ Auditoria de todos os logins

### Produção (TODO)

- ⚠️ Habilitar RLS no Supabase
- ⚠️ Configurar policies por role
- ⚠️ Usar HTTPS apenas
- ⚠️ Rate limiting
- ⚠️ JWT com refresh tokens
- ⚠️ Nunca expor SERVICE_KEY

## 📚 Documentação Adicional

- [`SETUP_DATABASE.md`](SETUP_DATABASE.md) - Configurar Supabase
- [`meu-saas-backend/SETUP_BACKEND.md`](meu-saas-backend/SETUP_BACKEND.md) - Configurar backend
- [`GUIA_AUDITORIA.md`](GUIA_AUDITORIA.md) - Sistema de auditoria
- [Supabase Docs](https://supabase.com/docs)
- [NestJS Docs](https://docs.nestjs.com)

## 🎯 Roadmap

### ✅ Concluído

- [x] Frontend completo (Funcionário + Encarregado)
- [x] Banco de dados Supabase
- [x] Sistema de login e auditoria
- [x] Registro de ponto funcionando
- [x] Histórico de pontos
- [x] Backend NestJS estruturado

### 🚧 Em Progresso

- [ ] Integração Perfil do usuário
- [ ] Sistema de notificações
- [ ] Escalas de trabalho

### 📋 Pendente

- [ ] Relatórios e exportações
- [ ] Aprovação de pontos por encarregado
- [ ] Dashboard analytics avançado
- [ ] Aplicativo mobile (React Native)
- [ ] Testes automatizados
- [ ] Deploy em produção

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário da Prefeitura Municipal.

---

**Desenvolvido com ❤️ para modernizar o controle de ponto da Prefeitura**
