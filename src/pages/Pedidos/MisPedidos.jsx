import React, { useState, useEffect } from "react";
import { useShoppingContext } from "../../ShoppingContext";
import axios from "axios";
import "./MisPedidos.css";
import { Navigate, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faTimes,
  faCopy,
  faCheckCircle,
  faPlus,
  faSync,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../AuthContext";
import { Link } from "react-router-dom";

const MisPedidos = () => {
  const navigate = useNavigate();
  const yapeNumber = 986734669;
  const [selectedPedido, setSelectedPedido] = useState(null);
  const {
    obtenerUsuarios,
    obtenerPedidos,
    obtenerProductos,
    obtenerDetallesPedido,
    detallesPedido,
    pedidos,
    productosOriginales,
  } = useShoppingContext();
  const { authenticatedUser } = useAuth();
  const [transacciones, setTransacciones] = useState({});
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false); // Nuevo estado

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          obtenerUsuarios(),
          obtenerPedidos(),
          obtenerProductos(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // No se actualiza al cambiar algún estado, solo se ejecuta al montar el componente

  useEffect(() => {
    let authenticatedUserId;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/verify-auth`,
          { withCredentials: true }
        );

        if (response.data.isAuthenticated) {
          await Promise.all([
            obtenerUsuarios(),
            obtenerPedidos(),
            obtenerProductos(),
          ]);
        }

        setIsAuthenticated(response.data.isAuthenticated);
        authenticatedUserId = response.data.user.id;
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [forceUpdate]);

  const obtenerTransaccion = async (pedidoId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/transacciones_pago/${pedidoId}`
      );
      const transaccionData = response.data;

      setTransacciones((prevTransacciones) => ({
        ...prevTransacciones,
        [pedidoId]: transaccionData,
      }));
    } catch (error) {
      console.error("Error al obtener la transacción:", error);
    }
  };

  const handlePedidoClick = async (pedido) => {
    if (selectedPedido && selectedPedido.id === pedido.id) {
      setSelectedPedido(null);
    } else {
      setSelectedPedido(pedido);
      await obtenerTransaccion(pedido.id);

      try {
        await obtenerDetallesPedido(pedido.id, "/registro-de-pedidos");
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
      }
    }
  };

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
  function formatDate(dateString) {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      " a las " +
      new Date(dateString).toLocaleTimeString("es-PE", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  }

  // Ordenar los pedidos de más recientes a más antiguos
  const sortedPedidos = pedidos.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  const handleForceUpdateClick = () => {
    setForceUpdate((prevForceUpdate) => !prevForceUpdate);
  };

  const handleNuevoPedidoClick = () => {
    navigate("/shop");
  };

  // Número de WhatsApp y mensaje
  const phoneNumber = "+51986734669";
  const message = "¡Hola Don Gatto! Necesito ayuda con un pedido.";

  // Crear la URL de WhatsApp
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
    message
  )}`;

  if (loading) {
    return (
      <div className="content-container">
        <div className="section-title">
          <h2>Cargando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="mis-pedidos-container">
        <div className="section-title">
          <h1>
            <span style={{ fontWeight: "normal" }}>Bienvenido</span>,{" "}
            <b>{authenticatedUser.nombre}</b>
          </h1>
          <div className="flex-space-around">
            <button className="update" onClick={handleForceUpdateClick}>
              <FontAwesomeIcon icon={faSync} /> Actualizar
            </button>
            <button className="nuevo-pedido" onClick={handleNuevoPedidoClick}>
              <FontAwesomeIcon icon={faPlus} /> Nuevo Pedido
            </button>
            <div className="soporte">
              <div>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon className="headset-icon" icon={faHeadset} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pedido-card-container">
          {sortedPedidos
            .filter((pedido) => pedido.user_id === authenticatedUser.id)
            .map((pedido) => (
              <React.Fragment key={pedido.id}>
                <ul className="pedido-card">
                  <div className="pedido-preview">
                    <li className="id-estado">
                      <div className="flex-space-between">
                        <div>
                          {pedido.estado_pedido === "Activo"
                            ? "En revisión"
                            : pedido.estado_pedido}
                        </div>

                        <div
                          id="status-circle-2"
                          className={`${
                            selectedPedido === pedido ? "selected " : ""
                          } ${
                            pedido.estado_pedido === "Finalizado"
                              ? "finalizado"
                              : ""
                          } ${
                            pedido.estado_pedido === "En camino"
                              ? "animar2"
                              : ""
                          }${
                            pedido.estado_pedido === "Activo" ? "activo" : ""
                          }`}
                        >
                          <div
                            id="status-circle"
                            className={`${
                              selectedPedido === pedido ? "selected " : ""
                            } ${
                              pedido.estado_pedido === "Finalizado"
                                ? "finalizado"
                                : ""
                            } ${
                              pedido.estado_pedido === "En camino"
                                ? "en-camino animar"
                                : ""
                            }${
                              pedido.estado_pedido === "Activo" ? "activo" : ""
                            }`}
                          ></div>
                        </div>
                        <div>
                          <span id="id">ID</span>{" "}
                          <span id="pedidoID">{pedido.id}</span>
                        </div>
                      </div>
                    </li>
                    <li className="direccion">{pedido.direccion_envio}</li>
                    <li className="monto_total">
                      <b>S/. {pedido.monto_total.toFixed(2)}</b>
                    </li>
                    <li>
                      <strong>Realizado el:</strong>{" "}
                      {formatDate(pedido.createdAt)}
                    </li>
                    <li>
                      <strong>a las:</strong> {formatTime(pedido.createdAt)}
                    </li>

                    <li>
                      <button>
                        <Link
                          to={`/pedido-confirmado/${pedido.id}/${pedido.trackId}}`}
                        >
                          Seguir Pedido
                        </Link>
                      </button>
                    </li>
                    <li className="ver-detalles">
                      <button
                        id="ver-detalles"
                        onClick={() => handlePedidoClick(pedido)}
                      >
                        {pedido.estado_pedido === "Activo"
                          ? "resumen"
                          : "resumen"}{" "}
                        <FontAwesomeIcon
                          icon={
                            selectedPedido && selectedPedido.id === pedido.id
                              ? faAngleUp
                              : faAngleDown
                          }
                        />
                      </button>
                    </li>
                  </div>
                </ul>

                {selectedPedido === pedido && (
                  <>
                    <div
                      className="detalles-card-container"
                      onClick={() => setSelectedPedido(null)}
                    ></div>
                    <div className="detalles-card">
                      <div className="c-b-container">
                        <button
                          className="detalles-card-close-btn"
                          onClick={() => setSelectedPedido(null)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>

                      <ul>
                        <div className="flex-space-between mg-r-10">
                          <li>
                            <strong>Método:</strong>{" "}
                            {transacciones[pedido.id]?.metodo_pago ===
                            "TarjetaDebitoCredito" ? (
                              <span>Tarjeta</span>
                            ) : (
                              <span>
                                {transacciones[pedido.id]?.metodo_pago}
                              </span>
                            )}
                          </li>

                          <li
                            className={
                              transacciones[pedido.id]?.estado_transaccion ===
                                "Pendiente" ||
                              transacciones[pedido.id]?.estado_transaccion ===
                                "Rechazada"
                                ? "red"
                                : "green"
                            }
                          >
                            {transacciones[pedido.id]?.estado_transaccion ===
                            "Pendiente"
                              ? `Pago ${
                                  transacciones[pedido.id]?.estado_transaccion
                                }`
                              : transacciones[pedido.id]?.estado_transaccion ||
                                "cargando..."}
                          </li>
                        </div>

                        <div className="datos-pedido">
                          {/* <li>{selectedPedido.nombre}</li>
                  <li>{selectedPedido.telefono}</li>
                  <li>{selectedPedido.email}</li> */}
                          <li>{selectedPedido.direccion_envio}</li>
                          <li>
                            <strong>Realizado el:</strong>{" "}
                            {formatDate(selectedPedido.createdAt)}
                          </li>
                          <li>
                            <strong>a las:</strong>{" "}
                            {formatTime(selectedPedido.createdAt)}
                          </li>
                          <li>
                            <p className="flex-end">
                              <b>total:</b> S/. {pedido.monto_total.toFixed(2)}
                            </p>
                          </li>
                          {selectedPedido.estado_pedido === "En camino" && (
                            <>
                              <li>
                                Su pedido está en camino a{" "}
                                {selectedPedido.direccion_envio}, salió el{" "}
                                {formatDate(selectedPedido.updatedAt)} a las{" "}
                                {formatTime(selectedPedido.updatedAt)}
                              </li>
                            </>
                          )}
                          {selectedPedido.estado_pedido === "Finalizado" && (
                            <>
                              <li>
                                <strong>Fecha de Entrega:</strong>{" "}
                                {formatDate(selectedPedido.updatedAt)}
                              </li>
                              <li>
                                <strong>Hora de Entrega:</strong>{" "}
                                {formatTime(selectedPedido.updatedAt)}
                              </li>
                            </>
                          )}
                        </div>

                        {transacciones[pedido.id]?.metodo_pago === "Yape" &&
                        (transacciones[pedido.id]?.estado_transaccion ===
                          "Pendiente" ||
                          transacciones[pedido.id]?.estado_transaccion ===
                            "Rechazada") ? (
                          <>
                            <img
                              src="/images/yape.jpg"
                              width={200}
                              alt="Yape"
                              className="yape-image"
                            />
                          </>
                        ) : (
                          ""
                        )}

                        {transacciones[pedido.id]?.estado_transaccion ===
                          "Pendiente" ||
                        transacciones[pedido.id]?.estado_transaccion ===
                          "Rechazada" ? (
                          <div>
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
                                  <FontAwesomeIcon icon={faCheckCircle} />{" "}
                                  Número copiado
                                </span>
                              )}
                            </button>
                          </div>
                        ) : (
                          ""
                        )}

                        {transacciones[pedido.id]?.estado_transaccion ===
                          "Pendiente" ||
                        transacciones[pedido.id]?.estado_transaccion ===
                          "Rechazada" ? (
                          <div>
                            <button className="enviar-comprobante">
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={`https://api.whatsapp.com/send?phone=+51913687390&text=ID de pedido: ${selectedPedido.id}%0D%0ANombre: ${selectedPedido.nombre}%0D%0ADirección de entrega: ${selectedPedido.direccion_envio}`}
                              >
                                Enviar comprobante
                              </a>
                            </button>
                          </div>
                        ) : (
                          ""
                        )}

                        {selectedPedido === pedido && (
                          <div>
                            <ul>
                              <h3 className="resumen-detalles">
                                Detalles del pedido
                              </h3>
                              {detallesPedido &&
                              detallesPedido.detalles &&
                              detallesPedido.detalles.length > 0 ? (
                                detallesPedido.detalles.map(
                                  (detalle, index) => {
                                    const productoDelDetalle =
                                      productosOriginales.find(
                                        (producto) =>
                                          producto.producto_id ===
                                          detalle.producto_id
                                      );
                                    return (
                                      <div
                                        className="detalle-mi-pedido"
                                        key={index}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "8px",
                                            borderBottom: "1px solid #ccc",
                                          }}
                                        >
                                          <div style={{ flex: 1 }}>
                                            <span>{detalle.cantidad}</span>{" "}
                                            <span>
                                              {productoDelDetalle?.nombre}
                                            </span>
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <img
                                              alt={`Imagen del producto ${productoDelDetalle?.nombre}`}
                                              src={productoDelDetalle?.img}
                                              height={80}
                                              style={{ marginRight: "16px" }}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              flex: 1,
                                              textAlign: "right",
                                            }}
                                          >
                                            <span>
                                              S/.{" "}
                                              {detalle.precio_unitario.toFixed(
                                                2
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                )
                              ) : (
                                <li>Cargando detalles del pedido...</li>
                              )}
                            </ul>
                            {detallesPedido && detallesPedido.detalles && (
                              <>
                                {detallesPedido.detalles.length > 1 ||
                                detallesPedido.detalles.some(
                                  (detalle) => detalle.cantidad > 1
                                ) ? (
                                  <div className="costo-envio-total">
                                    <p className="subtotal">
                                      <b>Subtotal:</b> S/.{" "}
                                      {(
                                        pedido.monto_total - pedido.costo_envio
                                      ).toFixed(2)}
                                    </p>
                                    <p className="costo-envio">
                                      <b>Costo de envío:</b> S/.{" "}
                                      {pedido.costo_envio.toFixed(2)}
                                    </p>
                                    <p className="flex-end">
                                      <b>total:</b> S/.{" "}
                                      {pedido.monto_total.toFixed(2)}
                                    </p>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MisPedidos;
