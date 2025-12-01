import { useState, useEffect, useMemo } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import LoginButton from "./components/LoginButton";
import SharePointTableReal from "./components/SharePointTableReal";
import DashboardReal from "./components/DashboardReal";
import VehicleFormReal from "./components/VehicleFormReal";
import DashboardFilters, { FilterState } from "./components/DashboardFilters";
import {
  sharePointService,
  SharePointListItem,
} from "./services/sharePointService";
import { realItems } from "./data/mockDataReal";
import { LayoutDashboard, Table2, Plus, Loader2 } from "lucide-react";
import {
  normalizeSharePointFields,
  getFieldValue,
  denormalizeSharePointFields,
} from "./utils/sharePointFieldMapping";

type View = "dashboard" | "table";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [items, setItems] = useState<SharePointListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] =
    useState<SharePointListItem | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    sede: "",
    asesor: "",
    cliente: "",
    serie: "",
    fase: "",
    observaciones: "",
    ciclo: "",
    fechaCompromisoDesde: "",
    fechaCompromisoHasta: "",
    fechaFinalDesde: "",
    fechaFinalHasta: "",
    porcentajeAvance: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      // Si no está autenticado, cargar datos mock
      loadMockData();
    } else {
      // Si está autenticado, intentar cargar datos reales
      loadRealData();
    }
  }, [isAuthenticated]);

  const loadMockData = () => {
    setItems(realItems);
    setUseMockData(true);
  };

  // Filtrar items
  const filteredItems = useMemo(() => {
    console.log(`🔍 Filtrando ${items.length} registros con filtros:`, filters);
    const filtered = items.filter((item) => {
      // Filtro por Sede
      if (filters.sede && getFieldValue(item.fields, "Sede") !== filters.sede)
        return false;

      // Filtro por Asesor
      if (
        filters.asesor &&
        getFieldValue(item.fields, "Asesor") !== filters.asesor
      )
        return false;

      // Filtro por Cliente
      if (
        filters.cliente &&
        getFieldValue(item.fields, "Title") !== filters.cliente
      )
        return false;

      // Filtro por Serie
      if (
        filters.serie &&
        getFieldValue(item.fields, "Serie") !== filters.serie
      )
        return false;

      // Filtro por Fase
      if (filters.fase) {
        const faseValue = item.fields[filters.fase];
        // Puedes agregar lógica adicional aquí si quieres filtrar por estado de la fase
      }

      // Filtro por Observaciones
      if (
        filters.observaciones &&
        getFieldValue(item.fields, "Observaciones") !== filters.observaciones
      )
        return false;

      // Filtro por Ciclo
      if (
        filters.ciclo &&
        getFieldValue(item.fields, "Ciclo") !== filters.ciclo
      )
        return false;

      // Filtro por Fecha de Compromiso (solo si el campo tiene valor)
      if (filters.fechaCompromisoDesde || filters.fechaCompromisoHasta) {
        const fechaCompromisoValue = getFieldValue(
          item.fields,
          "FechaCompromisoComercial"
        );
        // Solo filtrar si el campo tiene un valor válido
        if (fechaCompromisoValue) {
          const fechaCompromiso = new Date(fechaCompromisoValue);
          if (isNaN(fechaCompromiso.getTime())) return true; // Si la fecha es inválida, incluir el registro

          if (filters.fechaCompromisoDesde) {
            const desde = new Date(filters.fechaCompromisoDesde);
            if (fechaCompromiso < desde) return false;
          }
          if (filters.fechaCompromisoHasta) {
            const hasta = new Date(filters.fechaCompromisoHasta);
            hasta.setHours(23, 59, 59, 999); // Incluir todo el día
            if (fechaCompromiso > hasta) return false;
          }
        }
        // Si el campo no tiene valor, incluir el registro (no excluir por falta de fecha)
      }

      // Filtro por Fecha Final Alistamiento (solo si el campo tiene valor)
      if (filters.fechaFinalDesde || filters.fechaFinalHasta) {
        const fechaFinalValue = getFieldValue(
          item.fields,
          "FechaFinalAlistamiento"
        );
        // Solo filtrar si el campo tiene un valor válido
        if (fechaFinalValue) {
          const fechaFinal = new Date(fechaFinalValue);
          if (isNaN(fechaFinal.getTime())) return true; // Si la fecha es inválida, incluir el registro

          if (filters.fechaFinalDesde) {
            const desde = new Date(filters.fechaFinalDesde);
            if (fechaFinal < desde) return false;
          }
          if (filters.fechaFinalHasta) {
            const hasta = new Date(filters.fechaFinalHasta);
            hasta.setHours(23, 59, 59, 999); // Incluir todo el día
            if (fechaFinal > hasta) return false;
          }
        }
        // Si el campo no tiene valor, incluir el registro (no excluir por falta de fecha)
      }

      // Filtro por % de Avance
      if (filters.porcentajeAvance) {
        // Helper para obtener porcentaje de avance
        const getPorcentajeAvance = (fields: Record<string, any>): number => {
          let porcentaje = getFieldValue(fields, "PorcentajeAvanceTotal");

          if (typeof porcentaje === "string") {
            porcentaje =
              parseFloat(porcentaje.replace("%", "").replace(/[^0-9.]/g, "")) ||
              0;
          } else {
            porcentaje = Number(porcentaje) || 0;
          }

          return porcentaje;
        };

        const avance = getPorcentajeAvance(item.fields);
        if (filters.porcentajeAvance === "100" && avance !== 100) return false;
        if (
          filters.porcentajeAvance === ">0" &&
          (avance === 0 || avance === 100)
        )
          return false;
        if (filters.porcentajeAvance === "0" && avance !== 0) return false;
      }

      return true;
    });
    console.log(`✅ Registros después de filtrar: ${filtered.length}`);
    return filtered;
  }, [items, filters]);

  const loadRealData = async () => {
    try {
      setIsLoading(true);
      const itemsData = await sharePointService.getListItems();

      console.log(`📊 Registros recibidos de SharePoint: ${itemsData.length}`);

      // Normalizar los campos de SharePoint para usar nombres amigables
      const normalizedItems = itemsData.map((item) => ({
        ...item,
        fields: normalizeSharePointFields(item.fields),
      }));

      console.log(
        `✅ Registros normalizados y listos para mostrar: ${normalizedItems.length}`
      );
      console.log(
        `📋 Primeros 5 registros normalizados:`,
        normalizedItems.slice(0, 5).map((i) => ({
          id: i.id,
          title: i.fields.Title,
          serie: getFieldValue(i.fields, "Serie"),
        }))
      );

      setItems(normalizedItems);
      setUseMockData(false);
    } catch (error) {
      console.error("Error loading data:", error);
      // Si falla, usar datos mock
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (data: any, files?: File[]) => {
    if (useMockData) {
      // Simular guardado en mock
      const newItem: SharePointListItem = {
        id: String(items.length + 1),
        fields: {
          ...data,
          FechaSolicitud: data.FechaSolicitud + "T00:00:00Z",
          FechaCompromisoComercial:
            data.FechaCompromisoComercial + "T00:00:00Z",
          FechaInicioCiclo: data.FechaInicioCiclo + "T00:00:00Z",
          FechaFinalAlistamiento: data.FechaFinalAlistamiento
            ? data.FechaFinalAlistamiento + "T00:00:00Z"
            : null,
          PorcentajeAvanceTotal: 0, // Se calculará en SharePoint
          DiasRestantes: 30, // Se calculará en SharePoint
        },
        createdDateTime: new Date().toISOString(),
        lastModifiedDateTime: new Date().toISOString(),
      };
      setItems([...items, newItem]);
      setShowForm(false);
      alert(
        "Equipo agregado (modo prueba). En producción se guardará en SharePoint."
      );
    } else {
      // Guardar en SharePoint - Convertir nombres amigables a nombres internos
      try {
        // Preparar los datos con nombres internos de SharePoint
        const sharePointFields: Record<string, any> = {
          Title: data.Title || "",
          field_0: data.Serie || "", // Serie
          field_1: data.Prioridad || 0, // Prioridad
          field_2: data.Modelo || "", // Modelo
          field_3: data.OTT || "", // OTT
          field_4: data.Asesor || "", // Asesor
          field_28: data.Sede || "", // Sede
        };

        // Fechas (convertir a formato ISO)
        if (data.FechaSolicitud) {
          sharePointFields.field_7 = new Date(
            data.FechaSolicitud + "T00:00:00Z"
          ).toISOString();
        }
        if (data.FechaCompromisoComercial) {
          sharePointFields.field_9 = new Date(
            data.FechaCompromisoComercial + "T00:00:00Z"
          ).toISOString();
        }
        if (data.FechaInicioCiclo) {
          sharePointFields.field_10 = new Date(
            data.FechaInicioCiclo + "T00:00:00Z"
          ).toISOString(); // FechaInicioCiclo
        }
        if (data.FechaFinalAlistamiento) {
          sharePointFields.FechaFinalAlistamiento = new Date(
            data.FechaFinalAlistamiento + "T00:00:00Z"
          ).toISOString();
        }

        // Campos opcionales
        if (data.Observaciones) {
          sharePointFields.field_8 = data.Observaciones; // Observaciones
        }
        if (data.Ciclo) {
          sharePointFields.field_29 = `Ciclo ${data.Ciclo}`; // Ciclo - Formato: "Ciclo 17"
        }

        // Fases F1-F16 (field_11 a field_26)
        for (let i = 1; i <= 16; i++) {
          const faseKey = `F${i}`;
          if (data[faseKey]) {
            sharePointFields[`field_${10 + i}`] = data[faseKey]; // field_11, field_12, ..., field_26
          }
        }

        const newItem = await sharePointService.createListItem(
          sharePointFields
        );
        console.log(`✅ Equipo creado con ID: ${newItem.id}`);

        // Subir archivos adjuntos si existen
        let uploadedCount = 0;
        let failedCount = 0;
        if (files && files.length > 0) {
          console.log(`📎 Iniciando subida de ${files.length} archivo(s)...`);

          // Esperar un momento para que SharePoint procese el item
          await new Promise((resolve) => setTimeout(resolve, 1000));

          for (const file of files) {
            try {
              console.log(`⬆️ Subiendo: ${file.name}...`);
              await sharePointService.uploadAttachment(newItem.id, file);
              uploadedCount++;
            } catch (fileError: any) {
              console.error(`❌ Error subiendo ${file.name}:`, fileError);
              console.error("Detalles:", fileError.response?.data);
              failedCount++;
            }
          }

          console.log(
            `📊 Resultado: ${uploadedCount} exitosos, ${failedCount} fallidos`
          );
        }

        await loadRealData();
        setShowForm(false);

        const message =
          files && files.length > 0
            ? `Equipo agregado exitosamente. Archivos: ${uploadedCount} subidos` +
              (failedCount > 0 ? `, ${failedCount} fallidos` : "")
            : "Equipo agregado exitosamente";

        alert(message);
      } catch (error: any) {
        console.error("Error adding vehicle:", error);
        const errorMessage =
          error.response?.data?.error?.message ||
          error.message ||
          "Error desconocido";
        console.error("Error completo:", error.response?.data);
        alert(
          `Error al agregar equipo: ${errorMessage}. Revisa la consola para más detalles.`
        );
      }
    }
  };

  const handleEditVehicle = async (data: any, files?: File[]) => {
    if (!editingVehicle) return;

    if (useMockData) {
      // Simular edición en mock
      const updatedItems = items.map((item) =>
        item.id === editingVehicle.id
          ? {
              ...item,
              fields: {
                ...data,
                FechaSolicitud: data.FechaSolicitud + "T00:00:00Z",
                FechaCompromisoComercial:
                  data.FechaCompromisoComercial + "T00:00:00Z",
                FechaInicioCiclo: data.FechaInicioCiclo + "T00:00:00Z",
                FechaFinalAlistamiento: data.FechaFinalAlistamiento
                  ? data.FechaFinalAlistamiento + "T00:00:00Z"
                  : null,
                PorcentajeAvanceTotal: item.fields.PorcentajeAvanceTotal, // Mantener calculado
                DiasRestantes: item.fields.DiasRestantes, // Mantener calculado
              },
              lastModifiedDateTime: new Date().toISOString(),
            }
          : item
      );
      setItems(updatedItems);
      setEditingVehicle(null);
      alert(
        "Equipo actualizado (modo prueba). En producción se guardará en SharePoint."
      );
    } else {
      // Actualizar en SharePoint - Convertir nombres amigables a nombres internos
      try {
        // Preparar los datos con nombres internos de SharePoint
        const sharePointFields: Record<string, any> = {
          Title: data.Title || "",
          field_0: data.Serie || "", // Serie
          field_1: data.Prioridad || 0, // Prioridad
          field_2: data.Modelo || "", // Modelo
          field_3: data.OTT || "", // OTT
          field_4: data.Asesor || "", // Asesor
          field_28: data.Sede || "", // Sede
        };

        // Fechas (convertir a formato ISO)
        if (data.FechaSolicitud) {
          sharePointFields.field_7 = new Date(
            data.FechaSolicitud + "T00:00:00Z"
          ).toISOString();
        }
        if (data.FechaCompromisoComercial) {
          sharePointFields.field_9 = new Date(
            data.FechaCompromisoComercial + "T00:00:00Z"
          ).toISOString();
        }
        if (data.FechaInicioCiclo) {
          sharePointFields.field_10 = new Date(
            data.FechaInicioCiclo + "T00:00:00Z"
          ).toISOString(); // FechaInicioCiclo
        }
        if (data.FechaFinalAlistamiento) {
          sharePointFields.FechaFinalAlistamiento = new Date(
            data.FechaFinalAlistamiento + "T00:00:00Z"
          ).toISOString();
        }

        // Campos opcionales
        if (data.Observaciones) {
          sharePointFields.field_8 = data.Observaciones; // Observaciones
        }
        if (data.Ciclo) {
          sharePointFields.field_29 = `Ciclo ${data.Ciclo}`; // Ciclo - Formato: "Ciclo 17"
        }

        // Fases F1-F16 (field_11 a field_26)
        for (let i = 1; i <= 16; i++) {
          const faseKey = `F${i}`;
          if (data[faseKey]) {
            sharePointFields[`field_${10 + i}`] = data[faseKey]; // field_11, field_12, ..., field_26
          }
        }

        console.log(
          `📤 Enviando actualización para item ID: ${editingVehicle.id}`
        );
        console.log(`📋 Item completo:`, editingVehicle);
        console.log(`📋 Datos a enviar:`, sharePointFields);

        // Validar que el ID existe y es válido
        if (!editingVehicle.id || editingVehicle.id.trim() === "") {
          throw new Error("El ID del item no es válido");
        }

        await sharePointService.updateListItem(
          editingVehicle.id,
          sharePointFields
        );
        console.log(`✅ Equipo actualizado con ID: ${editingVehicle.id}`);

        // Subir archivos adjuntos si existen
        let uploadedCount = 0;
        let failedCount = 0;
        if (files && files.length > 0) {
          console.log(`📎 Iniciando subida de ${files.length} archivo(s)...`);

          // Esperar un momento para que SharePoint procese la actualización
          await new Promise((resolve) => setTimeout(resolve, 500));

          for (const file of files) {
            try {
              console.log(`⬆️ Subiendo: ${file.name}...`);
              await sharePointService.uploadAttachment(editingVehicle.id, file);
              uploadedCount++;
            } catch (fileError: any) {
              console.error(`❌ Error subiendo ${file.name}:`, fileError);
              console.error("Detalles:", fileError.response?.data);
              failedCount++;
            }
          }

          console.log(
            `📊 Resultado: ${uploadedCount} exitosos, ${failedCount} fallidos`
          );
        }

        await loadRealData();
        setEditingVehicle(null);

        const message =
          files && files.length > 0
            ? `Equipo actualizado exitosamente. Archivos: ${uploadedCount} subidos` +
              (failedCount > 0 ? `, ${failedCount} fallidos` : "")
            : "Equipo actualizado exitosamente";

        alert(message);
      } catch (error: any) {
        console.error("Error updating vehicle:", error);
        const errorMessage =
          error.response?.data?.error?.message ||
          error.message ||
          "Error desconocido";
        console.error("Error completo:", error.response?.data);
        alert(
          `Error al actualizar equipo: ${errorMessage}. Revisa la consola para más detalles.`
        );
      }
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("¿Estás seguro de eliminar este equipo?")) return;

    if (useMockData) {
      // Simular eliminación en mock
      setItems(items.filter((item) => item.id !== vehicleId));
      alert(
        "Equipo eliminado (modo prueba). En producción se eliminará de SharePoint."
      );
    } else {
      // Eliminar de SharePoint
      try {
        await sharePointService.deleteListItem(vehicleId);
        await loadRealData();
        alert("Equipo eliminado exitosamente");
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert("Error al eliminar equipo. Verifica los permisos.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            {/* Logo centrado */}
            <div className="flex-1 flex justify-center">
              <img
                src="https://res.cloudinary.com/dbufrzoda/image/upload/v1750457354/Captura_de_pantalla_2025-06-20_170819_wzmyli.png"
                alt="Logo Partequipos"
                className="h-16 object-contain"
              />
            </div>
            {/* Botón de login alineado a la derecha */}
            <div className="flex-1 flex justify-end">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  currentView === "dashboard"
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView("table")}
                className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  currentView === "table"
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Table2 className="w-5 h-5" />
                Tabla de Datos
              </button>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Equipo
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        ) : (
          <>
            {currentView === "dashboard" && (
              <div className="w-full mb-6">
                <DashboardFilters
                  items={items}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            )}
            {currentView === "dashboard" ? (
              <DashboardReal items={filteredItems} />
            ) : (
              <SharePointTableReal
                items={filteredItems}
                useMockData={useMockData}
                onEdit={setEditingVehicle}
                onDelete={handleDeleteVehicle}
                onRefresh={useMockData ? loadMockData : loadRealData}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2025 Seguimiento Usados - Desarrollado con React + Vite +
            TypeScript
          </p>
        </div>
      </footer>

      {/* Modal de Formulario */}
      {(showForm || editingVehicle) && (
        <VehicleFormReal
          vehicle={editingVehicle || undefined}
          onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
          onCancel={() => {
            setShowForm(false);
            setEditingVehicle(null);
          }}
          isEditing={!!editingVehicle}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
