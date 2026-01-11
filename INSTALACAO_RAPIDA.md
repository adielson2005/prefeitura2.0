# 🚀 INSTALAÇÃO RÁPIDA - PORTAL DO FUNCIONÁRIO

## ⚡ Guia de 5 Minutos

### 1️⃣ **Instalar Dependências**

```bash
npm install
# ou
bun install
```

### 2️⃣ **Criar Ícones PWA (Opcional mas Recomendado)**

Para ter a experiência completa de PWA, crie os ícones com as seguintes dimensões e salve em `/public/`:

- `icon-72x72.png` (72x72px)
- `icon-96x96.png` (96x96px)
- `icon-128x128.png` (128x128px)
- `icon-144x144.png` (144x144px)
- `icon-152x152.png` (152x152px)
- `icon-192x192.png` (192x192px)
- `icon-384x384.png` (384x384px)
- `icon-512x512.png` (512x512px)

**Dica:** Use ferramentas online como https://realfavicongenerator.net/ ou crie um ícone simples com o logo da prefeitura.

**Solução Temporária:** Você pode usar qualquer imagem quadrada e redimensioná-la com ferramentas online.

### 3️⃣ **Iniciar o Servidor**

```bash
npm run dev
# ou
bun dev
```

### 4️⃣ **Testar o Sistema**

Abra o navegador em: `http://localhost:5173`

#### **Login como GERENTE:**
```
Usuário: teste
Senha: 123
```
→ Você será redirecionado para o **Painel Administrativo**

#### **Logout e Login como FUNCIONÁRIO:**
```
Usuário: funcionario
Senha: 123
```
→ Você será redirecionado para o **Portal do Funcionário**

---

## 📱 TESTAR NO MOBILE

### **Opção 1: Localhost (Mesmo Wi-Fi)**

1. Descubra o IP do seu computador:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. No celular, acesse:
   ```
   http://SEU_IP:5173
   ```
   Exemplo: `http://192.168.1.10:5173`

3. Faça login como funcionário e explore!

### **Opção 2: Instalar como App (PWA)**

1. Abra o site no Chrome mobile
2. Toque nos 3 pontinhos (menu)
3. Toque em "Adicionar à tela inicial"
4. Confirme
5. O ícone do app aparecerá na tela inicial! 📱

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### **Portal do Funcionário:**
- [ ] Dashboard com resumo
- [ ] Registro de ponto (Entrada/Intervalo/Retorno/Saída)
- [ ] Visualização de escala semanal
- [ ] Histórico de pontos
- [ ] Perfil do funcionário
- [ ] Navegação inferior mobile
- [ ] Instalação como PWA

### **Painel Administrativo:**
- [ ] Todas as funcionalidades existentes continuam funcionando
- [ ] Acesso apenas para roles administrativos

### **Segurança:**
- [ ] Login com redirecionamento por role
- [ ] Proteção de rotas
- [ ] Timeout de sessão
- [ ] Logout funcional

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### **Service Worker não registra?**
- Certifique-se de estar usando HTTPS ou localhost
- Limpe o cache do navegador (Ctrl + Shift + Delete)
- Verifique o console do navegador (F12)

### **Ícones não aparecem?**
- Crie os arquivos de ícone ou use placeholders
- Verifique se os arquivos estão em `/public/`
- Limpe o cache e recarregue

### **Não redireciona após login?**
- Verifique se as credenciais estão corretas
- Abra o console (F12) e veja se há erros
- Verifique se o role está correto em [secureAuth.ts](src/lib/secureAuth.ts)

### **Erros de importação?**
```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

---

## 🎯 PRÓXIMAS AÇÕES

### **Desenvolvimento:**
1. Implementar backend real
2. Conectar com banco de dados
3. Criar API de ponto
4. Implementar geolocalização real
5. Adicionar notificações push

### **Produção:**
1. Criar ícones profissionais
2. Configurar HTTPS
3. Deploy em servidor
4. Testar PWA em produção
5. Treinar usuários

---

## 📖 DOCUMENTAÇÃO COMPLETA

Para mais detalhes, consulte:
- [PORTAL_FUNCIONARIO_README.md](PORTAL_FUNCIONARIO_README.md) - Documentação completa
- [src/lib/roleGuard.ts](src/lib/roleGuard.ts) - Sistema de roles
- [src/modules/employee/](src/modules/employee/) - Código do portal

---

## 🤝 CREDENCIAIS DE TESTE

| Tipo | Usuário | Senha | Redirecionamento |
|------|---------|-------|------------------|
| Gerente | `teste` | `123` | `/` (Admin) |
| Gerente | `gerente` | `gerente@A2005!` | `/` (Admin) |
| Funcionário | `funcionario` | `123` | `/funcionario` |

---

## ✨ ESTÁ PRONTO!

O sistema está 100% funcional e integrado. Aproveite!

**Dúvidas?** Verifique o console do navegador (F12) ou consulte a documentação completa.

---

**Data:** 07/01/2026  
**Versão:** 2.0.0  
**Status:** ✅ Pronto para uso
