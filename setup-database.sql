-- ========================================
-- SETUP INICIAL DO BANCO DE DADOS
-- Sistema de Ponto Eletrônico - Prefeitura
-- ========================================

-- PASSO 1: Verificar se as tabelas existem
-- Execute este SQL no Supabase SQL Editor

-- ========================================
-- CRIAR USUÁRIOS DE TESTE
-- ========================================

-- Senha padrão para todos: "senha123"
-- Hash SHA-256 de "senha123": a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3

-- 1. ENCARREGADO (ADMINISTRADOR)
INSERT INTO users (
  username,
  email,
  password_hash,
  full_name,
  role,
  active
) VALUES (
  'encarregado',
  'encarregado@prefeitura.gov.br',
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  'João da Silva',
  'ADMINISTRADOR',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;

-- 2. GERENTE
INSERT INTO users (
  username,
  email,
  password_hash,
  full_name,
  role,
  active
) VALUES (
  'gerente',
  'gerente@prefeitura.gov.br',
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  'Maria Santos',
  'GERENTE',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;

-- 3. SUPERVISOR
INSERT INTO users (
  username,
  email,
  password_hash,
  full_name,
  role,
  active
) VALUES (
  'supervisor',
  'supervisor@prefeitura.gov.br',
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  'Carlos Oliveira',
  'SUPERVISOR',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;

-- 4. FUNCIONÁRIO - VIGIA
INSERT INTO users (
  username,
  email,
  password_hash,
  full_name,
  role,
  active
) VALUES (
  'funcionario',
  'funcionario@prefeitura.gov.br',
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  'Pedro Alves',
  'VIGIA',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;

-- 5. FUNCIONÁRIO - VIGILANTE
INSERT INTO users (
  username,
  email,
  password_hash,
  full_name,
  role,
  active
) VALUES (
  'vigilante',
  'vigilante@prefeitura.gov.br',
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  'Ana Costa',
  'VIGILANTE',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;

-- 6. FUNCIONÁRIO - GUARDA
INSERT INTO users (
  username,
  email,
  password_hash,
  full_name,
  role,
  active
) VALUES (
  'guarda',
  'guarda@prefeitura.gov.br',
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  'Roberto Lima',
  'GUARDA',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;

-- ========================================
-- ADICIONAR DESCRIÇÕES NAS COLUNAS
-- ========================================

-- Descrição da tabela users
COMMENT ON TABLE users IS 'Usuários do sistema de ponto eletrônico da Prefeitura';

-- Descrições das colunas da tabela users
COMMENT ON COLUMN users.id IS 'Identificador único do usuário (UUID)';
COMMENT ON COLUMN users.email IS 'Email institucional ou pessoal do usuário';
COMMENT ON COLUMN users.username IS 'Nome de usuário para login (único)';
COMMENT ON COLUMN users.password_hash IS 'Hash SHA-256 da senha do usuário';
COMMENT ON COLUMN users.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN users.role IS 'Papel/função no sistema (VIGIA, VIGILANTE, GUARDA, SUPERVISOR, GERENTE, ADMINISTRADOR)';
COMMENT ON COLUMN users.active IS 'Indica se o usuário está ativo no sistema';
COMMENT ON COLUMN users.created_at IS 'Data e hora de criação do registro';
COMMENT ON COLUMN users.updated_at IS 'Data e hora da última atualização';
COMMENT ON COLUMN users.last_login IS 'Data e hora do último login bem-sucedido';

-- Descrição da tabela login_audit
COMMENT ON TABLE login_audit IS 'Registra todas as tentativas de login (sucesso e falha) para auditoria e segurança do sistema';

-- Descrições das colunas de login_audit
COMMENT ON COLUMN login_audit.id IS 'Identificador único do registro de auditoria';
COMMENT ON COLUMN login_audit.user_id IS 'ID do usuário que tentou fazer login';
COMMENT ON COLUMN login_audit.username IS 'Nome de usuário usado na tentativa de login';
COMMENT ON COLUMN login_audit.role IS 'Papel/função do usuário no sistema';
COMMENT ON COLUMN login_audit.login_type IS 'Tipo de login: encarregado ou funcionario';
COMMENT ON COLUMN login_audit.success IS 'Indica se o login foi bem-sucedido (true) ou falhou (false)';
COMMENT ON COLUMN login_audit.error_message IS 'Mensagem de erro detalhada em caso de falha no login';
COMMENT ON COLUMN login_audit.ip_address IS 'Endereço IP de origem da tentativa de login';
COMMENT ON COLUMN login_audit.user_agent IS 'Informações do navegador/dispositivo usado na tentativa';
COMMENT ON COLUMN login_audit.logged_in_at IS 'Data e hora exata da tentativa de login';

-- ========================================
-- VERIFICAÇÃO
-- ========================================

-- Listar todos os usuários criados
SELECT 
  username,
  full_name,
  role,
  email,
  active,
  created_at
FROM users
ORDER BY role DESC, username;

-- Contagem por role
SELECT 
  role,
  COUNT(*) as total
FROM users
WHERE active = true
GROUP BY role
ORDER BY role;
