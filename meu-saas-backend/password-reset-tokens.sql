-- Tabela para armazenar tokens de recuperação de senha
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  reset_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_code ON password_reset_tokens(reset_code);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_used ON password_reset_tokens(used);

-- Comentários
COMMENT ON TABLE password_reset_tokens IS 'Armazena códigos de recuperação de senha';
COMMENT ON COLUMN password_reset_tokens.reset_code IS 'Código de 6 dígitos para recuperação';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Data/hora de expiração do código (30 minutos)';
COMMENT ON COLUMN password_reset_tokens.used IS 'Indica se o código já foi utilizado';
