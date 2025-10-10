# 🚀 Guía Rápida de Uso - Seguimiento Alistamiento Usados

## ✅ ¡APLICACIÓN COMPLETAMENTE ACTUALIZADA!

Tu aplicación ahora coincide **100% con las columnas reales** de SharePoint.

---

## 🎯 RECARGA AHORA

```
http://localhost:5173
```

---

## 📊 VISTA 1: DASHBOARD

Al abrir la app, verás inmediatamente:

### Tarjetas de Estadísticas (6):

```
┌─────────────┬─────────────┬─────────────┐
│ Total: 6    │ En Proceso:4│ Completados:│
│             │             │ 1           │
├─────────────┼─────────────┼─────────────┤
│ Pendientes:1│ Avance: 45% │ Días: 15    │
└─────────────┴─────────────┴─────────────┘
```

### Gráficos (6):

1. **Circular**: Completados/En Proceso/Pendientes
2. **Barras**: Vehículos por Asesor
3. **Barras**: Vehículos por Sede
4. **Barras**: Vehículos por Prioridad (1-5)
5. **Circular**: Top 5 Modelos
6. **Lista**: Progreso de cada vehículo

### Resumen de Fases:

```
Grid de 16 cuadros (F1-F16)
Muestra cuántos vehículos completaron cada fase
```

### Alertas:

```
⚠️ Vehículos Próximos a Vencer
(Los que tienen < 10 días restantes)
```

---

## 📋 VISTA 2: TABLA DE DATOS

Click en "Tabla de Datos" en el menú superior.

### Tabla Principal:

```
Columnas visibles:
- Título (placa)
- Serie
- Modelo
- Asesor
- Sede
- Prioridad (con badge de color)
- % Avance (barra visual)
- Días Restantes (con color)
- Acciones (↓ ✏️ 🗑️)
```

### Al hacer click en ↓ (Expandir):

```
┌──────────────────────────────────────┐
│ Información General:                 │
│ - OTT: OTT-2024-001                 │
│ - Ciclo: Ciclo 1                    │
│ - Observaciones: Urgente            │
├──────────────────────────────────────┤
│ Fechas:                              │
│ - Solicitud: 01/10/2024             │
│ - Compromiso: 15/10/2024            │
│ - Inicio Ciclo: 02/10/2024          │
│ - Final: 20/10/2024                 │
├──────────────────────────────────────┤
│ Estado de Fases:                     │
│ [🟢][🟢][🟢][🟢][🟢][🔵][⚪][⚪]... │
│  F1  F2  F3  F4  F5  F6  F7  F8     │
│ [⚪][⚪][⚪][⚪][⚪][⚪][⚪][⚪]        │
│  F9 F10 F11 F12 F13 F14 F15 F16      │
│                                      │
│ Leyenda:                             │
│ 🟢 Completado  🔵 En Proceso  ⚪ Pendiente │
└──────────────────────────────────────┘
```

---

## ➕ AGREGAR VEHÍCULO

Click en "➕ Agregar Vehículo" (siempre visible arriba).

### PESTAÑA 1: Información General

```
┌─────────────────────────────────────┐
│ Título (Placa) *: [ABC123        ] │
│ Serie *:          [2024-007      ] │
│ Modelo *:         [▼ Hilux       ] │
│ OTT *:            [OTT-2024-007  ] │
│ Asesor *:         [▼ Juan Pérez  ] │
│ Prioridad *:      [1             ] │
│ Sede *:           [▼ Bogotá      ] │
│ Ciclo *:          [▼ Ciclo 1     ] │
│ Fecha Solicitud *:[10/10/2024   ] │
│ Fecha Compromiso*:[25/10/2024   ] │
│ Fecha Inicio *:   [11/10/2024   ] │
│ Fecha Final:      [             ] │
│ Observaciones:    [▼ Normal      ] │
└─────────────────────────────────────┘
```

### PESTAÑA 2: Fases del Alistamiento

```
┌──────────────────────────────────────────────────────────────┐
│ ℹ️ El % de avance se calculará automáticamente en SharePoint │
├──────────────────────────────────────────────────────────────┤
│ Fase 1 (F1):  [▼ Pendiente   ]  Fase 2 (F2):  [▼ Pendiente]│
│ Fase 3 (F3):  [▼ Pendiente   ]  Fase 4 (F4):  [▼ Pendiente]│
│ Fase 5 (F5):  [▼ Pendiente   ]  Fase 6 (F6):  [▼ Pendiente]│
│ ...                                                          │
│ Fase 15 (F15):[▼ Pendiente   ]  Fase 16 (F16):[▼ Pendiente]│
├──────────────────────────────────────────────────────────────┤
│ Campos Calculados Automáticamente:                          │
│ • % avance total: Basado en F1-F16                         │
│ • Días faltantes: Calculado según fases                    │
└──────────────────────────────────────────────────────────────┘

[Cancelar]  [💾 Guardar]
```

