import React, { useState } from "react";
import axios from "axios";

const EditarUsuario = ({ usuario, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(usuario);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Actualiza el estado solo para el campo que se está cambiando
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan si es necesario
    if (formData.newPassword !== formData.confirmNewPassword) {
      console.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${formData.id}`, // Ajusta la URL a la de tus usuarios
        formData
      );
      console.log("Respuesta del servidor:", response.data);

      // Llama a la función onUpdate para actualizar la lista de usuarios
      onUpdate(response.data);

      // Cierra el modal
      onClose();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </label>

          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
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
            Rol:
            <select name="level" value={formData.level} onChange={handleChange}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <div>
            <label>
              Nueva clave de acceso:
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </label>
            <label>
              Confirmar nueva clave de acceso:
              <input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </label>
          </div>
          <button type="submit">Actualizar Usuario</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default EditarUsuario;
