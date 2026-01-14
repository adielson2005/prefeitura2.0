# 🏛️ Sistema de Vigilância Municipal - Prefeitura

## ✨ Sistema Completo e Funcional

Sistema profissional de gestão de ponto eletrônico para vigias, vigilantes e guardas municipais, com portal administrativo completo e interface mobile-first para funcionários.

---

## 🚀 STATUS DO PROJETO

### ✅ 100% FUNCIONAL

- ✅ Sistema de Autenticação com Supabase
- ✅ Portal do Encarregado/Administrador
- ✅ Portal do Funcionário (Mobile-First)
- ✅ Registro de Ponto com Geolocalização
- ✅ Auditoria Completa de Logins
- ✅ Sistema de Escalas e Folgas
- ✅ Relatórios e Analytics
- ✅ Responsivo (Mobile, Tablet, Desktop)
- ✅ PWA (Progressive Web App)
- ✅ Tema Dark/Light
- ✅ Pronto para Deploy

---

## 🎯 INÍCIO RÁPIDO (5 MINUTOS)

### 1️⃣ Configurar Banco de Dados

1. Acesse https://app.supabase.com
2. Execute o arquivo `supabase-schema-complete.sql`
3. Execute o arquivo `setup-database.sql`

### 2️⃣ Iniciar o Sistema

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm run dev
```

Acesse: **http://localhost:8081**

### 3️⃣ Fazer Login

**Encarregado:**

- Usuário: `encarregado`
- Senha: `senha123`

**Funcionário:**

- Usuário: `funcionario`
- Senha: `senha123`

---

## 📚 DOCUMENTAÇÃO COMPLETA

### 📖 Guias Disponíveis

1. **[GUIA_SETUP_RAPIDO.md](GUIA_SETUP_RAPIDO.md)** - Setup em 10 minutos
2. **[GUIA_DEPLOY_VERCEL.md](GUIA_DEPLOY_VERCEL.md)** - Deploy em produção
3. **[GUIA_TESTES_COMPLETO.md](GUIA_TESTES_COMPLETO.md)** - Checklist de testes
4. **[setup-database.sql](setup-database.sql)** - Criar usuários de teste
5. **[supabase-schema-complete.sql](supabase-schema-complete.sql)** - Schema completo

---

## 👥 CREDENCIAIS DE TESTE

Todos usam senha: **`senha123`**

### 🛡️ Administradores

- `encarregado` - Administrador
- `gerente` - Gerente
- `supervisor` - Supervisor

### 👷 Funcionários

- `funcionario` - Vigia
- `vigilante` - Vigilante
- `guarda` - Guarda

---

## 🎨 FUNCIONALIDADES

### 🔐 Autenticação

- [x] Login seguro com hash SHA-256
- [x] Seleção de tipo de usuário (Encarregado/Funcionário)
- [x] Auditoria completa de logins
- [x] Controle de sessão
- [x] Proteção de rotas por role

### 👔 Portal do Encarregado

- [x] Dashboard com métricas e gráficos
- [x] Gestão de Vigias, Vigilantes e Guardas
- [x] Gestão de Supervisores
- [x] Controle de Ponto
- [x] Escalas e Folgas
- [x] Gestão de Áreas
- [x] Relatórios
- [x] Configurações
- [x] Perfil
- [x] Notificações
- [x] Segurança e Auditoria
- [x] Busca Global

### 📱 Portal do Funcionário (Mobile-First)

- [x] Dashboard simplificado
- [x] Registro de Ponto com GPS
- [x] Visualização de Escala
- [x] Histórico de Registros
- [x] Perfil
- [x] Configurações
- [x] Navegação Inferior Intuitiva

### 🎨 Interface

- [x] Design moderno e profissional
- [x] Tema Dark (padrão) e Light
- [x] Gradientes e glassmorphism
- [x] Animações suaves
- [x] 100% Responsivo
- [x] PWA - Instalar como app

---

## 🏗️ ARQUITETURA

### Frontend

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **UI:** shadcn/ui + Tailwind CSS
- **Routing:** React Router v6
- **State:** React Query
- **Forms:** React Hook Form + Zod

### Backend

- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth + Custom
- **API:** Supabase Client SDK
- **Storage:** Supabase Storage

### Deployment

- **Hosting:** Vercel (Edge Network)
- **CI/CD:** Automático via GitHub
- **SSL:** Automático (Let's Encrypt)

---

## 📦 ESTRUTURA DO PROJETO

```
prefeiturarelatorioponto/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── layout/       # Layouts (AppLayout, Sidebar, Header)
│   │   ├── ui/           # Componentes shadcn/ui
│   │   └── dashboard/    # Componentes do dashboard
│   ├── modules/
│   │   ├── employee/     # Portal do Funcionário
│   │   │   ├── pages/    # Páginas (Dashboard, Ponto, etc)
│   │   │   ├── layouts/  # Layout específico (mobile-first)
│   │   │   └── components/ # Componentes específicos
│   │   └── admin/        # Portal Administrativo (futuro)
│   ├── pages/            # Páginas principais
│   ├── lib/              # Utilitários
│   │   ├── supabaseClient.ts   # Cliente Supabase
│   │   ├── supabaseAuth.ts     # Autenticação
│   │   ├── secureAuth.ts       # Segurança
│   │   └── roleGuard.ts        # Controle de acesso
│   ├── hooks/            # Custom hooks
│   ├── App.tsx           # App principal
│   └── main.tsx          # Entry point
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── sw.js            # Service Worker
│   └── icons/           # Ícones PWA
├── supabase-schema-complete.sql   # Schema do banco
├── setup-database.sql             # Dados iniciais
├── vercel.json                    # Config Vercel
├── GUIA_SETUP_RAPIDO.md
├── GUIA_DEPLOY_VERCEL.md
├── GUIA_TESTES_COMPLETO.md
└── package.json
```

---

## 🔧 SCRIPTS DISPONÍVEIS

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor (porta 8081)

# Build
npm run build            # Build para produção
npm run preview          # Preview do build

# Qualidade
npm run lint             # Verificar código
```

