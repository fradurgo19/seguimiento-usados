# 6. Despliegue y Puesta en Producción

## ¿Qué es el Despliegue?

Desplegar significa poner la aplicación en un servidor accesible por internet para que los usuarios puedan usarla, no solo en la computadora del desarrollador.

## Opciones de Hosting

### Vercel (Recomendado)
- ✅ Gratis para proyectos pequeños
- ✅ Fácil de usar
- ✅ Despliegue automático desde GitHub
- ✅ HTTPS incluido
- ✅ Muy rápido

### Netlify
- ✅ Similar a Vercel
- ✅ Gratis para proyectos pequeños
- ✅ Fácil configuración

### Azure Static Web Apps
- ✅ Integración nativa con Azure
- ✅ Bueno si ya usas Azure
- ✅ Puede tener costos

### Otros
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

## Despliegue en Vercel (Paso a Paso)

### Paso 1: Preparar el Código

1. Asegurarse de que el código esté en un repositorio de GitHub
2. Verificar que el archivo `vercel.json` existe (ya está en el proyecto)
3. Verificar que `package.json` tenga el script `build`

### Paso 2: Crear Cuenta en Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Crear cuenta (puede usar GitHub para login)
3. Conectar cuenta de GitHub

### Paso 3: Importar Proyecto

1. En Vercel, hacer clic en "Add New Project"
2. Seleccionar el repositorio de GitHub
3. Vercel detectará automáticamente que es un proyecto Vite

### Paso 4: Configurar Variables de Entorno

En la configuración del proyecto en Vercel:

1. Ir a "Settings" > "Environment Variables"
2. Agregar todas las variables del archivo `.env`:
   - `VITE_TENANT_ID`
   - `VITE_CLIENT_ID`
   - `VITE_SHAREPOINT_SITE_URL`
   - `VITE_SHAREPOINT_LIST_NAME`
   - `VITE_REDIRECT_URI` (usar la URL de Vercel, ej: `https://tu-proyecto.vercel.app`)
   - `VITE_GRAPH_API_SCOPE`

### Paso 5: Actualizar Azure AD

1. Ir a Azure Portal > Tu aplicación > Authentication
2. Agregar nueva plataforma "Single-page application (SPA)"
3. Agregar la URL de Vercel: `https://tu-proyecto.vercel.app`
4. Guardar

### Paso 6: Desplegar

1. Vercel desplegará automáticamente
2. Esperar a que termine (generalmente 1-2 minutos)
3. Obtener la URL del proyecto (ej: `https://tu-proyecto.vercel.app`)

### Paso 7: Verificar

1. Abrir la URL en el navegador
2. Probar el login
3. Verificar que carguen los datos
4. Probar agregar/editar un equipo

## Despliegue Manual (Alternativa)

Si no se quiere usar Vercel automático:

### 1. Compilar el Proyecto

```bash
npm run build
```

Esto crea la carpeta `dist/` con los archivos listos.

### 2. Subir Archivos

Subir todo el contenido de `dist/` a un servidor web:
- Servidor FTP
- Azure Storage
- AWS S3
- Cualquier hosting estático

### 3. Configurar Servidor

Asegurarse de que el servidor:
- Sirva `index.html` para todas las rutas (SPA routing)
- Tenga HTTPS habilitado
- Permita archivos estáticos

## Configuración de `vercel.json`

El archivo `vercel.json` ya está configurado:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**¿Qué hace?**
- Define cómo compilar el proyecto
- Configura el routing para SPAs (todas las rutas van a index.html)
- Optimiza el cache de archivos estáticos

## Variables de Entorno en Producción

### Desarrollo vs Producción

| Variable | Desarrollo | Producción |
|----------|------------|------------|
| `VITE_REDIRECT_URI` | `http://localhost:5173` | `https://tu-proyecto.vercel.app` |
| Otras variables | Mismas | Mismas |

### Importante

⚠️ **Actualizar `VITE_REDIRECT_URI`** en producción con la URL real.

⚠️ **Actualizar Azure AD** con la URL de producción.

## Despliegue Automático

### Con GitHub

Si el código está en GitHub:

1. Conectar Vercel con GitHub
2. Cada vez que se haga `git push` a la rama principal
3. Vercel desplegará automáticamente

### Ramas

- **Producción:** Rama `main` o `master`
- **Preview:** Otras ramas crean deployments de prueba

## Actualizaciones

### Cómo Actualizar la Aplicación

1. Hacer cambios en el código
2. Hacer commit y push a GitHub
3. Vercel desplegará automáticamente
4. Los usuarios verán la nueva versión en 1-2 minutos

### Rollback (Volver Atrás)

Si algo sale mal:

1. Ir a Vercel > Deployments
2. Encontrar el deployment anterior que funcionaba
3. Hacer clic en "..." > "Promote to Production"

## Monitoreo

### Logs

En Vercel se pueden ver:
- Logs de build
- Logs de runtime (si hay errores)
- Métricas de uso

### Errores

Si hay errores:
1. Revisar logs en Vercel
2. Revisar consola del navegador (F12)
3. Verificar variables de entorno
4. Verificar permisos en Azure

## Checklist de Despliegue

Antes de desplegar, verificar:

- [ ] Código compila sin errores (`npm run build`)
- [ ] Variables de entorno configuradas en Vercel
- [ ] `VITE_REDIRECT_URI` actualizado con URL de producción
- [ ] Azure AD actualizado con URL de producción
- [ ] Permisos en Azure configurados correctamente
- [ ] Probar login en producción
- [ ] Probar carga de datos
- [ ] Probar agregar/editar equipo

## Costos

### Vercel (Plan Gratis)
- ✅ Gratis para proyectos personales
- ✅ 100 GB de ancho de banda
- ✅ Dominio personalizado incluido
- ✅ HTTPS incluido

### Si Necesitas Más
- Plan Pro: $20/mes
- Plan Enterprise: Contactar ventas

## Dominio Personalizado

### Agregar Dominio Propio

1. En Vercel, ir a Settings > Domains
2. Agregar dominio (ej: `seguimiento.partequipos.com`)
3. Seguir instrucciones para configurar DNS
4. Esperar a que se verifique (puede tardar horas)

### Configurar DNS

En el proveedor de dominio:
- Agregar registro CNAME apuntando a Vercel
- O agregar registro A con la IP de Vercel

## Seguridad en Producción

### HTTPS
- ✅ Vercel incluye HTTPS automáticamente
- ✅ Certificados SSL renovados automáticamente

### Variables de Entorno
- ✅ No se exponen en el código
- ✅ Solo accesibles en el servidor de Vercel

### Tokens
- ✅ Se manejan en el navegador (sessionStorage)
- ✅ Se renuevan automáticamente
- ✅ No se almacenan permanentemente

## Troubleshooting de Despliegue

### Error: "Build failed"
- Revisar logs en Vercel
- Verificar que todas las dependencias estén en `package.json`
- Verificar que no haya errores de TypeScript

### Error: "Redirect URI mismatch"
- Verificar que `VITE_REDIRECT_URI` en Vercel sea correcto
- Verificar que Azure AD tenga la URL correcta

### La aplicación carga pero no hay datos
- Verificar variables de entorno en Vercel
- Verificar permisos en Azure
- Revisar consola del navegador para errores

### La aplicación no carga
- Verificar que el build fue exitoso
- Verificar que `index.html` existe en `dist/`
- Revisar logs de Vercel

---

**Siguiente:** [Mantenimiento](./07-Mantenimiento.md)