**Opciones para cada fase:**

- Pendiente
- En Proceso
- Completado

---

## ✏️ EDITAR VEHÍCULO

1. En la tabla, click en ✏️ de cualquier fila
2. El formulario se abre **pre-llenado** con los datos actuales
3. Modifica lo que necesites
4. Para cambiar fases: Ve a pestaña "Fases del Alistamiento"
5. Cambia de "Pendiente" a "Completado" las que avanzaste
6. Click "Actualizar"
7. El % avance se recalculará automáticamente

---

## 🔍 VER DETALLES DE UN VEHÍCULO

1. En la tabla, click en ↓ (flecha hacia abajo)
2. Se expande mostrando:
   - OTT, Ciclo, Observaciones
   - Fechas completas
   - **Grid visual de las 16 fases con colores**

---

## 🗑️ ELIMINAR VEHÍCULO

1. Click en 🗑️ (basura)
2. Confirma
3. Se elimina (en modo prueba es local, en producción de SharePoint)

---

## 🎨 COLORES Y BADGES

### Prioridad:

- 🔴 **Prioridad 1** (Alta) - Rojo
- 🟡 **Prioridad 2** (Media) - Amarillo
- 🟢 **Prioridad 3** (Baja) - Verde
- etc.

### Días Restantes:

- 🔴 **< 5 días** - Rojo (urgente)
- 🟡 **5-10 días** - Amarillo (atención)
- 🟢 **> 10 días** - Verde (normal)

### Fases:

- 🟢 **Completado** - Verde
- 🔵 **En Proceso** - Azul
- ⚪ **Pendiente** - Gris

---

## 💾 MODO PRUEBA vs PRODUCCIÓN

### AHORA (Modo Prueba):

```
Banner morado en la parte superior
    ↓
Todos los cambios son locales
    ↓
Puedes agregar/editar/eliminar libremente
    ↓
Los cambios NO se guardan en SharePoint (aún)
```

### CON PERMISOS (Producción):

```
Banner desaparece
    ↓
Todos los cambios van a SharePoint
    ↓
% avance se calcula automáticamente
    ↓
Días restantes se calculan automáticamente
```

---

## 📊 FUNCIONALIDADES AVANZADAS

### En el Dashboard:

- **Hover** en gráficos circulares → Ver valores exactos
- **Scroll** en "Progreso por Vehículo" → Ver más vehículos
- **Alertas** → Solo muestra vehículos urgentes

### En la Tabla:

- **Expandir/Contraer** filas con ↓/↑
- **Ordenar** por columnas (próximamente)
- **Filtrar** por asesor, sede, etc. (próximamente)

---

## 🎯 FLUJO DE TRABAJO TÍPICO

### 1. Nuevo Vehículo Llega:

```
1. Click "➕ Agregar Vehículo"
2. Pestaña "General": Llena datos básicos
3. Pestaña "Fases": Deja todo en "Pendiente"
4. Guardar
5. Aparece en Dashboard y Tabla con 0% avance
```

### 2. Comienza el Alistamiento:

```
1. Click ✏️ en el vehículo
2. Pestaña "Fases": Cambia F1 a "Completado"
3. Actualizar
4. % avance sube automáticamente (SharePoint)
5. Días restantes se recalculan
```

### 3. Avanza el Proceso:

```
1. A medida que completas fases (F2, F3, F4...)
2. % avance aumenta automáticamente
3. Días restantes disminuyen
4. Se visualiza en la barra de progreso
```

### 4. Completa el Alistamiento:

```
1. Completas F1 hasta F16
2. % avance llega a 100%
3. Días restantes = 0
4. Aparece en "Completados" del Dashboard
5. Badge verde en la tabla
```

---

## 🚀 ¡PRUEBA AHORA!

```
http://localhost:5173
```

1. **Ve al Dashboard** → Explora los gráficos
2. **Click "Agregar Vehículo"** → Llena el formulario con 2 pestañas
3. **Ve a "Tabla de Datos"** → Click ↓ para ver las fases
4. **Edita un vehículo** → Cambia fases a "Completado"
5. **Vuelve al Dashboard** → Verás los gráficos actualizados

---

## 📞 SIGUIENTE PASO

**Dime:**

- ¿Necesitas ajustar las opciones de los desplegables?
- ¿F1-F16 tienen nombres específicos?
- ¿Hay alguna columna que falte?
- ¿Necesitas algún gráfico adicional?

**¡Todo está listo para que lo pruebes!** 🎉
