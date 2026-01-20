<div align="center">

# 🏛️ Sistema de Ponto Eletrônico - Prefeitura Municipal

### Sistema completo de gerenciamento de ponto eletrônico para servidores municipais

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Demo ao Vivo](#) • [Documentação](./DOCUMENTACAO.md) • [Guia de Instalação](#-instalação) • [Roadmap](#-roadmap)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Como Usar](#-como-usar)
- [Screenshots](#-screenshots)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **Sistema de Ponto Eletrônico** é uma aplicação web completa desenvolvida para gerenciar o registro de ponto de servidores municipais (vigias, vigilantes, guardas e supervisores). O sistema oferece controle total sobre jornadas de trabalho, escalas, relatórios e auditoria de acessos.

### 🎨 Características Principais

- ✅ **Interface Moderna**: Design responsivo e intuitivo com tema dark/light
- ✅ **Autenticação Segura**: Sistema de login com auditoria completa e 2FA
- ✅ **Gestão de Ponto**: Registro de entrada, intervalo, retorno e saída com geolocalização
- ✅ **Dashboard Interativo**: Visualização em tempo real de estatísticas e relatórios
- ✅ **Gestão de Escalas**: Planejamento e confirmação de turnos de trabalho
- ✅ **Notificações**: Sistema de alertas em tempo real
- ✅ **Modo Offline**: Funciona sem internet com sincronização automática
- ✅ **PWA**: Instalável como aplicativo nativo em dispositivos móveis
- ✅ **Auditoria Completa**: Rastreamento de todas as ações e acessos

---

## ⚡ Funcionalidades

### 🔐 Autenticação e Segurança

- Login com username/senha com hash SHA-256
- Sistema de recuperação de senha por email
- Autenticação em dois fatores (2FA)
- Auditoria completa de logins (IP, dispositivo, navegador, SO)
- Controle de sessão e timeout automático
- Diferentes níveis de acesso (VIGIA, VIGILANTE, GUARDA, SUPERVISOR, GERENTE, ADMINISTRADOR)

### ⏰ Registro de Ponto

- Registro de ENTRADA, INTERVALO, RETORNO e SAÍDA
- Captura automática de localização GPS
- Upload de foto para validação
- Validação de registros por supervisores
- Histórico completo de registros
- Edição e correção de registros (com justificativa)

### 📊 Dashboard e Relatórios

- Visão geral de estatísticas em tempo real
- Gráficos de horas trabalhadas
- Relatórios personalizáveis por período
- Exportação de dados (PDF, Excel, CSV)
- Análise de frequência e pontualidade
- Alertas de inconsistências

### 📅 Gestão de Escalas

- Criação e edição de escalas de trabalho
- Confirmação de turnos pelos funcionários
- Notificações automáticas de escala
- Visualização em calendário
- Gerenciamento de trocas de turno

### 🔔 Notificações

- Notificações em tempo real
- Alertas de escala próxima
- Lembretes de registro de ponto
- Avisos de sistema
- Configuração personalizada de canais (email, push, SMS)

### 👥 Gestão de Usuários (Administradores)

- CRUD completo de usuários
- Gerenciamento de permissões
- Ativação/desativação de contas
- Histórico de atividades
- Importação em lote de usuários

---

## 🛠️ Tecnologias

### Frontend

- **[React 18](https://reactjs.org/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite](https://vitejs.dev/)** - Build tool e dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI reutilizáveis
- **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos acessíveis
- **[React Router](https://reactrouter.com/)** - Roteamento
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado assíncrono
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[date-fns](https://date-fns.org/)** - Manipulação de datas
- **[Recharts](https://recharts.org/)** - Gráficos e visualizações
- **[Lucide React](https://lucide.dev/)** - Ícones

### Backend / Database

- **[Supabase](https://supabase.com/)** - Backend as a Service (PostgreSQL)
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Dexie.js](https://dexie.org/)** - IndexedDB para modo offline

### DevOps & Tools

- **[ESLint](https://eslint.org/)** - Linter
- **[Prettier](https://prettier.io/)** - Formatador de código
- **[Vite PWA Plugin](https://vite-pwa-org.netlify.app/)** - Progressive Web App

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** ou **pnpm** - Gerenciador de pacotes
- **Git** - [Download](https://git-scm.com/)
- **Conta Supabase** (gratuita) - [Criar conta](https://supabase.com/)

### Verificar instalações:

```bash
node --version  # Deve retornar v18.x.x ou superior
npm --version   # Deve retornar 9.x.x ou superior
git --version   # Deve retornar 2.x.x ou superior
```

---

## 🚀 Instalação

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/prefeiturarelatorioponto.git
cd prefeiturarelatorioponto
```

### 2️⃣ Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3️⃣ Configure o banco de dados Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **SQL Editor** no painel lateral
3. Copie todo o conteúdo do arquivo `supabase-schema-complete.sql`
4. Cole no editor SQL e execute
5. Aguarde a criação de todas as tabelas

### 4️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

> 💡 **Onde encontrar essas informações:**
>
> - Acesse seu projeto no Supabase
> - Vá em **Settings** → **API**
> - Copie a **URL** e a **anon/public key**

### 5️⃣ Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:5173**

---

## ⚙️ Configuração

### Usuários de Teste

O schema SQL já cria 4 usuários de teste com senha `123`:

| Username    | Senha | Cargo         | Email                       |
| ----------- | ----- | ------------- | --------------------------- |
| `teste`     | `123` | ADMINISTRADOR | teste@prefeitura.gov.br     |
| `vigia`     | `123` | VIGIA         | vigia@prefeitura.gov.br     |
| `vigilante` | `123` | VIGILANTE     | vigilante@prefeitura.gov.br |
| `guarda`    | `123` | GUARDA        | guarda@prefeitura.gov.br    |

### Personalização

- **Tema**: Edite `src/index.css` para alterar cores
- **Logo**: Substitua os arquivos em `public/`
- **Textos**: Configure em `src/lib/constants.ts`

---

## 💻 Como Usar

### Login

1. Acesse o sistema em `http://localhost:5173`
2. Escolha o tipo de acesso:
   - **Portal do Encarregado**: Para supervisores e administradores
   - **Portal do Funcionário**: Para vigias, vigilantes e guardas
3. Digite seu username e senha
4. Clique em **Entrar**

### Registrar Ponto

1. Após o login, vá em **Registrar Ponto**
2. Selecione o tipo: ENTRADA, INTERVALO, RETORNO ou SAÍDA
3. Adicione observações (opcional)
4. Permita acesso à localização (se solicitado)
5. Clique em **Registrar**

### Visualizar Relatórios

1. Vá em **Dashboard** ou **Relatórios**
2. Selecione o período desejado
3. Visualize estatísticas e gráficos
4. Exporte para PDF/Excel se necessário

### Gerenciar Escalas

1. Acesse **Escalas**
2. Clique em **Nova Escala**
3. Preencha data, horário e local
4. Atribua funcionários
5. Salve e notifique

---

## 📸 Screenshots

<div align="center">

### 🏠 Página Inicial

![Página Inicial](./docs/images/home.png)

### 🔐 Login

![Login](./docs/images/login.png)

### 📊 Dashboard

![Dashboard](./docs/images/dashboard.png)

### ⏰ Registro de Ponto

![Registro de Ponto](./docs/images/registro-ponto.png)

### 📅 Gestão de Escalas

![Escalas](./docs/images/escalas.png)

### 📱 Versão Mobile

![Mobile](./docs/images/mobile.png)

</div>

> 📝 **Nota**: As screenshots serão adicionadas em breve. Para ver a aplicação em funcionamento, siga as [instruções de instalação](#-instalação).

---

## 📁 Estrutura do Projeto

```
prefeiturarelatorioponto/
├── public/                    # Arquivos públicos (PWA, manifest, ícones)
│   ├── manifest.json
│   ├── sw.js
│   └── offline.html
├── src/
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── layout/          # Layout (Header, Sidebar, Footer)
│   │   ├── dashboard/       # Componentes do dashboard
│   │   ├── timerecord/      # Registro de ponto
│   │   └── professionals/   # Gestão de profissionais
│   ├── hooks/               # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useTimeRecord.ts
│   │   └── useNotifications.ts
│   ├── lib/                 # Utilitários e configurações
│   │   ├── supabase.ts      # Cliente Supabase
│   │   ├── utils.ts         # Funções auxiliares
│   │   └── constants.ts     # Constantes
│   ├── pages/               # Páginas/Rotas
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── modules/             # Módulos de negócio
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globais
├── supabase-schema-complete.sql  # Schema do banco de dados
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🧪 Testes

### Rodar testes

```bash
npm run test
```

### Rodar testes em modo watch

```bash
npm run test:watch
```

### Cobertura de testes

```bash
npm run test:coverage
```

---

## 🚢 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Servidor Próprio

```bash
npm run build
# Os arquivos estarão em ./dist
# Configure seu servidor para servir esses arquivos
```

### Variáveis de Ambiente em Produção

Não esqueça de configurar as variáveis de ambiente no painel da sua plataforma de hosting:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Veja como você pode ajudar:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Padrão de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação de código
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de build/configuração

Exemplo:

```bash
git commit -m "feat: adiciona filtro de data no relatório"
git commit -m "fix: corrige bug no registro de ponto"
git commit -m "docs: atualiza README com novas instruções"
```

---

## 📝 Roadmap

### ✅ Implementado

- [x] Sistema de autenticação completo
- [x] Registro de ponto com geolocalização
- [x] Dashboard com estatísticas
- [x] Gestão de escalas
- [x] Sistema de notificações
- [x] Auditoria de logins
- [x] Modo offline com PWA
- [x] Interface responsiva

### 🚧 Em Desenvolvimento

- [ ] Reconhecimento facial para validação
- [ ] Aplicativo mobile nativo (React Native)
- [ ] Relatórios avançados com BI
- [ ] API REST documentada (Swagger)

### 📋 Planejado

- [ ] Integração com folha de pagamento
- [ ] Chat em tempo real
- [ ] Módulo de treinamentos
- [ ] Sistema de avaliações
- [ ] Backup automático

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

Desenvolvido para a **Prefeitura Municipal** com 💙

### Contato

- 📧 Email: contato@prefeitura.gov.br
- 🌐 Website: [prefeitura.gov.br](https://prefeitura.gov.br)
- 📱 Telefone: (00) 0000-0000

---

## 🙏 Agradecimentos

- [shadcn](https://twitter.com/shadcn) pelo incrível trabalho no shadcn/ui
- [Supabase](https://supabase.com) pela plataforma backend
- Comunidade open source

---

<div align="center">

**[⬆ Voltar ao topo](#-sistema-de-ponto-eletrônico---prefeitura-municipal)**

Feito com ❤️ para servidores municipais

</div>
