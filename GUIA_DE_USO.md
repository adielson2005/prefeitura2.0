# 📱 Guia de Uso - SaaS Vigilância Responsivo

## 🚀 Como Usar a Aplicação

### Desktop (1280px+)

#### Navegação
1. **Menu Lateral (Sidebar)**
   - Clique em "Recolher" para minimizar
   - Passe o mouse para ver tooltips
   - Clique em qualquer item para navegar
   - A página ativa fica destacada em azul

2. **Barra de Topo (Header)**
   - **Busca**: Procure por profissionais (disponível a partir de xl)
   - **Notificações**: Ícone de sino com badge (3 notificações)
   - **Perfil**: Clique em seu nome para menu de usuário
     - Meu Perfil
     - Configurações
     - Sair

3. **Dashboard Principal**
   - 4 cards de métricas na primeira linha
   - Painel de controle de ponto
   - Timeline de atividades recentes
   - Cards de status dos profissionais

### Mobile (até 768px)

#### Navegação
1. **Menu Inferior (MobileNavbar)**
   - Ícone de menu (≡) na parte inferior
   - Clique para abrir/fechar menu slide-up
   - Navegue pelos principais itens
   - Clique no botão de sair (🚪) para fazer logout

2. **Barra de Topo (Header)**
   - Logo minimalista à esquerda
   - Notificações e perfil à direita
   - Busca oculta (toque para procurar em uma página dedicada)

3. **Conteúdo Principal**
   - Layouts em coluna única
   - Grid 2x2 para métricas
   - Cards compactos mas legíveis
   - Scroll vertical para ver mais

### Tablet (768px - 1024px)

#### Navegação
- Menu lateral visível
- Layout híbrido
- Dashboard adaptado em 2-3 colunas

#### Características
- Toque responsivo
- Botões com tamanho adequado (44px mín)
- Sem necessidade de zoom

---

## 📊 Dashboard - Entendendo os Componentes

### Métricas no Topo
```
┌─────────────────┐ ┌──────────────┐ ┌──────────┐ ┌────────────┐
│ Total de        │ │ Em Serviço   │ │ De Folga │ │ Alertas    │
│ Profissionais   │ │ Agora        │ │ Hoje     │ │ Requerem   │
│ 108 ↑5.2%       │ │ 86 (79.6%)   │ │ 15       │ │ atenção 7  │
└─────────────────┘ └──────────────┘ └──────────┘ └────────────┘
```

- **Total de Profissionais**: Todos os cadastrados no sistema
- **Em Serviço**: Quantos estão trabalhando agora
- **De Folga**: Programadas para hoje
- **Alertas**: Problemas que precisam atenção

### Controle de Ponto
- Registre suas entradas/saídas clicando em "Registrar"
- Sistema segue a ordem: Entrada → Almoço → Retorno → Saída
- Quando completo, mostra "Ponto completo!"
- Calcula total de horas trabalhadas

### Atividade Recente
- Timeline vertical mostrando últimas 24h
- Cores diferentes por tipo:
  - 🟢 Verde: Entrada
  - 🟡 Amarelo: Saída de Almoço
  - 🔵 Azul: Retorno de Almoço
  - ⚪ Cinza: Saída
  - 🔴 Vermelho: Alerta

### Resumo por Categoria
- **Vigias**: Profissionais especializados em vigilância
- **Vigilantes**: Profissionais de segurança
- **Guardas**: Profissionais de guarda

Cada um mostra:
- Total de profissionais
- Quantos estão em serviço (%)
- Visual com barra de progresso

### Em Serviço
Mostra profissionais em turnos com:
- **Nome**: Identificação do profissional
- **Categoria**: Tipo de profissional
- **Área**: Onde está trabalhando
- **Status**: 
  - 🟢 Em Serviço
  - 🟡 Atrasado
  - ⚪ Folga
  - 🔴 Ausente

---

## 🎯 Tarefas Comuns

### Fazer Login
1. Acesse http://localhost:8080/
2. Digite seu email (qualquer@email.com)
3. Digite sua senha (qualquer password)
4. Clique em "Entrar"
5. Será redirecionado ao Dashboard

### Consultar um Profissional
1. **Desktop**: Use a barra de busca no topo (xl+)
2. **Mobile**: Clique em "Buscar" no menu
3. Digite o nome ou ID
4. Veja os resultados filtrados

