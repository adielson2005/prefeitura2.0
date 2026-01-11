-- ========================================
-- SCHEMA COMPLETO COM AUDITORIA DE LOGINS
-- Sistema de Ponto Eletrônico - Prefeitura
-- ========================================

-- 1. REMOVER TUDO (se existir)
DROP TABLE IF EXISTS login_audit CASCADE;
DROP TABLE IF EXISTS security_codes CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS shifts CASCADE;
DROP TABLE IF EXISTS time_records CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS shift_status CASCADE;
DROP TYPE IF EXISTS punch_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- 2. HABILITAR EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. CRIAR TIPOS ENUM
CREATE TYPE user_role AS ENUM (
  'VIGIA',
  'VIGILANTE',
  'GUARDA',
  'SUPERVISOR',
  'GERENTE',
  'ADMINISTRADOR'
);

CREATE TYPE punch_type AS ENUM (
  'ENTRADA',
  'INTERVALO',
  'RETORNO',
  'SAIDA'
);

CREATE TYPE shift_status AS ENUM (
  'PENDENTE',
  'CONFIRMADO',
  'CANCELADO'
);

-- 4. CRIAR TABELA: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'VIGIA',
  
  -- Contatos
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

-- 5. CRIAR TABELA: time_records
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

-- 6. CRIAR TABELA: shifts
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  location VARCHAR(255),
  notes TEXT,
  
  status shift_status DEFAULT 'PENDENTE',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CRIAR TABELA: notifications
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

-- 8. CRIAR TABELA: security_codes
CREATE TABLE security_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  code VARCHAR(10) NOT NULL,
  purpose VARCHAR(50) NOT NULL,
  
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CRIAR TABELA: login_audit (AUDITORIA DE LOGINS)
CREATE TABLE login_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Dados do login
  username VARCHAR(100) NOT NULL,
  role user_role,
  login_type VARCHAR(20), -- 'encarregado' ou 'funcionario'
  
  -- Resultado
  success BOOLEAN NOT NULL,
  error_message TEXT,
  
  -- Dados técnicos
  ip_address VARCHAR(45),
  user_agent TEXT,
  browser VARCHAR(100),
  os VARCHAR(100),
  device VARCHAR(50),
  
  -- Timestamp
  logged_in_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CRIAR ÍNDICES
