import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  // const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Al cargar el componente, intenta recuperar la información de autenticación desde las cookies.
    checkAuthentication();
  }, []);

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        formData,
        { withCredentials: true }
      );

      const authToken = response.data.token; // Assuming your server sends back a token
      

      if (authToken) {
        // Store the token in localStorage
        localStorage.setItem("authToken", authToken);
        // Store the token in a cookie
        Cookies.set("authToken", authToken, { expires: 1, secure: true });
      } else {
        const newAuthToken = uuidv4();
        // Store the generated token in a cookie
        Cookies.set("authToken", newAuthToken, { expires: 1, secure: true });
        // Store the generated token in localStorage
      localStorage.setItem("authToken", newAuthToken);
      }
      

      setAuthenticatedUser(response.data.user);

      if (response.data.Login) {
        navigate("/");
      }
    } catch (error) {
      // Handle login errors
      console.error("Error durante el inicio de sesión:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/logout`, {
        withCredentials: true,
      });

      setAuthenticatedUser(null);

      // Remove the token from the cookie
      Cookies.remove("authToken");

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const checkAuthentication = async () => {
    try {
      // Retrieve the token from the cookie
      const authToken = Cookies.get("authToken");

      if (authToken) {
        // Include the token in the axios request header
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/verify-auth`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (response.data.isAuthenticated) {
          setAuthenticatedUser(response.data.user);
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };

  const contextValue = {
    authenticatedUser,
    setAuthenticatedUser,
    handleLogout,
    handleLogin,
    checkAuthentication,
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
