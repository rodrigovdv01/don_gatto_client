import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuCategory from "./MenuCategory";
import "./Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSearch,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useShoppingContext } from "../../../ShoppingContext";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const { agregarAlCarrito, modificarCantidad, toggleCart } =
    useShoppingContext(); // Obtiene el carrito y sus funciones desde el contexto
  const [productos, setProductos] = useState([]); // Estado para los productos obtenidos de la API
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Realizar una solicitud HTTP GET para obtener los productos activos desde la API utilizando Axios
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/`, {
        params: {
          activo: true, // Filtra los productos por activo:true
        },
      })
      .then((response) => {
        const productosData = response.data;
        if (Array.isArray(productosData)) {
          setProductos(productosData);
        } else {
          console.error("No hay productos agregados.");
        }
      })
      .catch((error) => {
        console.error("Error al obtener productos activos:", error);
      });
  }, []);

  return (
    <>
      {location.pathname === "/shop" && <h1>Tienda Online</h1>}
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="ver-carrito-container">
        <button className="estado">
          <Link to="/mis-pedidos">
            MIS PEDIDOS <FontAwesomeIcon icon={faCheckCircle} />
          </Link>
        </button>
        <button className="ver-carrito" onClick={toggleCart}>
          VER CARRITO <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      </div>

      <div className="menu-options">
        {searchTerm && ( // Render "Resultados" only if searchTerm is not empty
          <MenuCategory
            category="Resultados"
            menuItems={productos.filter(
              (item) =>
                item.activo &&
                (item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.descripcion
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
            )}
            agregarAlCarrito={agregarAlCarrito}
            modificarCantidad={modificarCantidad}
          />
        )}
        {!searchTerm && (
          <>
            <MenuCategory
              category="Relx"
              menuItems={productos.filter((item) => item.id_categoria === 0)} // Filtra los productos por categoría
              agregarAlCarrito={agregarAlCarrito}
              modificarCantidad={modificarCantidad} // Utiliza modificarCantidadMenu para "Menu"
            />
            <MenuCategory
              category="Waka"
              menuItems={productos.filter((item) => item.id_categoria === 1)} // Filtra los productos por categoría
              agregarAlCarrito={agregarAlCarrito}
              modificarCantidad={modificarCantidad}
            />
          </>
        )}
        {searchTerm && productos.length === 0 && (
          <p>No hay resultados para la búsqueda.</p>
        )}
      </div>

      {!searchTerm && (
        <div className="ver-carrito-container">
            <Link to="/carrito" className="continue-shopping">
              Continuar <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
        </div>
      )}
    </>
  );
};

export default Menu;
