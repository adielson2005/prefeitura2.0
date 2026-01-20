-- Ativar RLS na tabela shifts
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas
DROP POLICY IF EXISTS "Usuários podem ver suas próprias escalas" ON public.shifts;
DROP POLICY IF EXISTS "Supervisores podem gerenciar todas as escalas" ON public.shifts;
DROP POLICY IF EXISTS "Admins podem criar escalas" ON public.shifts;
DROP POLICY IF EXISTS "Admins podem atualizar escalas" ON public.shifts;
DROP POLICY IF EXISTS "Admins podem deletar escalas" ON public.shifts;
DROP POLICY IF EXISTS "Service role acesso total shifts" ON public.shifts;

-- Usuários veem próprias escalas
CREATE POLICY "Usuários podem ver suas próprias escalas"
ON public.shifts FOR SELECT
USING (auth.uid() = user_id);

-- Supervisores veem todas as escalas
CREATE POLICY "Supervisores podem ver todas as escalas"
ON public.shifts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
  )
);

-- Supervisores criam escalas
CREATE POLICY "Admins podem criar escalas"
ON public.shifts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
  )
);

-- Supervisores atualizam escalas
CREATE POLICY "Admins podem atualizar escalas"
ON public.shifts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
  )
);

-- Apenas admins e gerentes deletam escalas
CREATE POLICY "Admins podem deletar escalas"
ON public.shifts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE')
  )
);

-- Service role acesso total
CREATE POLICY "Service role acesso total shifts"
ON public.shifts FOR ALL
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);
