# ✅ Configuración Completa - Seguimiento Alistamiento Usados

## 📝 Resumen de la Implementación

Has recibido un proyecto completamente configurado y listo para conectarse a SharePoint de Partequipos.

---

## 🎯 Información de la Lista de SharePoint

### Lista: **Seguimiento Alistamiento Usados**

- **Sitio**: Servicio Posventa - Partequipos
- **URL del Sitio**: `https://partequipos2.sharepoint.com/sites/servicioposventa`
- **Nombre de la Lista**: `Seguimiento Alistamiento Usados`
- **URL de la Lista**: https://partequipos2.sharepoint.com/sites/servicioposventa/Lists/Seguimiento%20Alistamiento%20Usados/AllItems.aspx

---

## 🚀 Pasos para Poner en Marcha

### 1️⃣ Obtener Credenciales de Azure AD

Como esta aplicación se conecta a SharePoint de Partequipos, necesitas registrar una aplicación en Azure AD de tu organización:

#### Pasos en Azure Portal:

1. **Ir a Azure Portal**

   - https://portal.azure.com
   - Inicia sesión con tu cuenta de Partequipos

2. **Registrar Aplicación**

   - Azure Active Directory → App registrations → New registration
   - **Nombre**: `Seguimiento Alistamiento Usados App`
   - **Tipo de cuenta**: "Accounts in this organizational directory only (Partequipos only)"
   - **Redirect URI**:
     - Tipo: **Single-page application (SPA)**
     - URI: `http://localhost:5173`
   - Click "Register"

3. **Copiar Credenciales**

   - En la página de Overview, copia:
     - **Application (client) ID** → Este es tu `VITE_CLIENT_ID`
     - **Directory (tenant) ID** → Este es tu `VITE_TENANT_ID`

4. **Configurar Permisos**
   - API permissions → Add a permission → Microsoft Graph → Delegated permissions
   - Agrega:
     - ✅ `User.Read` (ya debe estar)
     - ✅ `Sites.Read.All`
     - ✅ `Sites.ReadWrite.All` (solo si necesitas editar datos)
   - Click "Grant admin consent for Partequipos" (requiere permisos de admin)

---

### 2️⃣ Configurar el Proyecto

Hay dos formas de configurar las variables de entorno:

#### Opción A: Script Automático (Recomendado) ⭐

```powershell
# En la carpeta del proyecto
.\configurar-env.ps1
```

El script te pedirá:

- Tenant ID (de Azure Portal)
- Client ID (de Azure Portal)

Los demás valores ya están configurados automáticamente.

#### Opción B: Manual

1. Crea el archivo `.env`:

   ```powershell
   Copy-Item env.example .env
   ```

2. Edita el archivo:

   ```powershell
   notepad .env
   ```

3. Completa solo estas dos líneas:

   ```env
   VITE_TENANT_ID=pega-aqui-tu-tenant-id
   VITE_CLIENT_ID=pega-aqui-tu-client-id
   ```

   Las siguientes líneas ya están configuradas:

   ```env
   VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa
   VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados
   VITE_REDIRECT_URI=http://localhost:5173
   VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
   ```

---

### 3️⃣ Iniciar la Aplicación

```bash
# Instalar dependencias (primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor iniciará en: **http://localhost:5173**

---

## ✅ Verificación

### Al abrir http://localhost:5173 deberías ver:

1. ✅ **Página principal** con el título "Seguimiento Usados"
2. ✅ **Botón azul** "Iniciar Sesión con Microsoft" en la esquina superior derecha
3. ✅ Mensaje solicitando que inicies sesión

### Después de iniciar sesión:

1. ✅ **Tu nombre** aparece en la esquina superior derecha
2. ✅ **Tabla de datos** con información de "Seguimiento Alistamiento Usados"
3. ✅ **Columnas** de la lista de SharePoint
4. ✅ **Datos** de los items de la lista

---

## 🔍 Pruebas

### Verificar Acceso a SharePoint

Antes de usar la aplicación, verifica que tengas acceso:

1. Abre en tu navegador:

   ```
   https://partequipos2.sharepoint.com/sites/servicioposventa/Lists/Seguimiento%20Alistamiento%20Usados/AllItems.aspx
   ```

2. ✅ Deberías poder ver la lista y sus items
3. ❌ Si no tienes acceso, solicita permisos al administrador de SharePoint

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "AADSTS50011: The reply URL specified in the request does not match"

**Causa**: La URI de redirección no está configurada en Azure.

**Solución**:

1. Ve a Azure Portal → Tu App → Authentication
2. Verifica que `http://localhost:5173` esté en "Single-page application"
3. Guarda los cambios

