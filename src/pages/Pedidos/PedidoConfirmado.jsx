import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import axios from "axios";
import "./PedidoConfirmado.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const PedidoDetalle = () => {
  const yapeNumber = 913687390;
  const {
    obtenerDetallesPedido,
    detallesPedido,
    obtenerProductos,
    productosOriginales,
  } = useShoppingContext();
  const { pedidoId } = useParams();
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [transacciones, setTransacciones] = useState({});
  const [loading, setLoading] = useState(true);
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
  }, [pedidoId, obtenerDetallesPedido, obtenerProductos]);

  const renderPedidoStatus = () => {
    if (!loading) {
      const { estado_pedido } = pedidoConfirmado;

      switch (estado_pedido) {
        case "Activo":
          return (
            <div>
              <h4>¡Gracias por tu compra, {pedidoConfirmado?.nombre}!</h4>
              <h2 className="pedido-titulo activo-text">
                ¡Hemos recibido tu pedido y está siendo revisado!
              </h2>
              {pagaConYape && (
                <>
                  <div>
                    <h3 className="">
                      Para completar tu pedido, por favor envíanos una{" "}
                      <b>captura de pantalla</b> de la{" "}
                      <b>transacción en Yape</b> por WhatsApp.
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
                    <b>{yapeNumber}</b>
                    <button className="copiar" onClick={handleCopyToClipboard}>
                      {!copiedToClipboard && (
                        <span>
                            <FontAwesomeIcon icon={faCopy} /> Copiar
                         
                        </span>
                      )}
                      {copiedToClipboard && (
                        <span className="numero-copiado">
                          Número copiado al portapapeles{" "}
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        case "En camino":
          return (
            <div className="mg-b-10">
              <h2 className="pedido-titulo en-camino-text">
                Tu pedido está en camino
              </h2>
              <b style={{ textAlign: "center" }}>
                Pedido confirmado el {formattedUpdatedAt}
              </b>
              {pagaConYape && (
                <>
                  <div>
                    <h3 className="">
                      Para completar tu pedido, por favor envíanos una{" "}
                      <b>captura de pantalla</b> de la{" "}
                      <b>transacción en Yape</b> por WhatsApp.
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
                    <b>{yapeNumber}</b>
                    <button className="copiar" onClick={handleCopyToClipboard}>
                      {!copiedToClipboard && (
                        <span>
                            <FontAwesomeIcon icon={faCopy} /> Copiar
                          
                        </span>
                      )}
                      {copiedToClipboard && (
                        <span className="numero-copiado">
                          Número copiado al portapapeles{" "}
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        case "Finalizado":
          return (
            <div className="mg-b-10">
              <h2 className="pedido-titulo finalizado-text">
                ¡Tu pedido ha sido entregado con éxito!
              </h2>
              <b style={{ textAlign: "center" }}>
                Pedido entregado el {formattedUpdatedAt}
              </b>
              {pagaConYape && (
                <>
                  <div>
                    <h3 className="">
                      Para completar tu pedido, por favor envíanos una{" "}
                      <b>captura de pantalla</b> de la{" "}
                      <b>transacción en Yape</b> por WhatsApp.
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
                    <b>{yapeNumber}</b>
                    <button className="copiar" onClick={handleCopyToClipboard}>
                      {!copiedToClipboard && (
                        <span>
                          <FontAwesomeIcon icon={faCopy} /> Copiar
                        </span>
                      )}
                      {copiedToClipboard && (
                        <span className="numero-copiado">
                          Número copiado al portapapeles{" "}
                          <FontAwesomeIcon icon={faCheckCircle} />
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

  const renderTransaccionStatus = () => {
    if (!loading) {
      const { estado_transaccion } = transacciones[pedidoId];

      switch (estado_transaccion) {
        case "Pendiente":
          return (
            <p className="transaccion-pendiente-text">
              Esperando confirmación de pago
            </p>
          );
        case "Pagado":
          return <p className="transaccion-pagado-text">Pago recibido</p>;
        case "Rechazado":
          return <p className="transaccion-rechazado-text">Pago rechazado</p>;
        default:
          return null;
      }
    }

    return null;
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
        {renderPedidoStatus()}

        <dt>{renderTransaccionStatus()}</dt>
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
            <dt>
              <div className="id-pedido">
                <span className="s1">ID de pedido: </span>
                <span className="s2">{pedidoConfirmado?.id}</span>
              </div>
            </dt>
            <dd></dd>

            <dt>Fecha de creación</dt>
            <dd>
              {formattedCreatedAt} a las {formattedCreatedTime}
            </dd>

            <dt>Método de pago</dt>
            <dd>
              {pagaConYape ? (
                <div>
                  <p>
                    Yape{" "}
                    {transacciones[pedidoId]?.estado_transaccion ===
                    "Pendiente" ? (
                      <>
                        <b>{yapeNumber}</b>
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
                              Número copiado al portapapeles{" "}
                              <FontAwesomeIcon icon={faCheckCircle} />
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

            <dt>Subtotal</dt>
            <dd>
              S/.{" "}
              {(
                pedidoConfirmado?.monto_total - pedidoConfirmado?.costo_envio
              ).toFixed(2) || "-"}
            </dd>

            <dt>Costo de envío</dt>
            <dd>S/. {pedidoConfirmado?.costo_envio.toFixed(2) || "-"}</dd>

            <dt>Monto total</dt>
            <dd>S/. {pedidoConfirmado?.monto_total.toFixed(2) || "-"}</dd>

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
};

export default PedidoDetalle;
