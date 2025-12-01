# 2. Arquitectura del Sistema

## Visión General

El sistema está construido como una **aplicación web de una sola página** (SPA - Single Page Application) que se comunica con servicios de Microsoft para obtener y guardar datos.

## Componentes Principales

### 1. Frontend (Lo que ve el usuario)

El frontend es una aplicación **React** que se ejecuta completamente en el navegador del usuario. No hay servidor backend propio.

**Tecnología:** React 18 + TypeScript + Vite

**Responsabilidades:**
- Mostrar la interfaz de usuario
- Manejar la autenticación del usuario
- Hacer peticiones a Microsoft Graph API
- Procesar y mostrar los datos recibidos

### 2. Autenticación (Microsoft Azure AD)

El sistema usa **Microsoft Authentication Library (MSAL)** para autenticar usuarios.

**Cómo funciona:**
1. Usuario hace clic en "Iniciar Sesión"
2. Se abre una ventana de Microsoft para autenticarse
3. Microsoft valida las credenciales
4. Microsoft devuelve un "token" (credencial temporal)
5. El sistema usa ese token para hacer peticiones a SharePoint

**No almacena contraseñas:** Todo el proceso de autenticación lo maneja Microsoft de forma segura.

### 3. Almacenamiento de Datos (SharePoint)

Los datos se almacenan en **listas de SharePoint** dentro de Microsoft 365.

**Cómo funciona:**
- SharePoint actúa como base de datos
- Cada "equipo" es un elemento (item) en una lista de SharePoint
- Los archivos adjuntos se guardan en la carpeta de attachments de cada elemento

### 4. API de Comunicación (Microsoft Graph API)

El sistema se comunica con SharePoint a través de **Microsoft Graph API**, que es la forma oficial de Microsoft para acceder a sus servicios.

**Flujo de comunicación:**
```
Aplicación → Microsoft Graph API → SharePoint → Datos
```

## Diagrama de Arquitectura Simplificado

```
┌─────────────────┐
│   Navegador     │
│   del Usuario   │
│                 │
│  ┌───────────┐  │
│  │   React   │  │
│  │   App     │  │
│  └─────┬─────┘  │
└────────┼────────┘
         │
         │ (Peticiones HTTP con token)
         │
         ▼
┌─────────────────┐
│ Microsoft Graph │
│      API        │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│  Azure AD    │  │  SharePoint  │
│ (Autentica)  │  │  (Datos)     │
└──────────────┘  └──────────────┘
```

## Flujo de Datos

### Cuando el usuario inicia sesión:

1. Usuario → Clic en "Iniciar Sesión"
2. Aplicación → Abre ventana de Microsoft
3. Usuario → Ingresa credenciales en Microsoft
4. Microsoft → Valida y devuelve token
5. Aplicación → Guarda token en sessionStorage
6. Aplicación → Muestra contenido principal

### Cuando el usuario carga datos:

1. Usuario → Abre la aplicación (ya autenticado)
2. Aplicación → Obtiene token de sessionStorage
3. Aplicación → Hace petición a Microsoft Graph API con el token
4. Microsoft Graph → Valida token y consulta SharePoint
5. SharePoint → Devuelve datos de la lista
6. Microsoft Graph → Devuelve datos a la aplicación
7. Aplicación → Procesa y muestra datos al usuario

### Cuando el usuario guarda cambios:

1. Usuario → Llena formulario y hace clic en "Guardar"
2. Aplicación → Valida datos del formulario
3. Aplicación → Obtiene token
4. Aplicación → Envía datos a Microsoft Graph API
5. Microsoft Graph → Valida token y actualiza SharePoint
6. SharePoint → Guarda cambios
7. Microsoft Graph → Confirma éxito
8. Aplicación → Muestra mensaje de éxito y recarga datos

## Seguridad

### Tokens de Acceso
- Los tokens tienen tiempo de vida limitado (generalmente 1 hora)
- Se renuevan automáticamente cuando es necesario
- Se almacenan en `sessionStorage` (se borran al cerrar el navegador)

### Permisos
- Los permisos se configuran en Azure Portal
- Solo usuarios autorizados pueden acceder
- Los permisos de SharePoint se respetan (si el usuario no puede escribir, no podrá editar)

### Variables de Entorno
- Las credenciales (Client ID, Tenant ID) se guardan en variables de entorno
- No se exponen en el código fuente
- Cada ambiente (desarrollo/producción) tiene sus propias credenciales

## Dónde se Ejecuta Cada Parte

| Componente | Dónde se Ejecuta |
|------------|------------------|
| Aplicación React | Navegador del usuario |
| Autenticación | Servidores de Microsoft Azure |
| Almacenamiento de datos | SharePoint (Microsoft 365) |
| API de comunicación | Microsoft Graph (servicios de Microsoft) |

## Ventajas de Esta Arquitectura

✅ **No requiere servidor propio:** Todo se ejecuta en el navegador y usa servicios de Microsoft

✅ **Escalable:** Microsoft maneja la carga, no hay que preocuparse por servidores

✅ **Seguro:** Usa la infraestructura de seguridad de Microsoft

✅ **Actualizaciones fáciles:** Solo hay que actualizar el código del frontend

✅ **Bajo costo:** No hay que mantener servidores propios

## Limitaciones

⚠️ **Requiere conexión a internet:** No funciona offline

⚠️ **Depende de Microsoft:** Si Microsoft tiene problemas, la aplicación no funciona

⚠️ **Permisos de Azure:** Requiere configuración inicial en Azure Portal

---

**Siguiente:** [Configuración Técnica](./03-Configuracion.md)

