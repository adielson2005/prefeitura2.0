-- ========================================
-- COMANDOS SQL ÚTEIS - SUPABASE
-- Use no SQL Editor do Supabase
-- ========================================

-- ========================================
-- CONSULTAS DE VERIFICAÇÃO
-- ========================================

-- Ver todos os usuários
SELECT id, username, full_name, role, active, last_login, created_at
FROM users
ORDER BY created_at DESC;

-- Ver registros de ponto de hoje
SELECT 
  u.full_name,
  tr.punch_type,
  tr.punch_time,
  tr.location_name
FROM time_records tr
JOIN users u ON tr.user_id = u.id
WHERE DATE(tr.punch_time) = CURRENT_DATE
ORDER BY tr.punch_time DESC;

-- Ver registros por usuário
SELECT 
  punch_type,
  punch_time,
  location_name,
  notes
FROM time_records
WHERE user_id = 'COLE_ID_DO_USUARIO_AQUI'
ORDER BY punch_time DESC
LIMIT 20;

-- Ver escalas da semana
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
WHERE s.shift_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY s.shift_date, s.start_time;

-- Ver notificações não lidas
SELECT 
  u.username,
  n.title,
  n.message,
  n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE n.read = false
ORDER BY n.created_at DESC;

-- ========================================
-- RELATÓRIOS E ESTATÍSTICAS
-- ========================================

-- Total de registros por usuário no mês
SELECT 
  u.full_name,
  u.role,
  COUNT(*) as total_registros,
  COUNT(CASE WHEN tr.punch_type = 'ENTRADA' THEN 1 END) as entradas,
  COUNT(CASE WHEN tr.punch_type = 'SAIDA' THEN 1 END) as saidas
FROM time_records tr
JOIN users u ON tr.user_id = u.id
WHERE DATE_TRUNC('month', tr.punch_time) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY u.id, u.full_name, u.role
ORDER BY total_registros DESC;

-- Registros por dia da semana
SELECT 
  TO_CHAR(punch_time, 'Day') as dia_semana,
  COUNT(*) as total_registros
FROM time_records
WHERE punch_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY TO_CHAR(punch_time, 'Day'), EXTRACT(DOW FROM punch_time)
ORDER BY EXTRACT(DOW FROM punch_time);

-- Horários médios de entrada/saída
SELECT 
  u.full_name,
  AVG(EXTRACT(EPOCH FROM tr.punch_time::TIME)) / 3600 as hora_media_entrada
FROM time_records tr
JOIN users u ON tr.user_id = u.id
WHERE tr.punch_type = 'ENTRADA'
  AND tr.punch_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id, u.full_name
ORDER BY u.full_name;

-- ========================================
-- MANUTENÇÃO E LIMPEZA
-- ========================================

-- Limpar códigos de segurança expirados
DELETE FROM security_codes
WHERE expires_at < NOW() - INTERVAL '7 days';

-- Limpar notificações antigas lidas
DELETE FROM notifications
WHERE read = true 
  AND read_at < NOW() - INTERVAL '90 days';

-- Marcar usuários inativos (sem login há mais de 6 meses)
UPDATE users
SET active = false
WHERE last_login < NOW() - INTERVAL '6 months'
  AND active = true;

-- ========================================
-- GESTÃO DE USUÁRIOS
-- ========================================

-- Criar novo usuário
INSERT INTO users (
  email,
  username,
  password_hash,
  full_name,
  role,
  email_institucional
) VALUES (
  'novo@prefeitura.gov.br',
  'novo_usuario',
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', -- hash de "123"
  'Nome Completo',
  'VIGIA',
  'novo@prefeitura.gov.br'
);

-- Alterar role de um usuário
UPDATE users
SET role = 'SUPERVISOR'
WHERE username = 'nome_usuario';

-- Desativar usuário
UPDATE users
SET active = false
WHERE username = 'nome_usuario';

-- Reativar usuário
UPDATE users
SET active = true
WHERE username = 'nome_usuario';

-- Alterar senha de usuário
UPDATE users
SET password_hash = 'NOVO_HASH_AQUI'
WHERE username = 'nome_usuario';

-- ========================================
-- BACKUP E EXPORTAÇÃO
-- ========================================

