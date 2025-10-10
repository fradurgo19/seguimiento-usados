# Script para crear archivo .env con credenciales de Partequipos
# Seguimiento Alistamiento Usados

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Creando archivo .env" -ForegroundColor Cyan
Write-Host "  Seguimiento Alistamiento Usados" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si ya existe .env
if (Test-Path ".env") {
    Write-Host "⚠️  El archivo .env ya existe" -ForegroundColor Yellow
    $overwrite = Read-Host "¿Deseas sobrescribirlo? (S/N)"
    if ($overwrite -ne "S" -and $overwrite -ne "s") {
        Write-Host "Cancelado." -ForegroundColor Yellow
        exit
    }
}

# Contenido del archivo .env con las credenciales de Azure
$envContent = @"
# Configuración de SharePoint / Microsoft Graph API
# Generado para: Seguimiento Alistamiento Usados - Partequipos

# CREDENCIALES DE AZURE AD
VITE_TENANT_ID=26cb2c05-c882-4926-891d-27fa7b04b516
VITE_CLIENT_ID=16e8b542-42ed-4376-91b4-f24aa6f8bed9

# CONFIGURACIÓN DE SHAREPOINT - Seguimiento Alistamiento Usados
VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa
VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados

# Redirect URI para autenticación (desarrollo local)
VITE_REDIRECT_URI=http://localhost:5173

# Scope de permisos de Microsoft Graph
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
"@

# Escribir archivo .env
try {
    $envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
    Write-Host ""
    Write-Host "✅ Archivo .env creado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Configuración aplicada:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Tenant ID:   26cb2c05-c882-4926-891d-27fa7b04b516" -ForegroundColor White
    Write-Host "✅ Client ID:   16e8b542-42ed-4376-91b4-f24aa6f8bed9" -ForegroundColor White
    Write-Host "✅ Sitio:       https://partequipos2.sharepoint.com/sites/servicioposventa" -ForegroundColor White
    Write-Host "✅ Lista:       Seguimiento Alistamiento Usados" -ForegroundColor White
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "⚠️  IMPORTANTE - Verifica en Azure Portal:" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Redirect URI configurado:" -ForegroundColor White
    Write-Host "   Authentication → Single-page application" -ForegroundColor Gray
    Write-Host "   → http://localhost:5173" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Permisos de API agregados:" -ForegroundColor White
    Write-Host "   API permissions → Microsoft Graph" -ForegroundColor Gray
    Write-Host "   ✅ User.Read" -ForegroundColor Gray
    Write-Host "   ✅ Sites.Read.All" -ForegroundColor Gray
    Write-Host "   ✅ Sites.ReadWrite.All (opcional)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. ⭐ Otorgar consentimiento de administrador:" -ForegroundColor Yellow
    Write-Host "   Click en 'Grant admin consent for Partequipos'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Próximos pasos:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Verifica los permisos en Azure Portal (ver arriba)" -ForegroundColor White
    Write-Host "2. El servidor ya está corriendo en:" -ForegroundColor White
    Write-Host "   http://localhost:5173" -ForegroundColor Cyan
    Write-Host "3. Abre el navegador y haz click en 'Iniciar Sesión'" -ForegroundColor White
    Write-Host "4. ¡Verás tus datos de SharePoint!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📚 Documentación: CREDENCIALES.md" -ForegroundColor Yellow
    Write-Host ""
} catch {
    Write-Host "❌ Error al crear el archivo .env: $_" -ForegroundColor Red
    exit 1
}

# Preguntar si desea abrir el navegador
Write-Host ""
$openBrowser = Read-Host "¿Deseas abrir la aplicación en el navegador ahora? (S/N)"
if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Write-Host ""
    Write-Host "Abriendo http://localhost:5173..." -ForegroundColor Green
    Start-Process "http://localhost:5173"
}

