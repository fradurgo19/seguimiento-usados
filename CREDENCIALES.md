# 🔐 Credenciales de Azure AD - Seguimiento Alistamiento Usados

## ✅ Aplicación Registrada en Azure

### Información de la Aplicación:

```
Nombre para mostrar:           Seguimiento Alistamiento Usados
Id. de aplicación (cliente):   16e8b542-42ed-4376-91b4-f24aa6f8bed9
Id. de directorio (inquilino):  26cb2c05-c882-4926-891d-27fa7b04b516
Identificador de objeto:        9118164e-d995-4193-8c54-b51ab6788657
```

---

## 📋 Variables de Entorno Configuradas

El archivo `.env.local` ha sido creado con:

```env
VITE_TENANT_ID=26cb2c05-c882-4926-891d-27fa7b04b516
VITE_CLIENT_ID=16e8b542-42ed-4376-91b4-f24aa6f8bed9
VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa
VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados
VITE_REDIRECT_URI=http://localhost:5173
VITE_GRAPH_API_SCOPE=https://graph.microsoft.com/.default
```

---

## ⚠️ IMPORTANTE - Verificar Permisos en Azure

### 1. Configurar Redirect URI

En Azure Portal, ve a tu aplicación y verifica:

**Azure Portal → Azure AD → App registrations → Seguimiento Alistamiento Usados**

1. Click en **"Authentication"** (Autenticación)
2. En **"Single-page application"**, verifica que esté agregado:
   ```
   http://localhost:5173
   ```
3. Si no está, agrégalo:
   - Click "Add a platform" → "Single-page application"
   - URI: `http://localhost:5173`
   - Save

### 2. Configurar Permisos de API

En la misma aplicación:

1. Click en **"API permissions"** (Permisos de API)
2. Debe tener al menos:

   - ✅ Microsoft Graph → `User.Read` (Delegated)
   - ✅ Microsoft Graph → `Sites.Read.All` (Delegated)
   - ✅ Microsoft Graph → `Sites.ReadWrite.All` (Delegated) - Si necesitas editar

3. **Click en "Grant admin consent for Partequipos"** ⭐
   - Este paso es CRÍTICO
   - Requiere permisos de administrador
   - Sin esto, la app no funcionará

---

## 🚀 Probar la Aplicación

### El servidor ya está corriendo en:

```
http://localhost:5173
```

### Pasos para probar:

1. **Abre tu navegador**

   - Ve a: http://localhost:5173

2. **Deberías ver**:

   - Página con título "Seguimiento Usados"
   - Botón azul "Iniciar Sesión con Microsoft"

3. **Click en "Iniciar Sesión con Microsoft"**

   - Se abrirá una ventana popup
   - Inicia sesión con tu cuenta de Partequipos (@partequipos.com)
   - Acepta los permisos si te los solicita

4. **Después de iniciar sesión**:
   - Verás tu nombre en la esquina superior derecha
   - La aplicación cargará los datos de "Seguimiento Alistamiento Usados"
   - Verás una tabla con todas las columnas y registros

---

## 🐛 Solución de Problemas

### Error: "AADSTS50011: The reply URL specified does not match"

**Solución**: Agrega `http://localhost:5173` en Authentication → Redirect URIs

### Error: "AADSTS65001: Consent required"

**Solución**: Ve a API permissions → Grant admin consent

### Error: "Access denied" o "Unauthorized"

**Solución**:

1. Verifica que los permisos estén aprobados (Grant admin consent)
2. Verifica que tu cuenta tenga acceso a la lista de SharePoint

### La ventana de login no se abre

**Solución**:

1. Verifica que el navegador no esté bloqueando popups
2. Prueba con otro navegador (Chrome, Edge)

### Error: "No se encontró la lista"

**Solución**:

1. Verifica que tengas acceso a: https://partequipos2.sharepoint.com/sites/servicioposventa
2. Verifica que la lista "Seguimiento Alistamiento Usados" exista

---

## 📝 Siguiente Paso

### Si el servidor no está corriendo:

```bash
npm run dev
```

### Si ya está corriendo:

Abre en tu navegador: **http://localhost:5173**

---

## ✅ Checklist Final

- [x] Aplicación registrada en Azure AD
- [x] Credenciales copiadas
- [x] Archivo .env.local creado
- [ ] Redirect URI configurado en Azure
- [ ] Permisos de API agregados
- [ ] Admin consent otorgado
- [ ] Aplicación probada en el navegador

---

## 🎉 ¡Listo para Usar!

Una vez que hayas verificado los permisos en Azure, la aplicación debería funcionar perfectamente.

**URL de la aplicación**: http://localhost:5173

**Cuenta para login**: Tu cuenta de Partequipos (@partequipos.com)

---

## 📞 Si necesitas ayuda

1. Verifica la consola del navegador (F12) para ver errores específicos
2. Asegúrate de que los permisos en Azure estén aprobados
3. Verifica que tengas acceso a la lista de SharePoint

**¡Disfruta de tu aplicación!** 🚀
