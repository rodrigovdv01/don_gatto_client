import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Send a request to the server to invalidate the session
      await axios.get(`${process.env.REACT_APP_API_URL}/logout`, {
        withCredentials: true,
      });
  
      // Clear the state of authentication
      setAuthenticatedUser(null);
  
      // Remove the authToken cookie
      Cookies.remove("authToken");
      Cookies.remove("authTokenServer");
  
      // Redirect the user to the desired page (e.g., the homepage)
      navigate("/");
    } catch (error) {
      // Handle any errors that may occur during logout
      console.error("Error during logout:", error);
  
      // Clear the state of authentication even if an error occurs
      setAuthenticatedUser(null);
  
      // Remove the authToken cookie even if an error occurs
      Cookies.remove("authToken");
      Cookies.remove("authTokenServer");
  
      // Redirect the user to the desired page (e.g., the homepage)
      navigate("/");
    }
  };
  

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        formData,
        {
          withCredentials: true, // Configurar para enviar cookies
        }
      );

      // Obtener la cookie del servidor
      const authTokenCookie = response.headers["set-cookie"];
      // Almacenarla en tu aplicación
      Cookies.set("authToken", authTokenCookie);
      setAuthenticatedUser(response.data.user);
      setError(null);
      if (response.data.Login) {  
        navigate("/");
      }
    } catch (error) {
      // Manejo de errores de inicio de sesión
      if (error.response) {
        if (error.response.status === 401) {
          if (error.response.data.message === "Correo no registrado") {
            setError("Correo no registrado. Regístrate si eres nuevo.");
          } else {
            setError("Contraseña incorrecta. Verifica tu contraseña.");
          }
        } else {
          setError("Error de inicio de sesión. Intenta nuevamente más tarde.");
        }
      } else {
        setError("Error de red. Verifica tu conexión a Internet.");
      }
    }
  };

  const checkAuthentication = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/verify-auth`, {
        withCredentials: true, // Configurar para enviar cookies
      });

      if (response.data.isAuthenticated) {
        setAuthenticatedUser(response.data.user);
      }
    } catch (error) {
      console.error("Error al verificar la autenticación:", error);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const contextValue = {
    authenticatedUser,
    setAuthenticatedUser,
    checkAuthentication,
    handleLogout,
    handleLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useIsUserAdmin = () => {
  const { authenticatedUser } = useAuth();
  return authenticatedUser && authenticatedUser.level === "admin";
};
