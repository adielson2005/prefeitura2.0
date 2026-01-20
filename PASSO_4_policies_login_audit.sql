-- ================================================================
-- SCRIPT 4: Criar Políticas para LOGIN_AUDIT
-- Execute ESTE BLOCO por último
-- ================================================================

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
