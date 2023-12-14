// Importa las librerías y componentes necesarios
import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";
import Details from "./Details";
import { useLocation } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import { useAuth } from "../../AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import paymentSound from "../../audio/payment.wav";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shippingInfo } = location.state || {};
  const [errorMessage, setErrorMessage] = useState("");
  const {
    calcularTotal,
    carrito,
    vaciarCarrito,
    setSelectedItems,
    selectedItemsOriginales,
    costoEnvio,
  } = useShoppingContext();
  const montoTotal = calcularTotal(carrito);

  const { authenticatedUser } = useAuth();
  const {
    detailsVisible,
    setDetailsVisible,
    isRotated,
    setRotated,
    showLoginSection,
    setShowLoginSection,
  } = useShoppingContext();

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
    setRotated(!isRotated);
  };

  const handleSkipLogin = () => {
    setShowLoginSection(false);
  };

  const [metodoPago, setMetodoPago] = useState("TarjetaDebitoCredito");
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

  const soundRef = useRef(null);
  const reproducirSonido = () => {
    if (soundRef.current) {
      soundRef.current.play();
    }
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
      const user_id = authenticatedUser ? authenticatedUser.id : "0";

      // Create a new pedido
      const pedidoResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/pedidos/crear-pedido`,
        {
          user_id,
          monto_total: montoTotal + costoEnvio,
          nombre: `${shippingInfo.nombre} ${shippingInfo.apellidos}`,
          telefono: `${shippingInfo.telefono}`,
          direccion_envio: `${shippingInfo.direccion}`,
          distrito: `${shippingInfo.distrito}`,
          costo_envio: costoEnvio,
          email: `${shippingInfo.email}`,
          estado_pedido: "Activo",
        }
      );

      if (pedidoResponse.status === 201) {
        const nuevoPedidoId = pedidoResponse.data.pedido.id;

        // Define the date of now
        const fecha_transaccion = new Date().toISOString();

        // Set the estado_transaccion to a default value (you might want to adjust this)
        let estado_transaccion = "Pendiente";

        if (metodoPago === "TarjetaDebitoCredito") {
          estado_transaccion = "Pagado";
        }

        // Create a new transacción associated with the pedido
        await axios.post(
          `${process.env.REACT_APP_API_URL}/transacciones_pago`,
          {
            user_id,
            pedido_id: nuevoPedidoId,
            fecha_transaccion,
            metodo_pago: metodoPago,
            monto_transaccion: montoTotal,
            estado_transaccion,
          }
        );

        // Add detalles-de-pedido for each product in the carrito
        for (const [index, producto] of carrito.entries()) {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/pedidos/detalles-de-pedido`,
            {
              user_id,
              pedido_id: nuevoPedidoId,
              producto_id: producto.producto_id,
              cantidad: producto.cantidad,
              precio_unitario: producto.precio,
            }
          );
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

  const contentBoxStyle = {
    width: location.pathname === "/checkout/payment" ? "100%" : "80%",
    margin: "20px auto",
  };

  return (
    <>
      <div className="content-container">
        <h1 className="title">FINALIZAR COMPRA</h1>
        <form
          className="payment-form-container payment-box"
          onSubmit={handleSubmit}
        >
          <div className="flex-order-2">
            <h2 className="heading">Información de Envío</h2>
            {/* Sección adicional para iniciar sesión si el usuario no está autenticado */}
            <div className="shipping-details">
              {shippingInfo ? (
                <>
                  <p>
                    Nombre: {shippingInfo.nombre} {shippingInfo.apellidos}
                  </p>

                  <p>Teléfono: {shippingInfo.telefono}</p>
                  <p>Dirección: {shippingInfo.direccion}</p>
                  <p>Correo Electrónico: {shippingInfo.email}</p>
                  <div style={contentBoxStyle}>
                    <div>
                      {" "}
                      <Details />
                      <div className="checkout-payment-options">
                        <Link to="/checkout" className="continue-shopping">
                          editar información
                        </Link>
                        <Link to="/carrito" className="continue-shopping">
                          editar Carrito
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p>Los datos de envío no están disponibles.</p>
              )}
            </div>
          </div>
          <div className="flex-order-1">
            <h2 className="heading">Método de Pago</h2>
            <div className="payment-options">
              <label className="tarjetaDebitoCredito">
                <input
                  selected
                  type="radio"
                  name="metodoPago"
                  value="TarjetaDebitoCredito"
                  checked={metodoPago === "TarjetaDebitoCredito"}
                  onChange={handleMetodoPagoChange}
                />
                Tarjeta de Débito/Crédito
              </label>
              <label className="yape">
                <input
                  type="radio"
                  name="metodoPago"
                  value="Yape"
                  checked={metodoPago === "Yape"}
                  onChange={handleMetodoPagoChange}
                />
                Yape
              </label>
            </div>

            {metodoPago === "Yape" && (
              <div className="yape-image-container">
                <img
                  src="/images/yape.jpg"
                  height={300}
                  alt="Yape"
                  className="yape-image"
                />

                <h3>
                  Después de realizar tu pedido, recibirás un enlace para
                  enviarnos el comprobante de la transacción de Yape a través de
                  WhatsApp.
                </h3>
                {/* <div className="enviar-comprobante">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://api.whatsapp.com/send?phone=+51913687390&text=Realicé un yape por el monto de S/.${montoTotal.toFixed(
                      2
                    )}%0D%0ANombre: ${shippingInfo.nombre} ${
                      shippingInfo.apellidos
                    }%0D%0ADirección de entrega: ${shippingInfo.direccion}`}
                  >
                    Enviar comprobante
                  </a>
                </div> */}
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

                    <label htmlFor="fechaVencimiento">
                      Fecha de Vencimiento
                    </label>
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
                      maxLength="4"
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

            <div className="pagar-buttons">
              {metodoPagoError && (
                <div className="error-message">{metodoPagoError}</div>
              )}

              <button
                type="submit"
                className="submit-button"
                onClick={reproducirSonido}
              >
                {metodoPago === "Yape" ? <p>Realizar Pedido</p> : <p>Pagar</p>}
              </button>
            </div>
          </div>
        </form>
      </div>

      <audio ref={soundRef} src={paymentSound}></audio>
    </>
  );
};

export default CheckoutPayment;
