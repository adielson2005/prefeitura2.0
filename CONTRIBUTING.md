# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o Sistema de Ponto Eletrônico! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Commit](#padrões-de-commit)
- [Padrões de Código](#padrões-de-código)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

---

## 📜 Código de Conduta

Este projeto segue um código de conduta baseado em respeito e colaboração. Ao participar, você concorda em:

- Ser respeitoso e inclusivo
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade
- Demonstrar empatia com outros membros

---

## 🚀 Como Contribuir

### 1️⃣ Fork o Projeto

Clique no botão **Fork** no topo da página do repositório.

### 2️⃣ Clone seu Fork

```bash
git clone https://github.com/seu-usuario/prefeiturarelatorioponto.git
cd prefeiturarelatorioponto
```

### 3️⃣ Crie uma Branch

```bash
# Para nova funcionalidade
git checkout -b feature/nome-da-funcionalidade

# Para correção de bug
git checkout -b fix/nome-do-bug

# Para documentação
git checkout -b docs/descricao
```

### 4️⃣ Faça suas Alterações

- Siga os [padrões de código](#padrões-de-código)
- Adicione testes quando aplicável
- Atualize a documentação se necessário

### 5️⃣ Commit suas Alterações

Siga nosso [padrão de commits](#padrões-de-commit):

```bash
git add .
git commit -m "feat: adiciona filtro de data no relatório"
```

### 6️⃣ Push para o GitHub

```bash
git push origin feature/nome-da-funcionalidade
```

### 7️⃣ Abra um Pull Request

- Vá para o repositório original no GitHub
- Clique em **New Pull Request**
- Selecione sua branch
- Descreva suas alterações detalhadamente

---

## 📝 Padrões de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: adiciona exportação de relatórios em PDF` |
| `fix` | Correção de bug | `fix: corrige cálculo de horas extras` |
| `docs` | Documentação | `docs: atualiza README com instruções de deploy` |
| `style` | Formatação de código | `style: ajusta indentação em Dashboard.tsx` |
| `refactor` | Refatoração sem alterar funcionalidade | `refactor: simplifica lógica de autenticação` |
| `perf` | Melhoria de performance | `perf: otimiza query de busca de usuários` |
| `test` | Testes | `test: adiciona testes para componente Login` |
| `build` | Build e dependências | `build: atualiza Vite para v5.0` |
| `ci` | Integração contínua | `ci: adiciona GitHub Actions para testes` |
| `chore` | Tarefas de manutenção | `chore: atualiza dependências` |
| `revert` | Reverter commit anterior | `revert: desfaz alteração no header` |

### Escopos (Opcional)

Use escopos para indicar qual parte do sistema foi alterada:

- `auth` - Autenticação
- `dashboard` - Dashboard
- `timerecord` - Registro de ponto
- `shifts` - Escalas
- `notifications` - Notificações
- `ui` - Interface do usuário
- `api` - API/Backend
- `db` - Banco de dados

**Exemplos:**

```bash
feat(auth): adiciona autenticação em dois fatores
fix(dashboard): corrige gráfico de horas trabalhadas
docs(api): documenta endpoints REST
refactor(ui): migra componentes para shadcn/ui v2
test(timerecord): adiciona testes de integração
```

### Descrição

- Use o imperativo: "adiciona" em vez de "adicionado"
- Não capitalize a primeira letra
- Sem ponto final
- Máximo de 72 caracteres

### Corpo (Opcional)

Explique **o que** e **por que**, não **como**:

```
feat(dashboard): adiciona filtro de período

Permite aos usuários filtrar relatórios por dia, semana, mês ou período customizado.
Isso resolve a solicitação #123 e melhora a experiência ao analisar dados históricos.
```

### Rodapé (Opcional)

- **Breaking Changes**: `BREAKING CHANGE: descrição`
- **Issues**: `Closes #123`, `Fixes #456`, `Refs #789`

**Exemplo completo:**

```
feat(auth)!: migra autenticação para Supabase Auth

BREAKING CHANGE: remove sistema de autenticação customizado

- Remove tabela de sessões
- Atualiza fluxo de login
- Adiciona suporte a OAuth

Closes #45
Refs #50
```

---

## 🎨 Padrões de Código

### TypeScript

- Use TypeScript estrito (`strict: true`)
- Defina tipos explícitos para props, estados e funções
- Evite `any`, prefira `unknown` quando necessário
- Use interfaces para objetos e types para uniões

```typescript
// ✅ Bom
interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Ruim
function getUser(id: any): any {
  // ...
}
```

### React

- Use componentes funcionais com hooks
- Prefira named exports para componentes
- Use `React.FC` ou defina props explicitamente
- Mantenha componentes pequenos e focados

```typescript
// ✅ Bom
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Ruim
export default function Button(props: any) {
  return <button>{props.label}</button>;
}
```

### CSS / Tailwind

- Use Tailwind classes sempre que possível
- Para estilos complexos, use `@apply` em arquivos CSS
- Mantenha classes em ordem lógica (layout → visual → interatividade)
- Use variáveis CSS para valores customizados

```tsx
// ✅ Bom
<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
  {/* conteúdo */}
</div>

// ❌ Ruim
<div style={{ display: 'flex', padding: '16px', backgroundColor: '#f3f4f6' }}>
  {/* conteúdo */}
</div>
```

### Nomenclatura

- **Arquivos**: PascalCase para componentes (`Button.tsx`), camelCase para utilities (`utils.ts`)
- **Variáveis**: camelCase (`userName`, `isLoading`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Componentes**: PascalCase (`UserProfile`, `DashboardCard`)
- **Hooks**: camelCase com prefixo `use` (`useAuth`, `useTimeRecord`)
- **Tipos/Interfaces**: PascalCase (`User`, `TimeRecord`, `ApiResponse`)

### Estrutura de Arquivos

```
ComponentName/
├── ComponentName.tsx      # Componente principal
├── ComponentName.test.tsx # Testes
├── ComponentName.types.ts # Tipos
├── ComponentName.styles.ts # Estilos (se necessário)
└── index.ts              # Export
```

### Imports

Organize imports na seguinte ordem:

```typescript
// 1. Bibliotecas externas
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Absolute imports internos
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// 3. Relative imports
import { formatDate } from './utils';
import type { User } from './types';

// 4. Estilos
import './styles.css';
```

---

## 🔍 Pull Requests

### Checklist antes de abrir um PR

- [ ] Código segue os padrões do projeto
- [ ] Commits seguem o padrão Conventional Commits
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Build está passando (`npm run build`)
- [ ] Linter está passando (`npm run lint`)
- [ ] Não há conflitos com a branch main

### Template de PR

```markdown
## 📝 Descrição

Descreva o que este PR faz.

## 🎯 Motivação e Contexto

Por que essa mudança é necessária? Qual problema ela resolve?

Closes #(issue)

## 🧪 Como foi testado?

Descreva como você testou suas mudanças.

- [ ] Teste manual
- [ ] Testes automatizados
- [ ] Testado em diferentes navegadores
- [ ] Testado em mobile

## 📸 Screenshots (se aplicável)

Adicione screenshots para mudanças visuais.

## ✅ Checklist

- [ ] Meu código segue os padrões do projeto
- [ ] Revisei meu próprio código
- [ ] Comentei partes complexas do código
- [ ] Atualizei a documentação
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes que provam que minha correção funciona
- [ ] Testes novos e existentes passam localmente
```

---

## 🐛 Reportar Bugs

### Antes de reportar

- Verifique se o bug já foi reportado
- Confirme que é um bug e não um erro de configuração
- Teste na versão mais recente

### Como reportar

Use o template de issue do GitHub:

```markdown
## 🐛 Descrição do Bug

Descrição clara e concisa do bug.

## 📋 Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## ✅ Comportamento Esperado

O que deveria acontecer.

## ❌ Comportamento Atual

O que está acontecendo.

## 🖼️ Screenshots

Se aplicável, adicione screenshots.

## 🌍 Ambiente

- OS: [ex: Windows 11]
- Navegador: [ex: Chrome 120]
- Versão: [ex: 1.0.0]

## ℹ️ Contexto Adicional

Qualquer outra informação relevante.
```

---

## 💡 Sugerir Funcionalidades

### Template de Feature Request

```markdown
## 🚀 Funcionalidade Sugerida

Descrição clara da funcionalidade.

## 🎯 Problema que Resolve

Qual problema essa funcionalidade resolve?

## 💭 Solução Proposta

Descrição de como você imagina que funcionaria.

## 🔄 Alternativas Consideradas

Outras soluções que você considerou.

## ℹ️ Contexto Adicional

Qualquer outra informação relevante.
```

---

## 📚 Recursos Úteis

- [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

## ❓ Dúvidas?

Se tiver alguma dúvida, abra uma [discussion](https://github.com/seu-usuario/prefeiturarelatorioponto/discussions) no GitHub.

---

## 🙏 Obrigado!

Suas contribuições tornam este projeto melhor para todos! 💙

