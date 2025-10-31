/**
 * Dashboard con estadísticas y gráficos
 * Basado en la estructura real de SharePoint
 */

import React, { useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Clock, CheckCircle, AlertCircle, Car } from "lucide-react";
import { SharePointListItem } from "../services/sharePointService";
import { getFieldValue, calcularPorcentajeAvance } from "../utils/sharePointFieldMapping";

interface DashboardRealProps {
  items: SharePointListItem[];
}

// Componente para la barra de scroll superior sincronizada
const TopScrollBar: React.FC = () => {
  const topScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topScroll = topScrollRef.current;
    const tableContainer = document.getElementById('table-scroll-container') as HTMLDivElement;
    
    if (!topScroll || !tableContainer) return;

    // Calcular el ancho de la tabla para el scroll superior
    const updateScrollWidth = () => {
      const table = tableContainer.querySelector('table');
      if (table) {
        const scrollDiv = topScroll.querySelector('div') as HTMLElement;
        if (scrollDiv) {
          scrollDiv.style.minWidth = `${table.scrollWidth}px`;
        }
      }
    };

    // Sincronizar scroll del superior con el de la tabla
    const handleTopScroll = () => {
      tableContainer.scrollLeft = topScroll.scrollLeft;
    };

    // Sincronizar scroll de la tabla con el superior
    const handleTableScroll = () => {
      topScroll.scrollLeft = tableContainer.scrollLeft;
    };

    topScroll.addEventListener('scroll', handleTopScroll);
    tableContainer.addEventListener('scroll', handleTableScroll);
    
    // Actualizar el ancho cuando cambie el tamaño de la tabla
    const resizeObserver = new ResizeObserver(() => {
      updateScrollWidth();
    });
    
    const table = tableContainer.querySelector('table');
    if (table) {
      resizeObserver.observe(table);
    }
    
    updateScrollWidth();

    return () => {
      topScroll.removeEventListener('scroll', handleTopScroll);
      tableContainer.removeEventListener('scroll', handleTableScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={topScrollRef}
      className="overflow-x-auto overflow-y-hidden border-b border-gray-200 bg-gray-50" 
      style={{ 
        height: '20px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e0 #f7fafc'
      }}
    >
      <div style={{ height: '1px' }}></div>
    </div>
  );
};

const DashboardReal: React.FC<DashboardRealProps> = ({ items }) => {
  // Función helper para obtener porcentaje de avance desde SharePoint
  const getPorcentajeAvance = (fields: Record<string, any>) => {
    let porcentaje = getFieldValue(fields, "PorcentajeAvanceTotal");
    
    // Si es un string (ej: "97%"), extraer el número
    if (typeof porcentaje === 'string') {
      porcentaje = parseFloat(porcentaje.replace('%', '').replace(/[^0-9.]/g, '')) || 0;
    } else {
      porcentaje = Number(porcentaje) || 0;
    }
    
    return porcentaje;
  };

  // Ordenar items por % Avance (menor a mayor)
  const sortedItems = [...items].sort((a, b) => {
    const avanceA = getPorcentajeAvance(a.fields);
    const avanceB = getPorcentajeAvance(b.fields);
    return avanceA - avanceB;
  });

  // Calcular estadísticas (usar items originales para estadísticas)
  const completados = items.filter(
    (i) => getPorcentajeAvance(i.fields) === 100
  ).length;
  const enProceso = items.filter(
    (i) => {
      const avance = getPorcentajeAvance(i.fields);
      return avance > 0 && avance < 100;
    }
  ).length;
  const pendientes = items.filter(
    (i) => getPorcentajeAvance(i.fields) === 0
  ).length;

  const stats = {
    total: items.length,
    completados,
    enProceso,
    pendientes,
    promedioAvance:
      items.reduce(
        (sum, i) => sum + getPorcentajeAvance(i.fields),
        0
      ) / items.length || 0,
    diasPromedioRestantes:
      items.reduce((sum, i) => sum + (Number(getFieldValue(i.fields, "DiasRestantes")) || 0), 0) /
        items.length || 0,
  };

  // Datos para gráfico de avance
  const avanceData = [
    { name: "Completados", value: completados, color: "#10b981" },
    { name: "En Proceso", value: enProceso, color: "#3b82f6" },
    { name: "Pendientes", value: pendientes, color: "#f59e0b" },
  ];

  // Datos por Asesor
  const vehiculosPorAsesor = items.reduce((acc: any, item) => {
    const asesor = getFieldValue(item.fields, "Asesor") || "Sin asignar";
    acc[asesor] = (acc[asesor] || 0) + 1;
    return acc;
  }, {});

  const asesoresData = Object.entries(vehiculosPorAsesor).map(
    ([name, value]) => ({
      name,
      cantidad: value,
    })
  );

  // Datos por Sede
  const vehiculosPorSede = items.reduce((acc: any, item) => {
    const sede = getFieldValue(item.fields, "Sede") || "Sin sede";
    acc[sede] = (acc[sede] || 0) + 1;
    return acc;
  }, {});

  const sedesData = Object.entries(vehiculosPorSede).map(([name, value]) => ({
    name,
    value,
  }));

  // Datos por Modelo
  const vehiculosPorModelo = items.reduce((acc: any, item) => {
    const modelo = getFieldValue(item.fields, "Modelo") || "Sin modelo";
    acc[modelo] = (acc[modelo] || 0) + 1;
    return acc;
  }, {});

  const modelosData = Object.entries(vehiculosPorModelo)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .slice(0, 5); // Top 5 modelos

  // Vehículos por Prioridad
  const prioridadData = items.reduce((acc: any, item) => {
    const prioridad = Number(getFieldValue(item.fields, "Prioridad")) || 0;
    const key = `Prioridad ${prioridad}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const prioridadChartData = Object.entries(prioridadData)
    .map(([name, value]) => ({
      name,
      value,
      color:
        name === "Prioridad 1"
          ? "#ef4444"
          : name === "Prioridad 2"
          ? "#f59e0b"
          : "#10b981",
    }))
    .sort(
      (a, b) => Number(a.name.split(" ")[1]) - Number(b.name.split(" ")[1])
    );

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Vehículos
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Proceso</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.enProceso}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.completados}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.pendientes}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avance Promedio
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.promedioAvance.toFixed(0)}%
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Días Promedio Restantes
              </p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats.diasPromedioRestantes.toFixed(0)}
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Avance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Estado de Avance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={avanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {avanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Asesores */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vehículos por Asesor
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={asesoresData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Sedes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Sede
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sedesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Prioridad */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Prioridad
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prioridadChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 Modelos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Modelos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={modelosData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {modelosData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
                        index
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de progreso por vehículo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progreso por Vehículo
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {sortedItems.slice(0, 10).map((item) => (
              <div key={item.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900">
                    {getFieldValue(item.fields, "Title") || "-"}
                  </span>
                  <span className="text-gray-600">
                    {getPorcentajeAvance(item.fields)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${getPorcentajeAvance(item.fields)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de Fases */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen de Fases (F1-F16)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => {
            const completadas = items.filter(
              (item) => getFieldValue(item.fields, `F${num}`) === "100%"
            ).length;
            const porcentaje = (completadas / items.length) * 100;
            return (
              <div
                key={`F${num}`}
                className="bg-gray-50 rounded-lg p-3 text-center"
              >
                <p className="text-xs font-medium text-gray-600 mb-1">F{num}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completadas}
                </p>
                <p className="text-xs text-gray-500">
                  {porcentaje.toFixed(0)}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Urgentes (Próximos a Vencer) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vehículos Próximos a Vencer (Días Restantes)
        </h3>
        <div className="space-y-2">
          {items
            .filter((item) => {
              const diasRestantes = Number(getFieldValue(item.fields, "DiasRestantes")) || 0;
              const avance = getPorcentajeAvance(item.fields);
              // Mostrar solo los que tienen días restantes Y que no están al 100%
              return diasRestantes > 0 && avance < 100;
            })
            .sort(
              (a, b) =>
                (Number(getFieldValue(a.fields, "DiasRestantes")) || 0) - (Number(getFieldValue(b.fields, "DiasRestantes")) || 0)
            )
            .slice(0, 5)
            .map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {getFieldValue(item.fields, "Title")} - {getFieldValue(item.fields, "Modelo")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Asesor: {getFieldValue(item.fields, "Asesor")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">
                    {Number(getFieldValue(item.fields, "DiasRestantes")) || 0}
                  </p>
                  <p className="text-xs text-gray-600">días restantes</p>
                </div>
              </div>
            ))}
          {items.filter((item) => {
              const diasRestantes = Number(getFieldValue(item.fields, "DiasRestantes")) || 0;
              const avance = getPorcentajeAvance(item.fields);
              return diasRestantes > 0 && avance < 100;
            }).length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No hay vehículos próximos a vencer
            </p>
          )}
        </div>
      </div>

      {/* Tabla Detallada con Fases */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Tabla Detallada - Progreso de Fases por Vehículo
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Vista completa del estado de cada fase (F1-F16) por vehículo. Las fases incompletas aparecen primero.
          </p>
        </div>
        
        {/* Scroll horizontal superior sincronizado */}
        <TopScrollBar />
        
        <div 
          id="table-scroll-container"
          className="overflow-x-auto overflow-y-auto" 
          style={{ 
            maxHeight: '600px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e0 #f7fafc'
          }}
        >
          <table className="divide-y divide-gray-200" style={{ minWidth: 'max-content', width: '100%' }}>
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-20">
                  Prioridad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Serie
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  OTT
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Modelo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha Compromiso
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Asesor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  % Avance
                </th>
                {(() => {
                  // Calcular qué fases están incompletas (al menos un registro no está al 100%)
                  const fasesIncompletas: number[] = [];
                  const fasesCompletas: number[] = [];
                  
                  for (let i = 1; i <= 16; i++) {
                    const tieneIncompletas = items.some((item) => {
                      const faseValue = getFieldValue(item.fields, `F${i}`) || "0%";
                      return faseValue !== "100%";
                    });
                    
                    if (tieneIncompletas) {
                      fasesIncompletas.push(i);
                    } else {
                      fasesCompletas.push(i);
                    }
                  }
                  
                  // Primero las incompletas, luego las completas
                  const fasesOrdenadas = [...fasesIncompletas, ...fasesCompletas];
                  
                  return fasesOrdenadas.map((num) => (
                    <th
                      key={`F${num}`}
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      F{num}
                    </th>
                  ));
                })()}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedItems.map((item) => {
                const formatDate = (dateString: string) => {
                  try {
                    const date = new Date(dateString);
                    return date.toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
                  } catch {
                    return "-";
                  }
                };

                const getPrioridadBadge = (prioridad: number) => {
                  if (prioridad === 1)
                    return "bg-red-100 text-red-800 border-red-300";
                  if (prioridad === 2)
                    return "bg-yellow-100 text-yellow-800 border-yellow-300";
                  return "bg-green-100 text-green-800 border-green-300";
                };

                const getFaseColor = (porcentaje: string) => {
                  if (porcentaje === "100%") return "bg-green-500 text-white";
                  if (porcentaje === "50%") return "bg-yellow-500 text-white";
                  return "bg-red-500 text-white";
                };

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 sticky left-0 bg-white">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-bold rounded border ${getPrioridadBadge(
                          Number(getFieldValue(item.fields, "Prioridad"))
                        )}`}
                      >
                        {Number(getFieldValue(item.fields, "Prioridad"))}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {getFieldValue(item.fields, "Serie")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {getFieldValue(item.fields, "OTT")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {getFieldValue(item.fields, "Modelo")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {formatDate(getFieldValue(item.fields, "FechaCompromisoComercial"))}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {getFieldValue(item.fields, "Title")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {getFieldValue(item.fields, "Asesor")}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 whitespace-nowrap">
                      {getPorcentajeAvance(item.fields)}%
                    </td>
                    {(() => {
                      // Usar el mismo orden de fases que en el header
                      const fasesIncompletas: number[] = [];
                      const fasesCompletas: number[] = [];
                      
                      for (let i = 1; i <= 16; i++) {
                        const tieneIncompletas = items.some((item) => {
                          const faseValue = getFieldValue(item.fields, `F${i}`) || "0%";
                          return faseValue !== "100%";
                        });
                        
                        if (tieneIncompletas) {
                          fasesIncompletas.push(i);
                        } else {
                          fasesCompletas.push(i);
                        }
                      }
                      
                      const fasesOrdenadas = [...fasesIncompletas, ...fasesCompletas];
                      
                      return fasesOrdenadas.map((num) => {
                        const porcentaje = getFieldValue(item.fields, `F${num}`) || "0%";
                        return (
                          <td
                            key={`${item.id}-F${num}`}
                            className="px-3 py-3 text-center"
                          >
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-bold rounded ${getFaseColor(
                                porcentaje
                              )}`}
                            >
                              {porcentaje}
                            </span>
                          </td>
                        );
                      });
                    })()}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Leyenda */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-medium text-gray-700">Leyenda de Fases:</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2 py-1 text-xs font-bold rounded bg-green-500 text-white">
                100%
              </span>
              <span className="text-gray-600">Completada</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2 py-1 text-xs font-bold rounded bg-yellow-500 text-white">
                50%
              </span>
              <span className="text-gray-600">En Progreso</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2 py-1 text-xs font-bold rounded bg-red-500 text-white">
                0%
              </span>
              <span className="text-gray-600">No Iniciada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReal;
