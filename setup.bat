@echo off
REM Script de configuración inicial para Windows
echo ================================================
echo   Configuración de Seguimiento Usados
echo ================================================
echo.

REM Verificar que Node.js esté instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js no está instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detectado
node --version
echo.

REM Verificar que npm esté instalado
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm no está instalado
    pause
    exit /b 1
)

echo [OK] npm detectado
npm --version
echo.

REM Instalar dependencias
echo ================================================
echo   Instalando dependencias...
echo ================================================
call npm install

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Falló la instalación de dependencias
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Configurando variables de entorno...
echo ================================================

REM Verificar si existe .env
if exist .env (
    echo [INFO] El archivo .env ya existe
    echo ¿Deseas sobrescribirlo? (S/N)
    set /p overwrite=
    if /i "%overwrite%"=="S" (
        copy /Y env.example .env
        echo [OK] Archivo .env creado desde env.example
    ) else (
        echo [INFO] Manteniendo .env existente
    )
) else (
    copy env.example .env
    echo [OK] Archivo .env creado desde env.example
)

echo.
echo ================================================
echo   ¡Configuración completa!
echo ================================================
echo.
echo PRÓXIMOS PASOS:
echo.
echo 1. Edita el archivo .env con tus credenciales de Azure
echo 2. Sigue la guía en CONFIGURACION.md para obtener las credenciales
echo 3. Ejecuta: npm run dev
echo.
echo ================================================
pause

