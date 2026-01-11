# 📱 Guia de Uso - Mobile Preview

## 🚀 Como Usar a Extensão Mobile Preview

### Método 1: Atalhos Rápidos
1. Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
2. Digite "Mobile Preview"
3. Selecione uma das opções:
   - **Mobile Preview: Show Preview** - Abre a visualização mobile
   - **Mobile Preview: Select Device** - Escolhe o dispositivo
   - **Mobile Preview: Toggle Orientation** - Alterna portrait/landscape

### Método 2: Menu de Contexto
1. Clique com botão direito em qualquer arquivo HTML ou no editor
2. Selecione "Open with Mobile Preview"

### Método 3: Atalho de Teclado
- **Windows/Linux**: `Ctrl+Alt+M`
- **Mac**: `Cmd+Alt+M`

## 🛠️ Configurações Aplicadas

As seguintes configurações foram integradas ao projeto:

- **Dispositivo Padrão**: iPhone 14 Pro
- **Auto Refresh**: Ativado (recarrega automaticamente ao salvar)
- **Moldura do Dispositivo**: Visível
- **Orientação**: Portrait (vertical)
- **URL Padrão**: http://localhost:5173 (servidor Vite)

### 📱 Dispositivos Configurados

Os seguintes dispositivos estão disponíveis para teste rápido:
- iPhone 14 Pro
- iPhone SE
- iPad Pro 12.9
- Samsung Galaxy S22
- Pixel 7

## 🎯 Fluxo de Trabalho Recomendado

### Opção 1: Usar Tarefas do VS Code
1. Pressione `Ctrl+Shift+B` para abrir lista de tarefas
2. Selecione "Dev + Mobile Preview"
3. O servidor de desenvolvimento inicia automaticamente
4. Abra o Mobile Preview com `Ctrl+Alt+M`

### Opção 2: Manual
1. No terminal, execute:
   ```bash
   npm run dev
   ```
2. Aguarde o servidor iniciar em http://localhost:5173
3. Pressione `Ctrl+Shift+P` → "Mobile Preview: Show Preview"

## 🔧 Personalização

### Alterar Dispositivo Padrão
Edite [.vscode/settings.json](.vscode/settings.json#L3):
```json
"mobile-preview.defaultDevice": "iPad Pro 12.9"
```

### Alterar URL do Preview
Edite [.vscode/settings.json](.vscode/settings.json#L15):
```json
"mobile-preview.url": "http://localhost:SUAPORTA"
```

### Desativar Auto Refresh
Edite [.vscode/settings.json](.vscode/settings.json#L4):
```json
"mobile-preview.autoRefresh": false
```

## 💡 Dicas de Uso

### 1. Teste Responsividade Rapidamente
- Use `Ctrl+Shift+P` → "Mobile Preview: Select Device"
- Teste diferentes tamanhos de tela sem sair do editor

### 2. Debug no Mobile
- Abra as DevTools do Chrome/Edge
- Inspecione elementos diretamente no preview mobile
- Use o Console para debug

### 3. Orientação Portrait/Landscape
- Use `Ctrl+Shift+P` → "Mobile Preview: Toggle Orientation"
- Teste layouts em ambas orientações

### 4. Multiple Previews
- Abra múltiplas instâncias do Mobile Preview
- Teste vários dispositivos simultaneamente
- Compare layouts lado a lado

## 📋 Atalhos Úteis

| Ação | Atalho |
|------|--------|
| Abrir Mobile Preview | `Ctrl+Alt+M` |
| Alternar Orientação | Dentro do preview |
| Recarregar Preview | `F5` no preview |
| Fechar Preview | `Ctrl+W` no preview |
| DevTools | `F12` no preview |

## 🐛 Solução de Problemas

### Preview não carrega
1. Certifique-se que o servidor dev está rodando (`npm run dev`)
2. Verifique se a porta 5173 está acessível
3. Recarregue o preview com `F5`

### Mudanças não aparecem
1. Verifique se auto-refresh está ativado
2. Salve o arquivo (`Ctrl+S`)
3. Aguarde 1-2 segundos
4. Se necessário, recarregue manualmente (`F5`)

### Dispositivo não aparece na lista
1. Pressione `Ctrl+Shift+P`
2. Digite "Mobile Preview: Refresh Device List"
3. Selecione novamente o dispositivo

## 🎨 Integração com o Projeto

Este projeto usa:
- **Vite** como bundler (porta 5173)
- **React** + **TypeScript**
- **Tailwind CSS** para estilos responsivos
- **shadcn/ui** para componentes

O Mobile Preview está configurado para trabalhar perfeitamente com esta stack, oferecendo hot reload e preview em tempo real.

## 📚 Recursos Adicionais

- [Documentação Mobile Preview](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint)
- [Vite Dev Server](https://vitejs.dev/guide/)
- [Responsive Design Testing](https://web.dev/responsive-web-design-basics/)

---

**Criado em**: 9 de janeiro de 2026  
**Versão**: 1.0  
**Projeto**: Sistema de Relatório de Ponto - Prefeitura
