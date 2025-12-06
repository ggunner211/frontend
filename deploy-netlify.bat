@echo off
REM Script para deploy AURA na Netlify
REM Uso: deploy-netlify.bat

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════╗
echo ║      AURA - DEPLOY FRONTEND NA NETLIFY        ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Verificar se está na pasta correta
if not exist "package.json" (
    echo ❌ Erro: Execute este script dentro da pasta frontend!
    echo.
    cd C:\Users\gabriel\Documents\AURA\frontend
    echo Mudando para: %cd%
    echo.
)

REM Menu de opcoes
echo Escolha uma opcao:
echo.
echo 1) Build apenas (criar pasta build/)
echo 2) Build + Upload Netlify (Drag & Drop)
echo 3) Setup Github + Netlify (Deploy Automatico)
echo 4) Verificar status do build
echo.

set /p choice="Digite a opcao (1-4): "

if "%choice%"=="1" (
    call :build_only
) else if "%choice%"=="2" (
    call :build_and_upload
) else if "%choice%"=="3" (
    call :github_setup
) else if "%choice%"=="4" (
    call :check_status
) else (
    echo ❌ Opcao invalida!
    exit /b 1
)

exit /b 0

:build_only
echo.
echo 📦 Gerando build de producao...
echo.
call npm run build
if %errorlevel% equ 0 (
    echo.
    echo ✅ Build criado com sucesso!
    echo 📁 Pasta: %cd%\build
    echo.
    echo Proximos passos:
    echo 1. Ir para https://app.netlify.com/drop
    echo 2. Arrastar a pasta 'build'
    echo 3. Aguardar publicacao
    echo.
) else (
    echo ❌ Erro ao gerar build!
)
exit /b %errorlevel%

:build_and_upload
echo.
echo 📦 Gerando build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro ao gerar build!
    exit /b 1
)

echo.
echo 🌐 Abrindo Netlify Drop...
echo.
start https://app.netlify.com/drop

echo.
echo 📋 Instrucoes:
echo 1. Selecione a pasta 'build' neste diretorio
echo 2. Arraste para a janela do navegador
echo 3. Aguarde a publicacao
echo 4. Seu site estara em: https://seu-site.netlify.app
echo.

exit /b 0

:github_setup
echo.
echo 📚 Setup Github + Netlify Automatico
echo.
echo Pre-requisitos:
echo   - Conta Github criada (https://github.com)
echo   - Conta Netlify criada (https://netlify.com)
echo   - Git instalado
echo.
pause

echo.
echo 1️⃣ Inicializando Git...
git init
git config user.name "AURA Technician"
git config user.email "aura@technician.app"

echo.
echo 2️⃣ Adicionando arquivos...
git add .
git commit -m "AURA Frontend - Ready for Netlify"

echo.
echo 3️⃣ Criando branch main...
git branch -M main

echo.
echo ⚠️  PAUSE: Criar repo no Github
echo   1. Ir para https://github.com/new
echo   2. Nome: aura-frontend
echo   3. Criar repositorio VAZIO
echo   4. Copiar URL (https://github.com/SEU_USER/aura-frontend.git)
echo.
set /p github_url="Cole a URL do repo Github: "

echo.
echo 4️⃣ Adicionando remote...
git remote add origin %github_url%

echo.
echo 5️⃣ Fazendo push...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Repositorio no Github criado!
    echo.
    echo 6️⃣ Conectar com Netlify:
    echo   1. Ir para https://app.netlify.com
    echo   2. "New site from Git"
    echo   3. Selecionar Github
    echo   4. Escolher "aura-frontend"
    echo   5. Build command: npm run build
    echo   6. Publish directory: build
    echo   7. Deploy!
    echo.
    echo 🎉 De agora em diante, a cada push no Github, Netlify deploya automaticamente!
    echo.
    start https://app.netlify.com
) else (
    echo ❌ Erro ao fazer push no Github
)

exit /b %errorlevel%

:check_status
echo.
echo 📊 Status do Build Local
echo.

if exist "build\" (
    echo ✅ Pasta 'build' existe
    
    REM Contar arquivos
    setlocal enabledelayedexpansion
    set count=0
    for /r "build" %%f in (*) do set /a count+=1
    
    echo 📁 Arquivos no build: !count!
    
    REM Tamanho da pasta
    for /f "tokens=3" %%a in ('dir build /s ^| findstr /c:"bytes"') do (
        echo 💾 Tamanho: %%a bytes
    )
) else (
    echo ❌ Pasta 'build' nao encontrada
    echo   Execute a opcao 1 ou 2 primeiro!
)

echo.
echo Node version:
node --version

echo.
echo NPM version:
npm --version

echo.
exit /b 0
