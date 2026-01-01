# 🎨 Referência de Tailwind CSS - Mudanças Implementadas

## Classes Tailwind Utilizadas para Responsividade

### Breakpoints
```tailwind
sm: 640px    - Tablets pequenos
md: 768px    - Tablets
lg: 1024px   - Desktops pequenos
xl: 1280px   - Desktops
2xl: 1536px  - Desktops grandes
```

### Padrão: Mobile-First
```tailwind
className="
  /* Mobile */
  text-sm p-3 gap-2
  /* Tablet */
  sm:text-base sm:p-4 sm:gap-3
  /* Desktop */
  md:text-lg md:p-6 md:gap-4
"
```

---

## Exemplo: Tipografia Responsiva

### Antes (Fixo)
```jsx
<h1 className="text-3xl font-bold">Título</h1>
```

### Depois (Responsivo)
```jsx
<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Título</h1>
```

**Resultado:**
- Mobile (375px): text-xl (20px)
- Tablet (768px): text-2xl (24px)
- Desktop (1280px): text-3xl (30px)

---

## Exemplo: Padding Responsivo

### AppLayout
```jsx
<div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8">
```

**Resultado:**
| Dispositivo | X | Y |
|---|---|---|
| Mobile | 12px | 16px |
| Tablet | 16px | 20px |
| Desktop | 24px | 24px |

---

## Exemplo: Grid Responsivo

### Métricas do Dashboard
```jsx
<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
```

**Resultado:**
| Dispositivo | Colunas | Gap |
|---|---|---|
| Mobile (375) | 2 | 8px |
| Tablet (768) | 2 | 12px |
| Desktop (1024) | 4 | 16px |

---

## Exemplo: Visibilidade Condicional

### Search no Header
```jsx
<div className="relative hidden xl:block">
  {/* Search input */}
</div>
```

**Resultado:**
- Não mostra em mobile/tablet
- Mostra em desktop (xl+)
- Economiza espaço em telas pequenas

---

## Exemplo: Display Condicional

### MobileNavbar
```jsx
<div className="md:hidden fixed bottom-0 left-0 right-0">
  {/* Mobile navigation */}
</div>
```

**Resultado:**
- Visível apenas em mobile
- Hidden em md (tablet+)

---

## Exemplo: Altura Responsiva

### Header
```jsx
<header className="h-14 md:h-16">
```

**Resultado:**
- Mobile: 56px
- Desktop: 64px

---

## Exemplo: Font Size Responsivo

### Títulos
```jsx
<h1 className="text-base sm:text-lg font-semibold">
```

**Resultado:**
| Dispositivo | Size | Peso |
|---|---|---|
| Mobile | 16px | 600 |
| Tablet | 18px | 600 |

---

## Cores Minimalistas - Palette

### Backgrounds
```tailwind
bg-background    /* Branco #FFFFFF */
bg-card         /* Branco */
bg-secondary    /* Cinza claro */
```

### Texts
```tailwind
text-foreground        /* Cinza escuro */
text-muted-foreground  /* Cinza médio */
```

### Borders
```tailwind
border-border         /* Cinza claro */
border-border/30      /* 30% opacidade */
```

### Status
```tailwind
text-status-active    /* Verde #10B981 */
text-status-warning   /* Amarelo #F59E0B */
text-status-danger    /* Vermelho #EF4444 */
```

---

## Espaçamento Escala

### Padding
```tailwind
p-2   /* 8px */
p-3   /* 12px */
p-4   /* 16px */
p-5   /* 20px */
p-6   /* 24px */
```

### Margin
```tailwind
m-1   /* 4px */
m-2   /* 8px */
m-3   /* 12px */
m-4   /* 16px */
```

### Gap
```tailwind
gap-1   /* 4px */
gap-2   /* 8px */
gap-3   /* 12px */
gap-4   /* 16px */
```

---

## Border Radius Minimalista

```tailwind
rounded-md   /* 6px */
rounded-lg   /* 8px */
rounded-xl   /* 12px */
```

**Nota**: Preferir `rounded-lg/md` em vez de `rounded-xl/2xl`

---

## Shadows Sutis

```tailwind
shadow-sm    /* Leve */
shadow-md    /* Médio */
shadow-lg    /* Pesado */
```

**Recomendação**: Usar com moderação

---

## Animações

### Transições
```tailwind
transition           /* Padrão */
transition-all       /* Todos os atributos */
duration-150         /* 150ms */
duration-200         /* 200ms */
duration-300         /* 300ms */
ease-in-out         /* Suave */
```

**Exemplo:**
```jsx
<button className="transition-all duration-200 hover:bg-secondary">
  Botão
</button>
```

---

## Display Utilities

### Flex
```tailwind
flex              /* display: flex */
items-center      /* align-items: center */
justify-between   /* justify-content: space-between */
gap-3            /* gap: 12px */
```

