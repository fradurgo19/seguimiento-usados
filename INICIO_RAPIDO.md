# 🚀 Inicio Rápido - Seguimiento Usados

## En 5 minutos tendrás la aplicación corriendo

### 📋 Antes de empezar, necesitas:

1. ✅ Node.js instalado (verifica con `node --version`)
2. ✅ Cuenta de Microsoft 365 con acceso a SharePoint
3. ✅ Una aplicación registrada en Azure AD (si no la tienes, ve a CONFIGURACION.md)

---

## 🎯 Configuración en 3 pasos

### Paso 1: Instalar

Abre PowerShell o CMD en la carpeta del proyecto:

```bash
npm install
```

### Paso 2: Configurar

**Opción A - Script Automático (Recomendado):**

```powershell
.\configurar-env.ps1
```

El script te pedirá solo el Tenant ID y Client ID. Los valores de SharePoint ya están configurados para Partequipos.

**Opción B - Configuración Manual:**

```powershell
Copy-Item env.example .env
notepad .env
```

Completa estos 2 valores en el archivo `.env`:

```env
VITE_TENANT_ID=tu-tenant-id           # De Azure Portal
VITE_CLIENT_ID=tu-client-id           # De Azure Portal

# Los siguientes ya están configurados para Partequipos:
VITE_SHAREPOINT_SITE_URL=https://partequipos2.sharepoint.com/sites/servicioposventa
VITE_SHAREPOINT_LIST_NAME=Seguimiento Alistamiento Usados
```

### Paso 3: Ejecutar

```bash
npm run dev
```

Abre tu navegador en: **http://localhost:5173**

---

## 🎉 ¡Listo!

Deberías ver:

1. Una página con "Seguimiento Usados"
2. Un botón "Iniciar Sesión con Microsoft"
3. Después de iniciar sesión → Tabla con tus datos de SharePoint

---

## ❓ ¿No funciona?

### ¿No tienes las credenciales de Azure?

Sigue la guía completa: **[CONFIGURACION.md](./CONFIGURACION.md)**

- Te guía paso a paso para registrar la app en Azure
- Incluye capturas y ejemplos

### ¿Error al cargar datos?

Verifica:

1. ✅ Las credenciales en `.env` son correctas (Tenant ID y Client ID)
2. ✅ Tienes acceso a: https://partequipos2.sharepoint.com/sites/servicioposventa
3. ✅ La lista "Seguimiento Alistamiento Usados" existe y tienes permisos de lectura
4. ✅ Los permisos en Azure están aprobados por el administrador

### ¿La ventana de login no se abre?

1. Verifica que no esté bloqueada por el navegador (popups)
2. Prueba con otro navegador (Chrome, Edge, Firefox)

---

## 📚 Más información

- **README.md** - Documentación completa
- **CONFIGURACION.md** - Guía detallada de configuración
- Consola del navegador (F12) - Verás los errores aquí

---

## 🛠️ Scripts disponibles

```bash
npm run dev        # Iniciar desarrollo
npm run build      # Compilar para producción
npm run preview    # Ver build de producción
npm run typecheck  # Verificar tipos TypeScript
npm run lint       # Verificar código
```

**Windows:**

- `configurar-env.ps1` - Configuración guiada de variables de entorno
- `setup.bat` - Instalación automática
- `dev.bat` - Iniciar desarrollo
- `build.bat` - Compilar para producción

---

## 💡 Tips

### Desarrollo más rápido

- Usa extensiones de VSCode recomendadas (abre `.vscode/extensions.json`)
- El auto-save está habilitado en `.vscode/settings.json`

### Debugging

- Abre DevTools (F12) → Console
- Todos los errores se muestran ahí con detalles

### Recarga automática

- Vite recarga automáticamente cuando guardas cambios
- Si algo no se actualiza, recarga la página (F5)

---

¿Listo para empezar? **¡Abre tu terminal y ejecuta `npm run dev`!** 🚀