-- Exportar usuários (copie resultado para Excel)
COPY (
  SELECT 
    username,
    full_name,
    email,
    role,
    email_institucional,
    telefone_celular,
    active,
    last_login,
    created_at
  FROM users
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- Exportar registros do mês
COPY (
  SELECT 
    u.full_name,
    u.username,
    tr.punch_type,
    tr.punch_time,
    tr.location_name,
    tr.latitude,
    tr.longitude
  FROM time_records tr
  JOIN users u ON tr.user_id = u.id
  WHERE DATE_TRUNC('month', tr.punch_time) = DATE_TRUNC('month', CURRENT_DATE)
  ORDER BY tr.punch_time
) TO STDOUT WITH CSV HEADER;

-- ========================================
-- AUDITORIA E LOGS
-- ========================================

-- Ver últimas atividades
SELECT 
  u.username,
  u.full_name,
  'Login' as acao,
  u.last_login as data_hora
FROM users u
WHERE u.last_login IS NOT NULL
ORDER BY u.last_login DESC
LIMIT 50;

-- Registros suspeitos (fora do horário comercial)
SELECT 
  u.full_name,
  tr.punch_type,
  tr.punch_time,
  EXTRACT(HOUR FROM tr.punch_time) as hora
FROM time_records tr
JOIN users u ON tr.user_id = u.id
WHERE EXTRACT(HOUR FROM tr.punch_time) < 6 
   OR EXTRACT(HOUR FROM tr.punch_time) > 22
ORDER BY tr.punch_time DESC;

-- Usuários com muitos registros em um dia (possível duplicação)
SELECT 
  u.full_name,
  DATE(tr.punch_time) as data,
  COUNT(*) as total_registros
FROM time_records tr
JOIN users u ON tr.user_id = u.id
GROUP BY u.id, u.full_name, DATE(tr.punch_time)
HAVING COUNT(*) > 10
ORDER BY total_registros DESC;

-- ========================================
-- TESTES E DEBUG
-- ========================================

-- Testar RLS (Row Level Security)
-- Execute como usuário específico para ver se as políticas funcionam
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'ID_DO_USUARIO';

SELECT * FROM time_records; -- Deve retornar apenas registros do usuário

RESET ROLE;

-- Ver políticas ativas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('users', 'time_records', 'shifts', 'notifications');

-- Ver índices
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ========================================
-- PERFORMANCE
-- ========================================

-- Analisar query performance
EXPLAIN ANALYZE
SELECT * FROM time_records
WHERE user_id = 'ID_USUARIO'
  AND punch_time >= CURRENT_DATE - INTERVAL '30 days';

-- Ver tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Vacuum e analyze (otimização)
VACUUM ANALYZE users;
VACUUM ANALYZE time_records;
VACUUM ANALYZE shifts;

-- ========================================
-- DADOS DE TESTE
-- ========================================

-- Inserir registro de ponto de teste
INSERT INTO time_records (
  user_id,
  punch_type,
  punch_time,
  latitude,
  longitude,
  location_name
) VALUES (
  (SELECT id FROM users WHERE username = 'teste' LIMIT 1),
  'ENTRADA',
  NOW(),
  -23.550520,
  -46.633308,
  'Prefeitura Municipal'
);

-- Inserir escala de teste
INSERT INTO shifts (
  user_id,
  shift_date,
  start_time,
  end_time,
  location,
  description,
  status
) VALUES (
  (SELECT id FROM users WHERE username = 'vigia' LIMIT 1),
  CURRENT_DATE + INTERVAL '1 day',
  '08:00:00',
  '17:00:00',
  'Portaria Principal',
  'Turno da manhã',
  'CONFIRMADO'
);

-- Inserir notificação de teste
INSERT INTO notifications (
  user_id,
  title,
  message,
  type
) VALUES (
  (SELECT id FROM users WHERE username = 'teste' LIMIT 1),
  'Bem-vindo!',
  'Seu cadastro foi realizado com sucesso.',
  'success'
);

-- ========================================
-- RESET COMPLETO (USE COM CUIDADO!)
-- ========================================

-- ⚠️ ATENÇÃO: Isso apaga TODOS os dados!
-- Descomente apenas se realmente quiser resetar tudo

-- TRUNCATE TABLE notifications CASCADE;
-- TRUNCATE TABLE security_codes CASCADE;
-- TRUNCATE TABLE shifts CASCADE;
-- TRUNCATE TABLE time_records CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- Depois execute novamente o supabase-schema.sql
-- para recriar os dados iniciais

-- ========================================
-- FIM DOS COMANDOS ÚTEIS
-- ========================================
