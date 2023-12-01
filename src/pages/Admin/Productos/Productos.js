import React, { useState, useEffect } from "react";
import axios from "axios";
import ListaProductos from "./ListaProductos";
import "../../../styles.css";

const AgregarMenu = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    img: "",
    stock: "",
    id_categoria: "",
  });

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const cargarProductos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/products/`,
        formData,
        
        {
          withCredentials: true,
        }
        
      );

      setFormData({
        nombre: "",
        descripcion: "",
        img: "",
        stock: "",
        id_categoria: "",
      });

      cargarProductos();
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  return (
    <div className="content-container">
      <h2>Agregar Producto</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              required
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
            Imagen:
            <input
              type="text"
              name="img"
              value={formData.img}
              onChange={handleChange}
            />
          </label>
          <label>
            Stock:
            <input
              required
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
              required
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
            >
              <option value="">Selecciona una categoría</option>
              <option value="0">Relx</option>
              <option value="1">Waka</option>
            </select>
          </label>
          <button type="submit">Registrar producto</button>
        </form>
      </div>

      <ListaProductos productos={productos} />
    </div>
  );
};

export default AgregarMenu;
