-- ================================================================
-- SCRIPT 2: Reativar RLS
-- Execute ESTE BLOCO depois do Passo 1
-- ================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_audit ENABLE ROW LEVEL SECURITY;
