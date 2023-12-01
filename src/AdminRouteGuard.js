import React from "react";
import { useNavigate } from "react-router-dom";
import { useIsUserAdmin } from "./AuthContext"; // Asegúrate de importar la función useIsUserAdmin desde tu AuthContext

const AdminRouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const isUserAdmin = useIsUserAdmin();

  if (!isUserAdmin) {
    navigate("/");
    return null; // No renderiza el contenido protegido
  }

  // Si el usuario es un administrador, renderiza el contenido protegido
  return children;
};

export default AdminRouteGuard;
