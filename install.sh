#!/bin/bash

# 🚀 Script de Instalação Completa
# Sistema de Ponto Eletrônico - Prefeitura Municipal

echo "========================================"
echo "🏛️  SISTEMA DE PONTO ELETRÔNICO"
echo "    Prefeitura Municipal"
echo "========================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para printar com cor
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Verificar se Node.js está instalado
echo "Verificando pré-requisitos..."
if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado!"
    echo "Por favor, instale Node.js 18+ de: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js $NODE_VERSION encontrado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm não encontrado!"
    exit 1
fi

NPM_VERSION=$(npm -v)
print_success "npm $NPM_VERSION encontrado"

echo ""
echo "========================================"
echo "📦 INSTALANDO DEPENDÊNCIAS DO FRONTEND"
echo "========================================"
echo ""

npm install
if [ $? -eq 0 ]; then
    print_success "Dependências do frontend instaladas"
else
    print_error "Erro ao instalar dependências do frontend"
    exit 1
fi

echo ""
echo "========================================"
echo "📦 INSTALANDO DEPENDÊNCIAS DO BACKEND"
echo "========================================"
echo ""

cd meu-saas-backend

# Instalar dependências base
npm install
if [ $? -eq 0 ]; then
    print_success "Dependências base do backend instaladas"
else
    print_error "Erro ao instalar dependências do backend"
    exit 1
fi

# Instalar dependências adicionais
echo "Instalando dependências adicionais..."
npm install @nestjs/config @supabase/supabase-js class-validator class-transformer
if [ $? -eq 0 ]; then
    print_success "Dependências adicionais instaladas"
else
    print_warning "Erro ao instalar algumas dependências adicionais"
fi

cd ..

echo ""
echo "========================================"
echo "⚙️  CONFIGURANDO VARIÁVEIS DE AMBIENTE"
echo "========================================"
echo ""

# Criar .env.local se não existir
if [ ! -f .env.local ]; then
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        print_warning ".env.local criado - CONFIGURE COM SUAS CREDENCIAIS!"
    else
        print_error ".env.local.example não encontrado"
    fi
else
    print_success ".env.local já existe"
fi

# Criar .env do backend se não existir
if [ ! -f meu-saas-backend/.env ]; then
    if [ -f meu-saas-backend/.env.example ]; then
        cp meu-saas-backend/.env.example meu-saas-backend/.env
        print_warning "Backend .env criado - CONFIGURE COM SUAS CREDENCIAIS!"
    else
        print_error "Backend .env.example não encontrado"
    fi
else
    print_success "Backend .env já existe"
fi

echo ""
echo "========================================"
echo "✅ INSTALAÇÃO CONCLUÍDA!"
echo "========================================"
echo ""

echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  Configurar Supabase:"
echo "   - Leia: SETUP_DATABASE.md"
echo "   - Execute o SQL: supabase-schema-complete.sql"
echo "   - Obtenha as credenciais em Settings > API"
echo ""
echo "2️⃣  Configurar variáveis de ambiente:"
echo "   - Edite: .env.local (frontend)"
echo "   - Edite: meu-saas-backend/.env (backend)"
echo ""
echo "3️⃣  Iniciar aplicação:"
echo ""
echo "   OPÇÃO 1 - Apenas Frontend + Supabase (Recomendado):"
echo "   $ npm run dev"
echo "   Acesse: http://localhost:5173"
echo ""
echo "   OPÇÃO 2 - Com Backend:"
echo "   Terminal 1: cd meu-saas-backend && npm run start:dev"
echo "   Terminal 2: npm run dev"
echo ""
echo "4️⃣  Fazer login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "📚 DOCUMENTAÇÃO:"
echo "   - README_COMPLETO.md - Visão geral completa"
echo "   - SETUP_DATABASE.md - Configuração do Supabase"
echo "   - meu-saas-backend/SETUP_BACKEND.md - Configuração do backend"
echo ""
print_success "Sistema pronto para configuração!"
echo ""
