# 🧪 GUIA COMPLETO DE TESTES DO SISTEMA

## 📋 CHECKLIST DE FUNCIONALIDADES

### ✅ AUTENTICAÇÃO E SEGURANÇA

#### Teste 1: Login como Encarregado

- [ ] Acessar http://localhost:8081
- [ ] Clicar em "Credencial Encarregado"
- [ ] Inserir: `encarregado` / `senha123`
- [ ] Verificar redirecionamento para Dashboard Admin
- [ ] Verificar se o nome aparece no header
- [ ] Verificar se o menu lateral está funcionando
- [ ] Verificar registro na tabela `login_audit` no Supabase

#### Teste 2: Login como Funcionário

- [ ] Acessar http://localhost:8081
- [ ] Clicar em "Credencial Funcionário"
- [ ] Inserir: `funcionario` / `senha123`
- [ ] Verificar redirecionamento para Portal do Funcionário
- [ ] Verificar navegação inferior (mobile)
- [ ] Verificar registro na tabela `login_audit` no Supabase

#### Teste 3: Tentativa de Login Inválida

- [ ] Tentar login com usuário inexistente
- [ ] Verificar mensagem de erro
- [ ] Tentar login com senha errada
- [ ] Verificar decremento de tentativas restantes
- [ ] Verificar registro de falha no `login_audit`

#### Teste 4: Proteção de Rotas

- [ ] Tentar acessar `/` sem estar logado
- [ ] Verificar redirecionamento para `/login`
- [ ] Logar como funcionário
- [ ] Tentar acessar `/` (rota admin)
- [ ] Verificar redirecionamento para `/funcionario`

---

### 🎯 PORTAL DO ENCARREGADO (ADMIN)

#### Teste 5: Dashboard Admin

- [ ] Visualizar métricas principais (cards)
- [ ] Verificar gráficos de estatísticas
- [ ] Verificar feed de atividades
- [ ] Verificar profissionais em serviço
- [ ] Responsividade em mobile/tablet/desktop

#### Teste 6: Gestão de Vigias

- [ ] Acessar página de Vigias
- [ ] Adicionar novo vigia
- [ ] Editar vigia existente
- [ ] Pesquisar vigia
- [ ] Filtrar por status
- [ ] Excluir vigia

#### Teste 7: Gestão de Vigilantes

- [ ] Acessar página de Vigilantes
- [ ] Adicionar novo vigilante
- [ ] Editar vigilante existente
- [ ] Pesquisar vigilante
- [ ] Verificar responsividade

#### Teste 8: Gestão de Guardas

- [ ] Acessar página de Guardas
- [ ] Adicionar novo guarda
- [ ] Editar guarda existente
- [ ] Pesquisar guarda
- [ ] Verificar responsividade

#### Teste 9: Controle de Ponto (Admin)

- [ ] Visualizar registros de ponto de todos
- [ ] Filtrar por funcionário
- [ ] Filtrar por data
- [ ] Exportar relatório
- [ ] Verificar responsividade

#### Teste 10: Escalas

- [ ] Visualizar calendário de escalas
- [ ] Criar nova escala
- [ ] Editar escala existente
- [ ] Atribuir funcionário a escala
- [ ] Verificar responsividade

#### Teste 11: Áreas

- [ ] Listar todas as áreas
- [ ] Adicionar nova área
- [ ] Editar área
- [ ] Atribuir funcionários a área
- [ ] Verificar responsividade

#### Teste 12: Supervisores

- [ ] Listar supervisores
- [ ] Adicionar supervisor
- [ ] Editar supervisor
- [ ] Verificar responsividade

#### Teste 13: Relatórios

- [ ] Gerar relatório de ponto
- [ ] Gerar relatório de frequência
- [ ] Filtrar por período
- [ ] Exportar PDF/Excel
- [ ] Verificar responsividade

#### Teste 14: Perfil (Admin)

- [ ] Visualizar dados pessoais
- [ ] Editar informações
- [ ] Alterar foto
- [ ] Salvar alterações
- [ ] Verificar responsividade

