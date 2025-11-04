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
  const equiposPorAsesor = items.reduce((acc: any, item) => {
    const asesor = getFieldValue(item.fields, "Asesor") || "Sin asignar";
    acc[asesor] = (acc[asesor] || 0) + 1;
    return acc;
  }, {});

  const asesoresData = Object.entries(equiposPorAsesor).map(
    ([name, value]) => ({
      name,
      cantidad: value,
    })
  );

  // Datos por Sede
  const equiposPorSede = items.reduce((acc: any, item) => {
    const sede = getFieldValue(item.fields, "Sede") || "Sin sede";
    acc[sede] = (acc[sede] || 0) + 1;
    return acc;
  }, {});

  const sedesData = Object.entries(equiposPorSede).map(([name, value]) => ({
    name,
    value,
  }));

  // Datos por Modelo
  const equiposPorModelo = items.reduce((acc: any, item) => {
    const modelo = getFieldValue(item.fields, "Modelo") || "Sin modelo";
    acc[modelo] = (acc[modelo] || 0) + 1;
    return acc;
  }, {});

  const modelosData = Object.entries(equiposPorModelo)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .slice(0, 5); // Top 5 modelos


  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Equipos
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
            Equipos por Asesor
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

        {/* Tabla de progreso por equipo y Últimos Registros - Dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-1 lg:col-span-2">
          {/* Tabla de progreso por equipo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Progreso por Equipo
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {sortedItems.slice(0, 20).map((item) => (
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

          {/* Últimos Registros Creados y Editados */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Últimos Registros Creados y Editados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Últimos Creados */}
              <div className="border border-blue-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
                <h4 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2 border-b border-blue-200 pb-2">
                  <TrendingUp className="w-4 h-4" />
                  Recientemente Creados
                </h4>
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                  {items
                    .filter((item) => item.createdDateTime)
                    .sort((a, b) => {
                      const dateA = new Date(a.createdDateTime || 0).getTime();
                      const dateB = new Date(b.createdDateTime || 0).getTime();
                      return dateB - dateA; // Más reciente primero
                    })
                    .slice(0, 12)
                    .map((item) => {
                      const createdDate = item.createdDateTime 
                        ? new Date(item.createdDateTime).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-";
                      return (
                        <div
                          key={`created-${item.id}`}
                          className="p-3 bg-white rounded-lg border border-blue-300 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {getFieldValue(item.fields, "Title") || getFieldValue(item.fields, "Serie") || "Sin título"}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                📦 {getFieldValue(item.fields, "Modelo")} • 👤 {getFieldValue(item.fields, "Asesor")}
                              </p>
                            </div>
                            <div className="ml-3 text-right">
                              <p className="text-xs font-medium text-blue-700 whitespace-nowrap">
                                {createdDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {items.filter((item) => item.createdDateTime).length === 0 && (
                    <p className="text-center text-gray-500 py-4 text-sm">
                      No hay registros creados
                    </p>
                  )}
                </div>
              </div>

              {/* Últimos Editados */}
              <div className="border border-green-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-white">
                <h4 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2 border-b border-green-200 pb-2">
                  <Clock className="w-4 h-4" />
                  Recientemente Editados
                </h4>
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                  {items
                    .filter((item) => item.lastModifiedDateTime)
                    .sort((a, b) => {
                      const dateA = new Date(a.lastModifiedDateTime || 0).getTime();
                      const dateB = new Date(b.lastModifiedDateTime || 0).getTime();
                      return dateB - dateA; // Más reciente primero
                    })
                    .slice(0, 12)
                    .map((item) => {
                      const modifiedDate = item.lastModifiedDateTime 
                        ? new Date(item.lastModifiedDateTime).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-";
                      return (
                        <div
                          key={`modified-${item.id}`}
                          className="p-3 bg-white rounded-lg border border-green-300 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {getFieldValue(item.fields, "Title") || getFieldValue(item.fields, "Serie") || "Sin título"}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                📦 {getFieldValue(item.fields, "Modelo")} • 👤 {getFieldValue(item.fields, "Asesor")}
                              </p>
                            </div>
                            <div className="ml-3 text-right">
                              <p className="text-xs font-medium text-green-700 whitespace-nowrap">
                                {modifiedDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {items.filter((item) => item.lastModifiedDateTime).length === 0 && (
                    <p className="text-center text-gray-500 py-4 text-sm">
                      No hay registros editados
                    </p>
                  )}
                </div>
              </div>
            </div>
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
                <p className="text-xs font-medium text-gray-600">F{num}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {porcentaje.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {completadas}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Urgentes (Próximos a Vencer) - Ancho completo */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Equipos Próximos a Vencer (Días Restantes)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items
            .filter((item) => {
              const diasRestantes = Number(getFieldValue(item.fields, "DiasRestantes")) || 0;
              const avance = getPorcentajeAvance(item.fields);
              // Mostrar los que tienen días restantes >= 0 (incluye 0) Y que no están al 100%
              return diasRestantes >= 0 && avance < 100;
            })
            .sort(
              (a, b) =>
                (Number(getFieldValue(a.fields, "DiasRestantes")) || 0) - (Number(getFieldValue(b.fields, "DiasRestantes")) || 0)
            )
            .slice(0, 15)
            .map((item) => (
              <div
                key={item.id}
                className="flex flex-col p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {getFieldValue(item.fields, "Title")} - {getFieldValue(item.fields, "Modelo")}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {getFieldValue(item.fields, "Asesor")}
                    </p>
                  </div>
                </div>
                <div className="text-center mt-auto">
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
              return diasRestantes >= 0 && avance < 100;
            }).length === 0 && (
            <div className="col-span-full">
              <p className="text-center text-gray-500 py-4">
                No hay equipos próximos a vencer
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabla Detallada con Fases */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Tabla Detallada - Progreso de Fases por Equipo
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Vista completa del estado de cada fase (F1-F16) por equipo. Las fases incompletas aparecen primero.
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
                <th className="px-4 py-3 sticky left-0 bg-blue-100 text-left text-xs font-medium text-gray-700 uppercase z-20 border-r-2 border-blue-200" style={{ minWidth: '100px' }}>
                  Prioridad
                </th>
                <th className="px-4 py-3 sticky bg-blue-100 text-left text-xs font-medium text-gray-700 uppercase z-20 border-r-2 border-blue-200" style={{ left: '100px', minWidth: '120px' }}>
                  Serie
                </th>
                <th className="px-4 py-3 sticky bg-blue-100 text-left text-xs font-medium text-gray-700 uppercase z-20 border-r-2 border-blue-200" style={{ left: '220px', minWidth: '120px' }}>
                  OTT
                </th>
                <th className="px-4 py-3 sticky bg-blue-100 text-left text-xs font-medium text-gray-700 uppercase z-20 border-r-2 border-blue-200" style={{ left: '340px', minWidth: '120px' }}>
                  Modelo
                </th>
                <th className="px-4 py-3 sticky bg-blue-100 text-left text-xs font-medium text-gray-700 uppercase z-20 border-r-4 border-blue-300 shadow-lg" style={{ left: '460px', minWidth: '120px' }}>
                  Asesor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha Compromiso
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  % Avance
                </th>
                {/* Fases ordenadas de F1 a F16 de izquierda a derecha */}
                {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                  <th
                    key={`F${num}`}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                  >
                    F{num}
                  </th>
                ))}
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

                // Prioridad es solo un número, sin colores especiales
                const prioridadValue = Number(getFieldValue(item.fields, "Prioridad")) || 0;

                const getFaseColor = (porcentaje: string) => {
                  if (porcentaje === "100%") return "bg-green-500 text-white";
                  if (porcentaje === "75%") return "bg-lime-500 text-white";
                  if (porcentaje === "50%") return "bg-yellow-500 text-white";
                  if (porcentaje === "25%") return "bg-orange-500 text-white";
                  return "bg-red-500 text-white";
                };

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 sticky left-0 bg-blue-50 z-10 border-r-2 border-blue-200" style={{ minWidth: '100px' }}>
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-gray-900">
                        {prioridadValue}
                      </span>
                    </td>
                    <td className="px-4 py-3 sticky bg-blue-50 text-sm text-gray-900 whitespace-nowrap z-10 border-r-2 border-blue-200" style={{ left: '100px', minWidth: '120px' }}>
                      {getFieldValue(item.fields, "Serie")}
                    </td>
                    <td className="px-4 py-3 sticky bg-blue-50 text-sm text-gray-900 whitespace-nowrap z-10 border-r-2 border-blue-200" style={{ left: '220px', minWidth: '120px' }}>
                      {getFieldValue(item.fields, "OTT")}
                    </td>
                    <td className="px-4 py-3 sticky bg-blue-50 text-sm text-gray-900 whitespace-nowrap z-10 border-r-2 border-blue-200" style={{ left: '340px', minWidth: '120px' }}>
                      {getFieldValue(item.fields, "Modelo")}
                    </td>
                    <td className="px-4 py-3 sticky bg-blue-50 text-sm text-gray-900 whitespace-nowrap z-10 border-r-4 border-blue-300 shadow-lg" style={{ left: '460px', minWidth: '120px' }}>
                      {getFieldValue(item.fields, "Asesor")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {formatDate(getFieldValue(item.fields, "FechaCompromisoComercial"))}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {getFieldValue(item.fields, "Title")}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 whitespace-nowrap">
                      {getPorcentajeAvance(item.fields)}%
                    </td>
                    {/* Fases ordenadas de F1 a F16 de izquierda a derecha */}
                    {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => {
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
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Leyenda */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="font-semibold text-gray-800">📊 Leyenda de Fases:</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-3 py-1 text-xs font-bold rounded-lg bg-green-500 text-white shadow-sm">
                100%
              </span>
              <span className="text-gray-700 font-medium">Completada</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-3 py-1 text-xs font-bold rounded-lg bg-lime-500 text-white shadow-sm">
                75%
              </span>
              <span className="text-gray-700 font-medium">Avanzada</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-3 py-1 text-xs font-bold rounded-lg bg-yellow-500 text-white shadow-sm">
                50%
              </span>
              <span className="text-gray-700 font-medium">En Progreso</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-3 py-1 text-xs font-bold rounded-lg bg-orange-500 text-white shadow-sm">
                25%
              </span>
              <span className="text-gray-700 font-medium">Iniciada</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-3 py-1 text-xs font-bold rounded-lg bg-red-500 text-white shadow-sm">
                0%
              </span>
              <span className="text-gray-700 font-medium">No Iniciada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReal;
