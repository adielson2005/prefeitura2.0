# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Planejado

- Reconhecimento facial para validação
- Aplicativo mobile nativo (React Native)
- Relatórios avançados com BI
- API REST documentada (Swagger)

---

## [1.0.0] - 2026-01-11

### 🎉 Lançamento Inicial

#### ✨ Adicionado

**Autenticação e Segurança**

- Sistema de login com username/senha
- Hash de senha com SHA-256
- Auditoria completa de logins (IP, dispositivo, navegador, SO)
- Sistema de recuperação de senha
- Controle de sessão
- Diferentes níveis de acesso (VIGIA, VIGILANTE, GUARDA, SUPERVISOR, GERENTE, ADMINISTRADOR)

**Registro de Ponto**

- Registro de ENTRADA, INTERVALO, RETORNO e SAÍDA
- Captura automática de geolocalização GPS
- Upload de foto para validação
- Validação de registros por supervisores
- Histórico completo de registros
- Edição e correção de registros com justificativa

**Dashboard e Relatórios**

- Dashboard interativo com estatísticas em tempo real
- Gráficos de horas trabalhadas com Recharts
- Relatórios personalizáveis por período
- Exportação de dados (planejado para próximas versões)
- Análise de frequência e pontualidade

**Gestão de Escalas**

- Criação e edição de escalas de trabalho
- Confirmação de turnos pelos funcionários
- Visualização em calendário
- Status de escalas (PENDENTE, CONFIRMADO, CANCELADO)

**Notificações**

- Sistema de notificações em tempo real
- Alertas de escala próxima
- Lembretes de registro de ponto
- Configuração personalizada de canais (email, push, SMS)

**Gestão de Usuários**

- CRUD completo de usuários para administradores
- Gerenciamento de permissões
- Ativação/desativação de contas
- Histórico de atividades

**Interface e UX**

- Design responsivo (desktop, tablet, mobile)
- Tema dark/light com persistência
- Componentes acessíveis com Radix UI
- Navegação intuitiva
- Feedback visual para todas as ações

**Infraestrutura**

- Progressive Web App (PWA)
- Modo offline com Dexie.js
- Build otimizado com Vite
- TypeScript para type safety
- Supabase como backend

#### 🛠️ Tecnologias Utilizadas

**Frontend**

- React 18.3.1
- TypeScript 5.6.2
- Vite 6.0.5
- Tailwind CSS 3.4.17
- shadcn/ui
- Radix UI
- React Router 7.1.3
- TanStack Query 5.83.0
- React Hook Form 7.54.2
- Zod 3.24.1
- date-fns 3.6.0
- Recharts 2.15.0
- Lucide React 0.469.0

**Backend / Database**

- Supabase 2.89.0
- PostgreSQL (via Supabase)
- Dexie.js 4.2.1 (IndexedDB)

**DevOps**

- ESLint 9.18.0
- Vite PWA Plugin 0.21.4

#### 📚 Documentação

- README completo com instruções de instalação
- Guia de contribuição (CONTRIBUTING.md)
- Schema SQL documentado
- Queries úteis para auditoria
- Múltiplos guias técnicos (LOGIN, SUPABASE, PWA, etc)

#### 🗃️ Banco de Dados

**Tabelas Criadas**

- `users` - Usuários do sistema
- `time_records` - Registros de ponto
- `shifts` - Escalas de trabalho
- `notifications` - Notificações
- `security_codes` - Códigos de segurança
- `login_audit` - Auditoria de logins

**Tipos Enum**

- `user_role` - Papéis de usuário
- `punch_type` - Tipos de registro de ponto
- `shift_status` - Status de escalas

**Funcionalidades do Banco**

- Índices otimizados para consultas rápidas
- Validação de dados com constraints
- Relacionamentos com CASCADE
- Timestamps automáticos
- UUIDs como chave primária

#### 🔒 Segurança

- Senhas hasheadas (SHA-256)
- Proteção contra SQL Injection (via Supabase)
- HTTPS enforced
- CORS configurado
- Validação de inputs no frontend e backend
- Auditoria completa de acessos

#### 📱 PWA Features

- Instalável em dispositivos
- Funciona offline
- Ícones para diferentes plataformas
- Manifest.json configurado
- Service Worker para cache
- Página offline customizada

---

## [0.9.0] - 2026-01-05

### Adicionado

- Protótipo inicial do dashboard
- Sistema básico de autenticação
- Estrutura de componentes shadcn/ui

### Alterado

- Migração de JavaScript para TypeScript
- Atualização de dependências

---

## [0.5.0] - 2025-12-15

### Adicionado

- Configuração inicial do projeto
- Setup do Vite + React
- Instalação do Tailwind CSS
- Estrutura básica de pastas

---

## Tipos de Mudanças

- `✨ Adicionado` - Para novas funcionalidades
- `🔧 Alterado` - Para mudanças em funcionalidades existentes
- `🗑️ Depreciado` - Para funcionalidades que serão removidas
- `🚫 Removido` - Para funcionalidades removidas
- `🐛 Corrigido` - Para correção de bugs
- `🔒 Segurança` - Para correções de vulnerabilidades

---

## Links

- [Repositório](https://github.com/seu-usuario/prefeiturarelatorioponto)
- [Issues](https://github.com/seu-usuario/prefeiturarelatorioponto/issues)
- [Pull Requests](https://github.com/seu-usuario/prefeiturarelatorioponto/pulls)

---

**Nota**: Para ver mudanças detalhadas, consulte os [commits](https://github.com/seu-usuario/prefeiturarelatorioponto/commits/main) no GitHub.
