import React, { useState, useEffect } from "react";
import { useShoppingContext } from "../../ShoppingContext";
import axios from "axios";
import "./MisPedidos.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

const MisPedidos = () => {
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
  } = useShoppingContext();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false); // Nuevo estado

  const [sortOrder, setSortOrder] = useState("desc");
  const [filterEstado, setFilterEstado] = useState("");

  const [circleColor, setCircleColor] = useState("#ffcccb"); // Inicializado con el mismo color que el fondo seleccionado

  const handleSortChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const handleFilterChange = (e) => {
    const newFilterEstado = e.target.value;
    setFilterEstado(newFilterEstado);
  };

  const handleForceUpdate = () => {
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
        authenticatedUserId = response.data.user.id; // Modifica esta línea
    
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
  }, [forceUpdate]); // Dependencia añadida para forzar la actualización

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
        {filteredPedidos.length > 0 ? (
          <h2>Historial de pedidos: {filteredPedidos.length}</h2>
        ) : (
          <h2>No tienes pedidos aún. Haz click para cargarlos.</h2>
        )}
        <p>Haz click en un pedido para ver sus detalles</p>
        <div>
          <button
            onClick={handleForceUpdate}
            className={
              filteredPedidos.length === 0
                ? "red-background"
                : "black-background"
            }
          >
            Cargar Pedidos
          </button>
          <label>
            Ordenar por:
            <select value={sortOrder} onChange={handleSortChange}>
              <option value="desc">Más reciente</option>
              <option value="asc">Más antiguo</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Filtrar por estado:
            <select value={filterEstado} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="Activo">En proceso</option>
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
                <li className="direccion">
                  {pedidos.find((pedido) => pedido.id)?.direccion_envio}
                </li>
                <li className="monto_total">
                  <b>S/. {pedido.monto_total.toFixed(2)}</b>
                </li>
                <li className="ver-detalles">
                  <button
                    id="ver-detalles"
                    onClick={() => handlePedidoClick(pedido)}
                  >
                    {pedido.estado_pedido === "Activo"
                      ? "detalles del pedido"
                      : "detalles del pedido"}{" "}
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

              {selectedPedido === pedido && (
                <li>
                  <ul>
                    <div className="flex-space-between">
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
                      <li>{selectedPedido.nombre}</li>
                      <li>{selectedPedido.telefono}</li>
                      <li>{selectedPedido.email}</li>
                      <li>{selectedPedido.direccion_envio}</li>
                      <li>
                        <strong>Realizado el:</strong>{" "}
                        {formatDate(selectedPedido.createdAt)}
                      </li>
                      <li>
                        <strong>a las:</strong>{" "}
                        {formatTime(selectedPedido.createdAt)}
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

                    {selectedPedido === pedido && (
                      <li>
                        <ul>
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
                              <span className="flex-end">
                                total S/. {pedido.monto_total.toFixed(2)}
                              </span>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </li>
                    )}
                    {transacciones[pedido.id]?.metodo_pago === "Yape" &&
                    (transacciones[pedido.id]?.estado_transaccion ===
                      "Pendiente" ||
                      transacciones[pedido.id]?.estado_transaccion ===
                        "Rechazada") ? (
                      <img
                        src="/images/yape.jpg"
                        width={200}
                        alt="Yape"
                        className="yape-image"
                      />
                    ) : (
                      ""
                    )}
                    {transacciones[pedido.id]?.estado_transaccion ===
                      "Pendiente" ||
                    transacciones[pedido.id]?.estado_transaccion ===
                      "Rechazada" ? (
                      <div className="enviar-comprobante">
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`https://api.whatsapp.com/send?phone=+51913687390&text=ID de pedido: ${selectedPedido.id}%0D%0ANombre: ${selectedPedido.nombre}%0D%0ADirección de entrega: ${selectedPedido.direccion_envio}`}
                        >
                          Enviar comprobante
                        </a>
                      </div>
                    ) : (
                      ""
                    )}
                  </ul>
                </li>
              )}
            </ul>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MisPedidos;
