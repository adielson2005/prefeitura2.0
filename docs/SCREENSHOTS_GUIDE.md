# 📸 Guia de Screenshots

Este documento orienta sobre como capturar e adicionar screenshots ao projeto.

## 🎯 Objetivo

Screenshots ajudam a demonstrar visualmente as funcionalidades do sistema e atraem mais interesse no projeto.

## 📁 Estrutura de Pastas

Salve todas as imagens em `docs/images/`:

```
docs/
└── images/
    ├── home.png              # Página inicial
    ├── login.png             # Tela de login
    ├── dashboard.png         # Dashboard principal
    ├── registro-ponto.png    # Tela de registro de ponto
    ├── escalas.png           # Gestão de escalas
    ├── relatorios.png        # Relatórios
    ├── notificacoes.png      # Sistema de notificações
    ├── perfil.png            # Perfil do usuário
    ├── mobile.png            # Versão mobile
    └── demo.gif              # GIF animado (opcional)
```

## 📷 Como Capturar Screenshots

### Windows

1. **Print Screen completo**: Pressione `PrtScn`
2. **Janela ativa**: Pressione `Alt + PrtScn`
3. **Área selecionada**: Pressione `Win + Shift + S` (Snipping Tool)
4. **Ferramenta recomendada**: Windows Snipping Tool ou Greenshot

### macOS

1. **Tela completa**: `Cmd + Shift + 3`
2. **Área selecionada**: `Cmd + Shift + 4`
3. **Janela específica**: `Cmd + Shift + 4 + Space`

### Linux

1. **Print Screen completo**: `PrtScn`
2. **Área selecionada**: `Shift + PrtScn`
3. **Ferramenta**: gnome-screenshot, Flameshot, ou Shutter

## 🎨 Boas Práticas

### Resolução
- **Desktop**: 1920x1080 (Full HD)
- **Mobile**: 375x667 (iPhone SE) ou 414x896 (iPhone 11)
- **Tablet**: 768x1024 (iPad)

### Formato
- **PNG** para interfaces estáticas (melhor qualidade)
- **JPG** para imagens grandes (menor tamanho)
- **GIF** para demonstrações animadas (máx 5MB)
- **WebP** para otimização (suporte moderno)

### Otimização
- Comprima as imagens antes de commitar
- Use ferramentas como TinyPNG, ImageOptim ou Squoosh
- Tamanho máximo recomendado: 500KB por imagem

### Conteúdo
- ✅ Use dados realistas (não "teste teste teste")
- ✅ Esconda informações sensíveis
- ✅ Capture em tela cheia (sem outras janelas visíveis)
- ✅ Use um navegador limpo (sem extensões visíveis na barra)
- ❌ Não mostre dados pessoais reais
- ❌ Evite screenshots com erros ou bugs

## 🎬 Gravando GIFs de Demonstração

### Ferramentas Recomendadas

**Windows**
- [ScreenToGif](https://www.screentogif.com/) (Gratuito)
- [LICEcap](https://www.cockos.com/licecap/) (Gratuito)

**macOS**
- [Kap](https://getkap.co/) (Gratuito)
- [Gifox](https://gifox.io/) (Pago)

**Linux**
- [Peek](https://github.com/phw/peek) (Gratuito)
- [SimpleScreenRecorder](https://www.maartenbaert.be/simplescreenrecorder/) + GIF converter

### Dicas para GIFs

1. **Duração**: 5-10 segundos
2. **FPS**: 15-20 (não precisa ser 60fps)
3. **Tamanho**: Máximo 5MB
4. **Conteúdo**: Foque em uma funcionalidade específica
5. **Loop**: Configure para repetir automaticamente

### Exemplo de Fluxos para Gravar

**Login**
```
1. Tela inicial
2. Clique em "Portal do Encarregado"
3. Digite username
4. Digite senha
5. Clique em "Entrar"
6. Dashboard aparece
```

**Registro de Ponto**
```
1. Dashboard
2. Clique em "Registrar Ponto"
3. Selecione "ENTRADA"
4. Adicione observação
5. Clique em "Registrar"
6. Sucesso aparece
```

## 📝 Checklist de Screenshots

Certifique-se de capturar:

- [ ] Página inicial / Landing page
- [ ] Tela de login (ambos os portais)
- [ ] Dashboard principal
- [ ] Registro de ponto
- [ ] Gestão de escalas
- [ ] Relatórios
- [ ] Perfil do usuário
- [ ] Notificações
- [ ] Versão mobile (responsive)
- [ ] Tema dark e light
- [ ] Estados de loading
- [ ] Mensagens de sucesso/erro

## 🔧 Ferramentas de Edição

### Básicas
- Paint (Windows)
- Preview (macOS)
- GIMP (Linux)

### Profissionais
- Adobe Photoshop
- Figma (web)
- Canva (web)

### Anotações
- [Greenshot](https://getgreenshot.org/) - Anotações rápidas
- [ShareX](https://getsharex.com/) - Captura + edição
- [Snagit](https://www.techsmith.com/screen-capture.html) - Profissional

## 📐 Templates para Mockups

Se quiser criar apresentações mais profissionais:

### Device Mockups
- [Mockuphone](https://mockuphone.com/)
- [Smartmockups](https://smartmockups.com/)
- [Placeit](https://placeit.net/)

### Browser Mockups
- [Screely](https://www.screely.com/)
- [Browser Frame](https://browserframe.com/)

## 🎯 Exemplo de README com Screenshots

```markdown
## 📸 Screenshots

<div align="center">

### 🏠 Página Inicial
![Página Inicial](./docs/images/home.png)
*Interface moderna e intuitiva de boas-vindas*

### 🔐 Login Dual
<table>
  <tr>
    <td><img src="./docs/images/login-encarregado.png" alt="Login Encarregado" width="400"/></td>
    <td><img src="./docs/images/login-funcionario.png" alt="Login Funcionário" width="400"/></td>
  </tr>
  <tr>
    <td align="center">Portal do Encarregado</td>
    <td align="center">Portal do Funcionário</td>
  </tr>
</table>

### 📊 Dashboard
![Dashboard](./docs/images/dashboard.png)
*Visão geral com estatísticas em tempo real*

### ⏰ Registro de Ponto
![Registro de Ponto](./docs/images/registro-ponto.png)
*Registro rápido com geolocalização*

### 📱 Responsivo
<img src="./docs/images/mobile.png" alt="Mobile" width="375"/>
*Totalmente adaptado para dispositivos móveis*

### 🎬 Demo

![Demo](./docs/images/demo.gif)
*Demonstração do fluxo completo*

</div>
```

## 🚀 Próximos Passos

Após adicionar as screenshots:

1. **Commit as imagens**:
   ```bash
   git add docs/images/
   git commit -m "docs: adiciona screenshots do sistema"
   git push
   ```

2. **Atualize o README**:
   - Substitua os placeholders de imagem pelos caminhos reais
   - Adicione descrições relevantes

3. **Crie um vídeo demo** (opcional):
   - Grave um vídeo de 2-3 minutos
   - Hospede no YouTube
   - Adicione link no README

## 📚 Recursos Úteis

- [How to Take Better Screenshots](https://www.techsmith.com/blog/how-to-take-a-screenshot/)
- [GitHub Markdown Guide](https://guides.github.com/features/mastering-markdown/)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)

---

**💡 Dica Final**: Screenshots de qualidade fazem TODA a diferença na primeira impressão do projeto. Dedique tempo para capturar imagens profissionais!