#### Teste 15: Configurações (Admin)

- [ ] Ajustar preferências do sistema
- [ ] Configurar notificações
- [ ] Alterar tema (dark/light)
- [ ] Salvar configurações
- [ ] Verificar responsividade

#### Teste 16: Segurança (Admin)

- [ ] Visualizar tentativas de login
- [ ] Visualizar sessões ativas
- [ ] Forçar logout de usuário
- [ ] Verificar auditoria
- [ ] Verificar responsividade

#### Teste 17: Busca Global

- [ ] Buscar funcionário
- [ ] Buscar área
- [ ] Buscar registro de ponto
- [ ] Verificar resultados
- [ ] Verificar responsividade

---

### 👷 PORTAL DO FUNCIONÁRIO

#### Teste 18: Dashboard Funcionário

- [ ] Visualizar resumo do dia
- [ ] Ver último registro de ponto
- [ ] Ver próxima escala
- [ ] Verificar notificações
- [ ] Responsividade mobile

#### Teste 19: Registro de Ponto

- [ ] Clicar em "Entrada"
- [ ] Permitir geolocalização
- [ ] Confirmar registro
- [ ] Verificar salvamento no Supabase
- [ ] Ver confirmação visual
- [ ] Repetir para: Intervalo, Retorno, Saída
- [ ] Verificar sequência correta
- [ ] Testar em mobile

#### Teste 20: Visualizar Escala

- [ ] Acessar "Escala"
- [ ] Visualizar turnos da semana
- [ ] Ver detalhes do turno
- [ ] Verificar horários
- [ ] Responsividade mobile

#### Teste 21: Histórico de Registros

- [ ] Acessar "Histórico"
- [ ] Ver registros do mês
- [ ] Filtrar por data
- [ ] Ver detalhes de cada registro
- [ ] Verificar localização no mapa
- [ ] Responsividade mobile

#### Teste 22: Perfil Funcionário

- [ ] Visualizar dados pessoais
- [ ] Ver estatísticas do mês
- [ ] Ver histórico de frequência
- [ ] Responsividade mobile

#### Teste 23: Configurações Funcionário

- [ ] Ajustar notificações
- [ ] Alterar senha
- [ ] Configurar tema
- [ ] Salvar preferências
- [ ] Responsividade mobile

---

### 📱 TESTES DE RESPONSIVIDADE

#### Teste 24: Mobile (320px - 767px)

- [ ] Login funciona corretamente
- [ ] Navegação inferior visível (funcionário)
- [ ] Menu lateral retrátil (admin)
- [ ] Cards se ajustam ao tamanho
- [ ] Formulários são utilizáveis
- [ ] Tabelas com scroll horizontal
- [ ] Botões acessíveis
- [ ] Textos legíveis

#### Teste 25: Tablet (768px - 1023px)

- [ ] Layout se adapta
- [ ] Navegação funciona
- [ ] Gráficos visíveis
- [ ] Tabelas legíveis
- [ ] Formulários organizados

#### Teste 26: Desktop (1024px+)

- [ ] Menu lateral fixo
- [ ] Todos os elementos visíveis
- [ ] Gráficos em tamanho adequado
- [ ] Tabelas completas
- [ ] Experiência otimizada

---

### 🔄 TESTES DE INTEGRAÇÃO

#### Teste 27: Supabase - Usuários

```sql
-- Verificar usuários criados
SELECT username, full_name, role, email, active
FROM users
ORDER BY role DESC;
```

- [ ] Todos os 6 usuários de teste existem
- [ ] Roles corretos
- [ ] Emails válidos
- [ ] Todos ativos

#### Teste 28: Supabase - Auditoria de Login

```sql
-- Ver últimas tentativas de login
SELECT
  username,
  success,
  error_message,
  logged_in_at,
  browser,
  os,
  device
FROM login_audit
ORDER BY logged_in_at DESC
LIMIT 20;
```

