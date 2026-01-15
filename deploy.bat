@echo off
echo ========================================
echo   DEPLOY AUTOMATICO - VERCEL
echo ========================================
echo.

echo [1/3] Adicionando arquivos ao Git...
git add .

echo [2/3] Fazendo commit...
git commit -m "config: adicionar .env.production para deploy automatico"

echo [3/3] Enviando para GitHub (deploy automatico no Vercel)...
git push

echo.
echo ========================================
echo   DEPLOY INICIADO!
echo ========================================
echo.
echo O Vercel vai fazer o deploy automaticamente.
echo Acesse: https://vercel.com/dashboard
echo.
pause
