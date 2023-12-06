import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import "./Details.css";
import "./Checkout.css";

const Details = () => {
  const { carrito, setSelectedItems, selectedItemsOriginales } =
    useShoppingContext();

  useEffect(() => {
    // Cargar los datos del localStorage al estado cuando se monta el componente
    const savedSelectedItems = localStorage.getItem("selectedItems");
    if (savedSelectedItems) {
      setSelectedItems(JSON.parse(savedSelectedItems));
    }
  }, []);

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => {
      return total + item.precio * item.cantidad;
    }, 0);
  };

  const calcularTotal = () => {
    const total = calcularSubtotal();
    return total;
  };

  return (
    <div className="">
      <table className="product-table">
        <thead>
          <th>Producto</th>
          <th>Subtotal</th>
        </thead>
        <tbody>
          {carrito.map((item, index) => {
            const monto_total = item.precio * item.cantidad;
            return (
              <tr key={`${item.producto_id}-${index}`}>
                <td className="flex" style={{ alignItems: "center" }}>
                  <img src={item.img} alt="imagen del producto" />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginLeft: "8px",
                    }}
                  >
                    <span className="product-name">{item.nombre}</span>
                    <b className="product-quantity">x{item.cantidad}</b>
                  </div>
                </td>

                <td>S/. {monto_total}</td>
              </tr>
            );
          })}
          <tr className="cart-subtotal">
            <td>
              <b>Subtotal</b>
            </td>

            <td>S/. {calcularSubtotal()}</td>
          </tr>
          <tr className="cart-shipping">
            <td colSpan="2">
              <b>Envío</b>
            </td>
          </tr>
          <tr className="cart-total">
            <td>
              <b>Total</b>
            </td>
            <td>S/. {calcularTotal()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Details;
