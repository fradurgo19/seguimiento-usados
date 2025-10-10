/**
 * Dashboard con estadísticas y gráficos
 * Basado en la estructura real de SharePoint
 */

import React from "react";
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

interface DashboardRealProps {
  items: SharePointListItem[];
}

const DashboardReal: React.FC<DashboardRealProps> = ({ items }) => {
  // Calcular estadísticas
  const completados = items.filter(
    (i) => (i.fields.PorcentajeAvanceTotal || 0) === 100
  ).length;
  const enProceso = items.filter(
    (i) =>
      (i.fields.PorcentajeAvanceTotal || 0) > 0 &&
      (i.fields.PorcentajeAvanceTotal || 0) < 100
  ).length;
  const pendientes = items.filter(
    (i) => (i.fields.PorcentajeAvanceTotal || 0) === 0
  ).length;

  const stats = {
    total: items.length,
    completados,
    enProceso,
    pendientes,
    promedioAvance:
      items.reduce(
        (sum, i) => sum + (Number(i.fields.PorcentajeAvanceTotal) || 0),
        0
      ) / items.length || 0,
    diasPromedioRestantes:
      items.reduce((sum, i) => sum + (Number(i.fields.DiasRestantes) || 0), 0) /
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
    const asesor = item.fields.Asesor || "Sin asignar";
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
    const sede = item.fields.Sede || "Sin sede";
    acc[sede] = (acc[sede] || 0) + 1;
    return acc;
  }, {});

  const sedesData = Object.entries(vehiculosPorSede).map(([name, value]) => ({
    name,
    value,
  }));

  // Datos por Modelo
  const vehiculosPorModelo = items.reduce((acc: any, item) => {
    const modelo = item.fields.Modelo || "Sin modelo";
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
    const prioridad = item.fields.Prioridad || 0;
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
            {items.slice(0, 10).map((item) => (
              <div key={item.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900">
                    {item.fields.Title}
                  </span>
                  <span className="text-gray-600">
                    {item.fields.PorcentajeAvanceTotal || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${item.fields.PorcentajeAvanceTotal || 0}%`,
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
              (item) => item.fields[`F${num}`] === "Completado"
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
            .filter((item) => (item.fields.DiasRestantes || 0) < 10)
            .sort(
              (a, b) =>
                (a.fields.DiasRestantes || 0) - (b.fields.DiasRestantes || 0)
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
                      {item.fields.Title} - {item.fields.Modelo}
                    </p>
                    <p className="text-sm text-gray-600">
                      Asesor: {item.fields.Asesor}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">
                    {item.fields.DiasRestantes || 0}
                  </p>
                  <p className="text-xs text-gray-600">días restantes</p>
                </div>
              </div>
            ))}
          {items.filter((item) => (item.fields.DiasRestantes || 0) < 10)
            .length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No hay vehículos próximos a vencer
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardReal;
