# ✅ Checklist de Configuração

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 Pré-Instalação

- [ ] Node.js 18+ instalado
  - Verificar: `node -v`
  - Deve mostrar: v18.x.x ou superior
- [ ] npm instalado
  - Verificar: `npm -v`
  - Deve mostrar: 9.x.x ou superior
- [ ] Conta no Supabase criada
  - Acesse: https://app.supabase.com/

## 🔧 Configuração do Supabase

- [ ] Projeto criado no Supabase
  - Nome sugerido: `prefeitura-ponto-eletronico`
  - Região: South America (São Paulo)
- [ ] SQL executado com sucesso
  - Arquivo: `supabase-schema-complete.sql`
  - Local: SQL Editor no Supabase
  - Resultado: "Success. No rows returned"
- [ ] 6 tabelas criadas
  - [ ] users
  - [ ] time_records
  - [ ] shifts
  - [ ] notifications
  - [ ] security_codes
  - [ ] login_audit
- [ ] 4 usuários de teste criados
  - Verificar: `SELECT username FROM users;`
  - Deve listar: admin, encarregado1, funcionario1, funcionario2
- [ ] Credenciais obtidas
  - [ ] Project URL copiada
  - [ ] anon/public key copiada
  - [ ] service_role key copiada (guardada com segurança)

## 📦 Instalação de Dependências

### Frontend

- [ ] Dependências instaladas
  - Comando: `npm install`
  - Verificar: existe `node_modules/` na raiz
- [ ] Build funciona
  - Comando: `npm run build`
  - Deve completar sem erros

### Backend (Opcional)

- [ ] Dependências instaladas
  - Comando: `cd meu-saas-backend && npm install`
  - Verificar: existe `meu-saas-backend/node_modules/`
- [ ] Dependências adicionais instaladas
  - `@nestjs/config`
  - `@supabase/supabase-js`
  - `class-validator`
  - `class-transformer`

## ⚙️ Variáveis de Ambiente

### Frontend (.env.local)

- [ ] Arquivo `.env.local` existe na raiz
- [ ] Variáveis preenchidas:
  - [ ] `VITE_SUPABASE_URL=https://xxxxx.supabase.co`
  - [ ] `VITE_SUPABASE_ANON_KEY=eyJhbGc...`
  - [ ] Valores sem espaços ou aspas extras
- [ ] Arquivo NÃO está no Git
  - Verificar: `.env.local` está em `.gitignore`

### Backend (meu-saas-backend/.env) - Opcional

- [ ] Arquivo `.env` existe em `meu-saas-backend/`
- [ ] Variáveis preenchidas:
  - [ ] `PORT=3000`
  - [ ] `SUPABASE_URL=https://xxxxx.supabase.co`
  - [ ] `SUPABASE_SERVICE_KEY=eyJhbGc...`
  - [ ] `SUPABASE_ANON_KEY=eyJhbGc...`
- [ ] Arquivo NÃO está no Git

## 🚀 Execução

### Frontend

- [ ] Servidor de dev inicia sem erros
  - Comando: `npm run dev`
  - Deve mostrar: "Local: http://localhost:5173/"
- [ ] Navegador abre automaticamente
- [ ] Página carrega sem erros no console
- [ ] Console não mostra erros de Supabase

### Backend (Opcional)

- [ ] Servidor inicia sem erros
  - Comando: `cd meu-saas-backend && npm run start:dev`
  - Deve mostrar: "🚀 Backend rodando em http://localhost:3000/api"
- [ ] Endpoint de health funciona
  - Testar: `curl http://localhost:3000/api`
  - Deve retornar: `{"message":"Hello World!"}`

## 🧪 Testes Funcionais

### Login

- [ ] Página de login carrega
- [ ] Login com admin funciona
  - Username: `admin`
  - Password: `admin123`
  - Deve redirecionar para dashboard
- [ ] Dados do usuário aparecem no header
- [ ] Logout funciona

### Registro de Ponto

- [ ] Página "Registro de Ponto" abre
- [ ] Botão de registrar ponto está visível
- [ ] Ao clicar, mostra notificação de sucesso
- [ ] Registro aparece na lista do dia
- [ ] Horário está correto

### Histórico

- [ ] Página "Histórico" abre
- [ ] Registros anteriores aparecem
- [ ] Filtro por mês funciona
- [ ] Estatísticas são calculadas corretamente

### Auditoria de Login

- [ ] Login é registrado em `login_audit`
  - Verificar no Supabase: `SELECT * FROM login_audit ORDER BY logged_in_at DESC;`
