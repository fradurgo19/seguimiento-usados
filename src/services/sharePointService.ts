/**
 * Servicio de SharePoint
 * Maneja las operaciones con listas de SharePoint usando Microsoft Graph API
 */

import axios, { AxiosInstance } from "axios";
import { authService } from "./authService";
import { sharePointConfig } from "../config/authConfig";

export interface SharePointListItem {
  id: string;
  fields: Record<string, any>;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
}

export interface SharePointListResponse {
  value: SharePointListItem[];
  "@odata.nextLink"?: string;
}

class SharePointService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: sharePointConfig.graphEndpoint,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para agregar el token en cada petición
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await authService.getAccessToken();
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("Error obteniendo token:", error);
          throw error;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Extrae el site ID desde la URL del sitio
   */
  private async getSiteId(): Promise<string> {
    try {
      const siteUrl = sharePointConfig.siteUrl;
      const url = new URL(siteUrl);
      const hostname = url.hostname;
      const sitePath = url.pathname;

      const response = await this.axiosInstance.get(
        `/sites/${hostname}:${sitePath}`
      );
      return response.data.id;
    } catch (error) {
      console.error("Error obteniendo site ID:", error);
      throw error;
    }
  }

  /**
   * Obtiene el ID de la lista por nombre
   */
  private async getListId(siteId: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get(`/sites/${siteId}/lists`);

      const lists = response.data.value;
      const list = lists.find(
        (l: any) =>
          l.displayName === sharePointConfig.listName ||
          l.name === sharePointConfig.listName
      );

      if (!list) {
        throw new Error(
          `No se encontró la lista: ${sharePointConfig.listName}`
        );
      }

      return list.id;
    } catch (error) {
      console.error("Error obteniendo list ID:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los items de la lista de SharePoint (con paginación)
   */
  async getListItems(): Promise<SharePointListItem[]> {
    try {
      const siteId = await this.getSiteId();
      const listId = await this.getListId(siteId);

      let allItems: SharePointListItem[] = [];
      let nextLink: string | undefined = undefined;
      let pageCount = 0;

      // Iterar hasta obtener todos los registros usando paginación
      do {
        pageCount++;
        const url = nextLink 
          ? nextLink // Si hay nextLink, usarlo (ya incluye la URL completa)
          : `/sites/${siteId}/lists/${listId}/items?$expand=fields&$top=5000&$orderby=Id desc`;

        const response = await this.axiosInstance.get<SharePointListResponse>(url);

        if (response.data.value && response.data.value.length > 0) {
          allItems = allItems.concat(response.data.value);
          console.log(`📄 Página ${pageCount}: ${response.data.value.length} registros (Total acumulado: ${allItems.length})`);
        }

        // Verificar si hay más páginas
        nextLink = response.data["@odata.nextLink"];
      } while (nextLink);

      console.log(`✅ Total de registros cargados desde SharePoint: ${allItems.length}`);

      // Debug: Mostrar las claves de los campos del primer item para identificar nombres internos
      if (allItems.length > 0) {
        console.log("🔍 Claves de campos disponibles en SharePoint:");
        console.log(Object.keys(allItems[0].fields));
        console.log("📋 Primeros 5 registros (IDs y Títulos):", 
          allItems.slice(0, 5).map(i => ({ 
            id: i.id, 
            title: i.fields.Title || i.fields.field_0 || 'Sin título',
            serie: i.fields.field_0 || i.fields.Serie || 'Sin serie'
          }))
        );
      }

      return allItems;
    } catch (error) {
      console.error("Error obteniendo items de la lista:", error);
      throw error;
    }
  }

  /**
   * Obtiene un item específico por ID
   */
  async getListItemById(itemId: string): Promise<SharePointListItem> {
    try {
      const siteId = await this.getSiteId();
      const listId = await this.getListId(siteId);

      const response = await this.axiosInstance.get(
        `/sites/${siteId}/lists/${listId}/items/${itemId}?expand=fields`
      );

      return response.data;
    } catch (error) {
      console.error("Error obteniendo item:", error);
      throw error;
    }
  }

  /**
   * Crea un nuevo item en la lista
   */
  async createListItem(
    fields: Record<string, any>
  ): Promise<SharePointListItem> {
    try {
      const siteId = await this.getSiteId();
      const listId = await this.getListId(siteId);

      const response = await this.axiosInstance.post(
        `/sites/${siteId}/lists/${listId}/items`,
        { fields }
      );

      return response.data;
    } catch (error) {
      console.error("Error creando item:", error);
      throw error;
    }
  }

  /**
   * Actualiza un item existente
   */
  async updateListItem(
    itemId: string,
    fields: Record<string, any>
  ): Promise<SharePointListItem> {
    try {
      const siteId = await this.getSiteId();
      const listId = await this.getListId(siteId);

      console.log(`🔄 Actualizando item ID: ${itemId}`);
      console.log(`📝 Campos a actualizar:`, fields);
      console.log(`🔗 URL completa: /sites/${siteId}/lists/${listId}/items/${itemId}/fields`);

      // Microsoft Graph API - PATCH directo a fields
      const response = await this.axiosInstance.patch(
        `/sites/${siteId}/lists/${listId}/items/${itemId}/fields`,
        fields,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Item actualizado exitosamente`);
      return response.data;
    } catch (error: any) {
      console.error("Error actualizando item:", error);
      console.error("Detalles del error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        itemId: itemId,
      });
      throw error;
    }
  }

  /**
   * Elimina un item
   */
  async deleteListItem(itemId: string): Promise<void> {
    try {
      const siteId = await this.getSiteId();
      const listId = await this.getListId(siteId);

      await this.axiosInstance.delete(
        `/sites/${siteId}/lists/${listId}/items/${itemId}`
      );
    } catch (error) {
      console.error("Error eliminando item:", error);
      throw error;
    }
  }

  /**
   * Obtiene los metadatos de la lista (columnas, tipos, etc.)
   */
  async getListMetadata(): Promise<any> {
    try {
      const siteId = await this.getSiteId();
      const listId = await this.getListId(siteId);

      const response = await this.axiosInstance.get(
        `/sites/${siteId}/lists/${listId}`
      );

      return response.data;
    } catch (error) {
      console.error("Error obteniendo metadatos:", error);
      throw error;
    }
  }

  /**
   * Obtiene las columnas de la lista
   */
  async getListColumns(): Promise<any[]> {
    try {
      const siteId = await this.getSiteId();
      const listId = await this.getListId(siteId);

      const response = await this.axiosInstance.get(
        `/sites/${siteId}/lists/${listId}/columns`
      );

      return response.data.value;
    } catch (error) {
      console.error("Error obteniendo columnas:", error);
      throw error;
    }
  }
}

// Singleton
export const sharePointService = new SharePointService();
