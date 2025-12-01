# 3. Configuración Técnica

## Requisitos Previos

Para que el sistema funcione, se necesitan:

### 1. Cuentas y Servicios de Microsoft

- **Cuenta de Microsoft 365** con acceso a SharePoint
- **Acceso a Azure Portal** (con permisos de administrador para registrar aplicaciones)
- **Sitio de SharePoint** donde estará la lista de datos
- **Lista de SharePoint** creada con los campos necesarios

### 2. Software en la Computadora de Desarrollo

- **Node.js** versión 18 o superior
- **npm** (viene con Node.js)
- **Git** (opcional, para control de versiones)
- **Editor de código** (Visual Studio Code recomendado)

### 3. Navegador

- Cualquier navegador moderno (Chrome, Edge, Firefox, Safari)
- JavaScript habilitado

## Configuración Paso a Paso

### Paso 1: Registrar la Aplicación en Azure

Esto permite que la aplicación se autentique con Microsoft.

1. Ir a [Azure Portal](https://portal.azure.com)
2. Buscar "Azure Active Directory" o "Entra ID"
3. Ir a "App registrations" > "New registration"
4. Configurar:
   - **Name:** Seguimiento Usados (o el nombre que prefieras)
   - **Supported account types:** "Accounts in this organizational directory only"
   - **Redirect URI:**
     - Platform: "Single-page application (SPA)"
     - URI: `http://localhost:5173` (para desarrollo)
5. Hacer clic en "Register"
6. **Guardar estos valores:**
   - **Application (client) ID** → Se usará como `VITE_CLIENT_ID`
   - **Directory (tenant) ID** → Se usará como `VITE_TENANT_ID`

### Paso 2: Configurar Permisos en Azure

Esto define qué puede hacer la aplicación.

1. En la aplicación registrada, ir a "API permissions"
2. Hacer clic en "Add a permission"
3. Seleccionar "Microsoft Graph"
4. Seleccionar "Delegated permissions"
5. Agregar estos permisos:
   - `User.Read` (leer información del usuario)
   - `Sites.Read.All` (leer sitios de SharePoint)
   - `Sites.ReadWrite.All` (leer y escribir en SharePoint)
6. Hacer clic en "Grant admin consent" (requiere permisos de administrador)

### Paso 3: Configurar Variables de Entorno

Las variables de entorno contienen información sensible que no debe estar en el código.

1. En la raíz del proyecto, crear un archivo llamado `.env`
2. Copiar el contenido de `env.example` (si existe) o crear uno nuevo
3. Llenar con los valores obtenidos:

```env
# ID del tenant de Azure (Directory ID)
VITE_TENANT_ID=tu-tenant-id-aqui

# ID de la aplicación registrada (Client ID)
VITE_CLIENT_ID=tu-client-id-aqui

# URL completa del sitio de SharePoint
VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa

# Nombre exacto de la lista en SharePoint
VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados

# URL de redirección después de autenticarse (desarrollo)
VITE_REDIRECT_URI=http://localhost:5173

# Scope de permisos (generalmente no cambiar)
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
```

### Paso 4: Obtener Información de SharePoint

**URL del Sitio:**
- Ir al sitio de SharePoint en el navegador
- Copiar la URL completa de la barra de direcciones
- Ejemplo: `https://partequipos2.sharepoint.com/sites/servicioposventa`

**Nombre de la Lista:**
- Ir a la lista en SharePoint
- El nombre aparece en la parte superior de la página
- **Importante:** Usar el nombre exacto, respetando mayúsculas y minúsculas

### Paso 5: Instalar Dependencias

Abrir terminal en la carpeta del proyecto y ejecutar:

```bash
npm install
```

Esto descargará todas las librerías necesarias (React, TypeScript, etc.)

### Paso 6: Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Configuración para Producción

Cuando se despliega en producción (por ejemplo, en Vercel), hay que:

### 1. Actualizar Redirect URI en Azure

1. Ir a Azure Portal > Tu aplicación > Authentication
2. Agregar nueva plataforma "Single-page application (SPA)"
3. Agregar la URL de producción, por ejemplo: `https://seguimiento-usados.vercel.app`

### 2. Configurar Variables de Entorno en el Hosting

En la plataforma de hosting (Vercel, Netlify, etc.):

1. Ir a Settings > Environment Variables
2. Agregar todas las variables del archivo `.env`
3. **Actualizar `VITE_REDIRECT_URI`** con la URL de producción

### 3. Compilar para Producción

```bash
npm run build
```

Esto crea una carpeta `dist/` con los archivos listos para producción.

## Verificación de la Configuración

### Verificar que todo funciona:

1. ✅ La aplicación inicia sin errores
2. ✅ El botón "Iniciar Sesión" funciona
3. ✅ Se puede autenticar con cuenta de Microsoft 365
4. ✅ Se cargan los datos de SharePoint
5. ✅ Se pueden ver los equipos en la lista
6. ✅ Se pueden agregar nuevos equipos
7. ✅ Se pueden editar equipos existentes

### Problemas Comunes

**Error: "Redirect URI mismatch"**
- Verificar que la URL en Azure Portal coincida exactamente con la de la aplicación
- Verificar que sea tipo "Single-page application (SPA)"

**Error: "Permisos insuficientes"**
- Verificar que los permisos estén agregados en Azure Portal
- Verificar que se haya hecho "Grant admin consent"

**Error: "No se puede conectar a SharePoint"**
- Verificar que la URL del sitio sea correcta
- Verificar que el nombre de la lista sea exacto
- Verificar que el usuario tenga permisos en SharePoint

**La aplicación no muestra datos**
- Abrir la consola del navegador (F12) y revisar errores
- Verificar que el usuario esté autenticado
- Verificar que el usuario tenga permisos de lectura en la lista

## Archivos de Configuración Importantes

| Archivo | Propósito |
|---------|-----------|
| `.env` | Variables de entorno (credenciales, URLs) |
| `package.json` | Dependencias y scripts del proyecto |
| `vite.config.ts` | Configuración del build tool (Vite) |
| `tsconfig.json` | Configuración de TypeScript |
| `src/config/authConfig.ts` | Configuración de autenticación MSAL |

## Seguridad de las Credenciales

⚠️ **IMPORTANTE:**
- El archivo `.env` **NO debe subirse** a Git
- Está en `.gitignore` para evitar que se suba accidentalmente
- Cada desarrollador debe tener su propio archivo `.env`
- En producción, las variables se configuran en la plataforma de hosting

---

**Siguiente:** [Tecnologías Utilizadas](./04-Tecnologias.md)

