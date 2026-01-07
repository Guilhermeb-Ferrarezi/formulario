import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redireciona para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}