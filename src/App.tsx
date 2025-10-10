import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import LoginButton from "./components/LoginButton";
import SharePointTableReal from "./components/SharePointTableReal";
import DashboardReal from "./components/DashboardReal";
import VehicleFormReal from "./components/VehicleFormReal";
import {
  sharePointService,
  SharePointListItem,
} from "./services/sharePointService";
import { realItems } from "./data/mockDataReal";
import { LayoutDashboard, Table2, Plus, Loader2 } from "lucide-react";

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

  const loadRealData = async () => {
    try {
      setIsLoading(true);
      const itemsData = await sharePointService.getListItems();
      setItems(itemsData);
      setUseMockData(false);
    } catch (error) {
      console.error("Error loading data:", error);
      // Si falla, usar datos mock
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (data: any) => {
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
        "Vehículo agregado (modo prueba). En producción se guardará en SharePoint."
      );
    } else {
      // Guardar en SharePoint
      try {
        await sharePointService.createListItem({
          ...data,
          FechaSolicitud: data.FechaSolicitud + "T00:00:00Z",
          FechaCompromisoComercial:
            data.FechaCompromisoComercial + "T00:00:00Z",
          FechaInicioCiclo: data.FechaInicioCiclo + "T00:00:00Z",
          FechaFinalAlistamiento: data.FechaFinalAlistamiento
            ? data.FechaFinalAlistamiento + "T00:00:00Z"
            : null,
        });
        await loadRealData();
        setShowForm(false);
        alert("Vehículo agregado exitosamente");
      } catch (error) {
        console.error("Error adding vehicle:", error);
        alert("Error al agregar vehículo. Verifica los permisos.");
      }
    }
  };

  const handleEditVehicle = async (data: any) => {
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
        "Vehículo actualizado (modo prueba). En producción se guardará en SharePoint."
      );
    } else {
      // Actualizar en SharePoint
      try {
        await sharePointService.updateListItem(editingVehicle.id, {
          ...data,
          FechaSolicitud: data.FechaSolicitud + "T00:00:00Z",
          FechaCompromisoComercial:
            data.FechaCompromisoComercial + "T00:00:00Z",
          FechaInicioCiclo: data.FechaInicioCiclo + "T00:00:00Z",
          FechaFinalAlistamiento: data.FechaFinalAlistamiento
            ? data.FechaFinalAlistamiento + "T00:00:00Z"
            : null,
        });
        await loadRealData();
        setEditingVehicle(null);
        alert("Vehículo actualizado exitosamente");
      } catch (error) {
        console.error("Error updating vehicle:", error);
        alert("Error al actualizar vehículo. Verifica los permisos.");
      }
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("¿Estás seguro de eliminar este vehículo?")) return;

    if (useMockData) {
      // Simular eliminación en mock
      setItems(items.filter((item) => item.id !== vehicleId));
      alert(
        "Vehículo eliminado (modo prueba). En producción se eliminará de SharePoint."
      );
    } else {
      // Eliminar de SharePoint
      try {
        await sharePointService.deleteListItem(vehicleId);
        await loadRealData();
        alert("Vehículo eliminado exitosamente");
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert("Error al eliminar vehículo. Verifica los permisos.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Seguimiento Usados
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Sistema de seguimiento integrado con SharePoint
              </p>
            </div>
            <LoginButton />
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
              Agregar Vehículo
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        ) : currentView === "dashboard" ? (
          <DashboardReal items={items} />
        ) : (
          <SharePointTableReal
            items={items}
            useMockData={useMockData}
            onEdit={setEditingVehicle}
            onDelete={handleDeleteVehicle}
            onRefresh={useMockData ? loadMockData : loadRealData}
          />
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
