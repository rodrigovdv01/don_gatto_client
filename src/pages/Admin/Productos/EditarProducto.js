import React, { useState } from "react";
import axios from "axios";

const EditarProducto = ({ producto, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(producto);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/products/${formData.producto_id}`,
        formData
      );
      console.log("Respuesta del servidor:", response.data);

      // Llama a la función onUpdate para actualizar la lista de productos
      onUpdate(response.data);

      // Cierra el modal
      onClose();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Producto</h2>
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
            Descripción:
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </label>
          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </label>
          <label>
            Precio:
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
            />
          </label>
          <label>
            Categoría:
            <select
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
            >
              <option value="0">Waka</option>
              <option value="1">Relx</option>
              <option value="2">Categoría 3</option>
              <option value="3">Categoría 4</option>
              <option value="4">Categoría 5</option>
            </select>
          </label>
          <label>
            Imagen:
            <input
              type="text"
              name="img"
              value={formData.img}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Actualizar Producto</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default EditarProducto;
