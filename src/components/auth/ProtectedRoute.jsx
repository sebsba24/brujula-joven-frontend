import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // No autenticado → redirigir
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Autenticado → mostrar contenido
  return children;
}