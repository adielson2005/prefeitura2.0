# 🔧 Corrigindo Erro de Upload de Avatar

## ❌ Problema

```
Failed to load resource: net::ERR_CONNECTION_REFUSED
Erro no upload: TypeError: Failed to fetch
```

## ✅ Solução Implementada

O sistema foi atualizado para usar **Supabase Storage** em vez do backend Node.js. Isso elimina a necessidade de um servidor separado para uploads.

---

## 📋 Configuração Necessária (5 minutos)

### Passo 1: Criar Bucket no Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Menu lateral → **Storage**
4. Clique em **"Create a new bucket"**
5. Configure:
   - **Name**: `user-files`
   - **Public bucket**: ✅ **MARCAR COMO PÚBLICO**
   - **File size limit**: `2097152` (2MB)
   - Allowed MIME types: `image/*`
6. Clique em **"Create bucket"**

### Passo 2: Configurar Políticas de Segurança

**OPÇÃO A - Script Completo (Recomendado):**

1. No Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Cole o conteúdo do arquivo `supabase-storage-setup.sql`
4. Clique em **"Run"**

**OPÇÃO B - Se der erro, use o script mínimo:**

1. Use o arquivo `supabase-storage-minimo.sql`
2. Execute **UMA LINHA POR VEZ** no SQL Editor
3. Se uma linha der erro "already exists", pule para a próxima

**OPÇÃO C - Manual (Pelo Dashboard):**

1. No Supabase, vá em **Storage** → **user-files**
2. Clique em **"Policies"**
3. Clique em **"New Policy"**
4. Escolha **"For full customization"**
5. Crie 4 políticas:
   - **INSERT**: Target roles = `authenticated`, Policy = `bucket_id = 'user-files'`
   - **SELECT**: Target roles = `public`, Policy = `bucket_id = 'user-files'`
   - **UPDATE**: Target roles = `authenticated`, Policy = `bucket_id = 'user-files'`
   - **DELETE**: Target roles = `authenticated`, Policy = `bucket_id = 'user-files'`

### Passo 3: Testar o Sistema

1. Atualize a página da aplicação (F5)
2. Faça login
3. Vá em **Perfil**
4. Clique no **ícone da câmera**
5. Selecione uma imagem
6. Clique em **Confirmar**
7. ✅ Deve funcionar!

---

## 🔍 Verificando se Está Funcionando

### No Navegador (Console):

Antes (❌ Erro):

```
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

Depois (✅ Sucesso):

```
Upload concluído com sucesso
Avatar atualizado
```

### No Supabase Dashboard:

1. Vá em **Storage** → **user-files**
2. Pasta **avatars** deve aparecer
3. Arquivos com formato: `{userId}-{timestamp}.{ext}`

---

## 📂 Arquivos Alterados

- ✅ `src/components/AvatarUpload.tsx` - Agora usa Supabase Storage
- ✅ `GUIA_AVATAR.md` - Documentação atualizada
- ✅ `supabase-storage-setup.sql` - Script de configuração

---

## 🎯 O Que Mudou

### Antes:

```typescript
// Tentava conectar ao backend Node.js (porta 3000)
await apiService.uploadFile(file, userId, "avatar");
// ❌ Erro se backend não estiver rodando
```

### Depois:

```typescript
// Upload direto para Supabase Storage
const { data } = await supabase.storage
  .from("user-files")
  .upload(`avatars/${fileName}`, file);
// ✅ Funciona sempre!
```

---

## 🚨 Troubleshooting

### Erro: "bucket not found"

➡️ Você não criou o bucket `user-files` no Supabase

### Erro: "new row violates row-level security"

➡️ Execute o script `supabase-storage-setup.sql` no SQL Editor

### Erro: "bucket not found"

➡️ Você não criou o bucket `user-files` no Supabase Storage

### Erro: "policy already exists"

➡️ **Isso é normal!** Significa que já foi configurado. Ignore e continue.

### Erro: "new row violates row-level security"

➡️ As políticas não foram criadas. Use a OPÇÃO C (manual) do Passo 2

### Erro: "File too large"

➡️ A imagem tem mais de 2MB. Reduza o tamanho

### Erro: "Invalid mime type"

➡️ Use apenas JPG, PNG ou GIF

### Script SQL dá erro ao executar

➡️ Use o `supabase-storage-minimo.sql` e execute linha por linha

---

## 💡 Vantagens da Nova Solução

✅ Não precisa do backend Node.js rodando  
✅ Upload mais rápido (direto ao Supabase)  
✅ Mais seguro (políticas RLS)  
✅ Mais confiável (infraestrutura Supabase)  
✅ Grátis (até 1GB no plano gratuito)  
✅ CDN global (imagens carregam rápido em qualquer lugar)

---

## 📞 Ainda com Problemas?

1. Verifique se o bucket foi criado como **público**
2. Confirme que executou o SQL completo
3. Limpe o cache do navegador (Ctrl + Shift + Delete)
4. Tente com uma imagem diferente (JPG pequena)
5. Verifique o console do navegador para erros específicos

---

**Última atualização**: 13/01/2026  
**Status**: ✅ Pronto para usar
