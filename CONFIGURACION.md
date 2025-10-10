# Guía de Configuración Paso a Paso

Esta guía te ayudará a configurar el proyecto desde cero.

## 📋 Checklist de Configuración

- [ ] Node.js instalado (v18+)
- [ ] Cuenta de Microsoft 365
- [ ] Acceso a Azure Portal
- [ ] Permisos de administrador en SharePoint (para algunas operaciones)

## 🔐 Configuración de Azure AD (Detallada)

### Paso 1: Acceder a Azure Portal

1. Ve a https://portal.azure.com
2. Inicia sesión con tu cuenta de Microsoft 365
3. Si no ves "Azure Active Directory", usa el buscador en la parte superior

### Paso 2: Registrar una nueva aplicación

1. En el menú lateral, selecciona **Azure Active Directory**
2. Click en **App registrations** (Registros de aplicaciones)
3. Click en **+ New registration** (+ Nuevo registro)

### Paso 3: Completar el formulario de registro

**Name (Nombre):**

```
Seguimiento Usados
```

**Supported account types (Tipos de cuenta compatibles):**

- Selecciona: "Accounts in this organizational directory only (Single tenant)"

**Redirect URI (URI de redirección):**

- Platform: **Single-page application (SPA)**
- URI: `http://localhost:5173`

Click en **Register** (Registrar)

### Paso 4: Copiar las credenciales

Una vez registrada, verás la página de **Overview**:

1. **Application (client) ID**:

   - Ejemplo: `12345678-1234-1234-1234-123456789abc`
   - Copia este valor ➜ Será tu `VITE_CLIENT_ID`

2. **Directory (tenant) ID**:
   - Ejemplo: `87654321-4321-4321-4321-987654321xyz`
   - Copia este valor ➜ Será tu `VITE_TENANT_ID`

### Paso 5: Configurar permisos de API

1. En el menú lateral de tu aplicación, click en **API permissions**
2. Click en **+ Add a permission**
3. Selecciona **Microsoft Graph**
4. Selecciona **Delegated permissions**
5. En el buscador, busca y selecciona:
   - ✅ `User.Read` (debería estar ya agregado)
   - ✅ `Sites.Read.All`
   - ✅ `Sites.ReadWrite.All` (solo si necesitas crear/modificar items)
6. Click en **Add permissions**

### Paso 6: Otorgar consentimiento de administrador

⚠️ **Este paso requiere permisos de administrador**

1. En la página de **API permissions**, click en **Grant admin consent for [Tu Organización]**
2. Click en **Yes** para confirmar
3. Verifica que todos los permisos muestren un check verde en "Status"

### Paso 7: Configurar autenticación adicional (Opcional)

1. En el menú lateral, click en **Authentication**
2. En **Implicit grant and hybrid flows**:
   - ✅ Marca **Access tokens**
   - ✅ Marca **ID tokens**
3. Click en **Save**

## 📝 Configuración de SharePoint

### Obtener la URL del sitio

1. Abre tu navegador y ve a tu sitio de SharePoint
2. La URL completa será algo como:
   ```
   https://tuempresa.sharepoint.com/sites/SeguimientoUsados
   ```
3. Copia toda la URL ➜ Será tu `VITE_SHAREPOINT_SITE_URL`

### Obtener el nombre de la lista

1. En tu sitio de SharePoint, ve a la lista que quieres conectar
2. El nombre aparece en la parte superior de la página
3. **Importante**: Usa el nombre **exacto** como aparece
   - Sensible a mayúsculas y minúsculas
   - Ejemplo: `Seguimiento de Vehiculos Usados`
4. Copia el nombre ➜ Será tu `VITE_SHAREPOINT_LIST_NAME`

### Verificar permisos de la lista

Asegúrate de que tu cuenta tenga al menos permisos de **lectura** en la lista:

1. En SharePoint, ve a la lista
2. Click en el ícono de configuración (⚙️) > **List settings**
3. Click en **Permissions for this list**
4. Verifica que tu cuenta o grupo tenga acceso

## ⚙️ Configuración del Proyecto

### 1. Clonar o descargar el proyecto

```bash
cd "C:\Users\Frank Duran\OneDrive - Partequipos S.A.S\Escritorio\SeguimientoUsados\project"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo .env

Crea un archivo llamado `.env` en la raíz del proyecto:

**Windows (PowerShell):**

```powershell
Copy-Item env.example .env
```

**Windows (CMD):**

```cmd
copy env.example .env
```

### 4. Completar las variables de entorno

Abre el archivo `.env` con tu editor favorito y completa:

```env
# IDs de Azure AD (del Paso 4 anterior)
VITE_TENANT_ID=tu-tenant-id-aqui
VITE_CLIENT_ID=tu-client-id-aqui

# Configuración de SharePoint
VITE_SHAREPOINT_SITE_URL=https://tuempresa.sharepoint.com/sites/tusitio
VITE_SHAREPOINT_LIST_NAME=NombreDeTuLista

# Estas pueden quedarse como están para desarrollo
VITE_REDIRECT_URI=http://localhost:5173
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
```

**Ejemplo completo:**

```env
VITE_TENANT_ID=87654321-4321-4321-4321-987654321xyz
VITE_CLIENT_ID=12345678-1234-1234-1234-123456789abc
VITE_SHAREPOINT_SITE_URL=https://partequipos.sharepoint.com/sites/SeguimientoUsados
VITE_SHAREPOINT_LIST_NAME=Seguimiento de Vehiculos Usados
VITE_REDIRECT_URI=http://localhost:5173
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
```

### 5. Iniciar la aplicación

```bash
npm run dev
```

Abre tu navegador en: http://localhost:5173

## ✅ Verificación

### Verificar que todo funcione:

1. **La aplicación carga**: ✅

   - Deberías ver la página con el título "Seguimiento Usados"
   - Botón "Iniciar Sesión con Microsoft"

2. **Puedes iniciar sesión**: ✅

   - Click en "Iniciar Sesión con Microsoft"
   - Se abre una ventana popup de Microsoft
   - Inicia sesión con tu cuenta
   - La ventana se cierra y ves tu nombre

3. **Se cargan los datos**: ✅
   - Después de iniciar sesión, deberías ver una tabla
   - La tabla muestra los datos de tu lista de SharePoint
   - Si no hay datos, verás un mensaje indicándolo

### Si algo no funciona:

1. **Abre la consola del navegador** (F12)
2. Ve a la pestaña **Console**
3. Busca mensajes de error en rojo
4. Revisa la sección "Solución de Problemas" en el README.md

## 🚀 Siguientes Pasos

Una vez que todo funcione:

1. Personaliza los componentes según tus necesidades
2. Agrega más funcionalidades (filtros, búsqueda, edición, etc.)
3. Configura el despliegue en Vercel para producción

## 📞 Ayuda Adicional

Si tienes problemas:

1. Verifica que todas las variables de entorno estén correctas
2. Asegúrate de que los permisos en Azure estén bien configurados
3. Verifica que tengas acceso a SharePoint
4. Revisa los logs en la consola del navegador

---

¿Listo para empezar? Sigue los pasos en orden y en 15-20 minutos tendrás todo funcionando. 🎉
