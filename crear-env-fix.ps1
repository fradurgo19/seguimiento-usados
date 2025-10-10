# Script para crear archivo .env con credenciales de Partequipos
# Seguimiento Alistamiento Usados

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Creando archivo .env" -ForegroundColor Cyan
Write-Host "  Seguimiento Alistamiento Usados" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si ya existe .env
if (Test-Path ".env") {
    Write-Host "El archivo .env ya existe" -ForegroundColor Yellow
    $overwrite = Read-Host "Deseas sobrescribirlo? (S/N)"
    if ($overwrite -ne "S" -and $overwrite -ne "s") {
        Write-Host "Cancelado." -ForegroundColor Yellow
        exit
    }
}

# Contenido del archivo .env con las credenciales de Azure
$envContent = @"
# Configuracion de SharePoint / Microsoft Graph API
# Generado para: Seguimiento Alistamiento Usados - Partequipos

# CREDENCIALES DE AZURE AD
VITE_TENANT_ID=26cb2c05-c882-4926-891d-27fa7b04b516
VITE_CLIENT_ID=16e8b542-42ed-4376-91b4-f24aa6f8bed9

# CONFIGURACION DE SHAREPOINT - Seguimiento Alistamiento Usados
VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa
VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados

# Redirect URI para autenticacion (desarrollo local)
VITE_REDIRECT_URI=http://localhost:5173

# Scope de permisos de Microsoft Graph
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
"@

# Escribir archivo .env
try {
    $envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
    Write-Host ""
    Write-Host "Archivo .env creado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Configuracion aplicada:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Tenant ID:   26cb2c05-c882-4926-891d-27fa7b04b516" -ForegroundColor White
    Write-Host "Client ID:   16e8b542-42ed-4376-91b4-f24aa6f8bed9" -ForegroundColor White
    Write-Host "Sitio:       https://partequipos2.sharepoint.com/sites/servicioposventa" -ForegroundColor White
    Write-Host "Lista:       Seguimiento Alistamiento Usados" -ForegroundColor White
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Proximos pasos:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. El servidor ya esta corriendo en:" -ForegroundColor White
    Write-Host "   http://localhost:5173" -ForegroundColor Cyan
    Write-Host "2. Abre el navegador y haz click en Iniciar Sesion" -ForegroundColor White
    Write-Host "3. Veras tus datos de SharePoint!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error al crear el archivo .env: $_" -ForegroundColor Red
    exit 1
}

# Preguntar si desea abrir el navegador
Write-Host ""
$openBrowser = Read-Host "Deseas abrir la aplicacion en el navegador ahora? (S/N)"
if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Write-Host ""
    Write-Host "Abriendo http://localhost:5173..." -ForegroundColor Green
    Start-Process "http://localhost:5173"
}

