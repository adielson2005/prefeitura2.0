# Script para facilitar commits seguindo Conventional Commits
# Uso: .\commit.ps1

Write-Host "🚀 Assistente de Commit - Conventional Commits" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Função para exibir menu
function Show-Menu {
    Write-Host "Selecione o tipo de commit:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1. ✨ feat       - Nova funcionalidade" -ForegroundColor Green
    Write-Host "  2. 🐛 fix        - Correção de bug" -ForegroundColor Red
    Write-Host "  3. 📝 docs       - Documentação" -ForegroundColor Blue
    Write-Host "  4. 💄 style      - Formatação de código" -ForegroundColor Magenta
    Write-Host "  5. ♻️  refactor  - Refatoração" -ForegroundColor Yellow
    Write-Host "  6. ⚡ perf       - Melhoria de performance" -ForegroundColor Cyan
    Write-Host "  7. ✅ test       - Testes" -ForegroundColor Green
    Write-Host "  8. 🔨 build      - Build e dependências" -ForegroundColor DarkYellow
    Write-Host "  9. 🔧 chore      - Tarefas de manutenção" -ForegroundColor Gray
    Write-Host " 10. ⏪ revert     - Reverter commit" -ForegroundColor DarkRed
    Write-Host ""
}

# Função para exibir escopos
function Show-Scopes {
    Write-Host "Selecione o escopo (opcional):" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1. auth          - Autenticação"
    Write-Host "  2. dashboard     - Dashboard"
    Write-Host "  3. timerecord    - Registro de ponto"
    Write-Host "  4. shifts        - Escalas"
    Write-Host "  5. notifications - Notificações"
    Write-Host "  6. ui            - Interface"
    Write-Host "  7. api           - API/Backend"
    Write-Host "  8. db            - Banco de dados"
    Write-Host "  9. Nenhum        - Sem escopo"
    Write-Host ""
}

# Exibir menu
Show-Menu

# Obter tipo
$tipo = Read-Host "Digite o número (1-10)"

# Mapear tipo
$tipos = @{
    "1" = "feat"
    "2" = "fix"
    "3" = "docs"
    "4" = "style"
    "5" = "refactor"
    "6" = "perf"
    "7" = "test"
    "8" = "build"
    "9" = "chore"
    "10" = "revert"
}

if (-not $tipos.ContainsKey($tipo)) {
    Write-Host "❌ Opção inválida!" -ForegroundColor Red
    exit 1
}

$tipoSelecionado = $tipos[$tipo]

Write-Host ""
# Exibir escopos
Show-Scopes

# Obter escopo
$escopo = Read-Host "Digite o número (1-9)"

# Mapear escopo
$escopos = @{
    "1" = "auth"
    "2" = "dashboard"
    "3" = "timerecord"
    "4" = "shifts"
    "5" = "notifications"
    "6" = "ui"
    "7" = "api"
    "8" = "db"
    "9" = ""
}

if (-not $escopos.ContainsKey($escopo)) {
    Write-Host "❌ Opção inválida!" -ForegroundColor Red
    exit 1
}

$escopoSelecionado = $escopos[$escopo]

Write-Host ""
# Obter descrição
$descricao = Read-Host "Digite a descrição do commit (imperativo, sem ponto final)"

if ([string]::IsNullOrWhiteSpace($descricao)) {
    Write-Host "❌ Descrição não pode ser vazia!" -ForegroundColor Red
    exit 1
}

# Obter corpo (opcional)
Write-Host ""
Write-Host "Corpo da mensagem (opcional - pressione Enter para pular):" -ForegroundColor Yellow
$corpo = Read-Host

# Obter breaking change
Write-Host ""
$breaking = Read-Host "É uma breaking change? (s/N)"
$isBreaking = $breaking -eq "s" -or $breaking -eq "S"

# Obter issue
Write-Host ""
$issue = Read-Host "Número da issue (opcional - apenas o número)"

# Construir mensagem
$mensagem = $tipoSelecionado

if ($escopoSelecionado -ne "") {
    $mensagem += "($escopoSelecionado)"
}

if ($isBreaking) {
    $mensagem += "!"
}

$mensagem += ": $descricao"

if ($corpo -ne "") {
    $mensagem += "`n`n$corpo"
}

if ($isBreaking) {
    Write-Host ""
    $breakingDesc = Read-Host "Descreva a breaking change"
    $mensagem += "`n`nBREAKING CHANGE: $breakingDesc"
}

if ($issue -ne "") {
    $mensagem += "`n`nCloses #$issue"
}

# Exibir preview
Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 Preview do commit:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host $mensagem -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Confirmar
$confirmar = Read-Host "Confirmar commit? (S/n)"

if ($confirmar -eq "n" -or $confirmar -eq "N") {
    Write-Host "❌ Commit cancelado!" -ForegroundColor Red
    exit 0
}

# Status do git
Write-Host ""
Write-Host "📊 Status do Git:" -ForegroundColor Yellow
git status --short

Write-Host ""
$addAll = Read-Host "Adicionar todos os arquivos? (S/n)"

if ($addAll -ne "n" -and $addAll -ne "N") {
    git add .
    Write-Host "✅ Arquivos adicionados!" -ForegroundColor Green
} else {
    Write-Host "💡 Use 'git add <arquivo>' para adicionar arquivos específicos" -ForegroundColor Yellow
}

# Fazer commit
Write-Host ""
Write-Host "🚀 Fazendo commit..." -ForegroundColor Cyan

git commit -m $mensagem

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green
    Write-Host ""
    
    # Perguntar sobre push
    $push = Read-Host "Fazer push para o repositório remoto? (s/N)"
    
    if ($push -eq "s" -or $push -eq "S") {
        $branch = git rev-parse --abbrev-ref HEAD
        Write-Host "🚀 Fazendo push para $branch..." -ForegroundColor Cyan
        git push origin $branch
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro ao fazer push!" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Erro ao fazer commit!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 Processo concluído!" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
