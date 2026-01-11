-- ========================================
-- QUERIES DE AUDITORIA DE LOGINS
-- Consultas úteis para análise de segurança
-- ========================================

-- 1. VER TODOS OS LOGINS DAS ÚLTIMAS 24 HORAS
SELECT 
  username,
  role,
  login_type,
  CASE 
    WHEN success THEN '✅ Sucesso'
    ELSE '❌ Falha'
  END as resultado,
  error_message,
  browser,
  os,
  device,
  logged_in_at
FROM login_audit
WHERE logged_in_at > NOW() - INTERVAL '24 hours'
ORDER BY logged_in_at DESC;

-- 2. ESTATÍSTICAS DE LOGIN POR TIPO DE USUÁRIO
SELECT 
  login_type,
  COUNT(*) as total_tentativas,
  COUNT(CASE WHEN success THEN 1 END) as sucessos,
  COUNT(CASE WHEN NOT success THEN 1 END) as falhas,
  ROUND(COUNT(CASE WHEN success THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as taxa_sucesso
FROM login_audit
GROUP BY login_type
ORDER BY total_tentativas DESC;

-- 3. USUÁRIOS COM MAIS TENTATIVAS FALHADAS
SELECT 
  username,
  role,
  COUNT(*) as tentativas_falhadas,
  MAX(logged_in_at) as ultima_tentativa,
  STRING_AGG(DISTINCT error_message, ' | ') as erros
FROM login_audit
WHERE success = false
  AND logged_in_at > NOW() - INTERVAL '7 days'
GROUP BY username, role
HAVING COUNT(*) >= 3
ORDER BY tentativas_falhadas DESC;

-- 4. ATIVIDADE DE LOGIN POR HORA DO DIA
SELECT 
  EXTRACT(HOUR FROM logged_in_at) as hora,
  COUNT(*) as total_logins,
  COUNT(CASE WHEN success THEN 1 END) as sucessos,
  COUNT(CASE WHEN NOT success THEN 1 END) as falhas
FROM login_audit
WHERE logged_in_at > NOW() - INTERVAL '7 days'
GROUP BY hora
ORDER BY hora;

-- 5. DISPOSITIVOS MAIS USADOS
SELECT 
  device,
  os,
  browser,
  COUNT(*) as acessos,
  COUNT(DISTINCT username) as usuarios_unicos
FROM login_audit
WHERE success = true
  AND logged_in_at > NOW() - INTERVAL '30 days'
GROUP BY device, os, browser
ORDER BY acessos DESC
LIMIT 10;

-- 6. LOGINS SUSPEITOS (múltiplas falhas seguidas)
SELECT 
  username,
  COUNT(*) as falhas_consecutivas,
  MIN(logged_in_at) as primeira_tentativa,
  MAX(logged_in_at) as ultima_tentativa,
  STRING_AGG(DISTINCT device, ', ') as dispositivos
FROM login_audit
WHERE success = false
  AND logged_in_at > NOW() - INTERVAL '1 hour'
GROUP BY username
HAVING COUNT(*) >= 3
ORDER BY falhas_consecutivas DESC;

-- 7. COMPARAR ENCARREGADOS VS FUNCIONÁRIOS
SELECT 
  CASE 
    WHEN login_type = 'encarregado' THEN '👔 Encarregado'
    WHEN login_type = 'funcionario' THEN '👷 Funcionário'
    ELSE '⚪ Direto'
  END as tipo_acesso,
  COUNT(*) as total_logins,
  COUNT(DISTINCT username) as usuarios_diferentes,
  COUNT(CASE WHEN success THEN 1 END) as sucessos,
  ROUND(AVG(CASE WHEN success THEN 1 ELSE 0 END) * 100, 2) as taxa_sucesso
FROM login_audit
WHERE logged_in_at > NOW() - INTERVAL '30 days'
GROUP BY login_type
ORDER BY total_logins DESC;

-- 8. HISTÓRICO COMPLETO DE UM USUÁRIO ESPECÍFICO
-- (Substitua 'teste' pelo username desejado)
SELECT 
  logged_in_at,
  login_type,
  CASE WHEN success THEN '✅' ELSE '❌' END as status,
  error_message,
  browser,
  os,
  device
FROM login_audit
WHERE username = 'teste'
ORDER BY logged_in_at DESC
LIMIT 50;

-- 9. PRIMEIRO E ÚLTIMO LOGIN DE CADA USUÁRIO
SELECT 
  u.username,
  u.full_name,
  u.role,
  MIN(la.logged_in_at) as primeiro_login,
  MAX(la.logged_in_at) as ultimo_login,
  COUNT(*) as total_logins,
  COUNT(CASE WHEN la.success THEN 1 END) as logins_sucesso
FROM users u
LEFT JOIN login_audit la ON u.id = la.user_id
WHERE u.active = true
GROUP BY u.username, u.full_name, u.role
ORDER BY ultimo_login DESC NULLS LAST;

-- 10. USUÁRIOS QUE NUNCA FIZERAM LOGIN
SELECT 
  username,
  full_name,
  role,
  email,
  created_at,
  EXTRACT(DAY FROM NOW() - created_at) as dias_sem_login
FROM users
WHERE active = true
  AND id NOT IN (SELECT DISTINCT user_id FROM login_audit WHERE success = true AND user_id IS NOT NULL)
ORDER BY created_at;

-- 11. TENDÊNCIA DE LOGINS (últimos 7 dias)
SELECT 
  DATE(logged_in_at) as data,
  COUNT(*) as total_tentativas,
  COUNT(CASE WHEN success THEN 1 END) as sucessos,
  COUNT(CASE WHEN NOT success THEN 1 END) as falhas,
  COUNT(DISTINCT username) as usuarios_unicos
FROM login_audit
WHERE logged_in_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(logged_in_at)
ORDER BY data DESC;

-- 12. LIMPEZA DE AUDITORIA ANTIGA (EXECUTAR MANUALMENTE)
-- Remove registros com mais de 90 dias
-- DELETE FROM login_audit 
-- WHERE logged_in_at < NOW() - INTERVAL '90 days';