CREATE INDEX idx_time_records_user ON time_records(user_id);
CREATE INDEX idx_time_records_date ON time_records(punch_time);
CREATE INDEX idx_shifts_user ON shifts(user_id);
CREATE INDEX idx_shifts_date ON shifts(shift_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_security_codes_user ON security_codes(user_id);
CREATE INDEX idx_security_codes_code ON security_codes(code);

-- Índices para auditoria
CREATE INDEX idx_login_audit_user ON login_audit(user_id);
CREATE INDEX idx_login_audit_username ON login_audit(username);
CREATE INDEX idx_login_audit_date ON login_audit(logged_in_at);
CREATE INDEX idx_login_audit_success ON login_audit(success);
CREATE INDEX idx_login_audit_type ON login_audit(login_type);

-- 11. DESABILITAR RLS TEMPORARIAMENTE (para testes)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE time_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE security_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE login_audit DISABLE ROW LEVEL SECURITY;

-- 12. INSERIR USUÁRIOS DE TESTE
-- Hash SHA-256 de "123" = a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3

INSERT INTO users (email, username, password_hash, full_name, role, active) VALUES
  ('teste@prefeitura.gov.br', 'teste', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Usuário de Teste', 'ADMINISTRADOR', true),
  ('vigia@prefeitura.gov.br', 'vigia', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Pedro Santos', 'VIGIA', true),
  ('vigilante@prefeitura.gov.br', 'vigilante', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Carlos Oliveira', 'VIGILANTE', true),
  ('guarda@prefeitura.gov.br', 'guarda', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'José Almeida', 'GUARDA', true);

-- ========================================
-- ✅ SCHEMA CRIADO COM SUCESSO!
-- ========================================

-- ========================================
-- 📊 QUERIES ÚTEIS PARA AUDITORIA
-- ========================================

-- 1. VER TODOS OS LOGINS DAS ÚLTIMAS 24 HORAS
-- SELECT 
--   username,
--   role,
--   login_type,
--   CASE 
--     WHEN success THEN '✅ Sucesso'
--     ELSE '❌ Falha'
--   END as resultado,
--   error_message,
--   browser,
--   os,
--   device,
--   logged_in_at
-- FROM login_audit
-- WHERE logged_in_at > NOW() - INTERVAL '24 hours'
-- ORDER BY logged_in_at DESC;

-- 2. ESTATÍSTICAS DE LOGIN POR TIPO DE USUÁRIO
-- SELECT 
--   login_type,
--   COUNT(*) as total_tentativas,
--   COUNT(CASE WHEN success THEN 1 END) as sucessos,
--   COUNT(CASE WHEN NOT success THEN 1 END) as falhas,
--   ROUND(COUNT(CASE WHEN success THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as taxa_sucesso
-- FROM login_audit
-- GROUP BY login_type
-- ORDER BY total_tentativas DESC;

-- 3. USUÁRIOS COM MAIS TENTATIVAS FALHADAS
-- SELECT 
--   username,
--   role,
--   COUNT(*) as tentativas_falhadas,
--   MAX(logged_in_at) as ultima_tentativa,
--   STRING_AGG(DISTINCT error_message, ' | ') as erros
-- FROM login_audit
-- WHERE success = false
--   AND logged_in_at > NOW() - INTERVAL '7 days'
-- GROUP BY username, role
-- HAVING COUNT(*) >= 3
-- ORDER BY tentativas_falhadas DESC;

-- 4. ATIVIDADE DE LOGIN POR HORA DO DIA
-- SELECT 
--   EXTRACT(HOUR FROM logged_in_at) as hora,
--   COUNT(*) as total_logins,
--   COUNT(CASE WHEN success THEN 1 END) as sucessos,
--   COUNT(CASE WHEN NOT success THEN 1 END) as falhas
-- FROM login_audit
-- WHERE logged_in_at > NOW() - INTERVAL '7 days'
-- GROUP BY hora
-- ORDER BY hora;

-- 5. DISPOSITIVOS MAIS USADOS
-- SELECT 
--   device,
--   os,
--   browser,
--   COUNT(*) as acessos,
--   COUNT(DISTINCT username) as usuarios_unicos
-- FROM login_audit
-- WHERE success = true
--   AND logged_in_at > NOW() - INTERVAL '30 days'
-- GROUP BY device, os, browser
-- ORDER BY acessos DESC
-- LIMIT 10;

-- 6. LOGINS SUSPEITOS (múltiplas falhas seguidas)
-- SELECT 
--   username,
--   COUNT(*) as falhas_consecutivas,
--   MIN(logged_in_at) as primeira_tentativa,
--   MAX(logged_in_at) as ultima_tentativa,
--   STRING_AGG(DISTINCT device, ', ') as dispositivos
-- FROM login_audit
-- WHERE success = false
--   AND logged_in_at > NOW() - INTERVAL '1 hour'
-- GROUP BY username
-- HAVING COUNT(*) >= 3
-- ORDER BY falhas_consecutivas DESC;

-- 7. COMPARAR ENCARREGADOS VS FUNCIONÁRIOS
-- SELECT 
--   CASE 
--     WHEN login_type = 'encarregado' THEN '👔 Encarregado'
--     WHEN login_type = 'funcionario' THEN '👷 Funcionário'
--     ELSE '⚪ Direto'
--   END as tipo_acesso,
--   COUNT(*) as total_logins,
--   COUNT(DISTINCT username) as usuarios_diferentes,
--   COUNT(CASE WHEN success THEN 1 END) as sucessos,
--   ROUND(AVG(CASE WHEN success THEN 1 ELSE 0 END) * 100, 2) as taxa_sucesso
-- FROM login_audit
-- WHERE logged_in_at > NOW() - INTERVAL '30 days'
-- GROUP BY login_type
-- ORDER BY total_logins DESC;

-- 8. HISTÓRICO COMPLETO DE UM USUÁRIO ESPECÍFICO
-- (Substitua 'teste' pelo username desejado)
-- SELECT 
--   logged_in_at,
--   login_type,
--   CASE WHEN success THEN '✅' ELSE '❌' END as status,
--   error_message,
--   browser,
--   os,
--   device
-- FROM login_audit
-- WHERE username = 'teste'
-- ORDER BY logged_in_at DESC
-- LIMIT 50;

-- 9. PRIMEIRO E ÚLTIMO LOGIN DE CADA USUÁRIO
-- SELECT 
--   u.username,
--   u.full_name,
--   u.role,
--   MIN(la.logged_in_at) as primeiro_login,
--   MAX(la.logged_in_at) as ultimo_login,
--   COUNT(*) as total_logins,
--   COUNT(CASE WHEN la.success THEN 1 END) as logins_sucesso
-- FROM users u
-- LEFT JOIN login_audit la ON u.id = la.user_id
-- WHERE u.active = true
-- GROUP BY u.username, u.full_name, u.role
-- ORDER BY ultimo_login DESC NULLS LAST;

-- 10. USUÁRIOS QUE NUNCA FIZERAM LOGIN
-- SELECT 
--   username,
--   full_name,
--   role,
--   email,
--   created_at,
--   EXTRACT(DAY FROM NOW() - created_at) as dias_sem_login
-- FROM users
-- WHERE active = true
--   AND id NOT IN (SELECT DISTINCT user_id FROM login_audit WHERE success = true AND user_id IS NOT NULL)
-- ORDER BY created_at;

-- 11. TENDÊNCIA DE LOGINS (últimos 7 dias)
-- SELECT 
--   DATE(logged_in_at) as data,
--   COUNT(*) as total_tentativas,
--   COUNT(CASE WHEN success THEN 1 END) as sucessos,
--   COUNT(CASE WHEN NOT success THEN 1 END) as falhas,
--   COUNT(DISTINCT username) as usuarios_unicos
-- FROM login_audit
-- WHERE logged_in_at > NOW() - INTERVAL '7 days'
-- GROUP BY DATE(logged_in_at)
-- ORDER BY data DESC;

-- 12. LIMPEZA DE AUDITORIA ANTIGA (EXECUTAR MANUALMENTE)
-- Remove registros com mais de 90 dias
-- DELETE FROM login_audit 
-- WHERE logged_in_at < NOW() - INTERVAL '90 days';

-- ========================================
-- 💡 COMO USAR AS QUERIES ACIMA:
-- ========================================
-- 1. Copie a query desejada (sem os comentários --)
-- 2. Cole em uma nova aba do SQL Editor
-- 3. Execute com Ctrl+Enter ou botão Run
-- 4. Veja os resultados instantaneamente!
--
-- Dica: Salve suas queries favoritas no SQL Editor
-- ========================================
