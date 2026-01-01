# 👀 Como Visualizar o Novo Design

## 🚀 Iniciar o Projeto

```bash
# Instalar dependências (se necessário)
npm install
# ou
bun install

# Iniciar servidor de desenvolvimento
npm run dev
# ou
bun dev
```

O projeto estará disponível em: `http://localhost:5173`

---

## 📸 O Que Você Verá

### Home / Dashboard
- **Header:** Novo design minimalista com busca e notificações
- **Sidebar:** Gradiente moderno com navegação organizada
- **Métrica Cards:** Cards com cores e ícones degradados
- **Quick Stats:** Barras de progresso coloridas
- **Activity Feed:** Timeline visual com linha conectora
- **Status Cards:** Cards de profissionais com indicadores
- **Upcoming Leaves:** Cards com datas destacadas

### Navegação
Acesse cada página via sidebar para ver o design aplicado em:
- Dashboard (Home)
- Vigias
- Vigilantes
- Guardas
- Controle de Ponto
- Folgas e Escalas
- Áreas
- Supervisores
- Relatórios
- Configurações

---

## 🎨 Elementos de Design Para Notar

### Cores
- 🔵 **Azul:** Primary (botões, headers)
- 🟢 **Verde:** Accent (status ativo)
- 🟠 **Âmbar:** Warning (atraso)
- 🔴 **Vermelho:** Danger (ausente)

### Interações
- ✨ **Hover no Card:** Sombra aumenta e translada para cima
- ✨ **Hover na Tabela:** Fundo azul claro
- ✨ **Hover no Menu:** Item fica com fundo claro
- ✨ **Click no Item:** Ativa com fundo verde e texto branco

### Tipografia
- 📝 **Títulos:** Segoe UI, Semibold, bem espaçados
- 📝 **Body:** Inter, peso 400-500, legível
- 📝 **Labels:** Pequenos, maiúsculos, semibold

### Espaçamento
- 📦 Cards: padding 24px (1.5rem)
- 📦 Buttons: padding 10px x 20px
- 📦 Gaps: 12px entre elementos
- 📦 Main: padding 32px (2rem)

---

## 🔍 Verificação Visual

### ✅ Checklist para Verificar

**Header**
- [ ] Título da página visível
- [ ] Busca com ícone funcional
- [ ] Ícone de notificação com badge
- [ ] Avatar com dropdown funcionando

**Sidebar**
- [ ] Gradiente navy visível
- [ ] Itens com hover state
- [ ] Item ativo com fundo verde
- [ ] Botão recolher/expandir funcionando

**Cards**
- [ ] Fundo branco com borda sutil
- [ ] Ícones com cores distintas
- [ ] Sombra no hover
- [ ] Textos bem organizados

**Tabelas**
- [ ] Header com background sutil
- [ ] Linhas com hover color
- [ ] Avatares coloridos
- [ ] Status em pills

**Dashboard Elements**
- [ ] Barras de progresso com cores
- [ ] Timeline com linhas conectoras
- [ ] Cards com espaçamento
- [ ] Tudo responsivo em mobile

---

## 🛠️ Debugging

Se algo não estiver certo:

1. **Limpar cache do navegador**
   ```
   Ctrl+Shift+Delete (abrir cache)
   Limpar tudo
   Recarregar página (Ctrl+R)
   ```

2. **Verificar console**
   - Abrir DevTools: F12
   - Ir em Console
   - Procurar por erros vermelhos

3. **Verificar styles**
   - Abrir DevTools: F12
   - Clicar em elemento
   - Ver classes Tailwind aplicadas

4. **Rebuild do projeto**
   ```bash
   npm run build
   npm run dev
   ```

---

## 📱 Responsividade

Teste em diferentes tamanhos:

- **Mobile (375px):** Menu recolhe, layout stack vertical
- **Tablet (768px):** Grid 2 colunas, sidebar visível
- **Desktop (1024px+):** Layout completo, tudo visível

