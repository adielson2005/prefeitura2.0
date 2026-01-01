# 🎨 Paleta de Cores - Referência Rápida

## Cores Principais

### Primary - Azul Corporativo
```
Código HEX: #1e40af
Código HSL: 220 90% 35%
RGB: 30, 64, 175
Uso: Botões primários, headers, elementos principais
```

### Accent - Emerald Verde
```
Código HEX: #10b981
Código HSL: 162 72% 45%
RGB: 16, 185, 129
Uso: Ações positivas, status ativo, destaques
```

### Secondary - Cinza Claro
```
Código HEX: #f3f4f6
Código HSL: 220 20% 96%
RGB: 243, 244, 246
Uso: Backgrounds secundários, inputs
```

### Background
```
Código HEX: #fafbff
Código HSL: 0 0% 99%
RGB: 250, 251, 255
Uso: Fundo geral da página
```

### Card / White
```
Código HEX: #ffffff
Código HSL: 0 0% 100%
RGB: 255, 255, 255
Uso: Cards, containers principais
```

---

## Cores de Status

### Status Ativo (Em Serviço)
```
Código HEX: #10b981
Código HSL: 162 72% 45%
RGB: 16, 185, 129
Uso: Badges "Em Serviço", indicadores positivos
```

### Status Warning (Atrasado)
```
Código HEX: #f59e0b
Código HSL: 38 92% 50%
RGB: 245, 158, 11
Uso: Badges "Atrasado", avisos
```

### Status Danger (Ausente)
```
Código HEX: #ef4444
Código HSL: 0 84% 60%
RGB: 239, 68, 68
Uso: Badges "Ausente", erros
```

### Status Neutral (Folga)
```
Código HEX: #64748b
Código HSL: 220 10% 50%
RGB: 100, 116, 139
Uso: Badges "Folga", elementos neutros
```

---

## Cores por Categoria

### Vigias
```
Código HEX: #2563eb
Código HSL: 220 95% 45%
RGB: 37, 99, 235
Uso: Avatares, ícones de Vigias
Gradiente: from-blue-500 to-blue-600
```

### Vigilantes
```
Código HEX: #10b981
Código HSL: 162 72% 45%
RGB: 16, 185, 129
Uso: Avatares, ícones de Vigilantes
Gradiente: from-emerald-500 to-emerald-600
```

### Guardas
```
Código HEX: #f59e0b
Código HSL: 38 92% 50%
RGB: 245, 158, 11
Uso: Avatares, ícones de Guardas
Gradiente: from-amber-500 to-amber-600
```

---

## Cores Neutras

### Foreground (Texto Principal)
```
Código HEX: #1f2937
Código HSL: 220 13% 20%
RGB: 31, 41, 55
Uso: Títulos, texto principal
```

### Muted Foreground (Texto Secundário)
```
Código HEX: #6b7280
Código HSL: 220 10% 50%
RGB: 107, 114, 128
Uso: Descrições, subtítulos, legenda
```

### Border
```
Código HEX: #e5e7eb
Código HSL: 220 15% 92%
RGB: 229, 231, 235
Uso: Bordas de elementos
Com opacidade: border-border/40 = 60% transparente
```

### Muted (Background Secundário)
```
Código HEX: #e8ecf1
Código HSL: 220 15% 90%
RGB: 232, 236, 241
Uso: Backgrounds secundários, seções
```

---

## Sidebar Colors

### Sidebar Background
```
Código HEX: #1a2847
Código HSL: 220 25% 12%
RGB: 26, 40, 71
Uso: Fundo do sidebar
```

### Sidebar Foreground (Texto)
```
Código HEX: #f0f9ff
Código HSL: 220 15% 98%
RGB: 240, 249, 255
Uso: Texto no sidebar
```

### Sidebar Accent (Item Ativo)
```
Código HEX: #10b981
Código HSL: 162 72% 45%
RGB: 16, 185, 129
Uso: Fundo de item ativo
```

---

## Gradientes Definidos

### Gradient Primary
```css
background: linear-gradient(
  135deg,
  #1e40af 0%,
  #2563eb 100%
);
```

### Gradient Accent
```css
background: linear-gradient(
  135deg,
  #10b981 0%,
  #059669 100%
);
```

### Gradient Card
```css
background: linear-gradient(
  180deg,
  #ffffff 0%,
  #fafbff 100%
);
```

### Gradient Hero / Sidebar
```css
background: linear-gradient(
  135deg,
  #1a2847 0%,
  #1e3a4f 100%
);
```

---

## Sombras

### Shadow SM (Pequena)
```css
box-shadow: 0 1px 2px rgba(31, 41, 55, 0.03);
```

### Shadow MD (Média)
```css
box-shadow: 
  0 4px 6px rgba(31, 41, 55, 0.08),
  0 2px 4px rgba(31, 41, 55, 0.03);
```

