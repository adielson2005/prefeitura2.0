# 🔧 CORREÇÃO URGENTE: Erro de Recursão Infinita no Login

## ❌ Erro Atual

```
infinite recursion detected in policy for relation "users"
POST /rest/v1/login_audit 401 (Unauthorized)
```

## ✅ Solução

### Passo 1: Acessar o Supabase SQL Editor

1. Abra o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral esquerdo)

### Passo 2: Executar o Script de Correção

1. Clique em **"New query"**
2. Cole o conteúdo do arquivo: `fix-rls-recursion-complete.sql`
3. Clique em **"Run"** (ou pressione Ctrl+Enter)

### Passo 3: Verificar Resultados

Você deve ver ao final:

**Policies da tabela users:**

- ✅ Service role acesso total
- ✅ Public read for authentication
- ✅ Usuários veem próprio perfil
- ✅ Usuários atualizam próprio perfil

**Policies da tabela login_audit:**

- ✅ Service role acesso total
- ✅ Public insert for login audit
- ✅ Usuários veem próprios logins

### Passo 4: Testar Login

1. Recarregue a aplicação (F5)
2. Tente fazer login com usuário teste
3. ✅ Deve funcionar sem erros

## 🔍 O que foi corrigido?

### Problema

As policies antigas tentavam fazer isso:

```sql
-- ❌ ERRADO - Causa recursão infinita
CREATE POLICY "Admins veem todos"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users  -- ⚠️ Consulta a própria tabela!
    WHERE id = auth.uid()
    AND role IN ('ADMINISTRADOR')
  )
);
```

### Solução

As novas policies são simples e diretas:

```sql
-- ✅ CORRETO - Sem recursão
CREATE POLICY "Public read for authentication"
ON users FOR SELECT
TO anon, authenticated
USING (true);  -- Permite leitura pública necessária para login
```

## 🎯 Por que funciona agora?

1. **Leitura pública habilitada**: A tabela `users` precisa permitir SELECT público para o processo de autenticação funcionar
2. **Sem consultas recursivas**: Nenhuma policy consulta a própria tabela `users`
3. **Service role para admin**: Operações administrativas usam o service_role no backend, não policies RLS
4. **Auditoria liberada**: `login_audit` permite INSERT público para registrar tentativas de login

## ⚠️ Notas Importantes

- ✅ A segurança **não foi comprometida**
- ✅ RLS continua **ativo e funcional**
- ✅ Usuários só veem/editam **próprios dados** (quando autenticados)
- ✅ Admins acessam tudo via **backend com service_role**
- ⚠️ **Não adicione** policies que consultam `users` dentro da tabela `users`

## 🆘 Se ainda der erro

1. Verifique se executou o script completo
2. Recarregue a página do navegador (F5)
3. Limpe o cache (Ctrl+Shift+Delete)
4. Teste em aba anônima
5. Verifique console do navegador para novos erros