Use F12 → Device Emulation para testar.

---

## 🎬 Funcionalidades a Testar

### Sidebar
- [ ] Hover em items
- [ ] Click em item (deve navegar)
- [ ] Click em recolher (deve encolher)
- [ ] Hover em recolhido (tooltip)

### Header
- [ ] Digitar na busca
- [ ] Click na notificação
- [ ] Click no avatar (abre dropdown)
- [ ] Click em "Sair"

### Cards
- [ ] Hover em metric card (deve elevar)
- [ ] Hover em status card (deve mudar cor)
- [ ] Hover em tabela (deve destacar linha)

### Responsividade
- [ ] Em mobile: sidebar recolhe
- [ ] Em tablet: layout se adapta
- [ ] Em desktop: layout completo

---

## 🎨 Customizações Rápidas

Se quiser ajustar cores rapidamente:

**Arquivo:** `src/index.css`

```css
:root {
  /* Mudar azul primary */
  --primary: 220 90% 35%;  /* Editar este valor */
  
  /* Mudar verde accent */
  --accent: 162 72% 45%;   /* Editar este valor */
  
  /* Mudar background */
  --background: 0 0% 99%;  /* Editar este valor */
}
```

Salvar e a página recarrega automaticamente!

---

## 📊 Estrutura de Cores HSL

Entender o formato HSL:
- **Hue (0-360):** Cor (0=red, 120=green, 240=blue)
- **Saturation (0-100%):** Intensidade da cor
- **Lightness (0-100%):** Brilho (0=preto, 100=branco)

Exemplos:
- `220 90% 35%` = Azul saturado e escuro
- `162 72% 45%` = Verde saturado e médio
- `0 0% 100%` = Branco puro
- `0 0% 0%` = Preto puro

---

## 🆘 Problemas Comuns

### "As cores não aparecem"
- Verifique se salvou `src/index.css`
- Limpe o cache (Ctrl+Shift+Delete)
- Recarregue a página (Ctrl+R)

### "Os componentes não estão estilizados"
- Verifique se o Tailwind está instalado
- Rode: `npm install`
- Recompile: `npm run dev`

### "Sidebar está muito estreita/larga"
- Edite em `AppSidebar.tsx`: `w-64` ou `w-20`
- Procure por: `collapsed ? "w-20" : "w-64"`

### "Cores muito diferentes do esperado"
- Edite `src/index.css` nas variáveis CSS
- Ou edite os valores Tailwind nos componentes

---

## 📚 Referências Rápidas

### Tailwind Classes Usadas
- `bg-white` - Fundo branco
- `text-foreground` - Texto principal (preto)
- `text-muted-foreground` - Texto secundário (cinza)
- `border border-border/40` - Borda sutil
- `rounded-lg` - Border radius 8px
- `shadow-sm` - Sombra sutil
- `hover:shadow-md` - Sombra no hover
- `transition-all duration-200` - Animação suave

### Cores Principais
- `bg-primary` - Azul corporativo
- `bg-accent` - Verde emerald
- `bg-status-danger` - Vermelho
- `bg-status-warning` - Âmbar
- `bg-secondary` - Cinza claro

---

## ✨ Resultado Final

Você deve ver:
- **Header:** Clean, profissional, funcional
- **Sidebar:** Gradiente moderno, navegação clara
- **Content:** Cards brancos, espaçamento perfeito
- **Interações:** Hover states suaves, feedback visual
- **Tipografia:** Legível, bem hierarquizada
- **Cores:** Profissionais, intuitivas, consistentes

**Se tudo estiver assim = Sucesso! 🎉**

---

## 📞 Suporte

Qualquer dúvida sobre o design:
1. Verifique `DESIGN_SYSTEM.md`
2. Verifique `VISUAL_GUIDE.md`
3. Verifique `CHANGELOG.md`
4. Inspecione os arquivos CSS/componentes

Happy designing! 🎨
