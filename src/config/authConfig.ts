/**
 * Configuración de autenticación con Microsoft Azure AD
 * Documentación: https://docs.microsoft.com/en-us/azure/active-directory/develop/
 */

import { Configuration, PopupRequest } from "@azure/msal-browser";

// Configuración MSAL
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_TENANT_ID || "common"
    }`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage", // Usar sessionStorage para mejor seguridad
    storeAuthStateInCookie: false, // Set true si hay problemas con IE11 o Edge
  },
};

// Scopes necesarios para Microsoft Graph
export const loginRequest: PopupRequest = {
  scopes: ["User.Read", "Sites.Read.All", "Sites.ReadWrite.All"],
};

// Scopes necesarios para SharePoint REST API (adjuntos)
export const sharePointRequest: PopupRequest = {
  scopes: [
    `${(import.meta.env.VITE_SHAREPOINT_SITE_URL || "").replace(/\/$/, "")}/.default`
  ],
};

// Configuración de SharePoint
export const sharePointConfig = {
  siteUrl: import.meta.env.VITE_SHAREPOINT_SITE_URL || "",
  listName: import.meta.env.VITE_SHAREPOINT_LIST_NAME || "",
  graphEndpoint: "https://graph.microsoft.com/v1.0",
};
