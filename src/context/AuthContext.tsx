/**
 * Contexto de Autenticación
 * Proporciona el estado de autenticación a toda la aplicación
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AccountInfo } from "@azure/msal-browser";
import { authService } from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  account: AccountInfo | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await authService.initialize();
      const currentAccount = authService.getAccount();

      if (currentAccount) {
        setAccount(currentAccount);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error inicializando autenticación:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      const response = await authService.login();
      setAccount(response.account);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error durante el login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setAccount(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error durante el logout:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    account,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
