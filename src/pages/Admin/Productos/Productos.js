import React, { useState, useEffect } from "react";
import axios from "axios";
import ListaProductos from "./ListaProductos";
import SignInForm from "../../../components/User/SignInForm";


const AgregarMenu = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    img: "",
    stock: "",
    id_categoria: "",
  });

  const [productos, setProductos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar la autenticación al cargar el componente
    axios
      .get(`${process.env.REACT_APP_API_URL}/verify-auth`, {
        withCredentials: true,
      })
      .then((response) => {
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error al verificar la autenticación:", error);
        setIsAuthenticated(false);
      });

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
      const response = await axios.post(
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

  if (!isAuthenticated) {
    return (
      <div className="content-container">
        <SignInForm/>
      </div>
    );
  }

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
              <option value="0">Ofertas</option>
              <option value="1">Categoría 1</option>
              <option value="2">Categoría 2</option>
              <option value="3">Categoría 3</option>
              <option value="4">Categoría 4</option>
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
