-- Ativar RLS na tabela security_codes
ALTER TABLE public.security_codes ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas
DROP POLICY IF EXISTS "Usuários podem ver seus próprios códigos" ON public.security_codes;
DROP POLICY IF EXISTS "Usuários podem usar seus códigos" ON public.security_codes;
DROP POLICY IF EXISTS "Admins podem ver todos códigos" ON public.security_codes;
DROP POLICY IF EXISTS "Admins podem criar códigos" ON public.security_codes;
DROP POLICY IF EXISTS "Admins podem deletar códigos" ON public.security_codes;
DROP POLICY IF EXISTS "Service role acesso total security_codes" ON public.security_codes;

-- Usuários veem próprios códigos
CREATE POLICY "Usuários podem ver seus próprios códigos"
ON public.security_codes FOR SELECT
USING (auth.uid() = user_id);

-- Usuários podem atualizar próprios códigos (marcar como usado)
CREATE POLICY "Usuários podem usar seus códigos"
ON public.security_codes FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins veem todos os códigos
CREATE POLICY "Admins podem ver todos códigos"
ON public.security_codes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE')
  )
);

-- Admins criam códigos (para recuperação de senha, 2FA, etc)
CREATE POLICY "Admins podem criar códigos"
ON public.security_codes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE')
  )
);

-- Admins deletam códigos
CREATE POLICY "Admins podem deletar códigos"
ON public.security_codes FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE')
  )
);

-- Service role acesso total (necessário para sistema de autenticação)
CREATE POLICY "Service role acesso total security_codes"
ON public.security_codes FOR ALL
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);
