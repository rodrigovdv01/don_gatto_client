import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";
import Details from "./Details";
import { useLocation } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import { useAuth } from "../../AuthContext";
import { v4 as uuidv4 } from "uuid";
import paymentSound from "../../audio/payment.wav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import WhatsAppButton from "../../components/WhatsappButton/WhatsappButton";

const CheckoutPayment = () => {
  const yapeNumber = 913687390;
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
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

  const [metodoPago, setMetodoPago] = useState("Yape");
  const [metodoPagoError, setMetodoPagoError] = useState("");
  const [formattedNumeroTarjeta, setFormattedNumeroTarjeta] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [trackId, setTrackId] = useState(null);

  const soundRef = useRef(null);

  const handleCopyToClipboard = () => {
    const copyText = yapeNumber;
    const textArea = document.createElement("textarea");
    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setCopiedToClipboard(true);

    // Después de un tiempo, restablecer el estado para ocultar el mensaje
    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 2000);
  };

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

  const handleFechaVencimientoChange = (e) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(/[^\d/]/g, "");

    if (sanitizedInput.length <= 5) {
      setFechaVencimiento(sanitizedInput);
    }
  };

  // Número de WhatsApp y mensaje
  const phoneNumber = "+51986734669";
  const message = "¡Hola Don Gatto! te envío el pago de mi pedido";

  // Crear la URL de WhatsApp
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
    message
  )}`;

  const handleMetodoPagoChange = (e) => {
    setMetodoPago(e.target.value);
    setMetodoPagoError("");
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlTrackId = searchParams.get("trackId");
    if (urlTrackId) {
      setTrackId(urlTrackId);
    } else {
      setTrackId(uuidv4());
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metodoPago) {
      setMetodoPagoError("Por favor, selecciona un método de pago");
      return;
    }

    try {
      const user_id = authenticatedUser ? authenticatedUser.id : "0";
      const pedidoTrackId = trackId || uuidv4();

      console.log("Enviando solicitud para crear pedido...");

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
          track_id: pedidoTrackId,
        }
      );

      console.log("Respuesta del servidor al crear pedido:", pedidoResponse);

      if (pedidoResponse.status === 201) {
        const nuevoPedidoId = pedidoResponse.data.pedido.id;

        const fecha_transaccion = new Date().toISOString();
        let estado_transaccion = "Pendiente";

        if (metodoPago === "TarjetaDebitoCredito") {
          estado_transaccion = "Pagado";
        }

        console.log("Enviando solicitud para crear transacción de pago...");

        const transaccionResponse = await axios.post(
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

        console.log(
          "Respuesta del servidor al crear transacción de pago:",
          transaccionResponse
        );

        for (const [index, producto] of carrito.entries()) {
          console.log(
            `Enviando solicitud para crear detalle de pedido (${index + 1}/${
              carrito.length
            })...`
          );

          const detallePedidoResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/pedidos/detalles-de-pedido`,
            {
              user_id,
              pedido_id: nuevoPedidoId,
              producto_id: producto.producto_id,
              cantidad: producto.cantidad,
              precio_unitario: producto.precio,
            }
          );

          console.log(
            `Respuesta del servidor al crear detalle de pedido (${index + 1}/${
              carrito.length
            }):`,
            detallePedidoResponse
          );
        }

        navigate(`/pedido-confirmado/${nuevoPedidoId}/${pedidoTrackId}`);
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

  const reproducirSonido = () => {
    if (soundRef.current) {
      soundRef.current.play();
    }
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
                      <div className="checkout-payment-options">
                        <Link to="/checkout" className="continue-shopping">
                          editar información
                        </Link>
                        <Link to="/carrito" className="continue-shopping">
                          editar Carrito
                        </Link>
                      </div>
                      <Details />
                    </div>
                  </div>
                </>
              ) : (
                <p>Los datos de envío no están disponibles.</p>
              )}
            </div>
          </div>
          <div className="flex-order-1">
            <h2 className="heading">Realizar Pago</h2>
            <div className="payment-options">

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

              <label className="tarjetaDebitoCredito" disabled={true}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="TarjetaDebitoCredito"
                  checked={metodoPago === "TarjetaDebitoCredito"}
                  onChange={handleMetodoPagoChange}
                  disabled={true}
                />
                Tarjeta de Débito/Crédito
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

                <ol className="instruction-list">
                  <li>
                    Ingresa en yape el número que aparece en pantalla o escanea
                    el QR para completar el pago.
                    <div className="copy-container">
                      {!copiedToClipboard && <b>{yapeNumber}</b>}
                      <div className="copiar" onClick={handleCopyToClipboard}>
                        {!copiedToClipboard && (
                          <span>
                            <FontAwesomeIcon icon={faCopy} /> Copiar
                          </span>
                        )}
                        {copiedToClipboard && (
                          <span className="numero-copiado">
                            <FontAwesomeIcon icon={faCheckCircle} /> Número
                            copiado
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                  <li>
                    Comparte el comprobante a través de WhatsApp.
                    <div className="enviar-comprobante">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Enviar comprobante <FontAwesomeIcon icon={faWhatsapp} />
                      </a>
                    </div>
                  </li>
                  <li>
                    Finaliza tu compra y podrás ver su estado en tiempo real.
                    <div className="pagar-buttons">
                      {metodoPagoError && (
                        <div className="error-message">{metodoPagoError}</div>
                      )}

                      <button
                        type="submit"
                        className="submit-button"
                        onClick={reproducirSonido}
                      >
                        {metodoPago === "Yape" ? (
                          <p>Finalizar compra</p>
                        ) : (
                          <p>Pagar</p>
                        )}
                      </button>
                    </div>
                  </li>
                </ol>
              </div>
            )}

            {metodoPago === "TarjetaDebitoCredito" && (
              <div className="tarjeta-debito-credito">
                <label htmlFor="numeroTarjeta">Número de tarjeta</label>
                <input
                  required
                  type="text"
                  id="numeroTarjeta"
                  name="numeroTarjeta"
                  minLength="19"
                  maxLength="19"
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
                  minLength="5"
                  maxLength="5"
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
                />

                <label htmlFor="nombreTitular">Nombre del Titular</label>
                <input
                  required
                  type="text"
                  id="nombreTitular"
                  name="nombreTitular"
                />
              </div>
            )}
          </div>
        </form>
      </div>

      <audio ref={soundRef} src={paymentSound}></audio>
    </>
  );
};

export default CheckoutPayment;
