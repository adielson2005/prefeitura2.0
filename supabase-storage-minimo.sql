-- =====================================================
-- CONFIGURAÇÃO MÍNIMA - SUPABASE STORAGE
-- Execute linha por linha se houver erro
-- =====================================================

-- 1. Adicionar coluna avatar_url
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Permitir upload (INSERT)
CREATE POLICY "Upload de arquivos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-files');

-- 3. Permitir leitura (SELECT) - público
CREATE POLICY "Leitura pública"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-files');

-- 4. Permitir atualização (UPDATE)
CREATE POLICY "Atualizar arquivos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-files');

-- 5. Permitir exclusão (DELETE)
CREATE POLICY "Deletar arquivos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-files');
