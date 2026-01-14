# 🚀 GUIA DE DEPLOY - VERCEL

## 📋 PRÉ-REQUISITOS

- ✅ Conta no GitHub
- ✅ Conta no Vercel (gratuita)
- ✅ Conta no Supabase (gratuita)
- ✅ Código commitado no GitHub

---

## 🔧 PASSO 1: PREPARAR O BANCO DE DADOS

### 1.1 Executar Scripts SQL no Supabase

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **SQL Editor** > **New query**

**Primeiro**: Execute `supabase-schema-complete.sql`

```sql
-- Cole todo o conteúdo do arquivo
-- Clique em Run
```

**Segundo**: Execute `setup-database.sql`

```sql
-- Cole todo o conteúdo do arquivo
-- Clique em Run
```

### 1.2 Verificar Dados

```sql
-- Verificar usuários criados
SELECT username, full_name, role FROM users;

-- Resultado esperado: 6 usuários
```

---

## 📦 PASSO 2: PREPARAR O PROJETO

### 2.1 Commit Final

```bash
# Adicionar todos os arquivos
git add .

# Commit
git commit -m "feat: Sistema completo e pronto para produção"

# Push para GitHub
git push origin main
```

### 2.2 Verificar Build Local

```bash
# Testar build
npm run build

# Se houver erros, corrija antes de continuar
```

---

## 🌐 PASSO 3: DEPLOY NO VERCEL

### 3.1 Importar Projeto

1. Acesse https://vercel.com
2. Clique em **Add New** > **Project**
3. Selecione o repositório do GitHub
4. Clique em **Import**

### 3.2 Configurar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

```env
VITE_SUPABASE_URL=https://gokqtsgmkcposhtxlkju.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdva3F0c2dta2Nwb3NodHhsa2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzI3MzIsImV4cCI6MjA4Mjg0ODczMn0.t1ESAz_v7l--Ml6sCB-mWoPVRRv49P4YcDg9XzC-6t8
```

**⚠️ IMPORTANTE:**

- Marque todas as checkboxes: Production, Preview, Development
- Verifique se os valores estão corretos (sem espaços extras)

### 3.3 Configurações de Build

O Vercel detecta automaticamente, mas verifique:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.4 Deploy

1. Clique em **Deploy**
2. Aguarde o build (2-5 minutos)
3. Quando terminar, clique no link gerado

Exemplo de URL: `https://seu-projeto.vercel.app`

---

## 🔐 PASSO 4: CONFIGURAR CORS NO SUPABASE

### 4.1 Adicionar URL do Vercel

1. Acesse https://app.supabase.com
2. Vá em **Authentication** > **URL Configuration**
3. Em **Site URL**, adicione: `https://seu-projeto.vercel.app`
4. Em **Redirect URLs**, adicione:
   - `https://seu-projeto.vercel.app`
   - `https://seu-projeto.vercel.app/*`
5. Clique em **Save**

### 4.2 Configurar RLS (Row Level Security)

Se as tabelas tiverem RLS ativo, configure as policies:

```sql
-- Desabilitar RLS para login_audit (apenas para testes)
ALTER TABLE login_audit DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS para users (apenas para testes)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS para time_records (apenas para testes)
ALTER TABLE time_records DISABLE ROW LEVEL SECURITY;
```

**⚠️ EM PRODUÇÃO:** Configure policies adequadas em vez de desabilitar RLS!

---

## ✅ PASSO 5: TESTAR EM PRODUÇÃO

### 5.1 Teste de Login

1. Acesse `https://seu-projeto.vercel.app`
2. Clique em "Credencial Encarregado"
3. Login: `encarregado` / `senha123`
4. Deve redirecionar para dashboard

### 5.2 Teste Mobile

1. Abra no celular
2. Teste login como funcionário
3. Teste registro de ponto
4. Verifique navegação inferior

### 5.3 Verificar Auditoria

```sql
-- No Supabase, verificar logins
SELECT * FROM login_audit
ORDER BY logged_in_at DESC
LIMIT 10;
```

---

## 🔄 PASSO 6: CI/CD AUTOMÁTICO

### 6.1 Configuração Automática

O Vercel já está configurado para:

- ✅ Deploy automático a cada push na main
- ✅ Preview deploys para Pull Requests
- ✅ Rollback instantâneo se necessário

### 6.2 Branches

```bash
# Desenvolvimento
git checkout -b develop
git push origin develop

# Vercel criará preview automaticamente
```

---

## 📊 PASSO 7: MONITORAMENTO

### 7.1 Analytics do Vercel

1. Acesse o projeto no Vercel
2. Vá em **Analytics**
3. Monitore:
   - Visitas
   - Performance
   - Erros

### 7.2 Logs

1. Vá em **Functions** > **Logs**
2. Monitore erros em tempo real

---

## 🛠️ PASSO 8: DOMÍNIO CUSTOMIZADO (OPCIONAL)

### 8.1 Adicionar Domínio

1. No Vercel, vá em **Settings** > **Domains**
2. Clique em **Add**
3. Digite seu domínio: `exemplo.prefeitura.gov.br`
4. Siga as instruções para configurar DNS

### 8.2 Configurar DNS

No seu provedor de DNS, adicione:

```
Type: CNAME
Name: exemplo
Value: cname.vercel-dns.com
```

### 8.3 Atualizar Supabase

Adicione o novo domínio nas URLs permitidas do Supabase.

---

## 🔐 PASSO 9: SEGURANÇA

### 9.1 HTTPS

✅ Automático no Vercel (Let's Encrypt)

### 9.2 Headers de Segurança

Criar `vercel.json` na raiz:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📱 PASSO 10: PWA (OPCIONAL)

### 10.1 Adicionar ao Home Screen

**iOS:**

1. Abra no Safari
2. Toque em "Compartilhar"
3. "Adicionar à Tela de Início"

**Android:**

1. Abra no Chrome
2. Menu > "Adicionar à tela inicial"
3. Confirme

---

## 🎉 CONCLUSÃO

Seu sistema está:

- ✅ **ONLINE** em produção
- ✅ **SEGURO** com HTTPS
- ✅ **RÁPIDO** com CDN global
- ✅ **ESCALÁVEL** automaticamente
- ✅ **MONITORADO** 24/7

---

## 🆘 TROUBLESHOOTING

### ❌ Build Failed

```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ❌ Variáveis de Ambiente não funcionam

1. Verifique se começam com `VITE_`
2. Redeploy após adicionar variáveis
3. Limpe cache do navegador

### ❌ CORS Error

1. Adicione URL do Vercel no Supabase
2. Aguarde 5 minutos
3. Limpe cache

### ❌ 404 nas Rotas

Adicionar `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📞 SUPORTE

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev

---

**Sistema em produção! 🚀**
