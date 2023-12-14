import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuCategory from "./MenuCategory";
import "./Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHistory } from "@fortawesome/free-solid-svg-icons";
import { useShoppingContext } from "../../../ShoppingContext";
import { Link } from "react-router-dom";

const Menu = () => {
  const { agregarAlCarrito, modificarCantidad, toggleCart } =
    useShoppingContext(); // Obtiene el carrito y sus funciones desde el contexto
  const [productos, setProductos] = useState([]); // Estado para los productos obtenidos de la API

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
      <div className="ver-carrito-container">
        <button className="estado">
          <Link to="/mis-pedidos">
            Estado de mi pedido <FontAwesomeIcon icon={faHistory} />
          </Link>
        </button>
        <button className="ver-carrito" onClick={toggleCart}>
          Ver Carrito <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      </div>

      <div className="menu-options">
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
      </div>
      <div className="ver-carrito-container">
        <button className="ver-carrito" onClick={toggleCart}>
          Continuar <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      </div>
    </>
  );
};

export default Menu;
