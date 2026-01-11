# 🚀 Guia de Integração com Supabase

## 📋 Índice
1. [Configuração Inicial](#1-configuração-inicial)
2. [Criar Banco de Dados](#2-criar-banco-de-dados)
3. [Configurar Variáveis de Ambiente](#3-configurar-variáveis-de-ambiente)
4. [Testar Conexão](#4-testar-conexão)
5. [Migrar Autenticação](#5-migrar-autenticação)
6. [Próximos Passos](#6-próximos-passos)

---

## 1. Configuração Inicial

### 1.1 Criar Conta no Supabase

1. Acesse https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub ou email
4. Clique em **"New Project"**

### 1.2 Criar Novo Projeto

```
Nome do Projeto: prefeitura-ponto
Senha do Banco: [escolha uma senha forte]
Região: South America (São Paulo)
Plano: Free (ou superior se necessário)
```

Aguarde 2-3 minutos enquanto o projeto é provisionado.

---

## 2. Criar Banco de Dados

### 2.1 Acessar SQL Editor

1. No painel do Supabase, clique em **"SQL Editor"** no menu lateral
2. Clique em **"New Query"**
3. Abra o arquivo `supabase-schema.sql` deste projeto
4. **Copie TODO o conteúdo** do arquivo
5. **Cole no SQL Editor** do Supabase
6. Clique em **"Run"** (ou pressione `Ctrl+Enter`)

✅ Você verá mensagens de sucesso confirmando a criação de:
- Tabelas (users, time_records, shifts, notifications, security_codes)
- Índices
- Políticas RLS (Row Level Security)
- Dados iniciais (usuários de teste)

### 2.2 Verificar Criação

1. Clique em **"Table Editor"** no menu lateral
2. Você deve ver 5 tabelas:
   - `users`
   - `time_records`
   - `shifts`
   - `notifications`
   - `security_codes`

---

## 3. Configurar Variáveis de Ambiente

### 3.1 Obter Credenciais

1. No Supabase, clique em **Settings** (⚙️) no menu lateral
2. Clique em **API**
3. Você verá:
   - **URL do Projeto**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (chave longa)

### 3.2 Configurar .env.local

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores:

```env
# Cole sua URL aqui (ex: https://abcdefgh.supabase.co)
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co

# Cole sua anon key aqui
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Salve o arquivo**

⚠️ **IMPORTANTE**: Nunca compartilhe o arquivo `.env.local` ou faça commit dele no Git!

---

## 4. Testar Conexão

### 4.1 Reiniciar Servidor

```bash
# Parar o servidor (Ctrl+C no terminal)
# Iniciar novamente
npm run dev
```

### 4.2 Verificar no Console

Abra o console do navegador (F12):
- ✅ Não deve haver erros sobre variáveis de ambiente
- ✅ O sistema deve carregar normalmente

### 4.3 Testar Login

Use os usuários criados automaticamente:

```
👤 Administrador:
   Usuário: teste
   Senha: 123

👤 Vigia:
   Usuário: vigia
   Senha: 123

👤 Vigilante:
   Usuário: vigilante
   Senha: 123

👤 Guarda:
   Usuário: guarda
   Senha: 123
```

---

## 5. Migrar Autenticação

### 5.1 Atualizar Login.tsx

Substitua o import da autenticação:

```typescript
// ANTES:
import { login } from "@/lib/secureAuth";

// DEPOIS:
import { loginWithSupabase } from "@/lib/supabaseAuth";
```

E atualize a função de login:

```typescript
// ANTES:
const result = await login(username, password);

// DEPOIS:
const result = await loginWithSupabase(username, password);
```

### 5.2 Funções Disponíveis

O arquivo `supabaseAuth.ts` fornece:

```typescript
// Autenticação
loginWithSupabase(username, password)
logout()
isAuthenticated()
getCurrentUser()

// Registro de Ponto
registerTimeRecord(userId, punchType, location, notes)
getTimeRecords(userId, startDate, endDate)

// Escalas
getUserShifts(userId, month, year)

// Perfil
updateUserProfile(userId, updates)
changePassword(userId, currentPassword, newPassword)

// Segurança
generateSecurityCode(userId, purpose)
validateSecurityCode(userId, code, purpose)

// Notificações
getUserNotifications(userId)
markNotificationAsRead(notificationId)
```

---

## 6. Próximos Passos

### 6.1 Integrar Páginas

Atualize as páginas para usar Supabase:

#### Ponto.tsx
```typescript
import { registerTimeRecord } from '@/lib/supabaseAuth';

const handleRegistrarPonto = async (tipo: PunchType) => {
  const user = getCurrentUser();
  const result = await registerTimeRecord(
    user.id,
    tipo,
    { latitude: lat, longitude: lng, name: 'Local' },
    'Registro via app'
  );
  
  if (result.success) {
    toast({ title: '✅ Ponto registrado!' });
  }
};
```

#### Historico.tsx
```typescript
import { getTimeRecords } from '@/lib/supabaseAuth';

useEffect(() => {
  async function loadRecords() {
    const user = getCurrentUser();
    const result = await getTimeRecords(user.id);
    
    if (result.success) {
      setRegistros(result.data);
    }
  }
  loadRecords();
}, []);
```

#### Perfil.tsx
```typescript
import { updateUserProfile } from '@/lib/supabaseAuth';

const handleSalvar = async () => {
  const user = getCurrentUser();
  const result = await updateUserProfile(user.id, {
    email_pessoal: emailPessoal,
    telefone_celular: telefone
  });
  
  if (result.success) {
    toast({ title: '✅ Perfil atualizado!' });
  }
};
```

### 6.2 Segurança de Produção

Antes de ir para produção:

1. **Alterar senhas padrão**:
```sql
-- No SQL Editor do Supabase
UPDATE users 
SET password_hash = '[hash da nova senha]'
WHERE username = 'admin';
```

2. **Configurar RLS** adequadamente
3. **Adicionar rate limiting**
4. **Configurar backups automáticos**
5. **Habilitar 2FA para administradores**

### 6.3 Recursos Adicionais

- 📚 [Documentação Supabase](https://supabase.com/docs)
- 🔐 [Guia de Segurança](https://supabase.com/docs/guides/auth)
- 💾 [Backups](https://supabase.com/docs/guides/platform/backups)
- 📊 [Logs e Monitoring](https://supabase.com/docs/guides/platform/logs)

---

## 🆘 Problemas Comuns

### Erro: "Cannot find module supabase"

```bash
npm install @supabase/supabase-js
```

### Erro: "VITE_SUPABASE_URL is not defined"

- Verifique se o arquivo `.env.local` está na **raiz do projeto**
- Reinicie o servidor de desenvolvimento
- Verifique se as variáveis começam com `VITE_`

### Erro de CORS

- No Supabase: Settings > API > CORS Origins
- Adicione: `http://localhost:8081`

### Erro de RLS (Row Level Security)

- Temporariamente desabilite RLS para testar:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

- Depois habilite novamente e configure as políticas corretas

---

## ✅ Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Schema SQL executado
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor reiniciado
- [ ] Login testado com usuário de teste
- [ ] Dados aparecendo no Table Editor
- [ ] Console sem erros

**Pronto! Seu sistema agora está conectado ao Supabase!** 🎉
