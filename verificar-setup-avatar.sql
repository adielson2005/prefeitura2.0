-- =====================================================
-- VERIFICAÇÃO DO SETUP - Execute para conferir
-- =====================================================

-- 1. Verificar se a tabela users existe e tem a coluna avatar_url
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'avatar_url';

-- Resultado esperado:
-- table_name | column_name | data_type | is_nullable
-- users      | avatar_url  | text      | YES

-- =====================================================

-- 2. Verificar se o bucket user-files existe
SELECT 
  id,
  name,
  public
FROM storage.buckets
WHERE name = 'user-files';

-- Resultado esperado:
-- id | name       | public
-- xx | user-files | true

-- =====================================================

-- 3. Verificar políticas criadas para o bucket
SELECT 
  policyname as "Política",
  cmd as "Operação",
  roles as "Para"
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%Upload%' 
   OR policyname LIKE '%Leitura%'
   OR policyname LIKE '%Atualizar%'
   OR policyname LIKE '%Deletar%'
   OR policyname LIKE '%upload%'
   OR policyname LIKE '%públic%'
   OR policyname LIKE '%avatar%';

-- Resultado esperado: 4 linhas (INSERT, SELECT, UPDATE, DELETE)

-- =====================================================

-- 4. Contar usuários (para confirmar que a tabela existe)
SELECT COUNT(*) as total_usuarios FROM users;

-- =====================================================
-- INTERPRETAÇÃO DOS RESULTADOS
-- =====================================================

/*
✅ TUDO CERTO SE:
- Query 1: Retorna 1 linha com avatar_url
- Query 2: Retorna 1 linha com public = true
- Query 3: Retorna 4 linhas (uma para cada operação)
- Query 4: Retorna número maior que 0

❌ PROBLEMA SE:
- Query 1: Vazio = falta adicionar coluna
- Query 2: Vazio = falta criar bucket
- Query 2: public = false = bucket não é público
- Query 3: Menos de 4 linhas = faltam políticas
- Query 4: Erro = tabela não existe

COMO CORRIGIR:
- Execute o arquivo: supabase-storage-minimo.sql
- Linha por linha, no SQL Editor
*/
