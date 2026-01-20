-- Ativar RLS na tabela notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas
DROP POLICY IF EXISTS "Usuários podem ver suas próprias notificações" ON public.notifications;
DROP POLICY IF EXISTS "Usuários podem marcar notificações como lidas" ON public.notifications;
DROP POLICY IF EXISTS "Admins podem criar notificações" ON public.notifications;
DROP POLICY IF EXISTS "Admins podem ver todas notificações" ON public.notifications;
DROP POLICY IF EXISTS "Admins podem deletar notificações" ON public.notifications;
DROP POLICY IF EXISTS "Service role acesso total notifications" ON public.notifications;

-- Usuários veem próprias notificações
CREATE POLICY "Usuários podem ver suas próprias notificações"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Usuários atualizam próprias notificações (marcar como lida)
CREATE POLICY "Usuários podem marcar notificações como lidas"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins veem todas as notificações
CREATE POLICY "Admins podem ver todas notificações"
ON public.notifications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
  )
);

-- Admins criam notificações
CREATE POLICY "Admins podem criar notificações"
ON public.notifications FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
  )
);

-- Admins deletam notificações
CREATE POLICY "Admins podem deletar notificações"
ON public.notifications FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE')
  )
);

-- Service role acesso total
CREATE POLICY "Service role acesso total notifications"
ON public.notifications FOR ALL
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);
