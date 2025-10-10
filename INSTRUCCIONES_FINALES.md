# 🎉 ¡Casi Listo! - Últimos Pasos

## ✅ Lo que ya tienes:

- ✅ Aplicación registrada en Azure AD
- ✅ Credenciales obtenidas:
  - **Tenant ID**: `26cb2c05-c882-4926-891d-27fa7b04b516`
  - **Client ID**: `16e8b542-42ed-4376-91b4-f24aa6f8bed9`
- ✅ Servidor corriendo en: http://localhost:5173
- ✅ Código completamente funcional

---

## 🚀 PASO 1: Crear archivo .env

Ejecuta este comando en PowerShell:

```powershell
.\crear-env.ps1
```

Este script creará automáticamente el archivo `.env` con tus credenciales de Azure.

**Alternativa manual:**

```powershell
# Copia y pega esto en PowerShell:
@"
VITE_TENANT_ID=26cb2c05-c882-4926-891d-27fa7b04b516
VITE_CLIENT_ID=16e8b542-42ed-4376-91b4-f24aa6f8bed9
VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa
VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados
VITE_REDIRECT_URI=http://localhost:5173
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
"@ | Out-File -FilePath .env -Encoding utf8
```

---

## ⚙️ PASO 2: Configurar Azure Portal (MUY IMPORTANTE)

Abre Azure Portal: https://portal.azure.com

### A. Configurar Redirect URI

1. **Azure Active Directory** → **App registrations**
2. Click en **"Seguimiento Alistamiento Usados"**
3. Click en **"Authentication"** (Autenticación) en el menú lateral
4. En la sección **"Single-page application"**:
   - Si NO está `http://localhost:5173`, agrégalo:
     - Click **"Add a platform"** → **"Single-page application"**
     - URI: `http://localhost:5173`
     - Click **"Configure"**
5. **Save** (Guardar)

### B. Configurar Permisos de API

1. En la misma aplicación, click en **"API permissions"** (Permisos de API)
2. Debe tener estos permisos:

   ```
   Microsoft Graph
   ├── User.Read (Delegated) ✅
   ├── Sites.Read.All (Delegated) ✅
   └── Sites.ReadWrite.All (Delegated) ✅ (opcional)
   ```

3. **Si faltan permisos**, agrégalos:
   - Click **"Add a permission"**
   - Click **"Microsoft Graph"**
   - Click **"Delegated permissions"**
   - Busca y selecciona:
     - ✅ `Sites.Read.All`
     - ✅ `Sites.ReadWrite.All` (si necesitas editar datos)
   - Click **"Add permissions"**

### C. 🌟 CRÍTICO: Otorgar Consentimiento de Administrador

1. En **"API permissions"**, verás un botón:

   ```
   ⚠️ Grant admin consent for Partequipos
   ```

2. **Click en ese botón** ⭐ (requiere permisos de administrador)

3. Confirma en el popup

4. Verifica que todos los permisos tengan un **check verde** ✅ en la columna "Status"

**Sin este paso, la aplicación NO funcionará** ⚠️

---

## 🌐 PASO 3: Probar la Aplicación

### El servidor ya está corriendo en:

```
http://localhost:5173
```

### Prueba:

1. **Abre tu navegador** y ve a: http://localhost:5173

2. **Deberías ver**:

   - Título: "Seguimiento Usados"
   - Subtítulo: "Sistema de seguimiento integrado con SharePoint"
   - Botón azul: "Iniciar Sesión con Microsoft"

3. **Click en "Iniciar Sesión con Microsoft"**

   - Se abre una ventana popup de Microsoft
   - Ingresa tu correo de Partequipos (ejemplo@partequipos.com)
   - Ingresa tu contraseña
   - Si te pide permisos, acepta

4. **¡Listo!** Deberías ver:
   - Tu nombre en la esquina superior derecha
   - Una tabla con los datos de "Seguimiento Alistamiento Usados"
   - Todas las columnas de tu lista de SharePoint

