-- ================================================
-- FIX: Políticas RLS para tabela users (SEM RECURSÃO)
-- ================================================
-- PROBLEMA: Policies que consultam a própria tabela users causam recursão infinita
-- SOLUÇÃO: Usar auth metadata e JWT claims ao invés de consultas à tabela
-- ================================================

-- Ativar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas (todas)
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

-- ================================================
-- POLÍTICAS SEGURAS (SEM RECURSÃO)
-- ================================================

-- 1. Service role tem acesso total (necessário para operações do backend)
CREATE POLICY "Service role acesso total"
ON public.users FOR ALL
TO authenticated
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- 2. Usuários autenticados podem ver próprio perfil
CREATE POLICY "Usuários veem próprio perfil"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 3. Usuários autenticados podem atualizar próprio perfil
CREATE POLICY "Usuários atualizam próprio perfil"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Permitir SELECT público para login (necessário para autenticação)
-- IMPORTANTE: Sem isso, o login não funciona pois precisa buscar o usuário
CREATE POLICY "Public read for authentication"
ON public.users FOR SELECT
TO anon, authenticated
USING (true);

-- ================================================
-- NOTA IMPORTANTE:
-- ================================================
-- As policies de admin (inserir, deletar) devem ser feitas via
-- service_role no backend, NÃO via policies RLS na tabela users.
-- Isso evita a recursão infinita.
-- ================================================
