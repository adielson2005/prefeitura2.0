# 🔧 TESTE DE DIAGNÓSTICO - Upload Avatar

## Criado um componente de teste em:

`src/components/TesteUpload.tsx`

## 📋 Como Usar:

### Opção 1: Adicionar Manualmente

1. Abra o arquivo: `src/pages/Perfil.tsx`

2. Adicione o import no topo:

```typescript
import { TesteUpload } from "@/components/TesteUpload";
```

3. Adicione o componente logo após `<div className="max-w-3xl space-y-6">`:

```typescript
<TesteUpload />
```

4. Salve e recarregue a página

5. Vá em **Perfil** - você verá dois botões de teste no topo

---

### Opção 2: Testar no Console do Navegador

Abra o Console (F12) e cole este código:

```javascript
// Teste 1: Verificar autenticação
const { data: userData } = await supabase.auth.getUser();
console.log("✅ Usuário:", userData.user?.email);

// Teste 2: Listar buckets
const { data: buckets } = await supabase.storage.listBuckets();
console.log(
  "✅ Buckets:",
  buckets.map((b) => `${b.name} (${b.public ? "público" : "privado"})`)
);

// Teste 3: Testar acesso ao bucket
const { data: files, error } = await supabase.storage.from("user-files").list();
console.log("✅ Arquivos no bucket:", files?.length || 0);
console.log("❌ Erro:", error);
```

---

## 🎯 O que os Testes Verificam:

✅ **Teste 1 - Conexão**: Verifica se está autenticado  
✅ **Teste 2 - Upload**: Tenta fazer upload real de um arquivo

---

## 📊 Resultados Esperados:

### ✅ SUCESSO:

```
✅ Usuário: seu-email@exemplo.com
ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

✅ Buckets encontrados: user-files

✅ Bucket 'user-files' encontrado!
Público: true

✅ Bucket acessível! Arquivos: 0

🎉 Tudo certo! Pode fazer upload!
```

### ❌ ERRO COMUM:

```
❌ Bucket 'user-files' NÃO encontrado!
```

**Solução**: O bucket não foi criado. Criar no Supabase Dashboard.

```
❌ Erro: Usuário não está autenticado!
```

**Solução**: Fazer login novamente.

```
❌ Erro ao acessar bucket: new row violates row-level security
```

**Solução**: Faltam as políticas RLS. Execute o `supabase-storage-minimo.sql`

---

## 🚀 Próximos Passos:

1. Execute um dos testes acima
2. Copie e cole aqui o resultado completo
3. Vou analisar e dar a solução exata

---

**Criado em**: 13/01/2026  
**Arquivo do componente**: `src/components/TesteUpload.tsx`
