import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useShoppingContext } from "./ShoppingContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { cartItemCount } = useShoppingContext();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogout = async () => {
    try {
      // Send a request to the server to invalidate the session
      await axios.get(`${process.env.REACT_APP_API_URL}/logout`, {
        withCredentials: true,
      });

      // Clear the state of authentication
      setAuthenticatedUser(null);

      // Redirect the user to the desired page (e.g., the homepage)
      navigate("/");
    } catch (error) {
      // Handle any errors that may occur during logout
      console.error("Error during logout:", error);

      // Clear the state of authentication even if an error occurs
      setAuthenticatedUser(null);

      // Redirect the user to the desired page (e.g., the homepage)
      navigate("/");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        loginData,
        {
          withCredentials: true,
        }
      );

      setAuthenticatedUser(response.data.user);

      if (response.data.Login) {
        setError(null);
        if (cartItemCount > 0) {
          navigate("/checkout");
        } else if (response.data.user.level === "admin") {
          navigate("/registro-de-pedidos");
        } else if (response.data.user.level === "user") {
          navigate("/mis-pedidos");
        }
      }
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        setError(error.response.data.message);
      } else {
        setError("Error de inicio de sesión. Intenta nuevamente más tarde.");
      }
    } else {
      setError("Error de red. Verifica tu conexión a Internet.");
    }
  };

  const checkAuthentication = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/verify-auth`,
        {
          withCredentials: true, // Configurar para enviar cookies
        }
      );

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
    handleLogout,
    handleLogin,
    loginData,
    setLoginData,
    error,
    setError,
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
