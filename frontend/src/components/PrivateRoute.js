// frontend/src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role"); // ✅ stocké lors de la connexion

  // ✅ Si pas de token → redirection vers /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Vérifie si le rôle est autorisé
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirige vers la page correspondant au rôle
    if (role === "CLIENT") {
      return <Navigate to="/espace-client" replace />;
    }
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
