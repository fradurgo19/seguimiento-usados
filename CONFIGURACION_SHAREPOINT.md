# 🔧 Configuración de SharePoint - Seguimiento Alistamiento Usados

## 📝 Información de la Lista

- **Nombre de la Lista**: Seguimiento Alistamiento Usados
- **URL de la Lista**: https://partequipos2.sharepoint.com/sites/servicioposventa/Lists/Seguimiento%20Alistamiento%20Usados/AllItems.aspx
- **Sitio SharePoint**: https://partequipos2.sharepoint.com/sites/servicioposventa

---

## ⚙️ Variables de Entorno

Crea o edita tu archivo `.env` en la raíz del proyecto con estos valores:

```env
# Configuración de Azure AD (OBTENER DE AZURE PORTAL)
VITE_TENANT_ID=tu-tenant-id-aqui
VITE_CLIENT_ID=tu-client-id-aqui

# Configuración de SharePoint - Seguimiento Alistamiento Usados
VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa
VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados

# Redirect URI para autenticación (desarrollo)
VITE_REDIRECT_URI=http://localhost:5173

# Scope de permisos
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
```

---

## 📋 Pasos para Configurar

### 1. Crear/Editar archivo .env

**Opción A - Crear nuevo archivo:**

```powershell
# En PowerShell
@"
VITE_TENANT_ID=
VITE_CLIENT_ID=
VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa
VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados
VITE_REDIRECT_URI=http://localhost:5173
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
"@ | Out-File -FilePath .env -Encoding utf8
```

**Opción B - Editar manualmente:**

```powershell
notepad .env
```

### 2. Obtener Credenciales de Azure AD

Si aún no tienes las credenciales de Azure:

1. Ve a [Azure Portal](https://portal.azure.com)
2. Azure Active Directory → App registrations → New registration
3. Nombre: "Seguimiento Alistamiento Usados"
4. Tipo de cuenta: "Accounts in this organizational directory only"
5. Redirect URI:
   - Tipo: **Single-page application (SPA)**
   - URI: `http://localhost:5173`
6. Copia el **Application (client) ID** → Pégalo en `VITE_CLIENT_ID`
7. Copia el **Directory (tenant) ID** → Pégalo en `VITE_TENANT_ID`

### 3. Configurar Permisos

En tu aplicación de Azure AD:

1. API permissions → Add a permission → Microsoft Graph → Delegated permissions
2. Agrega:
   - ✅ User.Read
   - ✅ Sites.Read.All
   - ✅ Sites.ReadWrite.All (si necesitas editar)
3. Click "Grant admin consent"

### 4. Verificar la Lista

Asegúrate de tener acceso a la lista:

1. Ve a: https://partequipos2.sharepoint.com/sites/servicioposventa/Lists/Seguimiento%20Alistamiento%20Usados/AllItems.aspx
2. Verifica que puedas ver los items
3. Tu cuenta Microsoft debe tener permisos de lectura mínimo

---

## 🚀 Iniciar la Aplicación

Una vez configurado el `.env`:

```bash
# Si el servidor no está corriendo
npm run dev
```

La aplicación estará en: **http://localhost:5173**

---

## ✅ Verificación

Después de iniciar sesión, la aplicación debería:

1. ✅ Mostrar tu nombre en la esquina superior derecha
2. ✅ Cargar automáticamente los datos de "Seguimiento Alistamiento Usados"
3. ✅ Mostrar una tabla con todas las columnas de tu lista
4. ✅ Formatear fechas, números y otros campos correctamente

---

## 🐛 Solución de Problemas

### Error: "No se encontró la lista"

- Verifica que el nombre sea exacto: `Seguimiento Alistamiento Usados`
- Asegúrate de tener permisos en la lista

### Error: "Access denied"

- Verifica que los permisos en Azure estén aprobados
- Asegúrate de que tu cuenta tenga acceso al sitio de SharePoint

### Error: "Invalid tenant"

- Verifica que el TENANT_ID sea correcto
- Debe ser el tenant ID de Partequipos

### La ventana de login no se abre

- Verifica que no esté bloqueada por el navegador
- Prueba con otro navegador (Chrome, Edge)

---

## 📝 Notas Importantes

1. **Nombre de la Lista**: El nombre debe ser exacto, incluyendo espacios: "Seguimiento Alistamiento Usados"
2. **URL del Sitio**: No incluyas la parte `/Lists/...`, solo hasta `/servicioposventa`
3. **Seguridad**: El archivo `.env` NO se sube al repositorio (está en `.gitignore`)
4. **Producción**: Para Vercel, configura las mismas variables en Settings → Environment Variables

---

## 🎯 Próximos Pasos

Una vez que la aplicación esté funcionando:

1. **Personaliza la UI** según tus necesidades
2. **Agrega filtros** para búsquedas específicas
3. **Implementa edición** de items (el código ya está listo)
4. **Agrega reportes** o estadísticas
5. **Despliega en Vercel** para acceso desde cualquier lugar

---

¿Necesitas ayuda? Revisa:

- **README.md** - Documentación completa
- **CONFIGURACION.md** - Guía detallada de Azure AD
- **INICIO_RAPIDO.md** - Guía rápida
