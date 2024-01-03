import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";

const EditarDatosPersonales = () => {
  const { authenticatedUser } = useAuth();
  const [cambiarClave, setCambiarClave] = useState();
  const [formData, setFormData] = useState(authenticatedUser);
  const Navigate = useNavigate();

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
      Navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <div className="content-container">
      <div className="modal">
        <div className="modal-content">
          <h2>Editar datos Personales</h2>
          <form onSubmit={handleSubmit} className="">
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-input"
              />
            </label>

            <label>
              Apellido:
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="form-input"
              />
            </label>
            <label>
              Teléfono:
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-input"
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </label>
            <label>
              Dirección:
              <input
                type="text"
                name="direccion_envio"
                value={formData.direccion_envio}
                onChange={handleChange}
                className="form-input"
              />
            </label>
            <label className="form-label">
              Distrito:
              <select
                name="distrito"
                value={formData.distrito}
                onChange={handleChange}
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

              <div className="cambiar-clave-container">
                <>
                  <label>
                    Nueva contraseña:
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </label>
                  <label>
                    Confirmar nueva contraseña:
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </label>
                </>
              </div>
            
            <button type="submit">Actualizar datos</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarDatosPersonales;
