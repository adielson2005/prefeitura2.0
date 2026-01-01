# Design System - Prefeitura Vigilância

## 🎨 Transformação Visual Completa

O projeto foi completamente redesenhado com uma identidade visual corporativa, profissional e moderna, otimizada para o uso em uma prefeitura municipal.

### Paleta de Cores

#### Cores Primárias
- **Primary (Azul Corporativo):** `#1e40af` - Confiança, profissionalismo e segurança
- **Accent (Emerald Green):** `#10b981` - Crescimento, ação positiva e confiança
- **Background (Branco):** `#fafbff` - Clean, minimalista e profissional

#### Cores de Status
- **Status Ativo:** `#10b981` - Verde (Em Serviço)
- **Status Warning:** `#f59e0b` - Âmbar (Atrasado)
- **Status Danger:** `#ef4444` - Vermelho (Ausente)
- **Status Neutral:** `#64748b` - Cinza (Folga)

#### Cores de Categorias
- **Vigias:** Azul `#2563eb`
- **Vigilantes:** Emerald `#10b981`
- **Guardas:** Âmbar `#f59e0b`

---

## 🏗️ Componentes Redesenhados

### Header (AppHeader)
✅ Design minimalista com busca integrada
✅ Menu dropdown para perfil de usuário
✅ Notificações com badge de contagem
✅ Espaçamento profissional e tipografia clara

### Sidebar (AppSidebar)
✅ Gradiente moderno (Navy Blue → Darker Navy)
✅ Itens de navegação com hover states claros
✅ Indicador visual para item ativo (fundo destacado)
✅ Ícones e textos bem organizados
✅ Funcionalidade de recolher/expandir
✅ Seções organizadas: Principal, Gestão, Sistema

### Cards e Métricas (MetricCard)
✅ Fundo branco com borda sutil
✅ Ícones coloridos com fundo suave
✅ Tipografia clara e hierárquica
✅ Efeito hover com sombra e translação
✅ Suporte para variantes de cores

### Tabelas (ProfessionalTable)
✅ Header com background sutil
✅ Linhas com hover state suave (azul claro)
✅ Avatares com gradientes por categoria
✅ Status em pills coloridas
✅ Ações com botões ghost minimalistas

### Cards de Status (StatusCard)
✅ Design horizontal compacto
✅ Avatares circulares com gradientes
✅ Indicador de status no avatar
✅ Informações organizadas em grid
✅ Efeito hover com sombra

### Resumo de Atividades (QuickStats)
✅ Barras de progresso modernas
✅ Indicadores visuais com cores
✅ Ícones com fundo degradado
✅ Percentuais calculados dinamicamente

### Feed de Atividades (ActivityFeed)
✅ Timeline visual com linhas conectoras
✅ Ícones em cápsulas coloridas
✅ Espaçamento adequado para leitura
✅ Cores distintas por tipo de atividade

### Próximas Folgas (UpcomingLeaves)
✅ Cards com data destacada
✅ Categoria de profissional com cores
✅ Layout compacto e elegante
✅ Hover state com fundo suave

---

## 🎯 Características de Design

### Tipografia
- **Sans-serif:** Segoe UI + Inter (sistema)
- **Display:** Segoe UI + Plus Jakarta Sans (sistema)
- Hierarchy clara: h1, h2, h3, h4, h5, h6
- Espaçamento vertical bem definido

### Espaçamento
- Padding: 6px (0.5rem) para componentes compactos
- Padding: 24px (1.5rem) para seções
- Padding: 32px (2rem) para main content
- Gap entre elementos: 12px (0.75rem) padrão

### Sombras e Elevação
- **sm:** Sombra sutil para elementos flutuantes
- **md:** Sombra média para interação
- **lg:** Sombra grande para modais e popovers
- **Glow:** Efeito brilho sutil no primary

### Transições
- Hover: 200ms (smooth e responsivo)
- Fade-in: 300ms (entrada elegante)
- Slide-up: 400ms (movimento dinâmico)

### Border Radius
- Cards e buttons: 8px (0.5rem) - minimalista
- Inputs: 8px (0.5rem) - consistente
- Avatares: circular (50%)

---

## 🚀 Implementação no Projeto

Todos os componentes foram atualizados para:
1. **Usar cores do design system** em vez de cores hardcoded
2. **Manter consistência visual** em todo o aplicativo
3. **Otimizar espaçamento** para leitura clara
4. **Implementar estados hover** para feedback visual
5. **Usar ícones Lucide** com cores apropriadas
6. **Suportar dark mode** (variáveis CSS preparadas)

---

## 📱 Responsividade

Todos os componentes são fully responsive:
- **Mobile:** Stack vertical, ícones maiores
- **Tablet:** Grid 2-3 colunas
- **Desktop:** Layout otimizado com espaço aproveitado
- **Sidebar:** Recolhe em telas pequenas

---

## 💡 Diferenciais do Design

### Profissionalismo
- Paleta corporativa apropriada para prefeitura
- Espacios respeitados e bem organizados
- Tipografia clara e legível

### Usabilidade
- Cores de status intuitivas
- Indicadores visuais claros
- Hover states informativos
- Feedback visual consistente

### Modernidade
- Gradientes sutis
- Transições suaves
- Design minimalista
- Hierarquia visual clara

---

## 🎨 Customização

Para ajustar cores ou estilos, edite em:
- `src/index.css` - Variáveis CSS globais
- `tailwind.config.ts` - Configuração Tailwind
- Componentes individuais - Classes Tailwind

Todas as cores são definidas em variáveis CSS para fácil manutenção!
