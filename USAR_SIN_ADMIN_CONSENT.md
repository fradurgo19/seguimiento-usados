# 🔓 Usar la Aplicación SIN Consentimiento de Administrador

## ✅ Buenas Noticias

Aunque no puedas otorgar el consentimiento de administrador, **la aplicación PUEDE funcionar** si:

1. Los permisos que agregaste **no requieren** consentimiento de administrador, O
2. Cada usuario otorga su **consentimiento individual** cuando inicia sesión

---

## 🎯 Solución Inmediata: Consentimiento Individual

### Cómo funciona:

Cuando un usuario inicie sesión por primera vez, Microsoft le pedirá que **acepte los permisos** que la aplicación solicita. Si el usuario acepta, podrá usar la aplicación (siempre que tenga acceso a SharePoint).

---

## 🚀 PRUEBA LA APLICACIÓN AHORA

### Paso 1: Crear archivo .env

```powershell
.\crear-env.ps1
```

### Paso 2: Abrir la aplicación

El servidor ya está corriendo:

```
http://localhost:5173
```

### Paso 3: Iniciar Sesión

1. Click en "Iniciar Sesión con Microsoft"
2. Ingresa tu correo de Partequipos
3. Ingresa tu contraseña
4. **Microsoft te mostrará una pantalla pidiendo permisos** ⭐
   - Te preguntará si permites que la app acceda a:
     - Tu perfil
     - SharePoint
   - **Click en "Aceptar"** o "Accept"

### Paso 4: ¿Funcionó?

**✅ SI FUNCIONÓ**: Verás la tabla con datos de SharePoint

- ¡Felicidades! No necesitas admin consent
- Cada usuario que use la app verá esa pantalla de permisos la primera vez

**❌ SI NO FUNCIONÓ**: Verás un error como:

- "AADSTS65001: The user or administrator has not consented"
- "Need admin approval"

**En ese caso**, necesitas el admin consent (ve a la Opción 1 abajo).

---

## 🔧 Alternativas

### OPCIÓN 1: Solicitar al Administrador ⭐ (Mejor solución)

He creado un documento para que se lo envíes al administrador de TI:

**Archivo**: `SOLICITUD_PARA_ADMINISTRADOR.md`

Puedes:

1. Abrir el archivo
2. Copiarlo y enviarlo por email/Teams al admin de TI
3. O imprimirlo y entregarlo

El administrador solo necesita 5 minutos para otorgar el consentimiento.

### OPCIÓN 2: Usar Application Permissions (Avanzado)

Si tienes acceso para crear Service Principals, puedes usar permisos de aplicación en lugar de delegados. Pero esto requiere:

- Crear un Client Secret
- Modificar el código para usar flujo de autenticación diferente
- No es recomendado para esta situación

### OPCIÓN 3: Configurar Consentimiento de Usuario

Algunos tenants de Azure AD permiten que los usuarios otorguen consentimiento por sí mismos. Verifica con tu administrador si está habilitado:

**Azure Portal → Azure AD → Enterprise applications → User settings**

- "Users can consent to apps accessing company data on their behalf" debe estar en **"Yes"**

Si está en "No", solo el administrador puede habilitarlo.

---

## 📊 ¿Qué Permisos Requieren Admin Consent?

Según la documentación de Microsoft:

| Permiso             | Requiere Admin Consent   | Tu app lo necesita |
| ------------------- | ------------------------ | ------------------ |
| User.Read           | ❌ No                    | ✅ Sí              |
| Sites.Read.All      | ⚠️ **Sí** (generalmente) | ✅ Sí              |
| Sites.ReadWrite.All | ⚠️ **Sí** (generalmente) | ✅ Sí              |

**Nota**: En algunos tenants, `Sites.Read.All` puede no requerir admin consent si el usuario tiene acceso al sitio.

---

## 🧪 Escenarios Posibles

### Escenario A: Funciona sin Admin Consent ✅

Si al iniciar sesión **NO ves** error y **SÍ ves** los datos:

- ¡Perfecto! Tu tenant permite consentimiento de usuario
- La app funcionará para todos los usuarios de Partequipos
- Cada uno verá la pantalla de permisos la primera vez

### Escenario B: Pide Admin Approval ⚠️

Si al iniciar sesión ves:

```
Need admin approval
[User name] needs permission to access resources in your organization that only an admin can grant.
```

**Solución**:

1. Envía `SOLICITUD_PARA_ADMINISTRADOR.md` al admin de TI
2. Espera a que otorgue el consentimiento
3. Intenta iniciar sesión nuevamente

### Escenario C: Error de Acceso ❌

Si ves: "Access denied" o "Forbidden":

- Verifica que tengas acceso a la lista de SharePoint
- Abre: https://partequipos2.sharepoint.com/sites/servicioposventa
- Si no puedes verla, solicita permisos al admin de SharePoint

---

## 🎯 Recomendación

### Plan de Acción:

1. **AHORA**: Prueba la aplicación

   ```powershell
   .\crear-env.ps1
   ```

   Luego abre: http://localhost:5173

2. **Si funciona** ✅: ¡Listo! Empieza a usar la app

3. **Si pide admin approval** ⚠️:
   - Envía `SOLICITUD_PARA_ADMINISTRADOR.md` al admin
   - Mientras tanto, puedes seguir desarrollando la interfaz
   - Una vez otorgado el consentimiento, todo funcionará

---

## 💡 Tips

### Mientras esperas el admin consent:

Puedes trabajar en:

- ✅ Diseño de la interfaz
- ✅ Agregar filtros y búsqueda (usando datos mock)
- ✅ Personalizar colores y estilos
- ✅ Agregar nuevas vistas

### Para desarrollo local:

Si necesitas datos para probar sin SharePoint:

```typescript
// Datos de prueba temporales
const mockData = [
  { id: "1", fields: { Title: "Prueba 1", Status: "En proceso" } },
  { id: "2", fields: { Title: "Prueba 2", Status: "Completado" } },
];
```

---

## 📞 Ayuda

### Contactos útiles:

- **Administrador de TI/Azure AD**: [nombre/email del admin de TI]
- **Administrador de SharePoint**: [nombre/email del admin de SharePoint]
- **Soporte de TI**: [extensión/email de soporte]

### Información que necesitan:

Cuando contactes al administrador, proporciona:

- Application ID: `16e8b542-42ed-4376-91b4-f24aa6f8bed9`
- Tenant ID: `26cb2c05-c882-4926-891d-27fa7b04b516`
- Archivo: `SOLICITUD_PARA_ADMINISTRADOR.md`

---

## ✅ Checklist

- [ ] Ejecuté `.\crear-env.ps1`
- [ ] Abrí http://localhost:5173
- [ ] Intenté iniciar sesión
- [ ] **¿Funcionó?**
  - [ ] ✅ Sí → ¡Empiezo a usar la app!
  - [ ] ⚠️ Pide admin approval → Envío solicitud al admin
  - [ ] ❌ Error de acceso → Verifico permisos de SharePoint

---

**¡Pruébalo ahora!** Es posible que funcione sin necesidad de admin consent 🤞

```powershell
.\crear-env.ps1
```

Luego abre: http://localhost:5173 🚀
