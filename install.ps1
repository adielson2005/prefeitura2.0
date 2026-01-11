# 🚀 Script de Instalação Completa
# Sistema de Ponto Eletrônico - Prefeitura Municipal

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🏛️  SISTEMA DE PONTO ELETRÔNICO" -ForegroundColor Cyan
Write-Host "    Prefeitura Municipal" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando pré-requisitos..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js $nodeVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale Node.js 18+ de: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm -v
    Write-Host "✓ npm $npmVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "✗ npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📦 INSTALANDO DEPENDÊNCIAS DO FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependências do frontend instaladas" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao instalar dependências do frontend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📦 INSTALANDO DEPENDÊNCIAS DO BACKEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location meu-saas-backend

# Instalar dependências base
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependências base do backend instaladas" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao instalar dependências do backend" -ForegroundColor Red
    exit 1
}

# Instalar dependências adicionais
Write-Host "Instalando dependências adicionais..." -ForegroundColor Yellow
npm install @nestjs/config @supabase/supabase-js class-validator class-transformer
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependências adicionais instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠ Erro ao instalar algumas dependências adicionais" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "⚙️  CONFIGURANDO VARIÁVEIS DE AMBIENTE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Criar .env.local se não existir
if (-not (Test-Path .env.local)) {
    if (Test-Path .env.local.example) {
        Copy-Item .env.local.example .env.local
        Write-Host "⚠ .env.local criado - CONFIGURE COM SUAS CREDENCIAIS!" -ForegroundColor Yellow
    } else {
        Write-Host "✗ .env.local.example não encontrado" -ForegroundColor Red
    }
} else {
    Write-Host "✓ .env.local já existe" -ForegroundColor Green
}

# Criar .env do backend se não existir
if (-not (Test-Path meu-saas-backend\.env)) {
    if (Test-Path meu-saas-backend\.env.example) {
        Copy-Item meu-saas-backend\.env.example meu-saas-backend\.env
        Write-Host "⚠ Backend .env criado - CONFIGURE COM SUAS CREDENCIAIS!" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Backend .env.example não encontrado" -ForegroundColor Red
    }
} else {
    Write-Host "✓ Backend .env já existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ INSTALAÇÃO CONCLUÍDA!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor White
Write-Host ""
Write-Host "1️⃣  Configurar Supabase:" -ForegroundColor Yellow
Write-Host "   - Leia: SETUP_DATABASE.md"
Write-Host "   - Execute o SQL: supabase-schema-complete.sql"
Write-Host "   - Obtenha as credenciais em Settings > API"
Write-Host ""
Write-Host "2️⃣  Configurar variáveis de ambiente:" -ForegroundColor Yellow
Write-Host "   - Edite: .env.local (frontend)"
Write-Host "   - Edite: meu-saas-backend\.env (backend)"
Write-Host ""
Write-Host "3️⃣  Iniciar aplicação:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   OPÇÃO 1 - Apenas Frontend + Supabase (Recomendado):" -ForegroundColor Cyan
Write-Host "   PS> npm run dev"
Write-Host "   Acesse: http://localhost:5173"
Write-Host ""
Write-Host "   OPÇÃO 2 - Com Backend:" -ForegroundColor Cyan
Write-Host "   Terminal 1: cd meu-saas-backend; npm run start:dev"
Write-Host "   Terminal 2: npm run dev"
Write-Host ""
Write-Host "4️⃣  Fazer login:" -ForegroundColor Yellow
Write-Host "   Username: admin"
Write-Host "   Password: admin123"
Write-Host ""
Write-Host "📚 DOCUMENTAÇÃO:" -ForegroundColor White
Write-Host "   - README_COMPLETO.md - Visão geral completa"
Write-Host "   - SETUP_DATABASE.md - Configuração do Supabase"
Write-Host "   - meu-saas-backend\SETUP_BACKEND.md - Configuração do backend"
Write-Host ""
Write-Host "✓ Sistema pronto para configuração!" -ForegroundColor Green
Write-Host ""
