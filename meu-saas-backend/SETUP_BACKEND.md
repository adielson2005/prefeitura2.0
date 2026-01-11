# 🚀 Guia de Setup Completo - Backend NestJS

## 📦 Instalação de Dependências

### 1. Instalar dependências obrigatórias

Entre na pasta do backend:

```bash
cd meu-saas-backend
```

Instale as dependências do NestJS:

```bash
npm install @nestjs/config @supabase/supabase-js class-validator class-transformer
```

### 2. Verificar instalação

Confirme que o `package.json` tem as dependências:

```json
{
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/config": "^3.x.x",
    "@nestjs/core": "^11.0.1",
    "@nestjs/platform-express": "^11.0.1",
    "@supabase/supabase-js": "^2.x.x",
    "class-validator": "^0.14.x",
    "class-transformer": "^0.5.x",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  }
}
```

## ⚙️ Configuração

### 1. Criar arquivo .env

Na pasta `meu-saas-backend`, copie o exemplo:

```bash
cp .env.example .env
```

### 2. Preencher variáveis de ambiente

Edite `.env` com suas credenciais do Supabase:

```env
PORT=3000

# Supabase (obtenha em: https://app.supabase.com > Settings > API)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database URL (opcional - para Prisma)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# JWT (opcional - para autenticação customizada)
JWT_SECRET=sua-chave-super-secreta-aleatoria-aqui

# Ambiente
NODE_ENV=development
```

⚠️ **IMPORTANTE**: A `SUPABASE_SERVICE_KEY` é secreta! Nunca compartilhe ou commite no Git.

## 🏃 Executar Backend

### Modo desenvolvimento (com hot-reload)

```bash
npm run start:dev
```

Você deve ver:

```
🚀 Backend rodando em http://localhost:3000/api
📊 Ambiente: development
```

### Modo produção

```bash
npm run build
npm run start:prod
```

## 🧪 Testar API

### 1. Testar endpoint de saúde

```bash
curl http://localhost:3000/api
```

Resposta esperada:

```json
{
  "message": "Hello World!"
}
```

### 2. Testar login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "loginType": "direto"
  }'
```

Resposta esperada:

```json
{
  "success": true,
  "user": {
    "id": "user-xxxx",
    "username": "admin",
    "email": "admin@prefeitura.gov.br",
    "role": "ADMINISTRADOR",
    "full_name": "Administrador do Sistema"
  },
  "message": "Login realizado com sucesso"
}
```

### 3. Testar registros de ponto

```bash
curl http://localhost:3000/api/time-records/stats/today
```

### 4. Listar usuários

```bash
curl http://localhost:3000/api/users
```

## 📁 Estrutura do Backend

```
meu-saas-backend/
├── src/
│   ├── auth/                    # Autenticação
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── users/                   # Gerenciamento de usuários
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── time-records/            # Registros de ponto
│   │   ├── time-records.module.ts
│   │   ├── time-records.controller.ts
│   │   └── time-records.service.ts
│   ├── supabase/                # Configuração Supabase
│   │   └── supabase.module.ts
│   ├── app.module.ts            # Módulo principal
│   └── main.ts                  # Entrada da aplicação
├── .env                         # Variáveis de ambiente (NÃO COMMITAR!)
├── .env.example                 # Exemplo de variáveis
└── package.json
```

## 🔌 Endpoints Disponíveis

### Autenticação

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/validate` - Validar token/usuário

### Usuários

- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id/profile` - Atualizar perfil

### Registros de Ponto

- `POST /api/time-records/punch` - Registrar novo ponto
- `GET /api/time-records/user/:userId` - Registros de um usuário
- `GET /api/time-records/all` - Todos os registros (admin)
- `GET /api/time-records/stats/today` - Estatísticas do dia

## 🔧 Integração com Frontend

### Atualizar frontend para usar backend

Edite `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_API_URL=http://localhost:3000/api
VITE_USE_BACKEND=true
```

### Criar serviço de API no frontend

Crie `src/lib/apiService.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiService = {
  async login(username: string, password: string, loginType?: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, loginType }),
    });
    return response.json();
  },

  async registerPunch(userId: string, punchType: string, location?: any) {
    const response = await fetch(`${API_URL}/time-records/punch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, punchType, location }),
    });
    return response.json();
  },
};
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@nestjs/config'"

```bash
npm install @nestjs/config
```

### Erro: "Cannot find module '@supabase/supabase-js'"

```bash
npm install @supabase/supabase-js
```

### Erro: "SUPABASE_URL não configurada"

- Verifique se o arquivo `.env` existe na pasta `meu-saas-backend`
- Confirme que as variáveis estão sem espaços: `SUPABASE_URL=https://...`

### Porta 3000 já está em uso

Altere a porta no `.env`:

```env
PORT=3001
```

### CORS error no frontend

- Confirme que o frontend está rodando em `http://localhost:5173`
- Verifique o array de origens em `main.ts`

## 🔒 Segurança

### Desenvolvimento

- ✅ CORS habilitado apenas para localhost
- ✅ Validação de dados com class-validator
- ✅ SERVICE_KEY usado apenas no backend

### Produção

- ⚠️ Alterar origens CORS para domínio real
- ⚠️ Usar HTTPS
- ⚠️ Habilitar rate limiting
- ⚠️ Adicionar autenticação JWT
- ⚠️ Nunca expor SERVICE_KEY

## 📊 Próximos Passos

1. ✅ Backend configurado
2. ✅ Supabase integrado
3. ✅ Endpoints básicos funcionando
4. ⬜ Adicionar autenticação JWT
5. ⬜ Implementar middleware de auth
6. ⬜ Adicionar testes unitários
7. ⬜ Deploy em produção

## 🆘 Suporte

Se tiver problemas:

1. Verifique os logs do terminal
2. Confirme que o Supabase está configurado (ver `SETUP_DATABASE.md`)
3. Teste os endpoints com curl/Postman
4. Verifique se todas as dependências estão instaladas

---

**Pronto!** 🎉 Seu backend NestJS está configurado e rodando!
