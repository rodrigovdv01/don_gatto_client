import React from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../../AuthContext";
import { useShoppingContext } from "../../ShoppingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import "./form.css";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { loginData, setLoginData } = useAuth();
  const { showLoginForm, showSignUpForm, setShowLoginForm, setShowSignUpForm } =
    useShoppingContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/createUser`,
        loginData
      );
      console.log("Respuesta del servidor:", response.data);
      // Puedes redirigir al usuario o mostrar un mensaje de éxito aquí
      navigate("/login");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      // Puedes mostrar un mensaje de error al usuario aquí
    }
    setShowLoginForm(false);

    setShowSignUpForm(false);
  };

  return (
    <>
      <div className="flex-login-container">
        <div className="form-container">
          <div className="close-form-container">
            <FontAwesomeIcon
              icon={faTimes}
              className="close-form"
              onClick={() => {
                if (showLoginForm) {
                  setShowLoginForm(false);
                }
                if (showSignUpForm) {
                  setShowSignUpForm(false);
                }
              }}
            />
          </div>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="flex-space-around">
              <label className="form-label">
                Nombre:
                <input
                  type="text"
                  name="nombre"
                  value={loginData.nombre}
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
              <label className="form-label">
                Apellido:
                <input
                  type="text"
                  name="apellido"
                  value={loginData.apellido}
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
            </div>

            <div className="flex-space-around">
              <label className="form-label">
                Email:
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
              <label className="form-label">
                Teléfono:
                <input
                  type="text"
                  name="telefono"
                  value={loginData.telefono}
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
            </div>

            <label className="form-label">
              Direccion:
              <input
                type="text"
                name="direccion_envio"
                value={loginData.direccion_envio}
                onChange={handleChange}
                className="form-input"
              />
            </label>
            <div className="flex">
              <label className="form-label">
                Contraseña:
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
            </div>

            <button type="submit" className="form-button">
              Registrarse
            </button>
            <ul>
              <li>ó</li>
              <li>
                <p
                  onClick={() => {
                    if (!showLoginForm) {
                      setShowLoginForm(true);
                    }
                    if (showSignUpForm) {
                      setShowSignUpForm(false);
                    }
                  }}
                >
                  Iniciar Sesión
                </p>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