- [ ] Logins bem-sucedidos registrados
- [ ] Falhas registradas com motivo
- [ ] Browser/OS detectados
- [ ] IP address capturado

#### Teste 29: Supabase - Registros de Ponto

```sql
-- Ver registros de ponto
SELECT
  u.full_name,
  tr.punch_type,
  tr.punch_time,
  tr.location_lat,
  tr.location_lng
FROM time_records tr
JOIN users u ON u.id = tr.user_id
ORDER BY tr.punch_time DESC
LIMIT 20;
```

- [ ] Registros salvos corretamente
- [ ] Tipo de ponto correto
- [ ] Horário preciso
- [ ] Geolocalização capturada

---

### ⚡ TESTES DE PERFORMANCE

#### Teste 30: Carregamento Inicial

- [ ] Página de login carrega em < 2s
- [ ] Dashboard carrega em < 3s
- [ ] Sem erros no console
- [ ] Sem warnings críticos

#### Teste 31: Navegação

- [ ] Transições suaves entre páginas
- [ ] Sem travamentos
- [ ] Dados carregam rapidamente
- [ ] Cache funcionando

#### Teste 32: Offline

- [ ] Service Worker registrado
- [ ] Página offline acessível
- [ ] Dados em cache disponíveis

---

### 🔐 TESTES DE SEGURANÇA

#### Teste 33: Sessão

- [ ] Logout limpa todos os dados
- [ ] Sessão expira após inatividade
- [ ] Token é invalidado ao sair
- [ ] Não é possível acessar rotas após logout

#### Teste 34: Validações

- [ ] Campos obrigatórios validados
- [ ] Formatos de email validados
- [ ] Senhas com requisitos mínimos
- [ ] XSS prevention
- [ ] CSRF protection

---

### 🚀 TESTE FINAL - DEPLOY

#### Teste 35: Build de Produção

```bash
npm run build
```

- [ ] Build concluído sem erros
- [ ] Tamanho do bundle otimizado
- [ ] Assets gerados corretamente

#### Teste 36: Preview

```bash
npm run preview
```

- [ ] Aplicação funciona em modo produção
- [ ] Todas as rotas acessíveis
- [ ] Performance otimizada

#### Teste 37: Vercel Deploy

- [ ] Deploy bem-sucedido
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado no Supabase
- [ ] Domínio funcionando
- [ ] HTTPS ativo

---

## 📊 MÉTRICAS DE SUCESSO

### ✅ FUNCIONALIDADE

- [ ] 100% das páginas funcionais
- [ ] 100% dos botões responsivos
- [ ] 0 erros críticos no console
- [ ] Todas as rotas protegidas

### 📱 RESPONSIVIDADE

- [ ] Mobile: 100% funcional
- [ ] Tablet: 100% funcional
- [ ] Desktop: 100% funcional
- [ ] Navegação adaptativa

### ⚡ PERFORMANCE

- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] TTI < 3.5s

### 🔒 SEGURANÇA

- [ ] Autenticação funcionando
- [ ] Autorização por roles
- [ ] Auditoria completa
- [ ] Senhas hasheadas
- [ ] Sessões seguras

---

## 🎉 RESULTADO FINAL

Quando todos os checkboxes estiverem marcados, o sistema está:

- ✅ **100% FUNCIONAL**
- ✅ **100% RESPONSIVO**
- ✅ **100% SEGURO**
- ✅ **PRONTO PARA PRODUÇÃO**

---

## 🆘 PROBLEMAS COMUNS

### ❌ Erro: Tabela não existe

**Solução:** Execute `supabase-schema-complete.sql` no Supabase

### ❌ Erro: Usuário não encontrado

**Solução:** Execute `setup-database.sql` no Supabase

### ❌ Erro de CORS

**Solução:** Configure URLs permitidas no Supabase > Authentication > URL Configuration

### ❌ Build falha

**Solução:**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

**Desenvolvido com ❤️ para a Prefeitura Municipal**
