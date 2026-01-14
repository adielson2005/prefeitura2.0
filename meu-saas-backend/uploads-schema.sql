-- Tabela para armazenar metadados de arquivos enviados
CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at);
CREATE INDEX IF NOT EXISTS idx_uploads_filename ON uploads(filename);

-- Comentários
COMMENT ON TABLE uploads IS 'Armazena metadados de arquivos enviados (comprovantes, documentos)';
COMMENT ON COLUMN uploads.filename IS 'Nome do arquivo no servidor';
COMMENT ON COLUMN uploads.original_name IS 'Nome original do arquivo enviado';
COMMENT ON COLUMN uploads.file_path IS 'Caminho completo do arquivo no sistema';
COMMENT ON COLUMN uploads.size IS 'Tamanho do arquivo em bytes';

-- Adicionar coluna attachment_url na tabela time_records
ALTER TABLE time_records 
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_id UUID REFERENCES uploads(id) ON DELETE SET NULL;

COMMENT ON COLUMN time_records.attachment_url IS 'URL do comprovante anexado';
COMMENT ON COLUMN time_records.attachment_id IS 'Referência ao arquivo na tabela uploads';
