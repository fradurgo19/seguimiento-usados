# 5. Estructura del Código

## Organización General

El código está organizado en carpetas según su función. Esto facilita encontrar y mantener el código.

## Estructura de Carpetas

```
project/
├── src/                    # Código fuente principal
│   ├── components/         # Componentes React reutilizables
│   ├── config/             # Archivos de configuración
│   ├── context/            # Contextos de React (estado global)
│   ├── services/           # Servicios para comunicarse con APIs
│   ├── hooks/              # Hooks personalizados de React
│   ├── types/              # Definiciones de tipos TypeScript
│   ├── utils/              # Funciones auxiliares
│   ├── data/               # Datos de prueba (mock data)
│   ├── App.tsx             # Componente principal de la aplicación
│   ├── main.tsx            # Punto de entrada de la aplicación
│   └── index.css           # Estilos globales
├── dist/                   # Archivos compilados (generados automáticamente)
├── node_modules/           # Dependencias instaladas (generadas automáticamente)
├── public/                 # Archivos estáticos (si los hay)
├── .env                    # Variables de entorno (no se sube a Git)
├── package.json            # Dependencias y scripts del proyecto
├── vite.config.ts          # Configuración de Vite
├── tsconfig.json           # Configuración de TypeScript
└── tailwind.config.js      # Configuración de Tailwind CSS
```

## Descripción de Carpetas y Archivos

### `/src` - Código Fuente Principal

Todo el código de la aplicación está aquí.

### `/src/components` - Componentes React

Componentes reutilizables que forman la interfaz de usuario.

**Archivos principales:**
- `App.tsx` - Componente raíz (aunque está en src/, no en components/)
- `LoginButton.tsx` - Botón de inicio de sesión
- `DashboardReal.tsx` - Vista del dashboard con gráficos
- `SharePointTableReal.tsx` - Tabla de datos de SharePoint
- `VehicleFormReal.tsx` - Formulario para agregar/editar equipos
- `DashboardFilters.tsx` - Componente de filtros

**¿Qué hace cada componente?**
- Cada componente es como un "bloque de construcción" de la interfaz
- Se pueden reutilizar en diferentes partes
- Tienen su propia lógica y estado

### `/src/config` - Configuración

Archivos que contienen configuraciones de la aplicación.

**Archivos:**
- `authConfig.ts` - Configuración de autenticación MSAL y SharePoint

**Contiene:**
- Configuración de Azure AD (Client ID, Tenant ID)
- URLs de SharePoint
- Scopes de permisos

### `/src/context` - Contextos de React

Para compartir estado entre componentes sin pasar props.

**Archivos:**
- `AuthContext.tsx` - Contexto de autenticación

**¿Para qué sirve?**
- Permite que cualquier componente sepa si el usuario está autenticado
- Evita pasar el estado de autenticación por muchos componentes

### `/src/services` - Servicios

Lógica para comunicarse con APIs externas.

**Archivos:**
- `authService.ts` - Servicio de autenticación
  - Maneja el login/logout
  - Obtiene tokens de acceso
  - Renueva tokens automáticamente

- `sharePointService.ts` - Servicio de SharePoint
  - Obtiene elementos de listas
  - Crea nuevos elementos
  - Actualiza elementos existentes
  - Elimina elementos
  - Sube archivos adjuntos

**¿Cómo funcionan?**
- Usan `axios` para hacer peticiones HTTP
- Agregan automáticamente el token de autenticación
- Manejan errores de forma centralizada

### `/src/hooks` - Hooks Personalizados

Funciones reutilizables que usan hooks de React.

**Archivos:**
- `useSharePointData.ts` - Hook para obtener datos de SharePoint

**¿Para qué sirven?**
- Encapsulan lógica común
- Se pueden usar en múltiples componentes
- Facilitan el manejo de datos

### `/src/types` - Tipos TypeScript

Definiciones de tipos para TypeScript.

**Archivos:**
- `sharepoint.ts` - Tipos relacionados con SharePoint

**Ejemplo de tipos:**
```typescript
interface SharePointListItem {
  id: string;
  fields: Record<string, any>;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
}
```

