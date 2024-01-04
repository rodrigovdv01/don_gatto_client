import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import axios from "axios";
import "./PedidoConfirmado.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import CountdownTimer from "../../CountDownTimer";
import OrderStatusIndicator from "../../OrderStatusIndicator"
const PedidoDetalle = () => {
  const yapeNumber = 986734669;
  const {
    obtenerDetallesPedido,
    detallesPedido,
    obtenerProductos,
    productosOriginales,
  } = useShoppingContext();
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [transacciones, setTransacciones] = useState({});
  const [loading, setLoading] = useState(true);
  const { pedidoId, trackId } = useParams();

  const navigate = useNavigate();
  const pagaConYape =
    transacciones[pedidoId]?.metodo_pago === "Yape" &&
    (transacciones[pedidoId]?.estado_transaccion === "Rechazada" ||
      transacciones[pedidoId]?.estado_transaccion === "Pendiente");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          pedidoResponse,
          detallesResponse,
          productosResponse,
          transaccionResponse,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/pedidos/${pedidoId}`),
          obtenerDetallesPedido(pedidoId),
          obtenerProductos(),
          axios.get(
            `${process.env.REACT_APP_API_URL}/transacciones_pago/${pedidoId}`
          ),
        ]);

        setPedidoConfirmado(pedidoResponse.data);
        setTransacciones((prevTransacciones) => {
          return {
            ...prevTransacciones,
            [pedidoId]: transaccionResponse.data,
          };
        });
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pedidoId, obtenerDetallesPedido, obtenerProductos, trackId, navigate]);

  const renderPedidoStatus = () => {
    if (!loading) {
      const { estado_pedido } = pedidoConfirmado;

      switch (estado_pedido) {
        case "Activo":
          return (
            <div>
              <h2 className="pedido-titulo activo-text">
                ¡Hemos recibido tu pedido! sigue las instrucciones...
              </h2>
              <h4>¡Gracias por tu compra, {pedidoConfirmado?.nombre}!</h4>
              <div className="countDownTimer">
                <CountdownTimer initialSeconds={600} />
                <p>Tienes 10 minutos para realizar el pago.</p>
              </div>
            </div>
          );
        case "Confirmado":
          return (
            <div className="mg-b-10">
              <h2 className="pedido-titulo en-camino-text">
                Tu pedido ha sido confirmado y está siendo preparado!
              </h2>
              <b style={{ textAlign: "center" }}>
                Pedido confirmado el {formattedUpdatedAt}
              </b>
            </div>
          );
        case "En camino":
          return (
            <div className="mg-b-10">
              <h2 className="pedido-titulo en-camino-text">
                Tu pedido está en camino
              </h2>
              <b style={{ textAlign: "center" }}>
                Salió el {formattedUpdatedAt}
              </b>

            

            </div>
          );
        case "Finalizado":
          return (
            <div className="mg-b-10">
              <h2 className="pedido-titulo finalizado-text">
                ¡Tu pedido ha sido entregado!
              </h2>
              <b style={{ textAlign: "center" }}>el {formattedUpdatedAt}</b>
            </div>
          );
        default:
          return null;
      }
    }

    return null;
  };

  const renderTransaccionStatus = () => {
    if (!loading) {
      const { estado_transaccion } = transacciones[pedidoId];

      switch (estado_transaccion) {
        case "Pendiente":
          return (
            <div>
              <p className="transaccion-pendiente-text">
                Esperando confirmación de pago
              </p>
              {renderPedidoStatus()}
              {pagaConYape && (
                <>
                  <div>
                    <h3 className="">
                      Paga con Yape, envíanos una captura por WhatsApp.
                    </h3>
                  </div>

                  <div>
                    <img
                      src="/images/yape.jpg"
                      width={200}
                      alt="Yape"
                      className="yape-image"
                    />
                  </div>

                  <div>
                    {!copiedToClipboard && <b>{yapeNumber}</b>}
                    <button className="copiar" onClick={handleCopyToClipboard}>
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
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        case "Pagado":
          return (
            <div>
              <p className="transaccion-pagado-text">Pago exitoso</p>

              {renderPedidoStatus()}
            </div>
          );
        case "Rechazada":
          return (
            <div>
              <p className="transaccion-rechazado-text">
                Su método de pago fue rechazado
              </p>

              {renderPedidoStatus()}
              {pagaConYape && (
                <>
                  <div>
                    <h3 className="">
                      Paga con Yape, envíanos una captura por WhatsApp.
                    </h3>
                  </div>

                  <div>
                    <img
                      src="/images/yape.jpg"
                      width={200}
                      alt="Yape"
                      className="yape-image"
                    />
                  </div>

                  <div>
                    {!copiedToClipboard && <b>{yapeNumber}</b>}
                    <button className="copiar" onClick={handleCopyToClipboard}>
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
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        default:
          return null;
      }
    }

    return null;
  };

  const handleTimeout = () => {
    console.log(
      "¡Gracias por tu compra! Estamos esperando la confirmación de tu pago, por favor comunícate con nosotros!"
    );
    // Perform actions when the timer reaches zero
    alert(
      "¡Gracias por tu compra! Estamos esperando la confirmación de tu pago, por favor comunícate con nosotros!"
    );
  };

  // Assuming detallesPedido is an object containing pedido details
  const formattedCreatedAt = pedidoConfirmado?.createdAt
    ? new Date(pedidoConfirmado.createdAt).toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";
  const formattedCreatedTime = pedidoConfirmado?.createdAt
    ? new Date(pedidoConfirmado.createdAt).toLocaleTimeString("es-PE", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "-";

  const formattedUpdatedAt = pedidoConfirmado?.updatedAt
    ? new Date(pedidoConfirmado.updatedAt).toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      " a las " +
      new Date(pedidoConfirmado.updatedAt).toLocaleTimeString("es-PE", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "-";

  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

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

  return (
    <div className="content-container">
      <div className="pedido-detalle-container">
        <section className="pedido-details">
          <dl>
            <dt>
              <div className="id-pedido">
                <span className="s1">ID de pedido: </span>
                <span className="s2">{pedidoConfirmado?.id}</span>
              </div>
              {/* <div>
                <span className="s1">track ID: </span>
                <span className="s2">{pedidoConfirmado?.trackId}</span>
              </div> */}
            </dt>
            <dd></dd>

            <dt>Fecha de pedido:</dt>
            <dd>
              {formattedCreatedAt} a las {formattedCreatedTime}
            </dd>
          </dl>
        </section>

        {renderTransaccionStatus()}
          <OrderStatusIndicator currentStatus={pedidoConfirmado?.estado_pedido} />
        
        {transacciones[pedidoId]?.estado_transaccion === "Pendiente" ? (
          <dd>
            <button className="enviar-comprobante">
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://api.whatsapp.com/send?phone=+51913687390&text=
        Hola! hice un pedido desde la web el ${formattedCreatedAt} a las ${formattedCreatedTime}%0D%0A
        Pagué S/. ${
          pedidoConfirmado?.monto_total.toFixed(2) || "-"
        } con yape.%0D%0A%0D%0A
        ID de pedido: ${pedidoConfirmado?.id}%0D%0A
        Track ID: ${pedidoConfirmado?.trackId}%0D%0A
        Nombre: ${pedidoConfirmado?.nombre}%0D%0A
        Dirección de entrega: ${pedidoConfirmado?.direccion_envio}%0D%0A
      `}
              >
                Enviar comprobante
              </a>
            </button>
          </dd>
        ) : (
          ""
        )}
        <section className="pedido-details">
          <dl>
            <dt>Método de pago</dt>
            <dd>
              {pagaConYape ? (
                <div>
                  <p>
                    Yape{" "}
                    {transacciones[pedidoId]?.estado_transaccion ===
                    "Pendiente" ? (
                      <>
                        {!copiedToClipboard && <b>{yapeNumber}</b>}
                        <button
                          className="copiar"
                          onClick={handleCopyToClipboard}
                        >
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
                        </button>
                      </>
                    ) : (
                      ""
                    )}{" "}
                  </p>
                </div>
              ) : (
                <span>{transacciones[pedidoId]?.metodo_pago}</span>
              )}
            </dd>

            <dt>Monto total</dt>
            <dd>S/. {pedidoConfirmado?.monto_total.toFixed(2) || "-"}</dd>

            {/* <dt>Subtotal</dt>
            <dd>
              S/.{" "}
              {(
                pedidoConfirmado?.monto_total - pedidoConfirmado?.costo_envio
              ).toFixed(2) || "-"}
            </dd>

            <dt>Costo de envío</dt>
            <dd>S/. {pedidoConfirmado?.costo_envio.toFixed(2) || "-"}</dd> */}

            <dt>Nombre de cliente</dt>
            <dd>{pedidoConfirmado?.nombre || "-"}</dd>

            <dt>Teléfono</dt>
            <dd>{pedidoConfirmado?.telefono || "-"}</dd>

            <dt>Email</dt>
            <dd>{pedidoConfirmado?.email || "-"}</dd>

            <dt>Dirección de entrega</dt>
            <dd>{pedidoConfirmado?.direccion_envio || "-"}</dd>
          </dl>
        </section>
        <div className="pedido-card-container">
          {Array.isArray(detallesPedido) && detallesPedido.length > 0 ? (
            detallesPedido.map((detalle, index) => {
              const productoDelDetalle = productosOriginales.find(
                (producto) => producto.producto_id === detalle.producto_id
              );
              return (
                <React.Fragment key={index}>
                  <article className="pedido-card">
                    <img
                      alt="imagen del producto"
                      src={productoDelDetalle?.img || "-"}
                      width={200}
                    />
                    <div>
                      <p>{productoDelDetalle?.nombre || "-"}</p>
                      <p>
                        <strong>Cantidad:</strong> {detalle.cantidad}
                      </p>
                      <p>
                        <strong>Precio Unitario:</strong> S/.{" "}
                        {detalle.precio_unitario.toFixed(2)}
                      </p>
                    </div>
                  </article>
                </React.Fragment>
              );
            })
          ) : (
            <p>No hay detalles disponibles para este pedido.</p>
          )}
        </div>
      </div>
    </div>
  );
  return null;
};

export default PedidoDetalle;
