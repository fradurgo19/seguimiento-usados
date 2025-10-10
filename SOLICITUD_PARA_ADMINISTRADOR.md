# 📧 Solicitud para Administrador de TI/Azure AD

**Para**: Administrador de TI / Administrador de Azure AD de Partequipos
**De**: Frank Duran
**Asunto**: Solicitud de Consentimiento de Administrador para Aplicación Azure AD

---

## 📋 Resumen

Solicito amablemente que se otorgue consentimiento de administrador para una aplicación de Azure AD que he registrado para acceder a datos de SharePoint con fines de seguimiento de alistamiento de vehículos usados.

---

## 🎯 Aplicación Registrada

**Nombre de la aplicación**: Seguimiento Alistamiento Usados
**Application (Client) ID**: `16e8b542-42ed-4376-91b4-f24aa6f8bed9`
**Directory (Tenant) ID**: `26cb2c05-c882-4926-891d-27fa7b04b516`
**Object ID**: `9118164e-d995-4193-8c54-b51ab6788657`

---

## 🔐 Permisos Solicitados

La aplicación requiere los siguientes permisos de **Microsoft Graph** (tipo **Delegated**):

| Permiso             | Propósito                                  | Requiere Admin Consent |
| ------------------- | ------------------------------------------ | ---------------------- |
| User.Read           | Leer perfil del usuario autenticado        | No                     |
| Sites.Read.All      | Leer datos de listas de SharePoint         | **Sí** ⚠️              |
| Sites.ReadWrite.All | Crear/editar datos en listas de SharePoint | **Sí** ⚠️              |

**Nota**: Los permisos `Sites.Read.All` y `Sites.ReadWrite.All` son los que requieren consentimiento de administrador.

---

## 📊 Propósito de la Aplicación

Esta aplicación web permite:

- Visualizar datos de la lista de SharePoint: **"Seguimiento Alistamiento Usados"**
- Sitio: https://partequipos2.sharepoint.com/sites/servicioposventa
- Mejorar el seguimiento y gestión del alistamiento de vehículos usados
- Proporcionar una interfaz moderna y eficiente para el equipo

---

## 🔒 Seguridad

- ✅ La aplicación usa autenticación OAuth 2.0 de Microsoft
- ✅ Solo accede a datos de SharePoint para los que el usuario ya tiene permisos
- ✅ Los permisos son de tipo "Delegated" (requieren que un usuario inicie sesión)
- ✅ No tiene acceso a datos sin supervisión
- ✅ Cumple con las mejores prácticas de seguridad de Microsoft

---

## 📝 Pasos para Otorgar Consentimiento

### Opción A: Desde Azure Portal (Recomendado)

1. Iniciar sesión en: https://portal.azure.com
2. Ir a: **Azure Active Directory** → **App registrations**
3. Buscar la aplicación: **"Seguimiento Alistamiento Usados"**
   - O buscar por ID: `16e8b542-42ed-4376-91b4-f24aa6f8bed9`
4. Click en **"API permissions"** (Permisos de API)
5. Verificar que estén los permisos:
   - ✅ Microsoft Graph → Sites.Read.All (Delegated)
   - ✅ Microsoft Graph → Sites.ReadWrite.All (Delegated)
6. Click en el botón: **"⚡ Grant admin consent for Partequipos"**
7. Confirmar en el popup

**Resultado esperado**: Todos los permisos deben mostrar estado "✅ Granted for Partequipos"

### Opción B: Mediante PowerShell (Alternativa)

```powershell
# Conectarse a Azure AD
Connect-AzureAD

# Obtener la aplicación
$app = Get-AzureADServicePrincipal -Filter "AppId eq '16e8b542-42ed-4376-91b4-f24aa6f8bed9'"

# Otorgar consentimiento para Sites.Read.All
New-AzureADServiceAppRoleAssignment -ObjectId $app.ObjectId -PrincipalId $app.ObjectId -ResourceId <Microsoft-Graph-Service-Principal-Id> -Id <Sites.Read.All-Permission-Id>
```

---

## ✅ Verificación

Después de otorgar el consentimiento, puedo verificar que funciona:

1. Abrir la aplicación: http://localhost:5173 (desarrollo)
2. Iniciar sesión con mi cuenta de Partequipos
3. La aplicación debe mostrar los datos de la lista de SharePoint

---

## 🚀 Entorno

- **Desarrollo**: http://localhost:5173
- **Producción** (futuro): Se desplegará en Vercel con HTTPS
- **Tecnologías**: React + TypeScript + Microsoft Authentication Library (MSAL)

---

## 📞 Contacto

Si tiene alguna pregunta o inquietud sobre esta solicitud, estoy disponible para aclaraciones.

**Nombre**: Frank Duran
**Email**: [tu-email@partequipos.com]
**Extensión**: [tu-extensión]

---

## 📎 Información Adicional

**Documentación de Microsoft sobre permisos de SharePoint**:

- https://docs.microsoft.com/en-us/graph/permissions-reference#sites-permissions

**Documentación sobre consentimiento de administrador**:

- https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/grant-admin-consent

---

## ⏰ Urgencia

**Prioridad**: Media
**Tiempo estimado**: 5-10 minutos

Esta aplicación mejorará significativamente la eficiencia del proceso de seguimiento de alistamiento de vehículos usados.

---

**Muchas gracias por su apoyo** 🙏

---

_Nota: Esta solicitud fue generada el [fecha] como parte del desarrollo de herramientas internas de Partequipos._
