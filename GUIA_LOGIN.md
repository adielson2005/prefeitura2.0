# 🔐 Guia Rápido - Página de Login

## 🚀 Como Testar

1. **Inicie o servidor**:
   ```bash
   npm run dev
   ```

2. **Acesse a página de login**:
   ```
   http://localhost:5173/login
   ```

3. **Use as credenciais de teste**:
   - **Email**: `gerente@prefeitura.gov.br`
   - **Senha**: `senha123`

4. **Clique em "Entrar"** e você será redirecionado para o dashboard

---

## 📋 Campos do Formulário

### Email
- ✅ Campo obrigatório
- ✅ Validação de email (deve conter @)
- ✅ Ícone de email (Lucide Mail)
- ✅ Placeholder explicativo

### Senha
- ✅ Campo obrigatório
- ✅ Mostra/oculta senha (toggle com Eye icon)
- ✅ Ícone de cadeado (Lucide Lock)
- ✅ Máscara de caracteres por padrão

### Opções Adicionais
- ✅ "Lembrar minha senha" (checkbox)
- ✅ "Esqueci minha senha" (link)
- ✅ "Criar conta" (link)

---

## 🎨 Design Visual

### Cores
- **Fundo**: Gradiente azul → azul claro → branco
- **Card**: Branco com sombra sutil
- **Botão**: Gradiente azul (primary → blue-700)
- **Texto**: Cinza para inputs, azul para links

### Elementos Decorativos
- ✨ Círculos gradiente no fundo
- 🎯 Cenrado na tela
- 📱 Totalmente responsivo
- ⚡ Animações suaves (200-400ms)

---

## 🔄 Fluxo de Autenticação

```
1. Usuário acessa /login
   ↓
2. Preenche email e senha
   ↓
3. Clica em "Entrar"
   ↓
4. Validação local (email com @, senha)
   ↓
5. Simula aguardo (1 segundo)
   ↓
6. Armazena token no localStorage
   ↓
7. Redireciona para dashboard (/)
```

---

## 💾 Armazenamento Local

O login armazena dois dados no `localStorage`:

```javascript
localStorage.setItem("authToken", "token-simulado-..." );
localStorage.setItem("userEmail", "gerente@prefeitura.gov.br");
```

**Nota**: A implementação atual é uma simulação. Para usar em produção, conecte a um backend real.

---

## ⚠️ Mensagens de Erro

### Email Inválido
- Mensagem: "Email é obrigatório"
- Aparece quando campo está vazio ou sem @

### Senha Vazia
- Mensagem: "Senha é obrigatória"
- Aparece quando campo está vazio

### Teste as Validações
1. Tente clicar em "Entrar" sem preencher nada
2. Tente com email inválido (sem @)
3. Veja a mensagem de erro aparecer em tempo real

---

## 🎯 Botão "Entrar"

### Estado Normal
- Cor: Azul gradiente
- Texto: "Entrar"
- Cursor: Pointer
- Hover: Mais escuro

### Estado Carregando
- Mostra spinner animado
- Texto: "Entrando..."
- Desabilitado (não clicável)
- Animação: Rotation 1s linear infinite

---

## 🔐 Segurança (Para Produção)

⚠️ **Importante**: A implementação atual NÃO é segura para produção!

Para implementar segurança real:

1. **Usar HTTPS**: Sempre criptografar requisições
2. **Backend Authentication**: Validar credenciais no servidor
3. **JWT Tokens**: Usar JSON Web Tokens com expiração
4. **HTTP-only Cookies**: Armazenar token em cookie seguro
5. **CSRF Protection**: Implementar proteção CSRF
6. **Rate Limiting**: Limitar tentativas de login
7. **Password Hashing**: Hash de senha no servidor (bcrypt, etc)

---

## 📱 Responsividade

A página de login é totalmente responsiva:

### Mobile (< 640px)
- Card menor
- Padding reduzido
- Botão ocupa largura total
- Texto ajustado

### Tablet (640px - 1024px)
- Card médio
- Espaçamento otimizado

### Desktop (> 1024px)
- Card maior
- Máximo width 400px
- Espaçamento robusto

---

## 🌙 Tema Escuro

A página de login herda o tema escuro do projeto:

- **Light Mode**: Gradiente azul claro
- **Dark Mode**: Gradiente azul escuro + card escuro
- **Transição**: Automática com preferência do sistema

Teste alternando entre temas em Configurações > Aparência do seu navegador.

---

## 📊 Componentes Usados

- ✅ Input (personalizado com labels)
- ✅ Button (com loader)
- ✅ Checkbox (lembrar senha)
- ✅ Icons (Mail, Lock, Eye, EyeOff, Loader2)
- ✅ Typography (Headings, Labels, Links)

---

## 🔗 Links Úteis

- **Dashboard**: http://localhost:5173/
- **Login**: http://localhost:5173/login
- **Configurações**: http://localhost:5173/config (se existir)

---

## ✅ Checklist de Teste

- [ ] Acessar /login sem erros
- [ ] Formulário exibe corretamente
- [ ] Email e senha aceitam input
- [ ] Toggle mostrar/ocultar senha funciona
- [ ] Checkbox "Lembrar" é clicável
- [ ] Links funcionam
- [ ] Validação funciona (tente enviar vazio)
- [ ] Enviar com credenciais válidas
- [ ] Redirecionamento para dashboard
- [ ] localStorage contém token
- [ ] Tema claro/escuro funciona
- [ ] Responsivo em mobile/tablet/desktop

---

## 🐛 Troubleshooting

### Página não carrega?
1. Verifique se npm run dev está rodando
2. Limpe o cache do navegador (Ctrl+F5)
3. Verifique console para erros (F12)

### Login não funciona?
1. Confirme que preencheu email E senha
2. Email precisa conter @ para ser válido
3. Limpe localStorage se tiver token antigo

### Cores erradas?
1. Limpe cache CSS (Ctrl+F5)
2. Reinicie npm run dev
3. Verifique src/index.css para variáveis

---

**Versão**: 1.0  
**Status**: ✅ Ready to Test  
**Erros**: 0
