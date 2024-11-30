// ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Verificar si existe un token

  return token ? children : <Navigate to="/" />; // Redirigir al login si no hay token
};

export default ProtectedRoute;
