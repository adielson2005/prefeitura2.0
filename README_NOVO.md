<div align="center">

# 🏛️ Sistema de Ponto Eletrônico

### Prefeitura Municipal

Sistema completo de gerenciamento de ponto eletrônico para servidores municipais

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)

</div>

---

## ⚡ Início Rápido (5 minutos)

```bash
# Windows (PowerShell)
.\install.ps1

# Linux/Mac
chmod +x install.sh && ./install.sh
```

**Ou manualmente:**

```bash
# 1. Instalar dependências
npm install

# 2. Configurar Supabase (executar SQL)
# Ver: SETUP_DATABASE.md

# 3. Configurar variáveis
cp .env.local.example .env.local
# Editar .env.local

# 4. Rodar
npm run dev
```

**Login padrão**: `admin` / `admin123`

📚 **Documentação completa**: [INICIO_RAPIDO.md](INICIO_RAPIDO.md)

---

## 🎯 O que é este sistema?

Sistema web moderno para registro e gerenciamento de ponto eletrônico de servidores municipais (vigias, vigilantes, guardas, supervisores).

### ✅ Funcionalidades Implementadas

- ✅ **Login com Auditoria** - Rastreamento completo (browser, OS, device)
- ✅ **Registro de Ponto** - Entrada/Intervalo/Retorno/Saída com GPS
- ✅ **Histórico** - Consulta de registros passados com filtros
- ✅ **Dashboard** - Estatísticas em tempo real
- ✅ **Tema Dark/Light** - Interface personalizável
- ✅ **Responsivo** - Mobile, tablet e desktop

### 🚧 Em Desenvolvimento

- 🚧 Perfil do Usuário
- 🚧 Sistema de Notificações
- 🚧 Gestão de Escalas
- 🚧 Aprovação de Pontos (Encarregado)
- 🚧 Relatórios Avançados

---

## 📂 Estrutura do Projeto

```
prefeiturarelatorioponto/
├── src/                              # Frontend React
│   ├── modules/employee/             # Módulo Funcionário
│   │   └── pages/
│   │       ├── Dashboard.tsx         # ✅ Dashboard
│   │       ├── Ponto.tsx             # ✅ Registro de ponto
│   │       ├── Historico.tsx         # ✅ Histórico
│   │       ├── Perfil.tsx            # 🚧 Perfil
│   │       └── ...
│   ├── lib/
│   │   ├── supabaseClient.ts         # Cliente Supabase
│   │   └── supabaseAuth.ts           # Funções de autenticação
│   └── ...
│
├── meu-saas-backend/                 # Backend NestJS (opcional)
│   ├── src/
│   │   ├── auth/                     # Autenticação
│   │   ├── users/                    # Usuários
│   │   ├── time-records/             # Registros de ponto
│   │   └── supabase/                 # Supabase client
│   └── SETUP_BACKEND.md
│
├── supabase-schema-complete.sql      # Schema do banco (IMPORTANTE!)
├── SETUP_DATABASE.md                 # Guia de configuração do Supabase
├── INICIO_RAPIDO.md                  # Início em 5 minutos
├── README_COMPLETO.md                # Documentação detalhada
├── CHECKLIST_CONFIGURACAO.md         # Checklist de verificação
└── .env.local.example                # Exemplo de variáveis
```

---

## 🏗️ Arquitetura

```
┌─────────────────────┐
│  Frontend (React)   │
│   Port: 5173        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Supabase Client    │
│  (Direct Connect)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Supabase Database  │
│   PostgreSQL        │
│   6 tables          │
└─────────────────────┘

Opcional:
┌─────────────────────┐
│  Backend (NestJS)   │
│   Port: 3000        │
│   API REST          │
└─────────────────────┘
```

### Tecnologias

**Frontend:**

- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Router v7
- Supabase JS Client

**Backend (Opcional):**

- NestJS
- TypeScript
- Supabase Integration

**Database:**

- Supabase (PostgreSQL)
- 6 tabelas principais
- Sistema de auditoria

---

## 📊 Banco de Dados

### Tabelas

1. **users** - Usuários do sistema (4 de teste)
2. **time_records** - Registros de ponto
3. **shifts** - Escalas de trabalho
4. **notifications** - Notificações
5. **security_codes** - Códigos de segurança 2FA
6. **login_audit** - Auditoria de logins

### Usuários de Teste

