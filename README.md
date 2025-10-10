# Seguimiento Usados - Sistema de Seguimiento con SharePoint

Sistema de seguimiento integrado con SharePoint desarrollado con React, Vite, TypeScript y Microsoft Graph API.

## 🚀 Características

- ✅ Autenticación con Microsoft Azure AD (MSAL)
- ✅ Conexión con listas de SharePoint
- ✅ Visualización de datos en tiempo real
- ✅ Interfaz moderna y responsive con Tailwind CSS
- ✅ TypeScript para mayor seguridad de tipos
- ✅ Iconos con Lucide React

## 📋 Requisitos Previos

1. **Node.js** versión 18 o superior
2. **Cuenta de Microsoft 365** con acceso a SharePoint
3. **Aplicación registrada en Azure AD** con los siguientes permisos:
   - `User.Read`
   - `Sites.Read.All`
   - `Sites.ReadWrite.All` (si necesitas escritura)

## 🔧 Configuración de Azure AD

### Paso 1: Registrar la aplicación en Azure

1. Ve a [Azure Portal](https://portal.azure.com)
2. Navega a **Azure Active Directory** > **App registrations** > **New registration**
3. Configura:
   - **Name**: Seguimiento Usados (o el nombre que prefieras)
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**:
     - Platform: Single-page application (SPA)
     - URI: `http://localhost:5173` (para desarrollo)

### Paso 2: Configurar permisos

1. En tu aplicación registrada, ve a **API permissions**
2. Click en **Add a permission** > **Microsoft Graph** > **Delegated permissions**
3. Agrega los siguientes permisos:
   - `User.Read`
   - `Sites.Read.All`
   - `Sites.ReadWrite.All` (si necesitas escritura)
4. Click en **Grant admin consent** (requiere permisos de administrador)

### Paso 3: Obtener credenciales

1. En **Overview**, copia:
   - **Application (client) ID**
   - **Directory (tenant) ID**
2. Guarda estos valores, los necesitarás para la configuración

## ⚙️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (puedes copiar `env.example`):

```bash
# Copia el archivo de ejemplo
cp env.example .env
```

Edita el archivo `.env` y completa con tus credenciales:

```env
# Configuración de SharePoint / Microsoft Graph API
VITE_TENANT_ID=tu-tenant-id-aqui
VITE_CLIENT_ID=tu-client-id-aqui
VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa
VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados

# Redirect URI para autenticación (desarrollo)
VITE_REDIRECT_URI=http://localhost:5173

# Scope de permisos
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
```

### 3. Obtener la URL del sitio y nombre de la lista

**URL del Sitio:**

- Ve a tu sitio de SharePoint
- Copia la URL completa, por ejemplo: `https://tuempresa.sharepoint.com/sites/SeguimientoUsados`

**Nombre de la Lista:**

- Ve a la lista en SharePoint
- El nombre de la lista aparece en la parte superior
- Usa el nombre exacto como aparece en SharePoint

## 🚀 Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🔍 Previsualizar Build de Producción

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
project/
├── src/
│   ├── components/          # Componentes React
│   │   ├── LoginButton.tsx
│   │   └── SharePointDataTable.tsx
│   ├── config/              # Configuración
│   │   └── authConfig.ts
│   ├── context/             # Contextos de React
│   │   └── AuthContext.tsx
│   ├── services/            # Servicios de API
│   │   ├── authService.ts
│   │   └── sharePointService.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globales
├── env.example              # Ejemplo de variables de entorno
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Tecnologías Utilizadas

- **React 18** - Framework de UI
- **TypeScript** - Superset de JavaScript con tipos
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS utility-first
- **MSAL** - Microsoft Authentication Library
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **date-fns** - Formateo de fechas

## 🔐 Seguridad

- Las credenciales se almacenan en variables de entorno (`.env`)
- El archivo `.env` está en `.gitignore` y no se sube al repositorio
- Se usa `sessionStorage` para los tokens (se borran al cerrar la pestaña)
- MSAL maneja automáticamente la renovación de tokens

## 🐛 Solución de Problemas

### Error: "No se puede conectar a SharePoint"

1. Verifica que las variables de entorno estén correctamente configuradas
2. Asegúrate de que la URL del sitio sea correcta
3. Verifica que el nombre de la lista sea exacto (sensible a mayúsculas)

### Error: "Permisos insuficientes"

1. Ve a Azure Portal > Tu aplicación > API permissions
2. Verifica que los permisos estén agregados
3. Asegúrate de hacer "Grant admin consent"

### Error: "Redirect URI mismatch"

1. Ve a Azure Portal > Tu aplicación > Authentication
2. Verifica que la URI de redirección sea exactamente `http://localhost:5173`
3. Asegúrate de que sea tipo "Single-page application (SPA)"

### La aplicación no muestra datos

1. Verifica en la consola del navegador si hay errores
2. Asegúrate de haber iniciado sesión
3. Verifica que tengas permisos de lectura en la lista de SharePoint

## 📝 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Compila para producción
npm run preview      # Previsualiza build de producción
npm run lint         # Ejecuta linter
npm run typecheck    # Verifica tipos de TypeScript
```

## 🚢 Despliegue en Vercel

La aplicación está configurada para desplegarse automáticamente en Vercel:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel (Settings > Environment Variables)
3. Actualiza `VITE_REDIRECT_URI` con la URL de producción
4. Agrega la URL de producción a Azure AD (Authentication > Add platform)

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
2. Revisa la documentación de [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js)

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

Desarrollado con ❤️ usando React + Vite + TypeScript
