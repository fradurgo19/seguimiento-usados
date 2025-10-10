/**
 * Componente de filtros para el Dashboard
 */

import React from "react";
import { Filter, X } from "lucide-react";
import { SharePointListItem } from "../services/sharePointService";

interface DashboardFiltersProps {
  items: SharePointListItem[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  sede: string;
  asesor: string;
  cliente: string;
  fase: string;
  observaciones: string;
  ciclo: string;
  fechaCompromisoDesde: string;
  fechaCompromisoHasta: string;
  fechaInicioDesde: string;
  fechaInicioHasta: string;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  items,
  filters,
  onFilterChange,
}) => {
  // Extraer opciones únicas de los datos
  const sedes = [...new Set(items.map((i) => i.fields.Sede).filter(Boolean))].sort();
  const asesores = [...new Set(items.map((i) => i.fields.Asesor).filter(Boolean))].sort();
  const clientes = [...new Set(items.map((i) => i.fields.Title).filter(Boolean))].sort();
  const observaciones = [...new Set(items.map((i) => i.fields.Observaciones).filter(Boolean))].sort();
  const ciclos = [...new Set(items.map((i) => i.fields.Ciclo).filter(Boolean))].sort();

  const handleChange = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      sede: "",
      asesor: "",
      cliente: "",
      fase: "",
      observaciones: "",
      ciclo: "",
      fechaCompromisoDesde: "",
      fechaCompromisoHasta: "",
      fechaInicioDesde: "",
      fechaInicioHasta: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              Filtros activos
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Sede */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sede
          </label>
          <select
            value={filters.sede}
            onChange={(e) => handleChange("sede", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las sedes</option>
            {sedes.map((sede) => (
              <option key={sede} value={sede}>
                {sede}
              </option>
            ))}
          </select>
        </div>

        {/* Asesor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asesor
          </label>
          <select
            value={filters.asesor}
            onChange={(e) => handleChange("asesor", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los asesores</option>
            {asesores.map((asesor) => (
              <option key={asesor} value={asesor}>
                {asesor}
              </option>
            ))}
          </select>
        </div>

        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <select
            value={filters.cliente}
            onChange={(e) => handleChange("cliente", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los clientes</option>
            {clientes.map((cliente) => (
              <option key={cliente} value={cliente}>
                {cliente}
              </option>
            ))}
          </select>
        </div>

        {/* Fase */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fase (F1-F16)
          </label>
          <select
            value={filters.fase}
            onChange={(e) => handleChange("fase", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las fases</option>
            {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
              <option key={`F${num}`} value={`F${num}`}>
                Fase {num} (F{num})
              </option>
            ))}
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <select
            value={filters.observaciones}
            onChange={(e) => handleChange("observaciones", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            {observaciones.map((obs) => (
              <option key={obs} value={obs}>
                {obs}
              </option>
            ))}
          </select>
        </div>

        {/* Ciclo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciclo
          </label>
          <select
            value={filters.ciclo}
            onChange={(e) => handleChange("ciclo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los ciclos</option>
            {ciclos.map((ciclo) => (
              <option key={ciclo} value={ciclo}>
                {ciclo}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha Compromiso Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Compromiso (Desde)
          </label>
          <input
            type="date"
            value={filters.fechaCompromisoDesde}
            onChange={(e) => handleChange("fechaCompromisoDesde", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Fecha Compromiso Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Compromiso (Hasta)
          </label>
          <input
            type="date"
            value={filters.fechaCompromisoHasta}
            onChange={(e) => handleChange("fechaCompromisoHasta", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Fecha Inicio Ciclo Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio Ciclo (Desde)
          </label>
          <input
            type="date"
            value={filters.fechaInicioDesde}
            onChange={(e) => handleChange("fechaInicioDesde", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Fecha Inicio Ciclo Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio Ciclo (Hasta)
          </label>
          <input
            type="date"
            value={filters.fechaInicioHasta}
            onChange={(e) => handleChange("fechaInicioHasta", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;

