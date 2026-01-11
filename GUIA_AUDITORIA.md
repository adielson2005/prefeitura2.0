# 📊 Sistema de Auditoria de Logins

## ✅ O que foi implementado:

### 1. **Tabela `login_audit` no Supabase**
Registra automaticamente:
- ✅ Quem tentou fazer login (username)
- ✅ Se escolheu "encarregado" ou "funcionário"
- ✅ Se o login foi bem-sucedido ou falhou
- ✅ Mensagem de erro (se houver)
- ✅ Navegador, sistema operacional e dispositivo
- ✅ Data e hora exata

### 2. **Registro Automático**
Cada tentativa de login (sucesso ou falha) é gravada automaticamente no banco de dados.

### 3. **Queries Prontas**
Arquivo `QUERIES_AUDITORIA.sql` com 12 consultas úteis.

---

## 🚀 Como Usar

### **PASSO 1: Executar o SQL no Supabase**

1. Abra o arquivo **`supabase-schema-complete.sql`**
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. No Supabase, vá em **SQL Editor**
4. Cole e clique em **Run**

Isso vai criar 6 tabelas (incluindo `login_audit`).

### **PASSO 2: Testar o Login**

Faça login no sistema:
- Escolha "Encarregado" ou "Funcionário"
- Digite: `teste` / `123`

### **PASSO 3: Verificar a Auditoria**

No Supabase, vá em **Table Editor** > **login_audit**

Você verá algo assim:

| username | login_type  | success | error_message | browser | os      | device  | logged_in_at        |
|----------|-------------|---------|---------------|---------|---------|---------|---------------------|
| teste    | encarregado | true    | null          | Chrome  | Windows | Desktop | 2026-01-09 23:45:00 |

---

## 📊 Consultas Úteis

### **Ver logins das últimas 24h**
```sql
SELECT username, login_type, success, logged_in_at 
FROM login_audit 
WHERE logged_in_at > NOW() - INTERVAL '24 hours'
ORDER BY logged_in_at DESC;
```

### **Estatísticas por tipo**
```sql
SELECT 
  login_type,
  COUNT(*) as total,
  COUNT(CASE WHEN success THEN 1 END) as sucessos,
  COUNT(CASE WHEN NOT success THEN 1 END) as falhas
FROM login_audit
GROUP BY login_type;
```

**Resultado esperado:**
```
login_type   | total | sucessos | falhas
-------------|-------|----------|-------
encarregado  |   45  |    42    |   3
funcionario  |   87  |    85    |   2
direto       |    5  |     4    |   1
```

### **Detectar ataques (múltiplas falhas)**
```sql
SELECT username, COUNT(*) as falhas
FROM login_audit
WHERE success = false 
  AND logged_in_at > NOW() - INTERVAL '1 hour'
GROUP BY username
HAVING COUNT(*) >= 3;
```

### **Ver quem nunca logou**
```sql
SELECT u.username, u.full_name, u.created_at
FROM users u
WHERE u.id NOT IN (
  SELECT user_id FROM login_audit WHERE success = true
);
```

---

## 🔍 Dashboards e Análises

### **1. Logins por Dia (últimos 7 dias)**
```sql
SELECT 
  DATE(logged_in_at) as data,
  COUNT(*) as total,
  COUNT(CASE WHEN success THEN 1 END) as sucessos
FROM login_audit
WHERE logged_in_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(logged_in_at)
ORDER BY data;
```

### **2. Dispositivos Mais Usados**
```sql
SELECT device, os, browser, COUNT(*) as acessos
FROM login_audit
WHERE success = true
GROUP BY device, os, browser
ORDER BY acessos DESC
LIMIT 5;
```

### **3. Horários de Pico**
```sql
SELECT 
  EXTRACT(HOUR FROM logged_in_at) as hora,
  COUNT(*) as logins
FROM login_audit
WHERE success = true
GROUP BY hora
ORDER BY logins DESC;
```

---

## 🛡️ Segurança

### **Detectar Comportamento Suspeito**

1. **Múltiplas falhas do mesmo usuário:**
```sql
SELECT username, COUNT(*) as tentativas
FROM login_audit
WHERE success = false
  AND logged_in_at > NOW() - INTERVAL '5 minutes'
GROUP BY username
HAVING COUNT(*) >= 5;
```

2. **Logins de locais diferentes rapidamente:**
```sql
SELECT username, device, os, logged_in_at
FROM login_audit
WHERE success = true
  AND username IN (
    SELECT username FROM login_audit
    WHERE success = true
      AND logged_in_at > NOW() - INTERVAL '5 minutes'
    GROUP BY username
    HAVING COUNT(DISTINCT device) > 1
  )
ORDER BY username, logged_in_at;
```

---

## 🧹 Manutenção

### **Limpar logs antigos (executar mensalmente)**
```sql
-- Manter apenas últimos 90 dias
DELETE FROM login_audit 
WHERE logged_in_at < NOW() - INTERVAL '90 days';
```

### **Ver tamanho da tabela**
```sql
SELECT 
  COUNT(*) as total_registros,
  MIN(logged_in_at) as mais_antigo,
  MAX(logged_in_at) as mais_recente
FROM login_audit;
```

---

## 📈 Exportar Relatórios

### **Relatório Mensal de Acessos**
```sql
SELECT 
  u.username,
  u.full_name,
  u.role,
  COUNT(la.id) as total_logins,
  MAX(la.logged_in_at) as ultimo_acesso
FROM users u
LEFT JOIN login_audit la ON u.id = la.user_id AND la.success = true
WHERE la.logged_in_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY u.username, u.full_name, u.role
ORDER BY total_logins DESC;
```

---

## 💡 Dicas

1. **Criar View para consultas frequentes:**
```sql
CREATE VIEW v_login_stats AS
SELECT 
  username,
  login_type,
  DATE(logged_in_at) as data,
  COUNT(*) as tentativas,
  COUNT(CASE WHEN success THEN 1 END) as sucessos
FROM login_audit
GROUP BY username, login_type, DATE(logged_in_at);
```

2. **Habilitar notificações de segurança:**
   - Configure um trigger para enviar email quando houver 5+ falhas
   - Use uma função Lambda/Edge Function do Supabase

3. **Integrar com ferramentas de BI:**
   - Exporte dados para Google Sheets
   - Use Metabase, Grafana ou similar

---

## ✅ Checklist

- [ ] Executei `supabase-schema-complete.sql`
- [ ] A tabela `login_audit` foi criada
- [ ] Fiz login de teste
- [ ] Verifiquei que o registro apareceu na tabela
- [ ] Testei pelo menos 3 queries do arquivo `QUERIES_AUDITORIA.sql`
- [ ] Entendi como detectar comportamento suspeito

**Tudo pronto! Agora você tem controle total sobre quem acessa o sistema!** 🎉
