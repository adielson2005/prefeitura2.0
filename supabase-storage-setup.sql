-- =====================================================
-- CONFIGURAÇÃO DO SUPABASE STORAGE PARA AVATARES
-- =====================================================

-- IMPORTANTE: Antes de executar este script, crie o bucket 'user-files'
-- manualmente no Supabase Dashboard:
-- 1. Storage → Create bucket
-- 2. Nome: user-files
-- 3. Public: SIM
-- 4. File size limit: 2MB

-- =====================================================
-- PASSO 1: ADICIONAR COLUNA avatar_url (se não existir)
-- =====================================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- =====================================================
-- PASSO 2: POLÍTICAS DE ACESSO PARA STORAGE
-- =====================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Usuários podem fazer upload de avatares" ON storage.objects;
DROP POLICY IF EXISTS "Avatares são públicos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio avatar" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar próprio avatar" ON storage.objects;

-- 1. Permitir INSERT (upload) para usuários autenticados
CREATE POLICY "Usuários podem fazer upload de avatares"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-files');

-- 2. Permitir SELECT (leitura) público
CREATE POLICY "Avatares são públicos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-files');

-- 3. Permitir UPDATE para usuários autenticados
CREATE POLICY "Usuários podem atualizar próprio avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-files')
WITH CHECK (bucket_id = 'user-files');

-- 4. Permitir DELETE para usuários autenticados
CREATE POLICY "Usuários podem deletar próprio avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-files');

-- =====================================================
-- ✅ PRONTO!
-- =====================================================

/*
INSTRUÇÕES:

1. ANTES de executar este script:
   - Vá em Storage → Create bucket
   - Nome: user-files
   - Marque como PÚBLICO ✅
   - Clique em Create

2. Execute este script no SQL Editor

3. Teste fazendo upload de uma foto!

Se der erro "policy already exists", é porque já foi executado antes.
Neste caso, está tudo certo! ✅
*/
