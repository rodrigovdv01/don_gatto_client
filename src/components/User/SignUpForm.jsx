import React, { useState } from "react";
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
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const { showLoginForm, showSignUpForm, setShowLoginForm, setShowSignUpForm } =
    useShoppingContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Añadir el distrito al objeto loginData
      setLoginData({ ...loginData, distrito: selectedDistrict });
      // Añadir el distrito al objeto loginData
      const dataToSend = {
        ...loginData,
        distrito: selectedDistrict,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/createUser`,
        dataToSend
      );

      console.log("Respuesta del servidor:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
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
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
              <label className="form-label">
                Apellido:
                <input
                  type="text"
                  name="apellido"
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
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
              <label className="form-label">
                Teléfono:
                <input
                  type="text"
                  name="telefono"
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
            </div>
            <div className="flex">
              <label className="form-label">
                Direccion:
                <input
                  type="text"
                  name="direccion_envio"
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
              <label className="form-label">
                Distrito:
                <select
                  name="distrito"
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="form-input"
                >
                  <option value="">Selecciona un distrito</option>
                  <option value="Barranco">Barranco</option>
                  <option value="Chorrillos">Chorrillos</option>
                  <option value="La Molina">La Molina</option>
                  <option value="Magdalena">Magdalena</option>
                  <option value="Miraflores">Miraflores</option>
                  <option value="San Borja">San Borja</option>
                  <option value="San Isidro">San Isidro</option>
                  <option value="San Miguel">San Miguel</option>
                  <option value="Santiago de Surco">Santiago de Surco</option>
                </select>
              </label>
            </div>

            <div className="flex">
              <label className="form-label">
                Contraseña:
                <input
                  type="password"
                  name="password"
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
                className="pointer"
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
