@echo off
REM Script para compilar la aplicación para producción

echo ================================================
echo   Compilando aplicación para producción...
echo ================================================
echo.

REM Verificar tipos TypeScript
echo [1/3] Verificando tipos TypeScript...
call npm run typecheck
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Error en la verificación de tipos
    pause
    exit /b 1
)
echo [OK] Verificación de tipos completada
echo.

REM Ejecutar linter
echo [2/3] Ejecutando linter...
call npm run lint
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Se encontraron problemas de linting
    echo ¿Deseas continuar de todos modos? (S/N)
    set /p continue=
    if /i not "%continue%"=="S" (
        exit /b 1
    )
)
echo [OK] Linter completado
echo.

REM Compilar
echo [3/3] Compilando...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Error durante la compilación
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ¡Compilación exitosa!
echo ================================================
echo.
echo Los archivos están en la carpeta: dist/
echo.
echo Para previsualizar, ejecuta: npm run preview
echo ================================================
pause

