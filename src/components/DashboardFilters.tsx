/**
 * Componente de filtros para el Dashboard
 * Implementa filtros en cascada (indexados) donde cada dropdown solo muestra
 * opciones relacionadas con los datos ya filtrados por otros filtros
 */

import React, { useMemo } from "react";
import { Filter, X } from "lucide-react";
import { SharePointListItem } from "../services/sharePointService";
import { getFieldValue } from "../utils/sharePointFieldMapping";

interface DashboardFiltersProps {
  items: SharePointListItem[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  sede: string;
  asesor: string;
  cliente: string;
  serie: string;
  fase: string;
  observaciones: string;
  ciclo: string;
  fechaCompromisoDesde: string;
  fechaCompromisoHasta: string;
  fechaFinalDesde: string;
  fechaFinalHasta: string;
  porcentajeAvance: string; // "100" | ">0" | "0" | ""
}

// Helper para obtener porcentaje de avance
const getPorcentajeAvance = (fields: Record<string, any>): number => {
  let porcentaje = getFieldValue(fields, "PorcentajeAvanceTotal");

  if (typeof porcentaje === "string") {
    porcentaje =
      parseFloat(porcentaje.replace("%", "").replace(/[^0-9.]/g, "")) || 0;
  } else {
    porcentaje = Number(porcentaje) || 0;
  }

  return porcentaje;
};

// Helper para aplicar filtros (excepto el campo excluido)
const applyFiltersExcept = (
  items: SharePointListItem[],
  filters: FilterState,
  excludeField: keyof FilterState
): SharePointListItem[] => {
  return items.filter((item) => {
    // Sede
    if (
      excludeField !== "sede" &&
      filters.sede &&
      getFieldValue(item.fields, "Sede") !== filters.sede
    ) {
      return false;
    }

    // Asesor
    if (
      excludeField !== "asesor" &&
      filters.asesor &&
      getFieldValue(item.fields, "Asesor") !== filters.asesor
    ) {
      return false;
    }

    // Cliente
    if (
      excludeField !== "cliente" &&
      filters.cliente &&
      getFieldValue(item.fields, "Title") !== filters.cliente
    ) {
      return false;
    }

    // Serie
    if (
      excludeField !== "serie" &&
      filters.serie &&
      getFieldValue(item.fields, "Serie") !== filters.serie
    ) {
      return false;
    }

    // Observaciones
    if (
      excludeField !== "observaciones" &&
      filters.observaciones &&
      getFieldValue(item.fields, "Observaciones") !== filters.observaciones
    ) {
      return false;
    }

    // Ciclo
    if (
      excludeField !== "ciclo" &&
      filters.ciclo &&
      getFieldValue(item.fields, "Ciclo") !== filters.ciclo
    ) {
      return false;
    }

    // Fecha Compromiso
    if (
      excludeField !== "fechaCompromisoDesde" &&
      excludeField !== "fechaCompromisoHasta"
    ) {
      if (filters.fechaCompromisoDesde || filters.fechaCompromisoHasta) {
        const fechaCompromisoValue = getFieldValue(
          item.fields,
          "FechaCompromisoComercial"
        );
        if (fechaCompromisoValue) {
          const fechaCompromiso = new Date(fechaCompromisoValue);
          if (!isNaN(fechaCompromiso.getTime())) {
            if (filters.fechaCompromisoDesde) {
              const desde = new Date(filters.fechaCompromisoDesde);
              if (fechaCompromiso < desde) return false;
            }
            if (filters.fechaCompromisoHasta) {
              const hasta = new Date(filters.fechaCompromisoHasta);
              hasta.setHours(23, 59, 59, 999);
              if (fechaCompromiso > hasta) return false;
            }
          }
        }
      }
    }

    // Fecha Final Alistamiento
    if (
      excludeField !== "fechaFinalDesde" &&
      excludeField !== "fechaFinalHasta"
    ) {
      if (filters.fechaFinalDesde || filters.fechaFinalHasta) {
        const fechaFinalValue = getFieldValue(
          item.fields,
          "FechaFinalAlistamiento"
        );
        if (fechaFinalValue) {
          const fechaFinal = new Date(fechaFinalValue);
          if (!isNaN(fechaFinal.getTime())) {
            if (filters.fechaFinalDesde) {
              const desde = new Date(filters.fechaFinalDesde);
              if (fechaFinal < desde) return false;
            }
            if (filters.fechaFinalHasta) {
              const hasta = new Date(filters.fechaFinalHasta);
              hasta.setHours(23, 59, 59, 999);
              if (fechaFinal > hasta) return false;
            }
          }
        }
      }
    }

    // Porcentaje Avance
    if (excludeField !== "porcentajeAvance" && filters.porcentajeAvance) {
      const avance = getPorcentajeAvance(item.fields);
      if (filters.porcentajeAvance === "100" && avance !== 100) return false;
      if (filters.porcentajeAvance === ">0" && (avance === 0 || avance === 100))
        return false;
      if (filters.porcentajeAvance === "0" && avance !== 0) return false;
    }

    return true;
  });
};

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  items,
  filters,
  onFilterChange,
}) => {
  // Filtros en cascada: cada dropdown muestra solo opciones de datos ya filtrados por otros filtros

  // Sede - no depende de otros filtros categóricos
  const sedes = useMemo(() => {
    const filtered = applyFiltersExcept(items, filters, "sede");
    return [
      ...new Set(
        filtered
          .map((i) => {
            const sede = i.fields.field_28 || i.fields.Sede;
            return sede;
          })
          .filter(Boolean)
      ),
    ].sort();
  }, [items, filters]);

  // Asesor - depende de sede, ciclo, observaciones, porcentajeAvance, fechas
  const asesores = useMemo(() => {
    const filtered = applyFiltersExcept(items, filters, "asesor");
    return [
      ...new Set(
        filtered
          .map((i) => {
            const asesor = i.fields.field_4 || i.fields.Asesor;
            return asesor;
          })
          .filter(Boolean)
      ),
    ].sort();
  }, [items, filters]);

  // Cliente - depende de todos los demás filtros
  const clientes = useMemo(() => {
    const filtered = applyFiltersExcept(items, filters, "cliente");
    return [
      ...new Set(filtered.map((i) => i.fields.Title).filter(Boolean)),
    ].sort();
  }, [items, filters]);

  // Serie - depende de todos los demás filtros
  const series = useMemo(() => {
    const filtered = applyFiltersExcept(items, filters, "serie");
    return [
      ...new Set(
        filtered
          .map((i) => {
            const serie = i.fields.field_0 || i.fields.Serie;
            return serie;
          })
          .filter(Boolean)
      ),
    ].sort();
  }, [items, filters]);

  // Observaciones - depende de otros filtros
  const observaciones = useMemo(() => {
    const filtered = applyFiltersExcept(items, filters, "observaciones");
    return [
      ...new Set(
        filtered
          .map((i) => {
            const obs = i.fields.field_8 || i.fields.Observaciones;
            return obs;
          })
          .filter(Boolean)
      ),
    ].sort();
  }, [items, filters]);

  // Ciclo - depende de otros filtros
  const ciclos = useMemo(() => {
    const filtered = applyFiltersExcept(items, filters, "ciclo");
    return [
      ...new Set(
        filtered
          .map((i) => {
            const ciclo = i.fields.field_29 || i.fields.Ciclo;
            return ciclo;
          })
          .filter(Boolean)
      ),
    ].sort();
  }, [items, filters]);

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
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 w-full">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
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

        {/* Serie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serie
          </label>
          <select
            value={filters.serie}
            onChange={(e) => handleChange("serie", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las series</option>
            {series.map((serie) => (
              <option key={serie} value={serie}>
                {serie}
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

        {/* % de Avance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            % de Avance
          </label>
          <select
            value={filters.porcentajeAvance}
            onChange={(e) => handleChange("porcentajeAvance", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="100">100% (Completados)</option>
            <option value=">0">{">0% y <100%"} (En Proceso)</option>
            <option value="0">0% (Pendientes)</option>
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
            onChange={(e) =>
              handleChange("fechaCompromisoDesde", e.target.value)
            }
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
            onChange={(e) =>
              handleChange("fechaCompromisoHasta", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Fecha Final Alistamiento Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Final Alistamiento (Desde)
          </label>
          <input
            type="date"
            value={filters.fechaFinalDesde}
            onChange={(e) => handleChange("fechaFinalDesde", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Fecha Final Alistamiento Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Final Alistamiento (Hasta)
          </label>
          <input
            type="date"
            value={filters.fechaFinalHasta}
            onChange={(e) => handleChange("fechaFinalHasta", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
