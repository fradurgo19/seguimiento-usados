/**
 * Tipos TypeScript para SharePoint
 * Define las interfaces y tipos usados en la aplicación
 */

export interface SharePointColumn {
  id: string;
  name: string;
  displayName: string;
  type: string;
  hidden: boolean;
  required: boolean;
  description?: string;
}

export interface SharePointListMetadata {
  id: string;
  displayName: string;
  name: string;
  description?: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
}

export interface SharePointUser {
  displayName: string;
  email: string;
  id: string;
}

export interface SharePointLookupValue {
  LookupId: number;
  LookupValue: string;
}

// Tipos de campos comunes en SharePoint
export type SharePointFieldValue =
  | string
  | number
  | boolean
  | Date
  | SharePointLookupValue
  | SharePointUser
  | null
  | undefined;
