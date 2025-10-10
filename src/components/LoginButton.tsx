/**
 * Componente de botón de inicio de sesión
 */

import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogIn, LogOut, Loader2 } from "lucide-react";

const LoginButton: React.FC = () => {
  const { isAuthenticated, account, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando...
      </button>
    );
  }

  if (isAuthenticated && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{account.name}</p>
          <p className="text-xs text-gray-500">{account.username}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
      <LogIn className="w-5 h-5" />
      Iniciar Sesión con Microsoft
    </button>
  );
};

export default LoginButton;
