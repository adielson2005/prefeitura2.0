-- ================================================
-- FIX: Políticas RLS para tabela login_audit (SEM RECURSÃO)
-- ================================================
-- PROBLEMA: Policy que consulta tabela users causa recursão
-- SOLUÇÃO: Permitir INSERT público para auditoria de login
-- ================================================

-- Ativar RLS na tabela login_audit
ALTER TABLE public.login_audit ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas
DROP POLICY IF EXISTS "Usuários veem próprios logins" ON public.login_audit;
DROP POLICY IF EXISTS "Admins veem todos logins" ON public.login_audit;
DROP POLICY IF EXISTS "Service role acesso total login_audit" ON public.login_audit;
DROP POLICY IF EXISTS "Public insert for login audit" ON public.login_audit;
DROP POLICY IF EXISTS "Authenticated read own" ON public.login_audit;

-- ================================================
-- POLÍTICAS SEGURAS
-- ================================================

-- 1. Service role acesso total
CREATE POLICY "Service role acesso total"
ON public.login_audit FOR ALL
TO authenticated
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- 2. Permitir INSERT público (necessário para registrar tentativas de login)
-- Usuários anônimos precisam poder criar registros de auditoria
CREATE POLICY "Public insert for login audit"
ON public.login_audit FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Usuários autenticados podem ver próprios logs
CREATE POLICY "Usuários veem próprios logins"
ON public.login_audit FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ================================================
-- NOTA: Admins devem acessar via service_role no backend
-- ================================================
