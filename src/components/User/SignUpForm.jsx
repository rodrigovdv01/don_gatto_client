import React, { useState } from "react";
import axios from "axios";
import "./form.css";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useAuth } from "../../AuthContext";

const SignUpForm = () => {
  const navigate = useNavigate();
  const {loginData, setLoginData} = useAuth();


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
  };

  return (
    <div className="content-container">
      <form onSubmit={handleSubmit} className="register-form">
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
          Direccion:
          <input
            type="text"
            name="direccion_envio"
            value={loginData.direccion_envio}
            onChange={handleChange}
            className="form-input"
          />
        </label>
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
        <button type="submit" className="form-button">
          Registrarse
        </button>
        <ul>
          <li>ó</li>
          <li>
            <p>
              <Link to="/login">Iniciar Sesión</Link>
            </p>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default SignUpForm;
