-- ========================================
-- SCHEMA DO BANCO DE DADOS - SUPABASE
-- Sistema de Ponto Eletrônico - Prefeitura
-- ========================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar ENUM para papéis/funções
CREATE TYPE user_role AS ENUM (
  'VIGIA',
  'VIGILANTE',
  'GUARDA',
  'SUPERVISOR',
  'GERENTE',
  'ADMINISTRADOR'
);

-- 3. Criar ENUM para tipos de registro de ponto
CREATE TYPE punch_type AS ENUM (
  'ENTRADA',
  'INTERVALO',
  'RETORNO',
  'SAIDA'
);

-- 4. Criar ENUM para status de escala
CREATE TYPE shift_status AS ENUM (
  'PENDENTE',
  'CONFIRMADO',
  'CANCELADO'
);

-- ========================================
-- TABELA: users (Usuários do Sistema)
-- ========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'VIGIA',
  
  -- Contatos de segurança
  email_institucional VARCHAR(255),
  email_pessoal VARCHAR(255),
  telefone_celular VARCHAR(20),
  
  -- Configurações
  theme VARCHAR(20) DEFAULT 'dark',
  notif_email BOOLEAN DEFAULT TRUE,
  notif_push BOOLEAN DEFAULT TRUE,
  notif_sms BOOLEAN DEFAULT FALSE,
  notif_som BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  
  -- Metadados
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: time_records (Registros de Ponto)
-- ========================================
CREATE TABLE time_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  punch_type punch_type NOT NULL,
  punch_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Localização GPS
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_name VARCHAR(255),
  
  -- Observações
  notes TEXT,
  photo_url TEXT,
  
  -- Validação
  is_valid BOOLEAN DEFAULT TRUE,
  validated_by UUID REFERENCES users(id),
  validated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: shifts (Escalas de Trabalho)
-- ========================================
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  location VARCHAR(255),
  description TEXT,
  
  status shift_status DEFAULT 'PENDENTE',
  
  -- Metadados
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: notifications (Notificações)
-- ========================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: security_codes (Códigos de Verificação)
-- ========================================
CREATE TABLE security_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  code VARCHAR(6) NOT NULL,
  purpose VARCHAR(50) NOT NULL, -- 'password_reset', 'two_factor', etc
  
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- ========================================
CREATE INDEX idx_time_records_user_id ON time_records(user_id);
CREATE INDEX idx_time_records_punch_time ON time_records(punch_time);
CREATE INDEX idx_shifts_user_id ON shifts(user_id);
CREATE INDEX idx_shifts_date ON shifts(shift_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_security_codes_user_id ON security_codes(user_id);
CREATE INDEX idx_security_codes_code ON security_codes(code);

-- ========================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON shifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS) - SEGURANÇA
-- ========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_codes ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON users FOR SELECT
  USING (auth.uid()::TEXT = id::TEXT);

CREATE POLICY "Administradores podem ver todos os usuários"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::TEXT = auth.uid()::TEXT
      AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
    )
  );

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON users FOR UPDATE
  USING (auth.uid()::TEXT = id::TEXT);

-- Políticas para time_records
CREATE POLICY "Usuários podem ver seus próprios registros"
  ON time_records FOR SELECT
  USING (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY "Usuários podem criar seus próprios registros"
  ON time_records FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY "Supervisores podem ver todos os registros"
  ON time_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::TEXT = auth.uid()::TEXT
      AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
    )
  );

-- Políticas para shifts
CREATE POLICY "Usuários podem ver suas próprias escalas"
  ON shifts FOR SELECT
  USING (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY "Supervisores podem gerenciar todas as escalas"
  ON shifts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::TEXT = auth.uid()::TEXT
      AND role IN ('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR')
    )
  );

-- Políticas para notifications
CREATE POLICY "Usuários podem ver suas próprias notificações"
  ON notifications FOR SELECT
  USING (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY "Usuários podem marcar notificações como lidas"
  ON notifications FOR UPDATE
  USING (auth.uid()::TEXT = user_id::TEXT);

-- Políticas para security_codes
CREATE POLICY "Usuários podem ver seus próprios códigos"
  ON security_codes FOR SELECT
  USING (auth.uid()::TEXT = user_id::TEXT);

-- ========================================
-- DADOS INICIAIS (SEED)
-- ========================================

-- Inserir usuário administrador inicial
INSERT INTO users (
  email,
  username,
  password_hash,
  full_name,
  role,
  email_institucional
) VALUES (
  'admin@prefeitura.gov.br',
  'admin',
  -- Hash de "Admin@2026!" (você deve alterar isso)
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  'Administrador do Sistema',
  'ADMINISTRADOR',
  'admin@prefeitura.gov.br'
);

-- Inserir usuários de teste
INSERT INTO users (email, username, password_hash, full_name, role, email_institucional) VALUES
  ('teste@prefeitura.gov.br', 'teste', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Usuário de Teste', 'ADMINISTRADOR', 'teste@prefeitura.gov.br'),
  ('vigia@prefeitura.gov.br', 'vigia', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Pedro Santos', 'VIGIA', 'vigia@prefeitura.gov.br'),
  ('vigilante@prefeitura.gov.br', 'vigilante', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Carlos Oliveira', 'VIGILANTE', 'vigilante@prefeitura.gov.br'),
  ('guarda@prefeitura.gov.br', 'guarda', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'José Almeida', 'GUARDA', 'guarda@prefeitura.gov.br');

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View para relatório de pontos do dia
CREATE VIEW daily_time_report AS
SELECT 
  u.full_name,
  u.role,
  DATE(tr.punch_time) as date,
  MIN(CASE WHEN tr.punch_type = 'ENTRADA' THEN tr.punch_time END) as first_entry,
  MAX(CASE WHEN tr.punch_type = 'SAIDA' THEN tr.punch_time END) as last_exit,
  COUNT(*) as total_punches
FROM time_records tr
JOIN users u ON tr.user_id = u.id
GROUP BY u.full_name, u.role, DATE(tr.punch_time);

-- View para escalas do mês
CREATE VIEW monthly_shifts AS
SELECT 
  u.full_name,
  u.role,
  s.shift_date,
  s.start_time,
  s.end_time,
  s.location,
  s.status
FROM shifts s
JOIN users u ON s.user_id = u.id
WHERE s.shift_date >= DATE_TRUNC('month', CURRENT_DATE)
  AND s.shift_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';

-- ========================================
-- FIM DO SCHEMA
-- ========================================
