import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import "./Details.css";
import "./Checkout.css";

const Details = () => {
  const { carrito, selectedItems, setSelectedItems, selectedItemsOriginales } =
    useShoppingContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Cargar los datos del localStorage al estado cuando se monta el componente
    const savedSelectedItems = localStorage.getItem("selectedItems");
    if (savedSelectedItems) {
      setSelectedItems(JSON.parse(savedSelectedItems));
    }

    // Resto de tu código...
  }, [setSelectedItems]);

 
  const handleEditCart = () => {
    // Restaura los selectedItems a su estado original
    setSelectedItems([...selectedItemsOriginales]);

    // Navega de regreso a la página del carrito
    navigate("/checkout/cart");
  };

  const handleCheckout = () => {
    if (location.pathname === "/checkout/cart") {
      navigate("/checkout/shipping");
    }
  };

  const renderCartLink = () => {
    if (location.pathname === "/checkout/cart") {
      return (
        <>
          <Link to="/menu" className="continue-shopping">
            Seguir Comprando
          </Link>
          <input
            type="submit"
            value="Siguiente paso"
            onClick={handleCheckout}
            className="next-step-button"
          />
        </>
      );
    } else if (location.pathname === "/checkout/shipping") {
      return (
        <div className="buttons">
          <Link
            to="/checkout/cart"
            className="continue-shopping"
            onClick={handleEditCart}
          >
            Editar Carrito
          </Link>
          <input
            type="submit"
            value="Realizar pedido"
            className="btn"
            onClick={handleCheckout}
          />
        </div>
      );
    }
  };

  return (
    <div className="details">
      {renderCartLink()}
      <table className="product-table">
        <tbody>
          {carrito.map((item, index) => {
            const monto_total = item.precio * item.cantidad;
            return (
              <tr key={`${item.producto_id}-${index}`}>
                <td>
                  <img src={item.img} alt="" />
                  <b>{item.nombre}</b>
                  
                  <p>{item.descripcion}</p>
                </td>
                <td>{item.cantidad}</td>
                <td>S/. {monto_total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* <p className="total">Total: S/. {calcularTotal(carrito)}</p> */}
    </div>
  );
};

export default Details;
