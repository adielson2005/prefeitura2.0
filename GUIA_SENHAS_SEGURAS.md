# 🔐 Guia de Configuração de Senhas Seguras

## ⚠️ IMPORTANTE: ALTERE AS SENHAS PADRÃO!

As credenciais padrão são apenas para teste. **VOCÊ DEVE alterá-las** antes de usar em produção.

---

## 📝 Como Gerar Hash de Senha

### Método 1: Console do Navegador (Recomendado)

1. Abra o Console do navegador (F12 → Console)
2. Cole este código substituindo `"SuaSenhaForte123!"` pela sua senha:

```javascript
async function gerarHash(senha) {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log('Hash SHA-256:', hashHex);
  return hashHex;
}

// Gerar hash da sua senha
gerarHash("SuaSenhaForte123!");
```

3. Copie o hash gerado

### Método 2: Site Online

1. Acesse: https://emn178.github.io/online-tools/sha256.html
2. Digite sua senha
3. Copie o hash SHA-256

---

## 🔧 Como Alterar as Senhas

### Passo 1: Abrir o arquivo de autenticação

Arquivo: `src/lib/secureAuth.ts`

Localize a seção `SECURE_CREDENTIALS`:

```typescript
const SECURE_CREDENTIALS = {
  admin: {
    username: "admin",
    passwordHash: "SEU_HASH_AQUI",
    role: "ADMINISTRADOR",
    fullName: "Administrador do Sistema"
  },
  gerente: {
    username: "gerente",
    passwordHash: "SEU_HASH_AQUI",
    role: "GERENTE",
    fullName: "Gerente Municipal"
  }
};
```

### Passo 2: Substituir os hashes

1. Gere o hash da sua nova senha (método acima)
2. Substitua o valor de `passwordHash`
3. Salve o arquivo

### Exemplo:

```typescript
const SECURE_CREDENTIALS = {
  admin: {
    username: "admin",
    passwordHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", // Hash de "123"
    role: "ADMINISTRADOR",
    fullName: "Administrador do Sistema"
  },
  gerente: {
    username: "gerente",
    passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // Hash de "password"
    role: "GERENTE",
    fullName: "João Silva - Gerente"
  }
};
```

---

## ✅ Boas Práticas para Senhas

### Senha Forte deve ter:
- ✅ Mínimo 12 caracteres
- ✅ Letras maiúsculas e minúsculas
- ✅ Números
- ✅ Símbolos especiais (!@#$%&*)
- ✅ Não usar palavras do dicionário
- ✅ Não usar informações pessoais

### Exemplos de senhas FORTES:
- `Pr3f3itur@2026!Segur@`
- `M4n1c!p@lS3cur3#2026`
- `V1gil@nc14$S1st3m@!`

### Exemplos de senhas FRACAS (NÃO USE):
- ❌ `123456`
- ❌ `admin123`
- ❌ `prefeitura`
- ❌ `senha2026`

---

## 🎯 Configuração Recomendada

### Para Administrador:
```typescript
admin: {
  username: "admin",
  passwordHash: "GERE_HASH_DA_SUA_SENHA_FORTE",
  role: "ADMINISTRADOR",
  fullName: "Seu Nome Completo"
}
```

### Para Gerente:
```typescript
gerente: {
  username: "gerente",
  passwordHash: "GERE_HASH_DA_SUA_SENHA_FORTE",
  role: "GERENTE",
  fullName: "Nome do Gerente"
}
```

---

## 🔒 Adicionar Mais Usuários (Opcional)

Você pode adicionar mais usuários editando `SECURE_CREDENTIALS`:

```typescript
const SECURE_CREDENTIALS = {
  admin: { /* ... */ },
  gerente: { /* ... */ },
  supervisor: {
    username: "supervisor",
    passwordHash: "HASH_AQUI",
    role: "SUPERVISOR",
    fullName: "Nome do Supervisor"
  }
};
```

---

## 🛡️ Recursos de Segurança Ativos

✅ **Proteção contra força bruta**
- 5 tentativas máximas
- Bloqueio de 15 minutos após falhas

✅ **Expiração de sessão**
- 8 horas de duração máxima
- 30 minutos de inatividade

✅ **Senhas criptografadas**
- Hash SHA-256
- Nunca armazenadas em texto puro

✅ **Validação em múltiplas camadas**
- Verificação de token
- Verificação de timestamp
- Verificação de atividade

---

## 📞 Recuperação de Acesso

### Se esquecer a senha:

**Não há recuperação automática por segurança.**

Você precisará:
1. Gerar um novo hash
2. Editar manualmente o arquivo `secureAuth.ts`
3. Substituir o `passwordHash`
4. Reiniciar o sistema

---

## ⚙️ Personalizar Configurações de Segurança

No arquivo `secureAuth.ts`, localize `SECURITY_CONFIG`:

```typescript
const SECURITY_CONFIG = {
  MAX_ATTEMPTS: 5,                    // Altere para mais/menos tentativas
  LOCKOUT_TIME: 15 * 60 * 1000,       // Tempo de bloqueio em ms
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // Duração da sessão
  INACTIVITY_TIMEOUT: 30 * 60 * 1000,  // Tempo de inatividade
};
```

### Exemplos de ajustes:

**Mais rigoroso:**
```typescript
MAX_ATTEMPTS: 3,                     // 3 tentativas
LOCKOUT_TIME: 30 * 60 * 1000,        // 30 minutos bloqueado
SESSION_TIMEOUT: 4 * 60 * 60 * 1000, // 4 horas de sessão
INACTIVITY_TIMEOUT: 15 * 60 * 1000,  // 15 minutos de inatividade
```

**Mais flexível:**
```typescript
MAX_ATTEMPTS: 10,                     // 10 tentativas
LOCKOUT_TIME: 5 * 60 * 1000,          // 5 minutos bloqueado
SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas de sessão
INACTIVITY_TIMEOUT: 60 * 60 * 1000,   // 60 minutos de inatividade
```

---

## 🎯 Checklist Pós-Instalação

- [ ] Gerei hash das senhas fortes
- [ ] Alterei o `passwordHash` do admin
- [ ] Alterei o `passwordHash` do gerente
- [ ] Personalizei os nomes completos
- [ ] Removi as credenciais de teste da tela de login
- [ ] Testei o login com as novas senhas
- [ ] Documentei as senhas em local seguro (offline)

---

**Data:** 04/01/2026  
**Sistema:** Prefeitura - Vigilância Municipal  
**Versão:** 1.0 - Sistema de Autenticação Segura
