# Script de configuración de variables de entorno
# Para Seguimiento Alistamiento Usados - Partequipos

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuración de Variables de Entorno" -ForegroundColor Cyan
Write-Host "  Seguimiento Alistamiento Usados" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si ya existe .env
if (Test-Path ".env") {
    Write-Host "⚠️  El archivo .env ya existe" -ForegroundColor Yellow
    $overwrite = Read-Host "¿Deseas sobrescribirlo? (S/N)"
    if ($overwrite -ne "S" -and $overwrite -ne "s") {
        Write-Host "Cancelado. Puedes editar .env manualmente con: notepad .env" -ForegroundColor Yellow
        exit
    }
}

Write-Host ""
Write-Host "📝 Ingresa las credenciales de Azure AD" -ForegroundColor Green
Write-Host "   (Obtén estos valores de Azure Portal)" -ForegroundColor Gray
Write-Host ""

# Solicitar Tenant ID
Write-Host "1. Tenant ID (Directory ID):" -ForegroundColor White
Write-Host "   Ejemplo: 12345678-1234-1234-1234-123456789abc" -ForegroundColor Gray
$tenantId = Read-Host "   VITE_TENANT_ID"

# Solicitar Client ID
Write-Host ""
Write-Host "2. Client ID (Application ID):" -ForegroundColor White
Write-Host "   Ejemplo: 87654321-4321-4321-4321-987654321xyz" -ForegroundColor Gray
$clientId = Read-Host "   VITE_CLIENT_ID"

# Confirmar datos
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuración a aplicar:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tenant ID:         $tenantId" -ForegroundColor White
Write-Host "Client ID:         $clientId" -ForegroundColor White
Write-Host "Sitio SharePoint:  https://partequipos2.sharepoint.com/sites/servicioposventa" -ForegroundColor White
Write-Host "Lista:             Seguimiento Alistamiento Usados" -ForegroundColor White
Write-Host "Redirect URI:      http://localhost:5173" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "¿Es correcta esta información? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Cancelado." -ForegroundColor Yellow
    exit
}

# Crear contenido del archivo .env
$envContent = @"
# Configuración de SharePoint / Microsoft Graph API
# Generado automáticamente el $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# CREDENCIALES DE AZURE AD
VITE_TENANT_ID=$tenantId
VITE_CLIENT_ID=$clientId

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
    Write-Host "Próximos pasos:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Inicia el servidor: npm run dev" -ForegroundColor White
    Write-Host "2. Abre el navegador: http://localhost:5173" -ForegroundColor White
    Write-Host "3. Inicia sesión con tu cuenta de Microsoft" -ForegroundColor White
    Write-Host "4. ¡Verás los datos de SharePoint!" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Documentación:" -ForegroundColor Yellow
    Write-Host "   - README.md" -ForegroundColor Gray
    Write-Host "   - CONFIGURACION_SHAREPOINT.md" -ForegroundColor Gray
    Write-Host "   - INICIO_RAPIDO.md" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al crear el archivo .env: $_" -ForegroundColor Red
    exit 1
}

# Preguntar si desea iniciar el servidor
Write-Host ""
$startServer = Read-Host "¿Deseas iniciar el servidor de desarrollo ahora? (S/N)"
if ($startServer -eq "S" -or $startServer -eq "s") {
    Write-Host ""
    Write-Host "Iniciando servidor..." -ForegroundColor Green
    npm run dev
}

