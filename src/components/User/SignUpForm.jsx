import React, { useState } from "react";
import axios from "axios";
import "./form.css";


import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion_envio: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/createUser`,
        formData
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
            value={formData.nombre}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <label className="form-label">
          Apellido:
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <label className="form-label">
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <label className="form-label">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <label className="form-label">
          Direccion:
          <input
            type="text"
            name="direccion_envio"
            value={formData.direccion_envio}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <label className="form-label">
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
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