---

## 🐛 Si Algo Sale Mal

### Error: "AADSTS50011: Reply URL mismatch"

❌ **Problema**: Falta configurar el Redirect URI

✅ **Solución**:

- Ve al **PASO 2.A** arriba
- Agrega `http://localhost:5173` en Authentication

### Error: "AADSTS65001: Consent required"

❌ **Problema**: Falta el consentimiento de administrador

✅ **Solución**:

- Ve al **PASO 2.C** arriba
- Click en "Grant admin consent for Partequipos"

### Error: "Access denied" o "Unauthorized"

❌ **Problema**: Permisos no configurados o no aprobados

✅ **Solución**:

1. Verifica el **PASO 2.B** - que los permisos estén agregados
2. Verifica el **PASO 2.C** - que el admin consent esté otorgado
3. Cierra la sesión y vuelve a iniciar sesión

### Error: "No se encontró la lista"

❌ **Problema**: No tienes acceso a la lista de SharePoint

✅ **Solución**:

1. Abre: https://partequipos2.sharepoint.com/sites/servicioposventa
2. Verifica que puedas ver el sitio
3. Ve a la lista "Seguimiento Alistamiento Usados"
4. Si no tienes acceso, pide permisos al administrador de SharePoint

### La ventana de login no se abre

❌ **Problema**: Bloqueador de popups

✅ **Solución**:

1. Permite popups para localhost:5173 en tu navegador
2. Prueba con Chrome o Edge

### El servidor no responde

❌ **Problema**: El servidor se detuvo

✅ **Solución**:

```bash
npm run dev
```

---

## 📊 Consola del Navegador (F12)

Si algo no funciona, abre la consola del navegador:

1. Presiona **F12** en el navegador
2. Ve a la pestaña **Console**
3. Verás mensajes de error detallados
4. Copia el error y busca la solución arriba

---

## ✅ Checklist Completo

Marca cada paso cuando lo completes:

- [ ] 1. Ejecuté `.\crear-env.ps1` o creé `.env` manualmente
- [ ] 2.A. Configuré Redirect URI en Azure → Authentication
- [ ] 2.B. Agregué permisos en Azure → API permissions
- [ ] 2.C. ⭐ Otorgué admin consent (click en el botón)
- [ ] 3. Abrí http://localhost:5173
- [ ] 4. Hice click en "Iniciar Sesión con Microsoft"
- [ ] 5. Ingresé mis credenciales de Partequipos
- [ ] 6. ✅ ¡Veo la tabla con datos de SharePoint!

---

## 🎉 ¡Éxito!

Cuando veas la tabla con tus datos, ¡habrás completado la configuración!

Ahora puedes:

- ✅ Ver todos los datos de "Seguimiento Alistamiento Usados"
- ✅ Recargar datos con el botón de actualizar
- ✅ Ver datos formateados (fechas, números, etc.)
- ✅ Modificar el código para agregar más funcionalidades

---

## 📚 Siguiente Nivel

Una vez que todo funcione, puedes:

1. **Personalizar la UI** - Edita `src/components/SharePointDataTable.tsx`
2. **Agregar filtros** - Implementa búsqueda por columnas
3. **Agregar edición** - Usa `sharePointService.updateListItem()`
4. **Exportar a Excel** - Agrega funcionalidad de exportación
5. **Desplegar en Vercel** - Poner en producción

---

## 🚀 Comandos Rápidos

```powershell
# Crear archivo .env
.\crear-env.ps1

# Iniciar servidor (si se detuvo)
npm run dev

# Abrir en navegador
start http://localhost:5173

# Compilar para producción
npm run build

# Ver errores de TypeScript
npm run typecheck
```

---

**¿Listo?**

**Ejecuta**: `.\crear-env.ps1`

**Luego**: Configura Azure Portal (Paso 2)

**Finalmente**: Abre http://localhost:5173

**¡Disfruta de tu aplicación!** 🎉
