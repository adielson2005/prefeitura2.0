-- ================================================================
-- SCRIPT 3: Criar Políticas para USERS
-- Execute ESTE BLOCO depois do Passo 2
-- ================================================================

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
