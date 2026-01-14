# 🧪 TESTE RÁPIDO - Integração Backend + Frontend

Write-Host "🚀 Iniciando testes da integração..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se backend está configurado
Write-Host "📋 Verificando configuração do backend..." -ForegroundColor Yellow
if (!(Test-Path "meu-saas-backend\.env")) {
    Write-Host "⚠️  Arquivo .env não encontrado no backend!" -ForegroundColor Red
    Write-Host "Criando .env a partir do .env.example..." -ForegroundColor Yellow
    Copy-Item "meu-saas-backend\.env.example" "meu-saas-backend\.env"
    Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Edite meu-saas-backend\.env com suas credenciais do Supabase!" -ForegroundColor Yellow
    Write-Host "   - SUPABASE_URL" -ForegroundColor Yellow
    Write-Host "   - SUPABASE_SERVICE_KEY" -ForegroundColor Yellow
    Write-Host "   - SUPABASE_ANON_KEY" -ForegroundColor Yellow
    Write-Host ""
}

# 2. Verificar se frontend está configurado
Write-Host "📋 Verificando configuração do frontend..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    Write-Host "✅ Criando .env.local..." -ForegroundColor Green
    @"
# Variáveis de Ambiente - Frontend
VITE_API_URL=http://localhost:3000/api
VITE_DEV_MODE=true
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎯 COMO TESTAR:" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  INICIAR BACKEND (em um terminal separado):" -ForegroundColor Yellow
Write-Host ""
Write-Host "   cd meu-saas-backend" -ForegroundColor White
Write-Host "   npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "   ✅ Aguarde ver: '🚀 Backend rodando em http://localhost:3000/api'" -ForegroundColor Green
Write-Host ""

Write-Host "2️⃣  INICIAR FRONTEND (em outro terminal):" -ForegroundColor Yellow
Write-Host ""
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   ✅ Aguarde ver: 'Local: http://localhost:5173/'" -ForegroundColor Green
Write-Host ""

Write-Host "3️⃣  TESTAR NO NAVEGADOR:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   🌐 Abra: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "   Login de teste:" -ForegroundColor Cyan
Write-Host "   • Username: admin" -ForegroundColor White
Write-Host "   • Password: admin123" -ForegroundColor White
Write-Host ""

Write-Host "4️⃣  FUNCIONALIDADES PARA TESTAR:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   ✅ Login (deve salvar token JWT)" -ForegroundColor White
Write-Host "   ✅ Registro de Ponto (entrada/intervalo/retorno/saída)" -ForegroundColor White
Write-Host "   ✅ Notificações (carregar/marcar como lida/excluir)" -ForegroundColor White
Write-Host "   ✅ Histórico (registros do mês)" -ForegroundColor White
Write-Host "   ✅ Dashboard (estatísticas)" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🔧 TESTES RÁPIDOS VIA TERMINAL:" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "📡 Testar se API está respondendo:" -ForegroundColor Yellow
Write-Host "   curl http://localhost:3000/api" -ForegroundColor White
Write-Host ""

Write-Host "🔐 Testar login via API:" -ForegroundColor Yellow
Write-Host '   curl -X POST http://localhost:3000/api/auth/login \' -ForegroundColor White
Write-Host '     -H "Content-Type: application/json" \' -ForegroundColor White
Write-Host '     -d "{\"username\":\"admin\",\"password\":\"admin123\"}"' -ForegroundColor White
Write-Host ""

Write-Host "🔔 Criar notificação de teste:" -ForegroundColor Yellow
Write-Host '   curl -X POST http://localhost:3000/api/notifications \' -ForegroundColor White
Write-Host '     -H "Content-Type: application/json" \' -ForegroundColor White
Write-Host '     -d "{\"title\":\"Teste\",\"message\":\"Olá!\",\"type\":\"INFO\"}"' -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📚 DOCUMENTAÇÃO COMPLETA:" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "   📖 GUIA_TESTE_INTEGRACAO.md - Guia completo de testes" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "⚠️  PROBLEMAS COMUNS:" -ForegroundColor Red
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "❌ 'CORS blocked':" -ForegroundColor Red
Write-Host "   → Verifique se backend está rodando na porta 3000" -ForegroundColor Yellow
Write-Host "   → Frontend deve estar em localhost:5173" -ForegroundColor Yellow
Write-Host ""

Write-Host "❌ 'API não disponível':" -ForegroundColor Red
Write-Host "   → Certifique-se que o backend está rodando" -ForegroundColor Yellow
Write-Host "   → Teste: curl http://localhost:3000/api" -ForegroundColor Yellow
Write-Host ""

Write-Host "❌ Erros no Supabase:" -ForegroundColor Red
Write-Host "   → Configure credenciais em meu-saas-backend\.env" -ForegroundColor Yellow
Write-Host "   → Sistema usa fallback automático se Supabase falhar" -ForegroundColor Yellow
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Tudo pronto para testar!" -ForegroundColor Green
Write-Host "💡 Dica: Abra 2 terminais - um para backend, outro para frontend" -ForegroundColor Cyan
Write-Host ""
