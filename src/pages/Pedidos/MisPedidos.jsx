import React, { useState, useEffect } from "react";
import { useShoppingContext } from "../../ShoppingContext";
import axios from "axios";
import "./MisPedidos.css";

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
        authenticatedUserId = response.data.id;

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
        <h2>Historial de pedidos: {filteredPedidos.length}</h2>
        <p>Haz click en el pedido para ver sus detalles</p>
        <div>
          <button onClick={handleForceUpdate}>Actualizar Pedidos</button>
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
            Estado de pedido:
            <select value={filterEstado} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="En camino">En camino</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </label>
        </div>
      </div>
      <div className="pedido-card-container">
        {applySortAndFilter(filteredPedidos).map((pedido) => (
          <React.Fragment key={pedido.id}>
            <ul
              className={`${
                selectedPedido === pedido ? "selected " : ""
              }pedido-card ${
                pedido.estado_pedido === "Finalizado" ? "finalizado" : ""
              } ${pedido.estado_pedido === "En camino" ? "en-camino" : ""}`}
            >
              <li className="id-estado">
                <div>{pedido.estado_pedido}</div>
                <div id="id-pedido">
                  <span id="id">ID</span> <span id="pedidoID">{pedido.id}</span>
                </div>
              </li>
              <li>
                <b>S/. {pedido.monto_total.toFixed(2)}</b>
              </li>
              <li>
                <button
                  id="ver-detalles"
                  onClick={() => handlePedidoClick(pedido)}
                >
                  {pedido.estado_pedido === "Activo"
                    ? "Enviar comprobante de pago"
                    : "Detalles del pedido"}
                </button>
              </li>
              {selectedPedido === pedido && (
                <li>
                  <ul>
                    <li>
                      <strong>Estado de Pago:</strong>{" "}
                      {transacciones[pedido.id]?.estado_transaccion}
                    </li>

                    <li>
                      <strong>Método de pago:</strong>{" "}
                      {transacciones[pedido.id]?.metodo_pago}
                    </li>
                    <div className="enviar-comprobante">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://api.whatsapp.com/send?phone=+51949833976&text=ID de pedido: ${selectedPedido.id}%0D%0ANombre: ${selectedPedido.nombre}%0D%0ADirección de entrega: ${selectedPedido.direccion_envio}`}
                      >
                        Enviar comprobante
                      </a>
                    </div>
                    <li>
                      <strong>{selectedPedido.nombre}</strong>
                    </li>
                    <li>
                      <strong>Teléfono:</strong> {selectedPedido.telefono}
                    </li>
                    <li>
                      <strong>Email:</strong> {selectedPedido.email}
                    </li>
                    <li>
                      <strong>Dirección de entrega:</strong>{" "}
                      {selectedPedido.direccion_envio}
                    </li>

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
                                      margin: "0 auto",
                                      textAlign: "center",
                                    }}
                                  >
                                    <span>{detalle.cantidad}</span>
                                    <span>{productoDelDetalle?.nombre}</span>
                                    <span>
                                      S/. {detalle.precio_unitario.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <li>
                              No hay detalles disponibles para este pedido.
                            </li>
                          )}
                        </ul>
                      </li>
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
