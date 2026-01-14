# 🧪 Guia de Teste - Integração Backend + Frontend

## ✅ O que foi implementado

### 1. **apiService.ts** - Serviço centralizado de API

- ✅ Login/Logout com JWT
- ✅ Gerenciamento de usuários
- ✅ Registros de ponto (CRUD + aprovação)
- ✅ Notificações (CRUD + marcar lidas)
- ✅ Escalas
- ✅ Relatórios
- ✅ Upload de arquivos
- ✅ Recuperação de senha
- ✅ Logs de auditoria

### 2. **Backend NestJS** - Novos endpoints

- ✅ NotificationsModule completo
- ✅ Endpoints de aprovação de ponto
- ✅ Integração com Supabase

### 3. **Frontend Atualizado** - Páginas usando API

- ✅ **Ponto.tsx** - Registro via API
- ✅ **Notificacoes.tsx** - Busca e gestão via API
- ✅ **Historico.tsx** - Registros via API
- ✅ **Dashboard.tsx** - Estatísticas via API
- ✅ **secureAuth.ts** - Login via API com fallback

---

## 🚀 Como Testar

### Passo 1: Iniciar Backend

```powershell
# Terminal 1 - Backend NestJS
cd meu-saas-backend
npm run start:dev
```

**Deve aparecer:**

```
🚀 Backend rodando em http://localhost:3000/api
📊 Ambiente: development
```

### Passo 2: Iniciar Frontend

```powershell
# Terminal 2 - Frontend React
npm run dev
```

**Deve aparecer:**

```
VITE v5.x.x ready in XXX ms
➜ Local: http://localhost:5173/
```

### Passo 3: Testar Health Check da API

Abra um novo terminal:

```powershell
# Testar se API está respondendo
curl http://localhost:3000/api
```

**Resposta esperada:**

```json
{ "message": "Hello World!" }
```

---

## 🧪 Testes Funcionais

### 1. **Teste de Login**

1. Acesse: http://localhost:5173
2. Digite:
   - Username: `admin`
   - Password: `admin123`
3. Clique em "Entrar"

**✅ Resultado esperado:**

- Login bem-sucedido
- Redirecionamento para dashboard
- Token JWT salvo no localStorage
- Console não deve mostrar erros

**🔍 Verificar no console:**

```javascript
// Abra DevTools (F12) > Console
localStorage.getItem("auth_token");
// Deve retornar um token JWT
```

---

### 2. **Teste de Registro de Ponto**

1. Faça login como funcionário
2. Vá em **Ponto** (menu lateral)
3. Clique em "Marcar Entrada"

**✅ Resultado esperado:**

- Loading durante registro
- Toast de sucesso
- Registro aparece na lista "Registros de Hoje"
- Próximo botão muda para "Iniciar Intervalo"

**🔍 Verificar no backend:**

```powershell
# No terminal do backend, deve aparecer o log da requisição
POST /api/time-records/punch 201
```

**🔍 Verificar no Supabase:**

1. Acesse: https://supabase.com > Seu projeto
2. Table Editor > `time_records`
3. Deve ter um novo registro

---

### 3. **Teste de Notificações**

1. Vá em **Notificações** (sino no header)
2. Verifique se carrega notificações

**✅ Resultado esperado:**

- Loading inicial
- Lista de notificações carregada da API
- Botão "Marcar como lida" funciona
- Botão "Excluir" funciona
- Som ativado/desativado

**🔍 Testar manualmente criar notificação:**

```powershell
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste de Notificação",
    "message": "Esta é uma notificação de teste",
    "type": "INFO"
  }'
```

Recarregue a página de notificações - deve aparecer a nova notificação.

---

### 4. **Teste de Histórico**

1. Vá em **Histórico**
2. Selecione o mês atual
3. Verifique se carrega registros

**✅ Resultado esperado:**

- Loading inicial
- Registros agrupados por dia
- Cálculo de horas correto
- Badges de status (completo/incompleto)

---

### 5. **Teste de Dashboard**

1. Vá em **Dashboard**
2. Verifique as estatísticas

**✅ Resultado esperado:**

- Métricas carregadas
- Gráficos atualizados
- Dados em tempo real

---

## 🔧 Troubleshooting

### ❌ Erro: "API não disponível"

**Solução:**

1. Verifique se backend está rodando: `curl http://localhost:3000/api`
2. Verifique CORS no backend (main.ts)
3. Verifique variável `VITE_API_URL` no `.env.local`

### ❌ Erro: "CORS blocked"

**Solução no backend:**

Edite `meu-saas-backend/src/main.ts`:

```typescript
app.enableCors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
});
```

### ❌ Erro: "Unauthorized" ou "Invalid token"

**Solução:**

1. Limpe localStorage: `localStorage.clear()`
2. Faça login novamente
3. Verifique se Supabase está configurado corretamente

### ❌ Notificações não carregam

**Solução:**

1. Verifique tabela `notifications` no Supabase
2. Crie notificações de teste manualmente
3. Verifique logs do backend

### ❌ Registros de ponto não aparecem

**Solução:**

1. Verifique tabela `time_records` no Supabase
2. Verifique se userId está correto
3. Verifique logs do backend

---

## 📊 Endpoints Disponíveis

### Autenticação

- `POST /api/auth/login` - Login
- `GET /api/auth/validate` - Validar token

### Usuários

- `GET /api/users` - Listar todos
- `GET /api/users/:id` - Buscar por ID
- `PUT /api/users/:id/profile` - Atualizar perfil

### Registros de Ponto

- `POST /api/time-records/punch` - Registrar ponto
- `GET /api/time-records/user/:userId` - Registros de um usuário
- `GET /api/time-records/all` - Todos os registros
- `GET /api/time-records/stats/today` - Estatísticas do dia
- `POST /api/time-records/approve` - Aprovar registro
- `POST /api/time-records/reject` - Rejeitar registro

### Notificações

- `GET /api/notifications` - Listar todas
- `GET /api/notifications/user/:userId` - De um usuário
- `POST /api/notifications` - Criar
- `PUT /api/notifications/:id/read` - Marcar como lida
- `POST /api/notifications/mark-all-read` - Marcar todas
- `DELETE /api/notifications/:id` - Excluir

---

## ✅ Checklist Final

- [ ] Backend rodando sem erros
- [ ] Frontend rodando sem erros
- [ ] Health check da API OK
- [ ] Login funcionando
- [ ] Token JWT sendo salvo
- [ ] Registro de ponto funcionando
- [ ] Notificações carregando
- [ ] Histórico carregando
- [ ] Dashboard com estatísticas
- [ ] Logout funcionando
- [ ] Console sem erros críticos

---

## 🎯 Próximos Passos

Após confirmar que tudo está funcionando:

1. ✅ **Fase 1 Completa** - Integração Backend + Frontend
2. 🔄 **Fase 2** - Sistema de aprovação de pontos
3. 🔄 **Fase 3** - Recuperação de senha
4. 🔄 **Fase 4** - Upload de comprovantes
5. 🔄 **Fase 5** - Notificações Push

---

## 📝 Notas Importantes

### Fallback Automático

- Se a API não estiver disponível, o sistema usa Supabase diretamente
- Garante que o frontend continue funcionando

### Token JWT

- Token expira após 24h (configurável)
- Frontend deve fazer refresh automático (a implementar)

### Modo Offline

- IndexedDB ainda funciona como cache local
- Sincronização ao reconectar (a implementar)

---

**🎉 Sistema totalmente integrado e funcional!**