- [ ] Tipo de login está correto (encarregado/funcionario/direto)
- [ ] Browser/OS/Device são detectados

## 🔒 Segurança

- [ ] `.env` e `.env.local` estão em `.gitignore`
- [ ] SERVICE_KEY não está exposta no frontend
- [ ] Senhas estão com hash SHA-256 no banco
- [ ] RLS está desabilitado (apenas desenvolvimento)
  - ⚠️ Para produção: habilitar RLS!

## 📊 Banco de Dados

### Verificações no Supabase

- [ ] Query funciona no SQL Editor:

  ```sql
  SELECT COUNT(*) FROM users;
  ```

  Resultado esperado: 4

- [ ] Query funciona no SQL Editor:

  ```sql
  SELECT COUNT(*) FROM time_records;
  ```

  Resultado esperado: ≥ 0

- [ ] Inserção manual funciona:
  ```sql
  INSERT INTO time_records (user_id, punch_type, punch_time)
  VALUES ('user-admin', 'ENTRADA', NOW())
  RETURNING *;
  ```

## 🎨 Interface

- [ ] Tema dark está ativado
- [ ] Sidebar é visível
- [ ] Botão de voltar funciona
- [ ] Navegação entre páginas funciona
- [ ] Ícones carregam corretamente
- [ ] Responsividade funciona em mobile

## 📱 Responsividade

Testar em diferentes tamanhos:

- [ ] Desktop (1920x1080) - OK
- [ ] Tablet (768x1024) - OK
- [ ] Mobile (375x667) - OK
- [ ] Sidebar se adapta ao tamanho

## 🐛 Troubleshooting Executado

Se encontrou problemas, marque como resolveu:

- [ ] "Cannot find module '@supabase/supabase-js'"

  - Solução: `npm install @supabase/supabase-js`

- [ ] "relation users does not exist"

  - Solução: Executar SQL completo no Supabase

- [ ] "VITE_SUPABASE_URL não configurada"

  - Solução: Criar `.env.local` com credenciais

- [ ] Frontend não conecta ao Supabase

  - Solução: Verificar credenciais em `.env.local`

- [ ] "Failed to fetch" ao fazer login

  - Solução: Verificar se Supabase está online

- [ ] CORS error
  - Solução: Verificar origem em `main.ts` do backend

## 📚 Documentação Lida

- [ ] `INICIO_RAPIDO.md` - Início em 5 minutos
- [ ] `SETUP_DATABASE.md` - Configuração Supabase completa
- [ ] `README_COMPLETO.md` - Visão geral do sistema
- [ ] `meu-saas-backend/SETUP_BACKEND.md` - Backend (se usar)

## 🎯 Objetivos Alcançados

### Mínimo Viável (MVP)

- [ ] Login funciona
- [ ] Registro de ponto salva no banco
- [ ] Histórico exibe registros
- [ ] Auditoria registra logins

### Funcionalidades Extras

- [ ] Dashboard com estatísticas
- [ ] Múltiplos tipos de usuário
- [ ] Sistema de notificações (pendente)
- [ ] Escalas de trabalho (pendente)
- [ ] Backend NestJS configurado

## 🚀 Pronto para Produção?

⚠️ **NÃO vá para produção até completar:**

- [ ] Habilitar RLS no Supabase
- [ ] Configurar policies de segurança
- [ ] Usar HTTPS apenas
- [ ] Configurar rate limiting
- [ ] Implementar JWT com refresh tokens
- [ ] Fazer backup do banco
- [ ] Configurar domínio personalizado
- [ ] SSL/TLS configurado
- [ ] Testes de carga realizados
- [ ] Monitoramento configurado

## ✅ Status Final

Marque quando tudo estiver 100%:

- [ ] **FRONTEND CONFIGURADO E FUNCIONANDO**
- [ ] **BACKEND CONFIGURADO E FUNCIONANDO** (opcional)
- [ ] **BANCO DE DADOS SUPABASE OPERACIONAL**
- [ ] **TODOS OS TESTES PASSARAM**
- [ ] **DOCUMENTAÇÃO LIDA E COMPREENDIDA**

---

## 🎉 Parabéns!

Se todos os itens estão marcados, seu sistema está pronto para uso em desenvolvimento!

**Próximo passo**: Implementar funcionalidades pendentes (Perfil, Notificações, Escalas)

**Data de conclusão**: **_/_**/**\_\_**
**Configurado por**: ********\_********
