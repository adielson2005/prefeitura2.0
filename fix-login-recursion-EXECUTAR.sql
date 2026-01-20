-- ================================================================
-- CORREÇÃO: Recursão Infinita no Login
-- Execute este script no Supabase SQL Editor
-- ================================================================

-- PASSO 1: Limpar tabela USERS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

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

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- PASSO 2: Criar políticas corretas para USERS
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

-- PASSO 3: Limpar tabela LOGIN_AUDIT
ALTER TABLE public.login_audit DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários veem próprios logins" ON public.login_audit;
DROP POLICY IF EXISTS "Admins veem todos logins" ON public.login_audit;
DROP POLICY IF EXISTS "Service role acesso total login_audit" ON public.login_audit;
DROP POLICY IF EXISTS "Service role acesso total" ON public.login_audit;
DROP POLICY IF EXISTS "Public insert for login audit" ON public.login_audit;
DROP POLICY IF EXISTS "Authenticated read own" ON public.login_audit;

ALTER TABLE public.login_audit ENABLE ROW LEVEL SECURITY;

-- PASSO 4: Criar políticas corretas para LOGIN_AUDIT
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