### Grid
```tailwind
grid                    /* display: grid */
grid-cols-2            /* 2 colunas */
lg:grid-cols-4         /* 4 colunas em lg+ */
gap-4                  /* gap: 16px */
```

### Min/Max Width
```tailwind
min-w-0      /* min-width: 0 (para truncate) */
max-w-7xl    /* max-width: 80rem */
w-full       /* width: 100% */
```

---

## Estados Interativos

### Hover
```tailwind
hover:bg-secondary      /* Background ao passar */
hover:text-foreground   /* Cor ao passar */
hover:shadow-md         /* Sombra ao passar */
```

### Focus
```tailwind
focus:outline-none
focus:ring-2
focus:ring-primary/30
focus:border-transparent
```

### Disabled
```tailwind
disabled:opacity-50
disabled:cursor-not-allowed
```

---

## Truncate e Overflow

### Text Truncate
```tailwind
truncate              /* text-overflow: ellipsis */
text-ellipsis        /* Alternativa */
whitespace-nowrap    /* Sem quebra */
```

### Scroll
```tailwind
overflow-auto           /* Auto scroll */
overflow-y-auto        /* Scroll vertical */
overflow-hidden        /* Ocultar overflow */
scrollbar-thin        /* Barra fina */
scrollbar-thumb-border /* Cor da barra */
```

---

## Flexibilidade

### Flex Grow/Shrink
```tailwind
flex-1           /* flex: 1 (crescer) */
flex-shrink-0    /* flex-shrink: 0 (não encolher) */
```

---

## Opacity

```tailwind
opacity-50       /* 50% transparência */
opacity-80       /* 80% (mais visível) */

text-white/50    /* Branco com 50% alpha */
bg-primary/10    /* Background tinto com 10% alpha */
```

---

## Gradientes (Uso Limitado)

```tailwind
/* Minimalista */
bg-gradient-to-br from-primary to-blue-700

/* Evitar */
Gradientes complexos
Múltiplas cores
Padrões decorativos
```

---

## Padrão de Componente Responsivo

### Template
```jsx
export function MyComponent() {
  return (
    <div className="
      /* Mobile defaults */
      p-3 gap-2 text-xs
      
      /* Tablet */
      sm:p-4 sm:gap-3 sm:text-sm
      
      /* Desktop */
      md:p-6 md:gap-4 md:text-base
    ">
      {/* Conteúdo */}
    </div>
  );
}
```

---

## Checklist de Responsividade

```
TIPOGRAFIA
✅ text- responsivo (xs → base → lg → xl)
✅ font-size escala em mobile/tablet/desktop
✅ line-height apropriado

ESPAÇAMENTO
✅ padding responsivo
✅ margin responsivo
✅ gap responsivo
✅ height responsivo

LAYOUT
✅ grid-cols responsivo
✅ flex adapta conteúdo
✅ min-w-0 para truncate
✅ max-w- aplicado

CORES
✅ Paleta minimalista
✅ Status colors usadas corretamente
✅ Contraste suficiente
✅ Sem gradientes desnecessários

INTERAÇÃO
✅ hover- definidos
✅ focus- acessível
✅ disabled- óbvio
✅ transitions suaves

VISIBILIDADE
✅ hidden- em mobile quando apropriado
✅ block/inline responsivos
✅ Sem horizontal scroll
✅ Altura de header otimizada
```

---

## Dicas Importantes

### 1. Mobile-First
```jsx
/* ✅ Bom */
<div className="p-3 sm:p-4 md:p-6">

/* ❌ Evitar */
<div className="md:p-6 sm:p-4 p-3">
```

### 2. Truncate com Flex
```jsx
/* ✅ Bom */
<div className="flex items-center gap-2 min-w-0">
  <div className="truncate">Texto longo</div>
</div>

/* ❌ Evitar */
<div className="flex">
  <div className="truncate">Texto longo</div>
</div>
```

### 3. Responsividade
```jsx
/* ✅ Bom */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

/* ❌ Evitar */
<div className="grid grid-cols-3">
```

### 4. Espaçamento
```jsx
/* ✅ Bom */
<div className="space-y-3 sm:space-y-4 md:space-y-6">

/* ❌ Evitar */
<div className="space-y-6">
```

---

## Referência Rápida

| Propriedade | Mobile | Tablet | Desktop |
|---|---|---|---|
| **Header** | h-14 | h-14 | h-14 |
| **Sidebar** | hidden | block | block |
| **Padding Main** | px-3 py-4 | px-4 py-5 | px-6 py-8 |
| **Grid Cols** | 2 | 2 | 4 |
| **Font Size** | text-xs | text-sm | text-base |
| **Gap** | gap-2 | gap-3 | gap-4 |
| **Card Padding** | p-3 | p-4 | p-5 |

---

**Versão**: 2.0 Tailwind Configuration
**Data**: 2025-01-01
**Status**: ✅ Em uso
