import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import "./Details.css";
import "./Checkout.css";

const Details = () => {
  const location = useLocation();
  const {
    carrito,
    setSelectedItems,
    selectedItemsOriginales,
    costoEnvio,
    setCostoEnvio,
    setMontoTotal,
    distrito,
  } = useShoppingContext();

  const { shippingInfo } = location.state || {};

  useEffect(() => {
    // Cargar los datos del localStorage al estado cuando se monta el componente
    const savedSelectedItems = localStorage.getItem("selectedItems");
    if (savedSelectedItems) {
      setSelectedItems(JSON.parse(savedSelectedItems));
    }

    // Calcular el costo de envío y el total después de cargar los datos del localStorage
    const costoEnvioCalculado = calcularEnvío();
    setCostoEnvio(costoEnvioCalculado);

    const total = calcularSubtotal() + costoEnvioCalculado;
    setMontoTotal(total);
  }, []);

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => {
      return total + item.precio * item.cantidad;
    }, 0);
  };

  // Función para calcular el envío por distrito
  const calcularEnvío = () => {
    // Define los costos de envío por distrito
    const costosEnvioPorDistrito = {
      Barranco: 1,
      Chorrillos: 2,
      "La Molina": 3,
      Magdalena: 4,
      Miraflores: 5,
      "San Borja": 6,
      "San Isidro": 7,
      "San Miguel": 8,
      "Santiago de Surco": 9,
    };

    // Verifica si el distrito está en la lista, si no, usa un valor predeterminado
    const CostoEnvioPorDistrito = costosEnvioPorDistrito[distrito] || 0;
    return CostoEnvioPorDistrito;
  };

  const costoEnvioActual = calcularEnvío();

  const calcularTotal = () => {
    const total = calcularSubtotal() + calcularEnvío();
    setMontoTotal(total);
    return total;
  };

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {carrito.map((item, index) => {
          const precioUnitario = item.precio.toFixed(2);
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
              <td>S/. {precioUnitario}</td>
              <td>S/. {monto_total.toFixed(2)}</td>
            </tr>
          );
        })}
        <tr className="cart-subtotal">
          <td>
            <b>Subtotal</b>
          </td>

          <td>S/. {calcularSubtotal().toFixed(2)}</td>
        </tr>
        <tr className="cart-shipping">
          <td className="flex-space-between">
            <b>Envío</b> {shippingInfo && distrito ? <b>({distrito})</b> : ""}
          </td>
          <td>S/. {calcularEnvío().toFixed(2)}</td>
        </tr>

        <tr className="cart-total">
          <td>
            <b>Total</b>
          </td>
          <td>S/. {calcularTotal().toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Details;
