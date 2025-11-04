# 📎 Configuración de Permisos para Adjuntos en SharePoint

## 🎯 Objetivo

Habilitar la funcionalidad de subir y descargar archivos adjuntos en la lista de SharePoint a través de la aplicación web.

## ⚠️ Problema Identificado

Los archivos adjuntos no se están guardando en SharePoint debido a que:

1. La API de Microsoft Graph no soporta completamente attachments en listas de SharePoint
2. Se requiere usar SharePoint REST API directamente
3. Se necesitan permisos específicos adicionales en Azure AD

## 🔧 Solución Implementada

### 1. Cambio de API

- **Antes:** Microsoft Graph API (`/sites/{id}/lists/{id}/items/{id}/driveItem/children`)
- **Ahora:** SharePoint REST API (`/_api/web/lists/getbytitle('{list}')/items({id})/AttachmentFiles`)

### 2. Endpoints Utilizados

#### Obtener Adjuntos:

```
GET {siteUrl}/_api/web/lists/getbytitle('{listName}')/items({itemId})/AttachmentFiles
```

#### Subir Adjunto:

```
POST {siteUrl}/_api/web/lists/getbytitle('{listName}')/items({itemId})/AttachmentFiles/add(FileName='{fileName}')
Content-Type: application/octet-stream
```

#### Eliminar Adjunto:

```
DELETE {siteUrl}/_api/web/lists/getbytitle('{listName}')/items({itemId})/AttachmentFiles/getByFileName('{fileName}')
```

## 🔐 Permisos Necesarios en Azure AD

### Permisos Actuales (Ya configurados):

- ✅ `Sites.Read.All` - Leer sitios y listas
- ✅ `Sites.ReadWrite.All` - Escribir en listas

### ⚠️ IMPORTANTE: Verificar Permisos Adicionales

Para que funcionen los adjuntos, asegúrate de que la aplicación de Azure AD tenga:

1. **AllSites.Write** (Delegated o Application)
   - Permite escribir en todas las colecciones de sitios
2. **Files.ReadWrite.All** (Delegated o Application)
   - Permite leer y escribir archivos adjuntos

### Pasos para Configurar Permisos:

1. **Ir a Azure Portal:**

   - https://portal.azure.com
   - Buscar "Azure Active Directory"
   - Ir a "App registrations"
   - Seleccionar tu aplicación

2. **Agregar Permisos API:**

   - Click en "API permissions"
   - Click en "Add a permission"
   - Seleccionar "Microsoft Graph"
   - Seleccionar "Delegated permissions"
   - Buscar y agregar:
     - ✅ `AllSites.Write`
     - ✅ `Files.ReadWrite.All`

3. **Otorgar Consentimiento de Administrador:**
   - Click en "Grant admin consent for [Tu Organización]"
   - Confirmar

## 🧪 Pruebas y Debugging

### Para Probar la Funcionalidad:

1. **Abrir la consola del navegador** (F12)
2. **Crear o editar un equipo**
3. **Adjuntar un archivo**
4. **Guardar**
5. **Revisar logs en consola:**

#### Logs Esperados (Exitoso):

```
📤 Intentando subir archivo: imagen.jpg (245.67 KB)
📍 Item ID: 123
🔗 URL de upload: https://.../_api/web/lists/getbytitle('...')/items(123)/AttachmentFiles/add(FileName='imagen.jpg')
✅ Adjunto subido exitosamente (sin digest): imagen.jpg
📊 Resultado: 1 exitosos, 0 fallidos
```

#### Logs de Error Común:

```
❌ Error subiendo imagen.jpg
Status: 403 - Forbidden
Causa: Permisos insuficientes en Azure AD
```

## 🔍 Troubleshooting

### Error 403 (Forbidden)

**Causa:** Permisos insuficientes  
**Solución:** Agregar permisos `AllSites.Write` y `Files.ReadWrite.All` en Azure AD

### Error 404 (Not Found)

**Causa:** El item no existe o el ID es incorrecto  
**Solución:** Verificar que el item se creó correctamente antes de subir adjuntos

### Error 401 (Unauthorized)

**Causa:** Token expirado o inválido  
**Solución:** Cerrar sesión y volver a iniciar sesión

### Adjuntos no aparecen después de subirlos

**Causa:** Puede tomar unos segundos en sincronizarse  
**Solución:** Recargar la página o esperar 5-10 segundos

## 📋 Checklist de Verificación

Antes de intentar subir adjuntos, verificar:

- [ ] Permisos de Azure AD configurados correctamente
- [ ] Consentimiento de administrador otorgado
- [ ] Variables de entorno configuradas (`VITE_SHAREPOINT_SITE_URL`, `VITE_SHAREPOINT_LIST_NAME`)
- [ ] Usuario tiene permisos de escritura en la lista de SharePoint
- [ ] La columna "Attachments" existe en la lista de SharePoint (creada automáticamente)

## 🚀 Código Actualizado

### Archivos Modificados:

1. ✅ `src/services/sharePointService.ts` - Cambio a SharePoint REST API
2. ✅ `src/App.tsx` - Mejor manejo de errores y contadores
3. ✅ `src/components/SharePointTableReal.tsx` - Visualización de adjuntos
4. ✅ `src/components/VehicleFormReal.tsx` - Upload UI

## 📞 Soporte

Si después de configurar los permisos sigue sin funcionar, revisar:

1. **Consola del navegador** - Ver logs detallados
2. **Azure Portal** - Verificar que los permisos estén otorgados
3. **SharePoint** - Verificar que la lista permita adjuntos (configuración de la lista)

---

**Nota:** Los adjuntos en SharePoint lists tienen un límite de tamaño por defecto de **10 MB por archivo**. Este límite se puede cambiar en la configuración de SharePoint si es necesario.
