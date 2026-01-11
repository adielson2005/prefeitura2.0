# ✅ Checklist de Integração Supabase

## 📋 Configuração Inicial (30 minutos)

### 1. Criar Projeto no Supabase
- [ ] Acessar https://supabase.com
- [ ] Criar nova conta (se necessário)
- [ ] Clicar em "New Project"
- [ ] Preencher:
  - Nome: `prefeitura-ponto`
  - Senha do banco: [anotar em local seguro]
  - Região: South America (São Paulo)
- [ ] Aguardar provisionamento (2-3 minutos)

### 2. Executar Schema do Banco
- [ ] Ir em SQL Editor no menu lateral
- [ ] Clicar em "New Query"
- [ ] Abrir arquivo `supabase-schema.sql`
- [ ] Copiar TODO o conteúdo
- [ ] Colar no SQL Editor
- [ ] Clicar em "Run" ou Ctrl+Enter
- [ ] Verificar mensagens de sucesso

### 3. Verificar Criação
- [ ] Ir em Table Editor
- [ ] Confirmar 5 tabelas criadas:
  - [ ] users
  - [ ] time_records
  - [ ] shifts
  - [ ] notifications
  - [ ] security_codes

### 4. Obter Credenciais
- [ ] Ir em Settings (⚙️) > API
- [ ] Copiar "URL do Projeto"
- [ ] Copiar "anon/public key"

### 5. Configurar .env.local
- [ ] Abrir `.env.local` na raiz do projeto
- [ ] Colar URL em `VITE_SUPABASE_URL`
- [ ] Colar anon key em `VITE_SUPABASE_ANON_KEY`
- [ ] Salvar arquivo

### 6. Reiniciar Servidor
- [ ] Parar servidor (Ctrl+C)
- [ ] Executar `npm run dev`
- [ ] Verificar console (F12) - sem erros de env

### 7. Testar Login
- [ ] Acessar http://localhost:8081
- [ ] Testar login:
  - Usuário: `teste`
  - Senha: `123`
- [ ] Verificar se entra no dashboard

---

## 🔌 Integração das Páginas (2-4 horas)

### Login (src/pages/Login.tsx)
- [ ] Importar `loginWithSupabase`
- [ ] Substituir chamada de `login()` por `loginWithSupabase()`
- [ ] Testar login de administrador
- [ ] Testar login de funcionário

### Dashboard Funcionário (src/modules/employee/pages/Dashboard.tsx)
- [ ] Importar `getCurrentUser`
- [ ] Buscar dados reais do usuário logado
- [ ] Exibir nome e informações corretas

### Ponto (src/modules/employee/pages/Ponto.tsx)
- [ ] Seguir exemplo do `EXEMPLO_INTEGRACAO_PONTO.tsx`
- [ ] Importar `registerTimeRecord`, `getTimeRecords`
- [ ] Implementar registro de ponto no banco
- [ ] Implementar carregamento de registros do dia
- [ ] Testar entrada, intervalo, retorno, saída

### Histórico (src/modules/employee/pages/Historico.tsx)
- [ ] Importar `getTimeRecords`
- [ ] Carregar registros do banco por período
- [ ] Implementar filtros de data
- [ ] Exibir lista de registros

### Escala (src/modules/employee/pages/Escala.tsx)
- [ ] Importar `getUserShifts`
- [ ] Carregar escalas do banco
- [ ] Exibir calendário com dados reais

### Perfil (src/modules/employee/pages/Perfil.tsx)
- [ ] Importar `getCurrentUser`, `updateUserProfile`
- [ ] Carregar dados do perfil do banco
- [ ] Implementar edição de contatos
- [ ] Salvar alterações no banco

### Configurações (src/modules/employee/pages/Configuracoes.tsx)
- [ ] Importar `changePassword`, `generateSecurityCode`, `validateSecurityCode`
- [ ] Integrar troca de senha com validação real
- [ ] Enviar códigos de verificação (simular por enquanto)
- [ ] Salvar preferências no banco

---

## 🧪 Testes (1 hora)

### Fluxo Completo de Funcionário
- [ ] Login como vigia
- [ ] Registrar entrada
- [ ] Registrar intervalo
- [ ] Registrar retorno
- [ ] Registrar saída
- [ ] Verificar histórico mostra todos os pontos
- [ ] Editar perfil
- [ ] Alterar senha
- [ ] Fazer logout
- [ ] Login com nova senha

### Fluxo de Administrador
- [ ] Login como admin
- [ ] Ver dashboard com dados de todos
- [ ] Acessar relatórios
- [ ] Gerenciar escalas
- [ ] Validar registros

### Testes de Segurança
- [ ] Tentar acessar área admin como funcionário (deve bloquear)
- [ ] Tentar ver dados de outro usuário (deve bloquear por RLS)
- [ ] Verificar que senhas estão em hash no banco
- [ ] Confirmar que códigos de verificação expiram

---

## 📊 Verificação no Supabase

### No Table Editor:
- [ ] Abrir tabela `users` - ver usuários cadastrados
- [ ] Abrir tabela `time_records` - ver registros de ponto
- [ ] Abrir tabela `shifts` - ver escalas
- [ ] Confirmar que dados estão sendo salvos

### No SQL Editor:
```sql
-- Ver registros de hoje
SELECT * FROM time_records 
WHERE DATE(punch_time) = CURRENT_DATE;

-- Ver usuários ativos
SELECT username, full_name, role, last_login 
FROM users 
WHERE active = true;

-- Ver escalas futuras
SELECT * FROM shifts 
WHERE shift_date >= CURRENT_DATE;
```

---

## 🚀 Otimizações (Opcional)

### Performance
- [ ] Adicionar índices em campos frequentemente buscados
- [ ] Implementar paginação em listas longas
- [ ] Configurar cache de queries

### UX
- [ ] Adicionar loading states
- [ ] Implementar retry automático em caso de erro
- [ ] Mensagens de erro mais amigáveis
- [ ] Feedback visual de sucesso

### Segurança (Produção)
- [ ] Alterar todas as senhas padrão
- [ ] Configurar rate limiting
- [ ] Habilitar 2FA para admins
- [ ] Configurar backups automáticos
- [ ] Adicionar logs de auditoria
- [ ] Revisar políticas RLS

---

## 📱 Próximas Funcionalidades

### Curto Prazo
- [ ] Dashboard em tempo real (Supabase Realtime)
- [ ] Exportar relatórios PDF/Excel
- [ ] Notificações push
- [ ] Upload de foto no registro de ponto

### Médio Prazo
- [ ] App mobile (React Native)
- [ ] Geolocalização com mapa
- [ ] Reconhecimento facial
- [ ] Integração com folha de pagamento

### Longo Prazo
- [ ] BI e analytics avançados
- [ ] API pública para integrações
- [ ] Multi-tenancy (várias prefeituras)
- [ ] Machine learning para detectar anomalias

---

## 🎯 Status Geral

- [ ] ✅ Configuração completa
- [ ] ✅ Todas as páginas integradas
- [ ] ✅ Testes passando
- [ ] ✅ Pronto para produção

**Data de Conclusão:** ___/___/2026

**Observações:**
_________________________________________
_________________________________________
_________________________________________
