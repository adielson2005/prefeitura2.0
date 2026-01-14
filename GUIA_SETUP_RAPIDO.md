# 🚀 GUIA DE SETUP RÁPIDO - Sistema de Ponto

## ✅ CHECKLIST DE CONFIGURAÇÃO

### 1️⃣ Configurar Supabase

1. **Acesse o Supabase Dashboard**: https://app.supabase.com
2. **Selecione seu projeto** (ou crie um novo)
3. **Execute os scripts SQL** na seguinte ordem:

#### Script 1: Criar Schema Completo

📁 Arquivo: `supabase-schema-complete.sql`

- Vá em **SQL Editor** > **New query**
- Cole todo o conteúdo do arquivo
- Clique em **Run**

#### Script 2: Criar Usuários de Teste

📁 Arquivo: `setup-database.sql`

- Vá em **SQL Editor** > **New query**
- Cole todo o conteúdo do arquivo
- Clique em **Run**

### 2️⃣ Configurar Variáveis de Ambiente

Já está configurado em `.env.local`:

```env
VITE_SUPABASE_URL=https://gokqtsgmkcposhtxlkju.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Verificado e funcionando!**

### 3️⃣ Iniciar o Sistema

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O sistema estará disponível em: **http://localhost:5173**

---

## 👤 CREDENCIAIS DE TESTE

Todos os usuários usam a senha: **`senha123`**

### 🛡️ **ENCARREGADO (Administrador)**

- **Usuário:** `encarregado`
- **Senha:** `senha123`
- **Acesso:** Painel administrativo completo

### 👔 **GERENTE**

- **Usuário:** `gerente`
- **Senha:** `senha123`
- **Acesso:** Painel administrativo completo

### 👮 **SUPERVISOR**

- **Usuário:** `supervisor`
- **Senha:** `senha123`
- **Acesso:** Painel administrativo completo

### 👷 **FUNCIONÁRIOS**

**VIGIA:**

- **Usuário:** `funcionario`
- **Senha:** `senha123`
- **Acesso:** Portal do Funcionário

**VIGILANTE:**

- **Usuário:** `vigilante`
- **Senha:** `senha123`
- **Acesso:** Portal do Funcionário

**GUARDA:**

- **Usuário:** `guarda`
- **Senha:** `senha123`
- **Acesso:** Portal do Funcionário

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Portal do Encarregado/Administrador

- ✅ Dashboard com estatísticas
- ✅ Gestão de Vigias, Vigilantes e Guardas
- ✅ Gestão de Supervisores
- ✅ Registro de Ponto
- ✅ Gestão de Escalas
- ✅ Gestão de Áreas
- ✅ Relatórios
- ✅ Configurações
- ✅ Perfil
- ✅ Notificações
- ✅ Segurança
- ✅ Busca

### ✅ Portal do Funcionário

- ✅ Dashboard simplificado
- ✅ Registro de Ponto com GPS
- ✅ Visualização de Escala
- ✅ Histórico de Registros
- ✅ Perfil
- ✅ Configurações

### ✅ Sistema de Autenticação

- ✅ Login com Supabase
- ✅ Auditoria de Logins
- ✅ Controle de Sessão
- ✅ Proteção de Rotas por Role
- ✅ Hash SHA-256 de senhas

### ✅ Responsividade

- ✅ Layout Desktop
- ✅ Layout Mobile
- ✅ Navbar Mobile
- ✅ Theme Dark/Light

---

## 📱 COMO TESTAR

### Teste 1: Login como Encarregado

1. Acesse http://localhost:5173
2. Clique em "Credencial Encarregado"
3. Use: `encarregado` / `senha123`
4. Você será redirecionado para o Dashboard Admin

### Teste 2: Login como Funcionário

1. Acesse http://localhost:5173
2. Clique em "Credencial Funcionário"
3. Use: `funcionario` / `senha123`
4. Você será redirecionado para o Portal do Funcionário

### Teste 3: Registro de Ponto (Funcionário)

1. Faça login como funcionário
2. Vá em "Ponto" no menu
3. Clique em um dos botões (Entrada, Intervalo, Retorno, Saída)
4. Confirme a geolocalização
5. O registro será salvo no Supabase

### Teste 4: Auditoria de Logins

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor** > `login_audit`
3. Veja todos os registros de login

---

## 🔧 PROBLEMAS COMUNS

### ❌ Erro: "Tabela não existe"

**Solução:** Execute o arquivo `supabase-schema-complete.sql` no SQL Editor do Supabase

### ❌ Erro: "Usuário não encontrado"

**Solução:** Execute o arquivo `setup-database.sql` no SQL Editor do Supabase

### ❌ Erro: "VITE_SUPABASE_URL não configurada"

**Solução:** Verifique se existe o arquivo `.env.local` na raiz do projeto

### ❌ Erro de CORS

**Solução:** Configure a URL permitida no Supabase:

- Dashboard > Authentication > URL Configuration
- Adicione: `http://localhost:5173`

---

## 🚀 DEPLOY NO VERCEL

### Passo 1: Push para GitHub

```bash
git add .
git commit -m "Setup completo do sistema"
git push origin main
```

### Passo 2: Deploy no Vercel

1. Acesse https://vercel.com
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em Deploy

### Passo 3: Configurar CORS no Supabase

- Dashboard > Authentication > URL Configuration
- Adicione a URL do Vercel (ex: `https://seu-app.vercel.app`)

---

## 📊 VERIFICAR DADOS NO SUPABASE

### Ver todos os usuários

```sql
SELECT username, full_name, role, email, active
FROM users
ORDER BY role DESC;
```

### Ver tentativas de login

```sql
SELECT
  username,
  success,
  error_message,
  logged_in_at,
  browser,
  os
FROM login_audit
ORDER BY logged_in_at DESC
LIMIT 20;
```

### Ver registros de ponto

```sql
SELECT
  u.full_name,
  tr.punch_type,
  tr.punch_time,
  tr.location_lat,
  tr.location_lng
FROM time_records tr
JOIN users u ON u.id = tr.user_id
ORDER BY tr.punch_time DESC
LIMIT 20;
```

---

## ✅ TUDO PRONTO!

Agora o sistema está **100% funcional** e pronto para uso! 🎉

**Próximos passos:**

- [ ] Personalizar cores e logo
- [ ] Adicionar mais funcionalidades
- [ ] Fazer deploy em produção
- [ ] Treinar usuários

---

**Desenvolvido com ❤️ para a Prefeitura Municipal**