### ❌ Error: "Access denied" al intentar cargar datos

**Causa**: Faltan permisos en Azure AD.

**Solución**:

1. Ve a Azure Portal → Tu App → API permissions
2. Verifica que `Sites.Read.All` esté presente
3. Click en "Grant admin consent"

### ❌ Error: "No se encontró la lista"

**Causa**: Error en el nombre de la lista o falta de permisos.

**Solución**:

1. Verifica que el `.env` tenga exactamente:
   ```
   VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados
   ```
2. Verifica que tengas acceso a la lista en SharePoint

### ❌ La ventana de login no se abre

**Causa**: Bloqueador de popups.

**Solución**:

1. Permite popups en tu navegador para localhost:5173
2. Intenta con otro navegador (Chrome, Edge, Firefox)

### ❌ Error: "Cannot read properties of undefined"

**Causa**: Variables de entorno no cargadas.

**Solución**:

1. Verifica que el archivo `.env` exista en la raíz del proyecto
2. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

---

## 📊 Estructura de Datos

La aplicación cargará automáticamente todas las columnas de tu lista de SharePoint.

### Tipos de campos soportados:

- ✅ **Texto**: Campos de texto simple
- ✅ **Números**: Campos numéricos
- ✅ **Fechas**: Se formatean como dd/MM/yyyy HH:mm
- ✅ **Booleanos**: Se muestran como "Sí" o "No"
- ✅ **Lookup**: Se muestra el valor de referencia
- ✅ **Person**: Se muestra el nombre del usuario

---

## 🎨 Personalización

Una vez que la aplicación funcione, puedes:

### 1. Personalizar la UI

- Edita `src/components/SharePointDataTable.tsx`
- Cambia colores, agregar filtros, etc.

### 2. Agregar Funcionalidades

- **Filtros**: Agregar búsqueda por columnas
- **Edición**: Usar `sharePointService.updateListItem()`
- **Creación**: Usar `sharePointService.createListItem()`
- **Exportación**: Exportar a Excel/CSV

### 3. Agregar Más Listas

- Duplica `SharePointDataTable.tsx`
- Cambia el `listName` en la llamada al servicio

---

## 📚 Documentación Adicional

1. **INICIO_RAPIDO.md** - Guía de inicio rápido (5 minutos)
2. **CONFIGURACION.md** - Guía detallada de Azure AD
3. **CONFIGURACION_SHAREPOINT.md** - Info específica de SharePoint
4. **README.md** - Documentación técnica completa
5. **RESUMEN_IMPLEMENTACION.md** - Arquitectura y características

---

## 💡 Tips Importantes

### Para Desarrollo

- ✅ El servidor recarga automáticamente al guardar archivos
- ✅ Los errores se muestran en la consola del navegador (F12)
- ✅ Los tokens se renuevan automáticamente

### Para Seguridad

- ⚠️ **NUNCA** subas el archivo `.env` a Git (ya está en .gitignore)
- ⚠️ **NUNCA** compartas tus Client ID o Tenant ID públicamente
- ✅ Los tokens se almacenan en sessionStorage (se borran al cerrar)

### Para Producción

- 📦 Compila con: `npm run build`
- 🚀 Despliega en Vercel (configuración ya incluida)
- 🔐 Configura variables de entorno en Vercel
- 🔗 Actualiza Redirect URI en Azure con la URL de producción

---

## 🎯 Estado Actual

### ✅ Implementado y Funcional:

- ✅ Autenticación con Microsoft
- ✅ Conexión a SharePoint
- ✅ Lectura de datos de "Seguimiento Alistamiento Usados"
- ✅ Visualización en tabla responsive
- ✅ Formateo automático de datos
- ✅ Manejo de errores
- ✅ UI moderna con Tailwind CSS

### 🔧 Listo para Implementar (código incluido):

- Crear nuevos items
- Editar items existentes
- Eliminar items
- Filtros y búsqueda
- Paginación

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:

1. **Revisa la consola del navegador** (F12) para ver errores específicos
2. **Verifica los documentos** en la carpeta del proyecto
3. **Verifica permisos** en Azure Portal y SharePoint
4. **Reinicia el servidor** después de cambiar variables de entorno

---

## ✨ ¡Listo para Empezar!

```bash
# Si aún no lo has hecho:
npm install

# Configura las credenciales:
.\configurar-env.ps1

# Inicia la aplicación:
npm run dev

# Abre en tu navegador:
# http://localhost:5173
```

**¡Disfruta desarrollando!** 🚀
