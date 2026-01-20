-- ================================================================
-- SCRIPT 1: Desabilitar RLS e Limpar Políticas Antigas
-- Copie e execute ESTE BLOCO primeiro
-- ================================================================

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
