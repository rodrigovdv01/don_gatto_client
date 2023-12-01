// Importa las librerías y componentes necesarios
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles.css";
import "./Checkout.css";
import Details from "./Details";
import { useLocation } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import { useAuth } from "../../AuthContext";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shippingInfo } = location.state || {};
  const [errorMessage, setErrorMessage] = useState("");
  const {
    calcularTotal,
    carrito,
    setPedidoId,
    vaciarCarrito,
    setSelectedItems,
    selectedItemsOriginales,
  } = useShoppingContext();
  const montoTotal = calcularTotal(carrito);

  const { authenticatedUser } = useAuth();

  const [metodoPago, setMetodoPago] = useState("");
  const [metodoPagoError, setMetodoPagoError] = useState("");
  const [formattedNumeroTarjeta, setFormattedNumeroTarjeta] = useState("");
  const handleNumeroTarjetaChange = (e) => {
    const inputNumeroTarjeta = e.target.value.replace(/\D/g, "");
    let formattedInput = "";

    for (let i = 0; i < inputNumeroTarjeta.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedInput += "-";
      }
      formattedInput += inputNumeroTarjeta[i];
    }

    setFormattedNumeroTarjeta(formattedInput);
  };

  const [fechaVencimiento, setFechaVencimiento] = useState("");

  const handleFechaVencimientoChange = (e) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(/[^\d/]/g, "");

    if (sanitizedInput.length <= 5) {
      setFechaVencimiento(sanitizedInput);
    }
  };

  const handleMetodoPagoChange = (e) => {
    setMetodoPago(e.target.value);
    setMetodoPagoError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metodoPago) {
      setMetodoPagoError("Por favor, selecciona un método de pago");
      return;
    }
    try {
      const pedidoResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/pedidos/crear-pedido`,
        {
          user_id: authenticatedUser.id,
          monto_total: montoTotal,
          nombre: `${shippingInfo.nombre} ${shippingInfo.apellidos}`,
          telefono: `${shippingInfo.telefono}`,
          direccion_envio: `${shippingInfo.direccion}`,
          email: `${shippingInfo.email}`,
          estado_pedido: "Recibido",
        }
      );

      if (pedidoResponse.status === 201) {
        const nuevoPedidoId = pedidoResponse.data.pedido.id;
        setPedidoId(nuevoPedidoId);

        for (const [index, producto] of carrito.entries()) {
          await axios.post(`${process.env.REACT_APP_API_URL}/pedidos/detalles-de-pedido`, {
            user_id: authenticatedUser.id,
            pedido_id: nuevoPedidoId,
            producto_id: producto.producto_id,
            cantidad: producto.cantidad,
            precio_unitario: producto.precio,
          });
          console.log(index);
        }

        console.log("Respuesta del servidor:", pedidoResponse.data);
        navigate(`/pedido-confirmado/${nuevoPedidoId}`);
      }
      vaciarCarrito();
      setSelectedItems([...selectedItemsOriginales]);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setErrorMessage(
        "Hubo un error al procesar el pago. Por favor, inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="content-container">
      <div className="shipping-details">
        <h2>Detalles de Envío</h2>
        {shippingInfo ? (
          <>
            <p>Correo Electrónico: {shippingInfo.email}</p>
            <p>
              Nombre: {shippingInfo.nombre} {shippingInfo.apellidos}
            </p>
            <p>Teléfono: {shippingInfo.telefono}</p>
            <p>Dirección de envío: {shippingInfo.direccion}</p>
          </>
        ) : (
          <p>Los datos de envío no están disponibles.</p>
        )}
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <Details montoTotal={montoTotal} />
      <h2 className="heading">Método de Pago</h2>
      <form className="payment-form-container" onSubmit={handleSubmit}>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="metodoPago"
              value="Yape"
              checked={metodoPago === "Yape"}
              onChange={handleMetodoPagoChange}
            />
            Yape
          </label>
          <label>
            <input
              type="radio"
              name="metodoPago"
              value="TarjetaDebitoCredito"
              checked={metodoPago === "TarjetaDebitoCredito"}
              onChange={handleMetodoPagoChange}
            />
            Tarjeta de Débito/Crédito
          </label>
        </div>

        {metodoPago === "Yape" && (
          <div className="yape-image-container">
            <img
              src="/images/yape.jpg"
              height={400}
              alt="Yape"
              className="yape-image"
            />
            <h2>Enviar comprobante de pago al whatsapp</h2>
          </div>
        )}

        {metodoPago === "TarjetaDebitoCredito" && (
          <div className="tarjeta-debito-credito">
            {metodoPago === "TarjetaDebitoCredito" && (
              <div className="tarjeta-debito-credito">
                <label htmlFor="numeroTarjeta">Número de tarjeta</label>
                <input
                  required
                  type="text"
                  id="numeroTarjeta"
                  name="numeroTarjeta"
                  minLength="19" // Máximo de 19 caracteres incluyendo guiones
                  maxLength="19" // Máximo de 19 caracteres incluyendo guiones
                  value={formattedNumeroTarjeta}
                  onChange={handleNumeroTarjetaChange}
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                />

                <label htmlFor="fechaVencimiento">Fecha de Vencimiento</label>
                <input
                  required
                  type="text"
                  id="fechaVencimiento"
                  name="fechaVencimiento"
                  minLength="5" // Máximo de 5 caracteres (dd/mm)
                  maxLength="5" // Máximo de 5 caracteres (dd/mm)
                  value={fechaVencimiento}
                  onChange={handleFechaVencimientoChange}
                  placeholder="dd/mm"
                />

                <label htmlFor="cvv">CVV</label>
                <input
                  required
                  placeholder="123"
                  type="text"
                  id="cvv"
                  name="cvv"
                  maxLength="3"
                  minLength="3"
                  // Agrega más propiedades según tus necesidades (por ejemplo, validación)
                />

                <label htmlFor="nombreTitular">Nombre del Titular</label>
                <input
                  required
                  type="text"
                  id="nombreTitular"
                  name="nombreTitular"
                  // Agrega más propiedades según tus necesidades (por ejemplo, validación)
                />
              </div>
            )}
          </div>
        )}

        <p className="total">Total: S/. {calcularTotal(carrito)}</p>
        {metodoPagoError && (
          <div className="error-message">{metodoPagoError}</div>
        )}
        <button type="submit" className="submit-button">
          Pagar
        </button>
      </form>
    </div>
  );
};

export default CheckoutPayment;
