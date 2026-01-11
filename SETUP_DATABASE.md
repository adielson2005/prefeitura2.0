# 🚀 Guia de Configuração do Banco de Dados Supabase

Este guia mostra como configurar completamente o banco de dados Supabase para o sistema de ponto eletrônico.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com/)
- Projeto criado no Supabase
- Acesso ao SQL Editor do Supabase

## 🔧 Passo a Passo

### 1️⃣ Criar Projeto no Supabase

1. Acesse [https://app.supabase.com/](https://app.supabase.com/)
2. Clique em "New Project"
3. Preencha:
   - **Name**: `prefeitura-ponto-eletronico`
   - **Database Password**: [Escolha uma senha forte]
   - **Region**: `South America (São Paulo)`
4. Clique em "Create new project"

### 2️⃣ Executar Schema SQL

1. No painel do Supabase, vá em **SQL Editor** (ícone de banco de dados)
2. Clique em "New Query"
3. Abra o arquivo `supabase-schema-complete.sql` na raiz do projeto
4. Copie TODO o conteúdo do arquivo
5. Cole no SQL Editor
6. Clique em "Run" (ou pressione Ctrl+Enter)

✅ **Resultado esperado**:

```
Success. 6 tables created.
Sample data inserted: 4 users, 12 test records.
```

### 3️⃣ Verificar Tabelas Criadas

Vá em **Table Editor** e confirme que existem 6 tabelas:

- ✅ `users` - Usuários do sistema (4 usuários de teste)
- ✅ `time_records` - Registros de ponto (12 registros de teste)
- ✅ `shifts` - Escalas de trabalho
- ✅ `notifications` - Notificações
- ✅ `security_codes` - Códigos de segurança
- ✅ `login_audit` - Auditoria de logins

### 4️⃣ Obter Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: (chave pública)
   - **service_role key**: (chave admin - GUARDE COM SEGURANÇA!)

### 5️⃣ Configurar Variáveis de Ambiente

#### Frontend (Vite)

1. Na raiz do projeto, copie `.env.local.example` para `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Edite `.env.local` e preencha:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
   VITE_API_URL=http://localhost:3000
   VITE_MODE=development
   ```

#### Backend NestJS (opcional)

1. Entre na pasta `meu-saas-backend`:

   ```bash
   cd meu-saas-backend
   ```

2. Copie `.env.example` para `.env`:

   ```bash
   cp .env.example .env
   ```

3. Edite `.env` e preencha:
   ```env
   PORT=3000
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_KEY=sua-service-role-key-aqui
   SUPABASE_ANON_KEY=sua-anon-key-aqui
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   JWT_SECRET=gere-uma-chave-aleatoria-forte
   NODE_ENV=development
   ```

### 6️⃣ Configurar RLS (Row Level Security)

⚠️ **IMPORTANTE**: O schema atual vem com RLS DESABILITADO para facilitar testes.

Para produção, você deve habilitar RLS:

1. Vá em **Authentication** → **Policies**
2. Para cada tabela, clique em "Enable RLS"
3. Adicione policies conforme necessário

Exemplo de policy para `time_records`:

```sql
-- Funcionários só podem ver seus próprios registros
CREATE POLICY "Users can view own records"
ON time_records FOR SELECT
USING (auth.uid()::text = user_id);

-- Encarregados podem ver todos os registros
CREATE POLICY "Managers can view all records"
ON time_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()::text
    AND role IN ('SUPERVISOR', 'GERENTE', 'ADMINISTRADOR')
  )
);
```

### 7️⃣ Testar Configuração

Execute no SQL Editor para verificar:

```sql
-- Ver todos os usuários
SELECT username, email, role FROM users;

-- Ver registros de ponto
SELECT u.username, tr.punch_type, tr.punch_time
FROM time_records tr
JOIN users u ON u.id = tr.user_id
ORDER BY tr.punch_time DESC
LIMIT 10;

-- Ver auditoria de login
SELECT username, login_type, success, logged_in_at
FROM login_audit
ORDER BY logged_in_at DESC
LIMIT 10;
```

## 👥 Usuários de Teste

O schema cria automaticamente 4 usuários para teste:

| Username     | Email                         | Senha    | Role          |
| ------------ | ----------------------------- | -------- | ------------- |
| admin        | admin@prefeitura.gov.br       | admin123 | ADMINISTRADOR |
| encarregado1 | encarregado@prefeitura.gov.br | enc123   | SUPERVISOR    |
| funcionario1 | func1@prefeitura.gov.br       | func123  | VIGILANTE     |
| funcionario2 | func2@prefeitura.gov.br       | func123  | VIGIA         |

## 🔍 Consultas de Auditoria

O schema inclui 12 queries de auditoria prontas. Para usá-las, copie do arquivo SQL (estão comentadas no final).

Exemplos:

```sql
-- 1. Logins nas últimas 24 horas
SELECT * FROM login_audit
WHERE logged_in_at > NOW() - INTERVAL '24 hours'
ORDER BY logged_in_at DESC;

-- 2. Logins falhados
SELECT * FROM login_audit
WHERE success = false
ORDER BY logged_in_at DESC;

-- 3. Uso por tipo (encarregado vs funcionário)
SELECT login_type, COUNT(*) as total
FROM login_audit
GROUP BY login_type;
```

## 🛠️ Comandos Úteis

### Limpar dados de teste (cuidado!)

```sql
TRUNCATE TABLE time_records CASCADE;
TRUNCATE TABLE login_audit CASCADE;
```

### Resetar tudo e começar de novo

```sql
-- Execute o schema completo novamente
-- Isso usa DROP TABLE IF EXISTS, então é seguro
```

### Adicionar novo usuário manualmente

```sql
INSERT INTO users (id, username, email, password_hash, role, full_name)
VALUES (
  'user-' || gen_random_uuid()::text,
  'novouser',
  'novouser@prefeitura.gov.br',
  -- Senha: senha123 (SHA-256)
  'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
  'VIGILANTE',
  'Novo Usuário'
);
```

## 📊 Monitoramento

### Verificar status do banco

- Vá em **Database** → **Database** para ver uso de espaço
- Vá em **Database** → **Logs** para ver logs de queries

### Backups automáticos

- Supabase faz backups automáticos diários
- Configure em **Settings** → **Database** → **Backups**

## 🆘 Troubleshooting

### Erro: "relation users does not exist"

- ✅ Execute o schema SQL completo novamente

### Erro: "duplicate key value violates unique constraint"

- ✅ O schema já foi executado antes. Use DROP TABLE ou ignore o erro

### Erro: "column does not exist"

- ✅ Verifique se executou TODO o schema, não apenas parte dele

### Erro ao conectar do frontend

- ✅ Verifique se `.env.local` existe e está preenchido
- ✅ Confirme que a URL e chave estão corretas
- ✅ Reinicie o servidor de desenvolvimento: `npm run dev`

## 🔐 Segurança

### Para Desenvolvimento

- ✅ RLS desabilitado (mais fácil testar)
- ✅ Usar apenas `anon key`

### Para Produção

- ⚠️ **HABILITE RLS EM TODAS AS TABELAS**
- ⚠️ Crie policies específicas por role
- ⚠️ Nunca exponha `service_role key` no frontend
- ⚠️ Use HTTPS apenas
- ⚠️ Configure rate limiting no Supabase

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## ✅ Checklist Final

Antes de colocar em produção:

- [ ] Schema SQL executado com sucesso
- [ ] 6 tabelas criadas e visíveis no Table Editor
- [ ] Variáveis de ambiente configuradas (frontend + backend)
- [ ] Usuários de teste criados
- [ ] Login funcionando (teste com admin/admin123)
- [ ] RLS habilitado e policies configuradas
- [ ] Backups automáticos ativados
- [ ] service_role key guardada com segurança
- [ ] Frontend conectando ao Supabase
- [ ] Registros de ponto salvando corretamente
- [ ] Auditoria de login funcionando

---

**Pronto!** 🎉 Seu banco de dados Supabase está configurado e pronto para uso!
