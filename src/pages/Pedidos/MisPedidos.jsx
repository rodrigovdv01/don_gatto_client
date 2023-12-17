import React, { useState, useEffect } from "react";
import { useShoppingContext } from "../../ShoppingContext";
import axios from "axios";
import "./MisPedidos.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faTimes,
  faCopy,
  faCheckCircle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../AuthContext";
import { Link } from "react-router-dom";

const MisPedidos = () => {
  const yapeNumber = 913687390;
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [transacciones, setTransacciones] = useState({});
  const {
    obtenerUsuarios,
    obtenerPedidos,
    pedidos,
    obtenerProductos,
    productosOriginales,
    obtenerDetallesPedido,
    detallesPedido,
    costoEnvio,
  } = useShoppingContext();

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false); // Nuevo estado

  const [sortOrder, setSortOrder] = useState("desc");
  const [filterEstado, setFilterEstado] = useState("");

  const { authenticatedUser } = useAuth();

  const handleSortChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const handleFilterChange = (e) => {
    const newFilterEstado = e.target.value;
    setFilterEstado(newFilterEstado);
  };

  const handleForceUpdate = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    setForceUpdate((prevForceUpdate) => !prevForceUpdate);
  };

  const applySortAndFilter = (pedidos) => {
    let sortedAndFilteredPedidos = [...pedidos];

    sortedAndFilteredPedidos.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });

    if (filterEstado) {
      sortedAndFilteredPedidos = sortedAndFilteredPedidos.filter(
        (pedido) => pedido.estado_pedido === filterEstado
      );
    }

    return sortedAndFilteredPedidos;
  };

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

        if (response.data.isAuthenticated) {
          const filteredPedidos = authenticatedUserId
            ? pedidos.filter((pedido) => pedido.user_id === authenticatedUserId)
            : pedidos;

          setFilteredPedidos(filteredPedidos);
        }
      } catch (error) {
        console.error("Error al verificar la autenticación:", error.message);
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

      setTransacciones((prevTransacciones) => {
        return {
          ...prevTransacciones,
          [pedidoId]: transaccionData,
        };
      });
    } catch (error) {
      console.error("Error al obtener la transacción:", error);

      if (error.response) {
        console.error(
          "Server responded with error status:",
          error.response.status
        );
      } else if (error.request) {
        console.error("No response received from the server.");
      } else {
        console.error("Error setting up the request:", error.message);
      }
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  }

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
      <div className="section-title">
        <h1>
          <span style={{ fontWeight: "normal" }}>Bienvenido</span>,{" "}
          <b>{authenticatedUser.nombre}</b>
        </h1>
        {filteredPedidos.length > 0 ? (
          <h2>Pedidos realizados: {filteredPedidos.length}</h2>
        ) : filteredPedidos.some(
            (pedido) => pedido.estado_pedido === "Activo"
          ) ? (
          <div>Hola</div>
        ) : (
          <h2>
            Revisa tu historial de pedidos aquí. Haz click para cargarlos.
          </h2>
        )}
        <p>Haz click en un pedido para ver sus detalles</p>
        <div>
          <div className="mis-pedidos-actions">
            <button
              onClick={(e) => handleForceUpdate(e)}
              className={
                filteredPedidos.length === 0
                  ? "red-background"
                  : "black-background"
              }
            >
              {filteredPedidos.length === 0 && "Cargar Pedidos"}
              {filteredPedidos.length !== 0 && "Actualizar"}
            </button>
            <button className="nuevo-pedido">
              <Link to="/menu" target="_blank">
                <FontAwesomeIcon icon={faPlus} /> Nuevo Pedido
              </Link>
            </button>
          </div>
          <label>
            Ordenar por:{" "}
            <select value={sortOrder} onChange={handleSortChange}>
              <option value="desc">Más reciente</option>
              <option value="asc">Más antiguo</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Filtrar por estado:{" "}
            <select value={filterEstado} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="Activo">Pedidos activos</option>
              <option value="En camino">En camino</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </label>
        </div>
      </div>

      <div className="pedido-card-container">
        {applySortAndFilter(filteredPedidos).map((pedido) => (
          <React.Fragment key={pedido.id}>
            <ul className="pedido-card">
              <div className="pedido-preview">
                <li className="id-estado">
                  <div className="flex">
                    <div>{pedido.estado_pedido}</div>

                    <div
                      id="status-circle"
                      className={`${
                        selectedPedido === pedido ? "selected " : ""
                      } ${
                        pedido.estado_pedido === "Finalizado"
                          ? "finalizado"
                          : ""
                      } ${
                        pedido.estado_pedido === "En camino" ? "en-camino" : ""
                      }${pedido.estado_pedido === "Activo" ? "activo" : ""}`}
                    ></div>
                  </div>

                  <div className="">
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
                  <button>
                    <Link to={`/pedido-confirmado/${pedido.id}`}>
                      Seguir Pedido
                    </Link>
                  </button>
                </li>
                <li className="ver-detalles">
                  <button
                    id="ver-detalles"
                    onClick={() => handlePedidoClick(pedido)}
                  >
                    {pedido.estado_pedido === "Activo" ? "resumen" : "resumen"}{" "}
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
                          <span>{transacciones[pedido.id]?.metodo_pago}</span>
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
                              <FontAwesomeIcon icon={faCheckCircle} /> Número
                              copiado
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
                            detallesPedido.detalles.map((detalle, index) => {
                              const productoDelDetalle =
                                productosOriginales.find(
                                  (producto) =>
                                    producto.producto_id === detalle.producto_id
                                );
                              return (
                                <div className="detalle-mi-pedido" key={index}>
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
                                      <span>{productoDelDetalle?.nombre}</span>
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
                                      style={{ flex: 1, textAlign: "right" }}
                                    >
                                      <span>
                                        S/. {detalle.precio_unitario.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
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
  );
};

export default MisPedidos;
