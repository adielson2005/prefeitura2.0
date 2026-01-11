# Script PowerShell para criar ícones placeholder PWA
# Execute: .\create-placeholder-icons.ps1

Write-Host "`n🎨 GERADOR DE ÍCONES PLACEHOLDER PWA`n" -ForegroundColor Cyan

# Verificar se o diretório public existe
if (-not (Test-Path ".\public")) {
    New-Item -ItemType Directory -Path ".\public" -Force | Out-Null
    Write-Host "✅ Diretório /public criado" -ForegroundColor Green
}

# Função para criar SVG simples
function Create-PlaceholderSVG {
    param (
        [string]$outputPath,
        [int]$size
    )
    
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $size $size">
  <rect width="$size" height="$size" fill="#2563eb"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="$(($size * 0.6))" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">P</text>
</svg>
"@
    
    Set-Content -Path $outputPath -Value $svg
}

Write-Host "📝 Criando ícones SVG placeholder..." -ForegroundColor Yellow

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

foreach ($size in $sizes) {
    $filename = ".\public\icon-$size`x$size.svg"
    Create-PlaceholderSVG -outputPath $filename -size $size
    Write-Host "  ✅ Criado: icon-$size`x$size.svg" -ForegroundColor Green
}

Write-Host "`n🎉 Ícones placeholder criados com sucesso!" -ForegroundColor Green
Write-Host "`n📌 IMPORTANTE:" -ForegroundColor Yellow
Write-Host "  - Os ícones estão em formato SVG (funcionam, mas PNG é melhor)"
Write-Host "  - Para converter SVG para PNG, use ferramentas online:"
Write-Host "    → https://cloudconvert.com/svg-to-png"
Write-Host "    → https://svgtopng.com/"
Write-Host "`n  - Ou use o guia completo em: GUIA_ICONES_PWA.md`n"
Write-Host "✨ Seu PWA já está funcional com estes placeholders!`n" -ForegroundColor Cyan