### Registrar Ponto
1. Vá para Dashboard (primeira página)
2. Encontre o painel "Controle de Ponto"
3. Clique no botão "Registrar" para próxima ação
4. Repita para cada etapa do dia

### Gerenciar Profissionais
1. Vá para "Vigilantes", "Vigias" ou "Guardas"
2. Veja lista de profissionais
3. Clique para ver detalhes
4. Editar (se tiver permissão)

### Consultar Escalas
1. Vá para "Folgas e Escalas"
2. Veja programação
3. Adicionar novo período (se tiver permissão)

### Gerar Relatórios
1. Vá para "Relatórios"
2. Selecione período e filtros
3. Clique em "Gerar"
4. Exporte em PDF ou CSV

### Acessar Configurações
1. Vá para "Configurações" (menu lateral)
2. Ou clique no usuário → "Configurações"
3. Edite preferências

---

## ⚙️ Ajustes de Interface

### Sidebar
- **Recolher/Expandir**: Clique em "Recolher" no footer do menu
- **Categoria**: Menu organizado em seções lógicas
  - **Principal**: Dashboard e profissionais
  - **Gestão**: Operações diárias
  - **Sistema**: Configurações e relatórios

### Header
- **Logo**: Clique para voltar ao Dashboard
- **Barra de busca**: Digite para filtrar (Enter para buscar)
- **Notificações**: Clique para ir a notificações
- **Perfil**: Clique para seu menu pessoal

### Modo Escuro (Futuro)
- Será implementado em breve
- Poderá ser ativado em Configurações
- Suportará todos os componentes

---

## 📱 Dicas de Mobile

### Otimizações Automáticas
- ✅ Fonts menores mas legíveis
- ✅ Spacing compacto mas confortável
- ✅ Botões com tamanho toque (44px+)
- ✅ Sem horizontal scrolling
- ✅ Touch-friendly dropdowns

### Gestos
- **Deslizar**: Abrir menu (quando implementado)
- **Tap duplo**: Zoom em cards (quando implementado)
- **Longo tap**: Menu contextual (quando implementado)

### Performance
- ✅ Carregamento rápido
- ✅ Sem bloqueios de interface
- ✅ Animações suaves

---

## 🔧 Atalhos de Teclado (Desktop)

```
Ctrl + K       → Abrir busca global (quando implementado)
Ctrl + ,       → Abrir configurações (quando implementado)
Escape         → Fechar menus/modais
Tab            → Navegação entre elementos
Enter          → Confirmar ações
```

---

## 📊 Interpretando os Dados

### Cores de Status
```
🟢 Verde (#10B981)    → OK, em funcionamento, positivo
🟡 Amarelo (#F59E0B)  → Atenção, aviso, precaução
🔴 Vermelho (#EF4444) → Crítico, erro, negativo
⚪ Cinza              → Neutro, inativo, indefinido
🔵 Azul               → Ativo, selecionado, informação
```

### Interpretando Percentuais
```
Vigias: 75% ███████░░
↓
18 de 24 profissionais em serviço (6 fora)
```

### Tendências (%)
```
↑ +5.2% Verde   → Aumentando (positivo)
↓ -2.1% Vermelho → Diminuindo (negativo)
```

---

## 🆘 Solução de Problemas

### Página não carrega
- Verifique conexão internet
- Limpe cache (Ctrl+Shift+Del)
- Reinicie o navegador

### Não consigo fazer login
- Verifique se escreveu o email corretamente
- Qualquer senha funciona em modo teste
- Limpe cookies se tiver tentado antes

### Dados não atualizam
- Recarregue a página (Ctrl+R)
- Aguarde alguns segundos
- Verifique se tem conexão com API

### Menu desaparece em mobile
- Toque no ícone de menu (≡)
- Verifique se está em orientação vertical
- Girar para horizontal pode ajudar

### Texto muito pequeno
- Aumente zoom (Ctrl+)
- Verifique tamanho da tela
- Use modo landscape em mobile

---

## 📚 Mais Informações

Para documentação técnica, veja:
- `MELHORIAS_RESPONSIVIDADE.md` - Detalhes técnicos
- `GUIA_VISUAL_REDESIGN.md` - Layouts visuais
- `README.md` - Instruções gerais
- `DOCUMENTACAO.md` - Referência completa

---

**Última atualização**: 2025-01-01
**Versão**: 2.0 - Responsivo e Minimalista
**Status**: ✅ Produção
