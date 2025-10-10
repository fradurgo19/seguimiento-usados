/**
 * Hook personalizado para manejar datos de SharePoint
 * Facilita el uso del servicio de SharePoint en componentes
 */

import { useState, useEffect, useCallback } from "react";
import {
  sharePointService,
  SharePointListItem,
} from "../services/sharePointService";

interface UseSharePointDataResult {
  items: SharePointListItem[];
  columns: any[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useSharePointData = (
  autoLoad: boolean = true
): UseSharePointDataResult => {
  const [items, setItems] = useState<SharePointListItem[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [itemsData, columnsData] = await Promise.all([
        sharePointService.getListItems(),
        sharePointService.getListColumns(),
      ]);

      setItems(itemsData);
      const visibleColumns = columnsData.filter(
        (col) => !col.hidden && !col.name.startsWith("_")
      );
      setColumns(visibleColumns);
    } catch (err: any) {
      console.error("Error cargando datos:", err);
      setError(err.message || "Error al cargar los datos de SharePoint");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  return {
    items,
    columns,
    isLoading,
    error,
    refresh: loadData,
  };
};
