# 🚀 Configuração Rápida - Upload de Avatar (2 minutos)

## ⚡ Passo a Passo Visual

### 1️⃣ Criar Bucket (1 minuto)

```
Supabase Dashboard
    ↓
[Storage] (menu lateral)
    ↓
[Create a new bucket] (botão verde)
    ↓
Preencha:
    Name: user-files
    Public: ☑️ MARCAR COMO PÚBLICO
    ↓
[Create bucket]
```

### 2️⃣ Configurar Permissões (1 minuto)

**OPÇÃO FÁCIL - Manual:**

```
Supabase Dashboard
    ↓
[Storage] → [user-files]
    ↓
[Policies] (aba)
    ↓
[New Policy] → [For full customization]
    ↓
Criar 4 políticas:
```

#### Política 1: Permitir Upload

- **Policy name**: `Permitir upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'user-files'`

#### Política 2: Leitura Pública

- **Policy name**: `Leitura pública`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'user-files'`

#### Política 3: Permitir Atualização

- **Policy name**: `Permitir atualização`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'user-files'`

#### Política 4: Permitir Exclusão

- **Policy name**: `Permitir exclusão`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'user-files'`

---

**OPÇÃO RÁPIDA - SQL:**

1. Vá em **SQL Editor**
2. Cole isto:

```sql
-- Adicionar coluna
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 4 políticas
CREATE POLICY "Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'user-files');
CREATE POLICY "Leitura" ON storage.objects FOR SELECT TO public USING (bucket_id = 'user-files');
CREATE POLICY "Atualizar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'user-files');
CREATE POLICY "Deletar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'user-files');
```

3. Clique em **Run**

Se der erro "already exists" = já está configurado! ✅

---

### 3️⃣ Testar

1. Volte para a aplicação
2. Recarregue a página (F5)
3. Login → Perfil
4. Clique no ícone da câmera
5. Selecione uma foto
6. Confirmar
7. ✅ Deve funcionar!

---

## ❓ Deu Erro?

| Erro                    | Solução                                   |
| ----------------------- | ----------------------------------------- |
| `bucket not found`      | Não criou o bucket. Volte ao Passo 1      |
| `policy already exists` | Normal! Já está configurado ✅            |
| `row-level security`    | Faltam as políticas. Faça Passo 2         |
| `Failed to fetch`       | Bucket não é público. Recrie como público |

---

## ✅ Como Saber se Funcionou?

**No console do navegador (F12):**

- ❌ Antes: `ERR_CONNECTION_REFUSED`
- ✅ Depois: Nenhum erro vermelho

**No Supabase Storage:**

- Pasta `avatars` aparece
- Arquivo com seu avatar dentro

**Na aplicação:**

- Foto aparece no perfil imediatamente
- Toast verde de sucesso ✅

---

**Tempo total**: ~2 minutos  
**Dificuldade**: ⭐⭐☆☆☆
