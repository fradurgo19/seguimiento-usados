/**
 * Servicio de Autenticación
 * Maneja la autenticación con Microsoft Azure AD usando MSAL
 */

import {
  PublicClientApplication,
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../config/authConfig";

class AuthService {
  private msalInstance: PublicClientApplication;

  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  /**
   * Inicializa MSAL
   */
  async initialize(): Promise<void> {
    await this.msalInstance.initialize();
  }

  /**
   * Inicia sesión con popup
   */
  async login(): Promise<AuthenticationResult> {
    try {
      const response = await this.msalInstance.loginPopup(loginRequest);
      return response;
    } catch (error) {
      console.error("Error durante el login:", error);
      throw error;
    }
  }

  /**
   * Cierra sesión
   */
  async logout(): Promise<void> {
    const account = this.getAccount();
    if (account) {
      await this.msalInstance.logoutPopup({
        account: account,
      });
    }
  }

  /**
   * Obtiene la cuenta activa
   */
  getAccount(): AccountInfo | null {
    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      return accounts[0];
    }
    return null;
  }

  /**
   * Obtiene el token de acceso
   * Intenta obtenerlo silenciosamente, si falla solicita interacción
   */
  async getAccessToken(): Promise<string> {
    const account = this.getAccount();

    if (!account) {
      throw new Error("No hay cuenta activa. Por favor inicia sesión.");
    }

    try {
      // Intenta obtener el token silenciosamente
      const response = await this.msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });
      return response.accessToken;
    } catch (error) {
      // Si falla, solicita interacción del usuario
      if (error instanceof InteractionRequiredAuthError) {
        const response = await this.msalInstance.acquireTokenPopup(
          loginRequest
        );
        return response.accessToken;
      }
      throw error;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.getAccount() !== null;
  }

  /**
   * Obtiene la instancia de MSAL
   */
  getMsalInstance(): PublicClientApplication {
    return this.msalInstance;
  }
}

// Singleton
export const authService = new AuthService();
