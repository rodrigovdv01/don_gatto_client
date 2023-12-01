import React, { useState, useEffect } from "react";
import axios from "axios";
// import SignInForm from "../../../components/User/SignInForm";
import ListaUsuarios from "./ListaUsuarios"; // Asegúrate de ajustar la importación al componente correcto
import "../../../styles.css";

const AgregarUsuarios = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    level: "",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const cargarUsuarios = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validar el formulario aquí antes de enviar la solicitud

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/createUser`,
        formData
      );

      console.log("Respuesta del servidor:", response.data);

      // Limpiar el formulario después de registrar el usuario
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        password: "",
        level: "",
      });

      // Actualizar la lista de usuarios después de registrar uno nuevo
      window.location.reload()
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setError(
        "Error al registrar el usuario. Verifica los datos e intenta nuevamente."
      );
    }
  };

  return (
    <div className="content-container">
      <ListaUsuarios usuarios={usuarios} />
      <div>
        {/* Mostrar mensaje de error si existe */}
        {error && <p className="error-message">{error}</p>}

        <form className="registrar-usuario-form" onSubmit={handleSubmit}>
          <h2>Registrar nuevo usuario</h2>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Correo:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Teléfono:
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Contraseña:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </label>
          <label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Rol
              </option>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>

          <button type="submit">Registrar usuario</button>
        </form>
      </div>
    </div>
  );
};

export default AgregarUsuarios;
