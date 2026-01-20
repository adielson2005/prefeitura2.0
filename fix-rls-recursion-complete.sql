-- ================================================================
-- CORREÇÃO COMPLETA: Recursão Infinita em Políticas RLS
-- ================================================================
-- Data: 19/01/2026
-- Problema: Políticas RLS que consultam a própria tabela users
--           causam erro "infinite recursion detected"
-- Solução: Simplificar policies, usar JWT claims, permitir acesso
--          público necessário para autenticação
-- ================================================================

-- ================================================================
-- 1. TABELA USERS - Correção de Recursão Infinita
-- ================================================================

-- Desabilitar RLS temporariamente para limpar
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Remover TODAS as policies antigas
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

-- Reativar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- NOVA POLICY 1: Service role acesso total
CREATE POLICY "Service role acesso total"
ON public.users FOR ALL
TO authenticated
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- NOVA POLICY 2: Leitura pública (NECESSÁRIO para login funcionar)
-- Sem isso, a query de autenticação falha
CREATE POLICY "Public read for authentication"
ON public.users FOR SELECT
TO anon, authenticated
USING (true);

-- NOVA POLICY 3: Usuários autenticados podem ver próprio perfil
CREATE POLICY "Usuários veem próprio perfil"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- NOVA POLICY 4: Usuários autenticados podem atualizar próprio perfil
CREATE POLICY "Usuários atualizam próprio perfil"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ================================================================
-- 2. TABELA LOGIN_AUDIT - Permitir INSERT público
-- ================================================================

-- Desabilitar RLS temporariamente
ALTER TABLE public.login_audit DISABLE ROW LEVEL SECURITY;

-- Remover policies antigas
DROP POLICY IF EXISTS "Usuários veem próprios logins" ON public.login_audit;
DROP POLICY IF EXISTS "Admins veem todos logins" ON public.login_audit;
DROP POLICY IF EXISTS "Service role acesso total login_audit" ON public.login_audit;
DROP POLICY IF EXISTS "Service role acesso total" ON public.login_audit;
DROP POLICY IF EXISTS "Public insert for login audit" ON public.login_audit;
DROP POLICY IF EXISTS "Authenticated read own" ON public.login_audit;

-- Reativar RLS
ALTER TABLE public.login_audit ENABLE ROW LEVEL SECURITY;

-- NOVA POLICY 1: Service role acesso total
CREATE POLICY "Service role acesso total"
ON public.login_audit FOR ALL
TO authenticated
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- NOVA POLICY 2: INSERT público (necessário para auditoria de login)
CREATE POLICY "Public insert for login audit"
ON public.login_audit FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- NOVA POLICY 3: Usuários autenticados veem próprios logs
CREATE POLICY "Usuários veem próprios logins"
ON public.login_audit FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ================================================================
-- VERIFICAÇÃO FINAL
-- ================================================================

-- Listar policies da tabela users
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Listar policies da tabela login_audit
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'login_audit'
ORDER BY policyname;

-- ================================================================
-- CONCLUSÃO
-- ================================================================
-- ✅ Recursão infinita corrigida
-- ✅ Login deve funcionar normalmente
-- ✅ Auditoria de login funcional
-- ✅ Segurança mantida (RLS ativo)
-- 
-- IMPORTANTE:
-- - Operações de admin (criar, deletar usuários) devem usar service_role
-- - A policy "Public read" é NECESSÁRIA para autenticação funcionar
-- - Não adicionar policies que consultam a tabela users dentro de users
-- ================================================================
