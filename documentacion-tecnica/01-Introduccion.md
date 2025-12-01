# 1. Introducción al Proyecto

## ¿Qué es este sistema?

El **Sistema de Seguimiento Usados** es una aplicación web que permite a los usuarios gestionar y dar seguimiento a equipos usados (vehículos) que están en proceso de alistamiento. 

La aplicación se conecta directamente con **SharePoint** de Microsoft 365 para leer y escribir información en tiempo real.

## ¿Para qué sirve?

El sistema permite:

- **Ver el estado** de todos los equipos en proceso de alistamiento
- **Filtrar y buscar** equipos por diferentes criterios (sede, asesor, cliente, fechas, etc.)
- **Agregar nuevos equipos** al sistema
- **Editar información** de equipos existentes
- **Subir archivos adjuntos** (documentos, fotos, etc.) a cada equipo
- **Visualizar estadísticas** en un dashboard con gráficos
- **Eliminar equipos** cuando sea necesario

## ¿Quién lo usa?

El sistema está diseñado para ser usado por personal de la empresa que necesita:
- Dar seguimiento al proceso de alistamiento de equipos usados
- Consultar el estado de los equipos
- Actualizar información sobre el progreso de cada equipo

## ¿Cómo funciona en términos simples?

1. El usuario abre la aplicación en su navegador
2. Se autentica con su cuenta de Microsoft 365 (la misma que usa para SharePoint)
3. La aplicación se conecta a SharePoint y obtiene la lista de equipos
4. El usuario puede ver, filtrar, agregar o modificar información
5. Todos los cambios se guardan directamente en SharePoint

## Características principales

### ✅ Autenticación segura
- Usa Microsoft Azure AD para autenticar usuarios
- Solo usuarios autorizados pueden acceder
- Los permisos se gestionan desde Azure Portal

### ✅ Integración con SharePoint
- Lee datos directamente de listas de SharePoint
- Escribe cambios en tiempo real
- Soporta subida de archivos adjuntos

### ✅ Interfaz moderna
- Diseño responsive (funciona en computadoras, tablets y móviles)
- Fácil de usar e intuitivo
- Visualización de datos con gráficos y tablas

### ✅ Filtros avanzados
- Búsqueda por múltiples criterios simultáneos
- Filtros por fechas, porcentajes, sedes, asesores, etc.
- Resultados en tiempo real

## ¿Dónde se ejecuta?

La aplicación es una **aplicación web** que se ejecuta en el navegador del usuario. No requiere instalación de software adicional, solo un navegador moderno (Chrome, Edge, Firefox, Safari).

El código puede ejecutarse:
- **En desarrollo:** En la computadora del desarrollador (localhost)
- **En producción:** En un servicio de hosting como Vercel, Netlify o similar

## Flujo de trabajo típico

1. Usuario abre la aplicación → Ve el dashboard con todos los equipos
2. Usuario aplica filtros → Ve solo los equipos que le interesan
3. Usuario hace clic en "Agregar Equipo" → Llena un formulario
4. Usuario sube archivos si es necesario → Los archivos se guardan en SharePoint
5. Usuario guarda → El nuevo equipo aparece en la lista
6. Usuario puede editar o eliminar equipos cuando sea necesario

## Datos que maneja

El sistema trabaja con información sobre equipos usados, incluyendo:
- Información básica (cliente, serie, modelo, OTT)
- Fechas importantes (solicitud, compromiso, inicio de ciclo, finalización)
- Estado de diferentes fases del proceso (F1 a F16)
- Porcentaje de avance total
- Observaciones y notas
- Archivos adjuntos (documentos, imágenes)

---

**Siguiente:** [Arquitectura del Sistema](./02-Arquitectura.md)

