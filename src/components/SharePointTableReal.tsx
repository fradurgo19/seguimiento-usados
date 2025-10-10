/**
 * Tabla optimizada para datos reales de SharePoint
 * Muestra las columnas más importantes
 */

import React, { useState } from "react";
import { SharePointListItem } from "../services/sharePointService";
import { Edit2, Trash2, TestTube2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SharePointTableRealProps {
  items: SharePointListItem[];
  useMockData: boolean;
  onEdit: (vehicle: SharePointListItem) => void;
  onDelete: (vehicleId: string) => void;
  onRefresh: () => void;
}

const SharePointTableReal: React.FC<SharePointTableRealProps> = ({
  items,
  useMockData,
  onEdit,
  onDelete,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: es });
    } catch {
      return "-";
    }
  };

  const getPrioridadColor = (prioridad: number) => {
    if (prioridad === 1) return "bg-red-100 text-red-800";
    if (prioridad === 2) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getPrioridadText = (prioridad: number) => {
    if (prioridad === 1) return "Alta";
    if (prioridad === 2) return "Media";
    return "Baja";
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {useMockData && (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
          <div className="flex items-center gap-2">
            <TestTube2 className="w-5 h-5 text-purple-600" />
            <p className="text-purple-800 font-medium">Modo de Prueba Activo</p>
          </div>
          <p className="text-purple-700 text-sm mt-1">
            Puedes agregar, editar y eliminar registros. Los cambios se
            aplicarán localmente. Una vez que el administrador apruebe los
            permisos, los cambios se guardarán en SharePoint.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asesor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sede
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Avance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Días Restantes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.fields.Title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.fields.Serie}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.fields.Modelo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.fields.Asesor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.fields.Sede}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(
                          item.fields.Prioridad
                        )}`}
                      >
                        {getPrioridadText(item.fields.Prioridad)} (
                        {item.fields.Prioridad})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                item.fields.PorcentajeAvanceTotal || 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-10 text-right">
                          {item.fields.PorcentajeAvanceTotal || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`font-medium ${
                          (item.fields.DiasRestantes || 0) < 5
                            ? "text-red-600"
                            : (item.fields.DiasRestantes || 0) < 10
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.fields.DiasRestantes || 0} días
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleRow(item.id)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Ver detalles"
                      >
                        {expandedRow === item.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>

                  {/* Fila expandible con detalles */}
                  {expandedRow === item.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Información General */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Información General
                            </h4>
                            <div>
                              <span className="text-xs text-gray-600">
                                OTT:
                              </span>
                              <p className="text-sm font-medium text-gray-900">
                                {item.fields.OTT}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">
                                Ciclo:
                              </span>
                              <p className="text-sm font-medium text-gray-900">
                                {item.fields.Ciclo}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">
                                Observaciones:
                              </span>
                              <p className="text-sm font-medium text-gray-900">
                                {item.fields.Observaciones || "-"}
                              </p>
                            </div>
                          </div>

                          {/* Fechas */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Fechas
                            </h4>
                            <div>
                              <span className="text-xs text-gray-600">
                                Solicitud:
                              </span>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(item.fields.FechaSolicitud)}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">
                                Compromiso Comercial:
                              </span>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(
                                  item.fields.FechaCompromisoComercial
                                )}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">
                                Inicio Ciclo:
                              </span>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(item.fields.FechaInicioCiclo)}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">
                                Final Alistamiento:
                              </span>
                              <p className="text-sm font-medium text-gray-900">
                                {item.fields.FechaFinalAlistamiento
                                  ? formatDate(
                                      item.fields.FechaFinalAlistamiento
                                    )
                                  : "-"}
                              </p>
                            </div>
                          </div>

                          {/* Fases */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Estado de Fases
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                              {Array.from({ length: 16 }, (_, i) => i + 1).map(
                                (num) => {
                                  const porcentaje =
                                    item.fields[`F${num}`] || "0%";
                                  const bgColor =
                                    porcentaje === "100%"
                                      ? "bg-green-500"
                                      : porcentaje === "50%"
                                      ? "bg-blue-500"
                                      : "bg-gray-300";
                                  return (
                                    <div
                                      key={`F${num}`}
                                      className="text-center"
                                      title={`F${num}: ${porcentaje}`}
                                    >
                                      <div
                                        className={`${bgColor} text-white text-xs font-bold rounded px-2 py-1`}
                                      >
                                        {porcentaje}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                            <div className="flex gap-4 text-xs mt-3">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span>100%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                <span>50%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                                <span>0%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No hay vehículos registrados</p>
        </div>
      )}
    </div>
  );
};

export default SharePointTableReal;