---

## 📱 RESPONSIVIDADE

### ✅ Mobile (320px - 767px)

- Navegação inferior para funcionários
- Menu lateral retrátil para admin
- Cards empilhados verticalmente
- Formulários otimizados para toque
- Tabelas com scroll horizontal

### ✅ Tablet (768px - 1023px)

- Layout híbrido
- Menu lateral sempre visível
- Cards em grid 2 colunas
- Tabelas com largura adaptativa

### ✅ Desktop (1024px+)

- Menu lateral fixo e expandido
- Dashboard em grid 3-4 colunas
- Tabelas completas
- Experiência otimizada

---

## 🔐 SEGURANÇA

### Implementado

- [x] Hash SHA-256 de senhas
- [x] Tokens de sessão seguros
- [x] Expiração automática de sessão
- [x] Auditoria de logins (IP, browser, OS)
- [x] Proteção contra XSS
- [x] Proteção contra CSRF
- [x] HTTPS obrigatório
- [x] Headers de segurança
- [x] Controle de acesso por role

---

## 🚀 DEPLOY EM PRODUÇÃO

### Vercel (Recomendado)

1. **Fazer push para GitHub**

```bash
git add .
git commit -m "Deploy inicial"
git push origin main
```

2. **Importar no Vercel**

- Acesse https://vercel.com
- Conecte o repositório
- Configure variáveis de ambiente

3. **Configurar Supabase**

- Adicione URL do Vercel nas URLs permitidas
- Configure CORS

📖 **Ver:** [GUIA_DEPLOY_VERCEL.md](GUIA_DEPLOY_VERCEL.md) para detalhes completos

---

## 🧪 TESTES

Execute o checklist completo de testes:

📖 **Ver:** [GUIA_TESTES_COMPLETO.md](GUIA_TESTES_COMPLETO.md)

### Quick Tests

```bash
# Teste de build
npm run build

# Teste de preview
npm run preview
```

---

## 🎨 TEMAS

O sistema possui 2 temas:

- **Dark Mode** (padrão) - Profissional e moderno
- **Light Mode** - Claro e clean

Alternar em: **Configurações** > **Tema**

---

## 📊 MONITORAMENTO

### Logs do Supabase

```sql
-- Ver tentativas de login
SELECT * FROM login_audit
ORDER BY logged_in_at DESC
LIMIT 20;

-- Ver registros de ponto
SELECT * FROM time_records
ORDER BY punch_time DESC
LIMIT 20;
```

### Analytics do Vercel

- Performance metrics
- Error tracking
- Usage statistics

---

## 🆘 SUPORTE

### Problemas Comuns

**❌ Tabela não existe**

```
Solução: Execute supabase-schema-complete.sql no Supabase
```

**❌ Usuário não encontrado**

```
Solução: Execute setup-database.sql no Supabase
```

**❌ CORS Error**

```
Solução: Adicione URL no Supabase > Authentication > URL Configuration
```

**❌ Build falha**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📄 LICENÇA

Este projeto é propriedade da Prefeitura Municipal.

---

## 👨‍💻 DESENVOLVIMENTO

### Requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase (gratuita)
- Conta Vercel (gratuita)

### Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- React Router
- React Query

---

## 🎉 CONCLUSÃO

Sistema **100% funcional**, **100% responsivo** e **pronto para produção**!

### Links Úteis

- 📖 [Setup Rápido](GUIA_SETUP_RAPIDO.md)
- 🚀 [Deploy Vercel](GUIA_DEPLOY_VERCEL.md)
- 🧪 [Guia de Testes](GUIA_TESTES_COMPLETO.md)
- 🗄️ [Schema SQL](supabase-schema-complete.sql)
- 👥 [Usuários de Teste](setup-database.sql)

---

**Desenvolvido com ❤️ para a Prefeitura Municipal**