| Username     | Senha    | Role          |
| ------------ | -------- | ------------- |
| admin        | admin123 | ADMINISTRADOR |
| encarregado1 | enc123   | SUPERVISOR    |
| funcionario1 | func123  | VIGILANTE     |
| funcionario2 | func123  | VIGIA         |

---

## 🚀 Instalação Completa

### 1. Pré-requisitos

- Node.js 18+
- Conta no Supabase (gratuita)

### 2. Instalação Automática

**Windows:**

```powershell
.\install.ps1
```

**Linux/Mac:**

```bash
chmod +x install.sh
./install.sh
```

### 3. Configurar Supabase

Siga o guia: [SETUP_DATABASE.md](SETUP_DATABASE.md)

Resumo:

1. Criar projeto no [Supabase](https://supabase.com/)
2. Executar SQL: `supabase-schema-complete.sql`
3. Obter credenciais: Settings → API

### 4. Configurar Variáveis

Edite `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Rodar

```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 📚 Documentação

- 📘 [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Comece em 5 minutos
- 📗 [SETUP_DATABASE.md](SETUP_DATABASE.md) - Configuração Supabase completa
- 📕 [README_COMPLETO.md](README_COMPLETO.md) - Documentação técnica detalhada
- 📙 [CHECKLIST_CONFIGURACAO.md](CHECKLIST_CONFIGURACAO.md) - Verificação passo a passo
- 📔 [meu-saas-backend/SETUP_BACKEND.md](meu-saas-backend/SETUP_BACKEND.md) - Backend NestJS (opcional)

---

## 🧪 Como Testar

### Login

1. Abra http://localhost:5173
2. Username: `admin`
3. Password: `admin123`

### Registro de Ponto

1. Faça login como `funcionario1`
2. Vá em "Registro de Ponto"
3. Clique em "Registrar Entrada"
4. Verifique o registro na lista

### Histórico

1. Vá em "Histórico"
2. Veja registros agrupados por dia
3. Teste filtros de mês

---

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Rodar em desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

### Backend (opcional)

```bash
cd meu-saas-backend
npm run start:dev    # Rodar em desenvolvimento
npm run build        # Compilar
npm run start:prod   # Rodar em produção
```

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to Supabase"

✅ Verifique se `.env.local` existe  
✅ Confirme credenciais em `.env.local`  
✅ Reinicie: `npm run dev`

### Erro: "relation users does not exist"

✅ Execute o SQL completo no Supabase  
✅ Veja: [SETUP_DATABASE.md](SETUP_DATABASE.md)

### Login não funciona

✅ Teste: `admin` / `admin123`  
✅ Verifique se SQL foi executado  
✅ Veja console do navegador (F12)

**Mais soluções**: [CHECKLIST_CONFIGURACAO.md](CHECKLIST_CONFIGURACAO.md)

---

## 🔒 Segurança

### Desenvolvimento (atual)

- ✅ RLS desabilitado (facilita testes)
- ✅ Senhas com SHA-256
- ✅ Auditoria de logins

### Produção (TODO)

- ⚠️ Habilitar RLS no Supabase
- ⚠️ Configurar policies por role
- ⚠️ HTTPS obrigatório
- ⚠️ Rate limiting
- ⚠️ JWT com refresh tokens

---

## 🎯 Roadmap

### ✅ Fase 1 - MVP (Concluído)

- [x] Login e autenticação
- [x] Registro de ponto
- [x] Histórico
- [x] Dashboard básico
- [x] Auditoria de login

### 🚧 Fase 2 - Funcionalidades (Em andamento)

- [x] Ponto.tsx integrado
- [x] Historico.tsx integrado
- [ ] Perfil.tsx integrado
- [ ] Notificações
- [ ] Escalas

### 📋 Fase 3 - Melhorias (Pendente)

- [ ] Relatórios avançados
- [ ] Aprovação de pontos
- [ ] Exportação de dados
- [ ] PWA
- [ ] Aplicativo mobile

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add: nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é propriedade da Prefeitura Municipal.  
Todos os direitos reservados.

---

## 🆘 Suporte

- 📧 Email: suporte@prefeitura.gov.br
- 📖 Documentação: [README_COMPLETO.md](README_COMPLETO.md)
- 🐛 Issues: [GitHub Issues](#)

---

<div align="center">

**Desenvolvido com ❤️ para a Prefeitura Municipal**

[⬆ Voltar ao topo](#-sistema-de-ponto-eletrônico)

</div>