**¿Para qué sirven?**
- Ayudan a detectar errores
- Mejoran el autocompletado
- Documentan qué datos se esperan

### `/src/utils` - Utilidades

Funciones auxiliares que se usan en varios lugares.

**Archivos:**
- `sharePointFieldMapping.ts` - Mapeo entre nombres de campos

**¿Para qué sirven?**
- Convertir nombres de campos de SharePoint a nombres amigables
- Normalizar datos
- Funciones reutilizables

### `/src/data` - Datos de Prueba

Datos mock (falsos) para desarrollo y pruebas.

**Archivos:**
- `mockData.ts` - Datos de prueba básicos
- `mockDataReal.ts` - Datos de prueba más realistas

**¿Para qué sirven?**
- Probar la aplicación sin conexión a SharePoint
- Desarrollar sin necesidad de autenticarse
- Ejemplos de cómo se ven los datos

## Flujo de la Aplicación

### 1. Inicio (`main.tsx`)

```typescript
// main.tsx es el punto de entrada
// Renderiza el componente App en el elemento #root del HTML
```

### 2. Componente Principal (`App.tsx`)

```typescript
// App.tsx envuelve todo en AuthProvider
// AuthProvider maneja el estado de autenticación
// AppContent muestra la interfaz según si está autenticado o no
```

### 3. Autenticación

```
Usuario → LoginButton → authService → Azure AD → Token → AuthContext
```

### 4. Carga de Datos

```
App → sharePointService → Microsoft Graph API → SharePoint → Datos → Componentes
```

### 5. Visualización

```
Datos → DashboardReal / SharePointTableReal → Usuario ve la información
```

## Patrones de Código Utilizados

### 1. Componentes Funcionales
Todos los componentes son funciones (no clases):
```typescript
function MiComponente() {
  return <div>Hola</div>;
}
```

### 2. Hooks de React
Se usan hooks para manejar estado y efectos:
- `useState` - Para estado local
- `useEffect` - Para efectos secundarios (cargar datos, etc.)
- `useMemo` - Para cálculos costosos
- `useContext` - Para acceder a contextos

### 3. Async/Await
Para operaciones asíncronas (peticiones a APIs):
```typescript
async function cargarDatos() {
  const datos = await sharePointService.getListItems();
  return datos;
}
```

### 4. TypeScript
Todo el código está tipado:
```typescript
interface Vehiculo {
  id: string;
  nombre: string;
}
```

## Archivos de Configuración

### `package.json`
- Lista todas las dependencias
- Define scripts (dev, build, etc.)
- Información del proyecto

### `vite.config.ts`
- Configuración del build tool
- Plugins (React)
- Optimizaciones

### `tsconfig.json`
- Configuración de TypeScript
- Opciones de compilación
- Rutas de archivos

### `tailwind.config.js`
- Configuración de Tailwind CSS
- Colores personalizados
- Extensiones del tema

## Convenciones de Nombres

- **Componentes:** PascalCase (ej: `DashboardReal.tsx`)
- **Funciones:** camelCase (ej: `getListItems()`)
- **Constantes:** UPPER_SNAKE_CASE (ej: `VITE_CLIENT_ID`)
- **Tipos/Interfaces:** PascalCase (ej: `SharePointListItem`)
- **Archivos:** PascalCase para componentes, camelCase para otros

## Cómo Encontrar Código Específico

**¿Dónde está el código de autenticación?**
→ `/src/services/authService.ts` y `/src/config/authConfig.ts`

**¿Dónde está el código de SharePoint?**
→ `/src/services/sharePointService.ts`

**¿Dónde está el formulario de agregar equipo?**
→ `/src/components/VehicleFormReal.tsx`

**¿Dónde está el dashboard?**
→ `/src/components/DashboardReal.tsx`

**¿Dónde está la tabla de datos?**
→ `/src/components/SharePointTableReal.tsx`

**¿Dónde se define el estado global?**
→ `/src/context/AuthContext.tsx`

---

**Siguiente:** [Despliegue](./06-Despliegue.md)

