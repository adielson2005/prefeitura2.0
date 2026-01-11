# ⚡ Início Rápido - 5 Minutos

Siga estes passos para ter o sistema rodando rapidamente.

## 🎯 Pré-requisitos

- Node.js 18+ instalado ([Download](https://nodejs.org/))
- Conta no Supabase ([Criar conta grátis](https://supabase.com/))

## 🚀 Passo a Passo

### 1. Instalar Dependências (1 minuto)

**Windows (PowerShell):**

```powershell
.\install.ps1
```

**Linux/Mac:**

```bash
chmod +x install.sh
./install.sh
```

**Ou manualmente:**

```bash
npm install
cd meu-saas-backend
npm install
cd ..
```

### 2. Configurar Supabase (2 minutos)

1. Acesse [Supabase](https://app.supabase.com/)
2. Crie novo projeto: "prefeitura-ponto"
3. Vá em **SQL Editor**
4. Copie TODO o conteúdo de `supabase-schema-complete.sql`
5. Cole e clique em **Run**

✅ Deve criar 6 tabelas + 4 usuários de teste

### 3. Obter Credenciais (1 minuto)

1. No Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1...`

### 4. Configurar Variáveis (1 minuto)

Edite `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Rodar Sistema (30 segundos)

```bash
npm run dev
```

Abra: **http://localhost:5173**

### 6. Fazer Login

```
Username: admin
Password: admin123
```

## 🎉 Pronto!

Você já pode:

- ✅ Registrar pontos
- ✅ Ver histórico
- ✅ Acessar dashboard
- ✅ Trocar de usuário

## 🔄 Outros Usuários de Teste

| Username     | Senha    | Tipo          |
| ------------ | -------- | ------------- |
| admin        | admin123 | Administrador |
| encarregado1 | enc123   | Supervisor    |
| funcionario1 | func123  | Funcionário   |
| funcionario2 | func123  | Funcionário   |

## 🆘 Problemas?

### Não conecta ao Supabase

```bash
# Verifique se o .env.local existe
cat .env.local  # Linux/Mac
type .env.local # Windows

# Se não existir, copie do exemplo
cp .env.local.example .env.local
```

### Erro "Table does not exist"

- Execute o SQL completo no Supabase SQL Editor
- Verifique se todas as 6 tabelas foram criadas

### Login não funciona

- Confirme que executou TODO o SQL (incluindo INSERT de usuários)
- Tente: `admin` / `admin123`

## 📚 Quer mais?

- **Backend opcional**: `meu-saas-backend/SETUP_BACKEND.md`
- **Guia completo**: `SETUP_DATABASE.md`
- **Documentação**: `README_COMPLETO.md`

---

**Tempo total: ~5 minutos** ⏱️
