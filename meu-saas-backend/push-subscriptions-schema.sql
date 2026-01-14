-- Tabela para armazenar subscriptions de push notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  expiration_time BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que um usuário não tenha subscriptions duplicadas
  UNIQUE(user_id, endpoint)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Comentários
COMMENT ON TABLE push_subscriptions IS 'Armazena subscriptions de notificações push do navegador';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'URL do endpoint do serviço de push';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Chave pública do cliente para criptografia';
COMMENT ON COLUMN push_subscriptions.auth IS 'Segredo de autenticação';
COMMENT ON COLUMN push_subscriptions.expiration_time IS 'Timestamp de expiração da subscription (opcional)';