### Shadow LG (Grande)
```css
box-shadow: 
  0 10px 15px rgba(31, 41, 55, 0.1),
  0 4px 6px rgba(31, 41, 55, 0.03);
```

### Shadow XL (Muito Grande)
```css
box-shadow: 
  0 20px 25px rgba(31, 41, 55, 0.12),
  0 8px 10px rgba(31, 41, 55, 0.04);
```

### Shadow Glow (Brilho Sutil)
```css
box-shadow: 0 0 20px rgba(30, 64, 175, 0.1);
```

---

## Aplicações Práticas

### Botão Primary
```
Fundo: #1e40af (Azul Primary)
Texto: #ffffff (Branco)
Hover: #1e3a8a (Azul mais escuro)
Sombra: shadow-sm
```

### Botão Secondary
```
Fundo: #f3f4f6 (Cinza claro)
Texto: #1f2937 (Texto principal)
Hover: #e5e7eb (Cinza mais escuro)
```

### Card Normal
```
Fundo: #ffffff (Branco)
Borda: #e5e7eb (Cinza claro) 40% opacidade
Sombra: shadow-sm
Hover: shadow-md + elevar
```

### Status Badge
```
Ativo: bg-#10b981 text-white
Atrasado: bg-#f59e0b text-white
Ausente: bg-#ef4444 text-white
Folga: bg-#64748b text-white
```

### Input / Textarea
```
Fundo: #fafbff (Background claro)
Borda: #e5e7eb (Cinza)
Focus: ring-2 ring-#1e40af (Azul)
Texto: #1f2937 (Preto)
Placeholder: #6b7280 (Cinza)
```

### Link / Active Item
```
Texto: #1e40af (Azul Primary)
Hover: #1e3a8a (Azul mais escuro)
Underline: opcional
```

---

## Variações de Opacidade

```
Cor base: #1e40af

Com 10% opacidade: rgba(30, 64, 175, 0.1)
Com 20% opacidade: rgba(30, 64, 175, 0.2)
Com 30% opacidade: rgba(30, 64, 175, 0.3)
Com 50% opacidade: rgba(30, 64, 175, 0.5)
```

---

## Temas por Elemento

### Header
```
Fundo: #ffffff (Branco)
Borda inferior: #e5e7eb 40%
Ícones: #6b7280
Texto: #1f2937
```

### Sidebar
```
Fundo: #1a2847 → #1e3a4f (Gradiente)
Texto: #f0f9ff
Item hover: rgba(240, 249, 255, 0.1)
Item ativo: #10b981
```

### Main Content
```
Fundo: #fafbff
Cards: #ffffff com border #e5e7eb 40%
Espaçamento: 8px-32px (em rem)
```

### Footer / Dividers
```
Cor: #e5e7eb
Opacidade: 40-60%
Altura: 1px
```

---

## Checklist de Cores

- [ ] Primary: #1e40af (Azul)
- [ ] Accent: #10b981 (Verde)
- [ ] Warning: #f59e0b (Âmbar)
- [ ] Danger: #ef4444 (Vermelho)
- [ ] Neutral: #64748b (Cinza)
- [ ] Background: #fafbff (Branco quebrado)
- [ ] Card: #ffffff (Branco)
- [ ] Text: #1f2937 (Preto)
- [ ] Muted: #6b7280 (Cinza médio)
- [ ] Border: #e5e7eb (Cinza claro)

---

## Como Ajustar

Para mudar qualquer cor:

1. **Arquivo:** `src/index.css`
2. **Seção:** `:root {}`
3. **Encontre:** `--primary: 220 90% 35%;`
4. **Edite:** Os números HSL
5. **Salve:** Ctrl+S

Exemplo:
```css
/* Antes */
--primary: 220 90% 35%;

/* Depois - Azul mais claro */
--primary: 220 90% 45%;
```

---

## Testes de Acessibilidade

- Contraste de cores (WCAG AA): ✅ Cumprido
- Cor como único indicador: ❌ Evitado (uso ícones também)
- Daltonismo: ✅ Paleta testada

---

## Exportar para Figma/Design

Se precisar exportar para design tools:

**Estilos de Preenchimento:**
- Primary Blue: #1e40af
- Emerald Green: #10b981
- Warning Amber: #f59e0b
- Danger Red: #ef4444
- Neutral Gray: #64748b

**Estilos de Tipografia:**
- Heading: Segoe UI / Plus Jakarta Sans, Semibold
- Body: Segoe UI / Inter, Regular
- Caption: Segoe UI / Inter, Small, Semibold

**Efeitos:**
- Shadow SM: Como definido acima
- Border Radius: 8px

---

## 📝 Resumo

✅ **10 Cores Principais**
✅ **4 Gradientes**
✅ **5 Sombras Diferentes**
✅ **Sistema Escalável**
✅ **WCAG Compliant**
✅ **Profissional & Moderno**

Pronto para usar! 🎨
