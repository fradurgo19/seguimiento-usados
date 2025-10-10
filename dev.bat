@echo off
REM Script para iniciar el servidor de desarrollo

echo ================================================
echo   Iniciando servidor de desarrollo...
echo ================================================
echo.
echo La aplicación estará disponible en:
echo http://localhost:5173
echo.
echo Presiona Ctrl+C para detener el servidor
echo ================================================
echo.

call npm run dev

