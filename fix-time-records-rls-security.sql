-- Ativar RLS na tabela time_records
ALTER TABLE public.time_records ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas
DROP POLICY IF EXISTS "Usuários podem ver seus próprios registros" ON public.time_records;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios registros" ON public.time_records;
DROP POLICY IF EXISTS "Supervisores podem ver todos os registros" ON public.time_records;
DROP POLICY IF EXISTS "Admins podem atualizar registros" ON public.time_records;
DROP POLICY IF EXISTS "Admins podem deletar registros" ON public.time_records;
DROP POLICY IF EXISTS "Service role acesso total time_records" ON public.time_records;

-- Usuários veem próprios registros
CREATE POLICY "Usuários podem ver seus próprios registros"
ON public.time_records FOR SELECT
USING (auth.uid() = user_id);

-- Usuários criam próprios registros (bater ponto)
CREATE POLICY "Usuários podem criar seus próprios registros"
ON public.time_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Supervisores e admins veem todos os registros
CREATE POLICY "Supervisores podem ver todos os registros"
ON public.time_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
  )
);

-- Admins podem atualizar registros (corrigir registros, validar, etc)
CREATE POLICY "Admins podem atualizar registros"
ON public.time_records FOR UPDATE
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

-- Apenas admins podem deletar registros
CREATE POLICY "Admins podem deletar registros"
ON public.time_records FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR', 'GERENTE')
  )
);

-- Service role acesso total
CREATE POLICY "Service role acesso total time_records"
ON public.time_records FOR ALL
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);
