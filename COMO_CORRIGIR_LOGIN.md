# 🔧 GUIA RÁPIDO: Corrigir Erro de Login

## ❌ Erro que você está vendo:

```
infinite recursion detected in policy for relation "users"
```

## ✅ Solução em 4 Passos Simples

### 📋 Instruções:

1. **Abra o Supabase**: https://supabase.com/dashboard
2. **Vá em SQL Editor** (menu lateral esquerdo)
3. **Execute os scripts NA ORDEM** (copie e cole um de cada vez):

---

### **PASSO 1:** Limpar políticas antigas

```sql
-- Copie e execute TODO este bloco:

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_audit DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON public.users;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.users;
DROP POLICY IF EXISTS "Admins podem ver todos usuários" ON public.users;
DROP POLICY IF EXISTS "Admins podem inserir usuários" ON public.users;
DROP POLICY IF EXISTS "Admins podem atualizar usuários" ON public.users;
DROP POLICY IF EXISTS "Admins podem deletar usuários" ON public.users;
DROP POLICY IF EXISTS "Service role acesso total" ON public.users;
DROP POLICY IF EXISTS "Public read access" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Usuários veem próprio perfil" ON public.users;
DROP POLICY IF EXISTS "Usuários atualizam próprio perfil" ON public.users;
DROP POLICY IF EXISTS "Public read for authentication" ON public.users;
DROP POLICY IF EXISTS "Usuários veem próprios logins" ON public.login_audit;
DROP POLICY IF EXISTS "Admins veem todos logins" ON public.login_audit;
DROP POLICY IF EXISTS "Service role acesso total login_audit" ON public.login_audit;
DROP POLICY IF EXISTS "Service role acesso total" ON public.login_audit;
DROP POLICY IF EXISTS "Public insert for login audit" ON public.login_audit;
DROP POLICY IF EXISTS "Authenticated read own" ON public.login_audit;
```

---

### **PASSO 2:** Reativar RLS

```sql
-- Copie e execute:

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_audit ENABLE ROW LEVEL SECURITY;
```

---

### **PASSO 3:** Criar políticas para USERS

```sql
-- Copie e execute TODO este bloco:

CREATE POLICY "Service role acesso total"
ON public.users FOR ALL
TO authenticated
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

CREATE POLICY "Public read for authentication"
ON public.users FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Usuários veem próprio perfil"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Usuários atualizam próprio perfil"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

---

### **PASSO 4:** Criar políticas para LOGIN_AUDIT

```sql
-- Copie e execute TODO este bloco:

CREATE POLICY "Service role acesso total"
ON public.login_audit FOR ALL
TO authenticated
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

CREATE POLICY "Public insert for login audit"
ON public.login_audit FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Usuários veem próprios logins"
ON public.login_audit FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

---

## 🎉 PRONTO!

Agora:

1. **Recarregue** a aplicação (F5)
2. **Tente fazer login** novamente
3. ✅ **Deve funcionar!**

---

## ⚠️ Se ainda der erro:

- Verifique se executou TODOS os 4 passos NA ORDEM
- Recarregue a página (F5)
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Teste em aba anônima

---

## 📝 Alternativa: Usar arquivos separados

Se preferir, pode executar os arquivos na ordem:

1. `PASSO_1_limpar.sql`
2. `PASSO_2_reativar_rls.sql`
3. `PASSO_3_policies_users.sql`
4. `PASSO_4_policies_login_audit.sql`
