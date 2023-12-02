import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Productos.css";
import EditarProducto from "./EditarProducto";

const ListaProductos = () => {
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaId, setBusquedaId] = useState("");
  const [busquedaActivo, setBusquedaActivo] = useState("");
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [productosDesactivados, setProductosDesactivados] = useState([]);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);
  const [editando, setEditando] = useState(false);

  // Objeto de mapeo para categorías
  const categorias = {
    0: "Menu",
    1: "Entradas",
    2: "Segundos",
    3: "Postres",
    4: "Bebidas",
  };

  // Define the filtrarProductos function using useCallback
  const filtrarProductos = useCallback(() => {
    let productosFiltrados = [...productosOriginales];

    if (busquedaNombre) {
      productosFiltrados = productosFiltrados.filter((producto) =>
        producto.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
      );
    }

    if (busquedaId) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.producto_id.toString() === busquedaId
      );
    }

    if (busquedaActivo !== "") {
      const activo = busquedaActivo === "activo";
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.activo === activo
      );
    }

    if (busquedaCategoria) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.id_categoria.toString() === busquedaCategoria
      );
    }

    setProductosFiltrados(productosFiltrados);
  }, [
    busquedaNombre,
    busquedaId,
    busquedaActivo,
    busquedaCategoria,
    productosOriginales,
  ]);

  useEffect(() => {
    obtenerProductos();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [
    busquedaNombre,
    busquedaId,
    busquedaActivo,
    busquedaCategoria,
    productosOriginales,
    filtrarProductos, // Include the function in the dependency array
  ]);

  const obtenerProductos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
      const productos = response.data;
      setProductosOriginales(productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleActualizarProductos = async () => {
    obtenerProductos();
    window.location.reload();
  };

  const toggleActivo = async (producto_id) => {
    try {
      const producto = productosOriginales.find(
        (producto) => producto.producto_id === producto_id
      );
      const updatedProducto = { ...producto, activo: !producto.activo };

      await axios.put(
        `${process.env.REACT_APP_API_URL}/products/${producto_id}`,
        updatedProducto
      );

      if (!producto.activo) {
        setProductosDesactivados([...productosDesactivados, producto_id]);
      } else {
        setProductosDesactivados(
          productosDesactivados.filter((item) => item !== producto_id)
        );
      }

      handleActualizarProductos();
    } catch (error) {
      console.error("Error al cambiar el estado activo del producto:", error);
    }
  };

  const handleEditarProducto = (producto) => {
    setProductoEditando(producto);
    setEditando(true);
  };

  const handleEliminarProducto = async (producto_id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/products/${producto_id}`);
      handleActualizarProductos();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <div className="content-container">
      <h2>Lista de Productos</h2>
      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Nombre"
          value={busquedaNombre}
          onChange={(e) => setBusquedaNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="producto_id"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
        />
        <select
          value={busquedaActivo}
          onChange={(e) => setBusquedaActivo(e.target.value)}
        >
          <option value="">Estado</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <select
          value={busquedaCategoria}
          onChange={(e) => setBusquedaCategoria(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="0">Menu</option>
          <option value="1">Entradas</option>
          <option value="2">Segundos</option>
          <option value="3">Postres</option>
          <option value="4">Bebidas</option>
        </select>
      </div>
      <button onClick={handleActualizarProductos}>Actualizar</button>
      {productosFiltrados.length === 0 ? (
        <div>Cargando productos...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID de Producto</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Imagen</th>
              <th>Imagen URL</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <React.Fragment key={producto.producto_id}>
                <tr>
                  <td>{producto.producto_id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.stock}</td>
                  <td>S/. {producto.precio}</td>
                  <td>{categorias[producto.id_categoria]}</td>
                  <td className="img">
                    <img src={producto.img} alt={producto.img} />
                  </td>
                  <td>{producto.img}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={producto.activo}
                      onChange={() => toggleActivo(producto.producto_id)}
                      disabled={productosDesactivados.includes(
                        producto.producto_id
                      )}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditarProducto(producto)}>
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleEliminarProducto(producto.producto_id)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
                {editando && productoEditando === producto && (
                  <tr>
                    <td colSpan="9">
                      <EditarProducto
                        producto={productoEditando}
                        onClose={() => setEditando(false)}
                        onUpdate={handleActualizarProductos}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      {productoAEditar && (
        <EditarProducto
          producto={productoAEditar}
          onClose={() => setProductoAEditar(null)}
          onUpdate={handleActualizarProductos}
        />
      )}
    </div>
  );
};

export default ListaProductos;
