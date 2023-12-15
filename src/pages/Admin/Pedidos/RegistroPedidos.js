import React, { useState, useEffect } from "react";
import { useShoppingContext } from "../../../ShoppingContext";
import axios from "axios";
import "./RegistroPedidos.css";
import "../../../components/Header/Header.css";

const RegistroPedidos = () => {
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [transacciones, setTransacciones] = useState({});
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterEstado, setFilterEstado] = useState("");
  const {
    obtenerUsuarios,
    usuariosOriginales,
    obtenerPedidos,
    pedidos,
    setPedidos,
    obtenerProductos,
    productosOriginales,
    obtenerDetallesPedido,
    detallesPedido,
  } = useShoppingContext();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/verify-auth`, {
        withCredentials: true,
      })
      .then((response) => {
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error al verificar la autenticación:", error);
        setIsAuthenticated(false);
      });
    obtenerUsuarios();
    obtenerProductos();
    obtenerPedidos();

  }, [isAuthenticated]);

  const sortPedidos = async () => {
    // Wait for obtenerPedidos to complete

    // Ordenar los pedidos según la opción seleccionada
    const pedidosOrdenados = [...pedidos]
      .filter(
        (pedido) => filterEstado === "" || pedido.estado_pedido === filterEstado
      )
      .sort((a, b) => {
        const fechaA = new Date(a.createdAt);
        const fechaB = new Date(b.createdAt);

        // Ordenar de más reciente a más antiguo si el orden es 'desc'
        // Ordenar de más antiguo a más reciente si el orden es 'asc'
        return sortOrder === "desc" ? fechaB - fechaA : fechaA - fechaB;
      });

    setPedidos(pedidosOrdenados);
  };

  useEffect(() => {
    sortPedidos();
  }, [pedidos, sortOrder]);

  // Función para formatear la hora
  const formatTime = (createdAt) => {
    return new Date(createdAt).toLocaleTimeString("es-PE", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Función para formatear la fecha
  const formatDate = (createdAt) => {
    return new Date(createdAt).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const obtenerTransaccion = async (pedidoId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/transacciones_pago/${pedidoId}`
      );
      const transaccionData = response.data;

      // Assuming setTransacciones is a function to update state
      setTransacciones((prevTransacciones) => ({
        ...prevTransacciones,
        [pedidoId]: transaccionData,
      }));
    } catch (error) {
      console.error("Error al obtener la transacción:", error);

      // Handle the error accordingly, for example:
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error(
          "Server responded with error status:",
          error.response.status
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  const buscarInformacionUsuario = (user_id) => {
    const usuario = usuariosOriginales.find(
      (usuario) => usuario.id === user_id
    );
    return usuario || {};
  };

  const handlePedidoClick = async (pedido) => {
    // If the clicked pedido is the same as the currently selected one, hide details
    if (selectedPedido && selectedPedido.id === pedido.id) {
      setSelectedPedido(null);
    } else {
      // Otherwise, show details for the clicked pedido
      setSelectedPedido(pedido);
      await obtenerTransaccion(pedido.id);
      try {
        await obtenerDetallesPedido(pedido.id, "/registro-de-pedidos");
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
      }
    }
  };

  const handleTransaccionChange = async (e) => {
    const nuevoEstadoTransaccion = e.target.value;
    const pedidoId = selectedPedido.id;

    try {
      // Update the PUT request URL for updating transactions
      await axios.put(
        `${process.env.REACT_APP_API_URL}/transacciones_pago/${pedidoId}`,
        {
          estado_transaccion: nuevoEstadoTransaccion,
        }
      );

      // Use obtenerTransaccion to get the updated transaction details
      await obtenerTransaccion(pedidoId);

      console.log(
        `Estado de la transacción del pedido ${pedidoId} actualizado a ${nuevoEstadoTransaccion}`
      );
    } catch (error) {
      console.error("Error al actualizar el estado de la transacción:", error);
    }
  };

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/pedidos/${pedidoId}`, {
        estado_pedido: nuevoEstado,
      });

      const nuevosPedidos = pedidos.map((pedido) => {
        if (pedido.id === pedidoId) {
          return { ...pedido, estadoPedido: nuevoEstado };
        }
        return pedido;
      });

      obtenerPedidos(nuevosPedidos);

      console.log(`Estado del pedido ${pedidoId} actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    const pedidoId = selectedPedido.id;

    actualizarEstadoPedido(pedidoId, nuevoEstado);
  };

  const handleFilterChange = (e) => {
    const newFilterEstado = e.target.value;
    setFilterEstado(newFilterEstado);
  };

  const handleSortChange = (e) => {
    const nuevoOrden = e.target.value;
    setSortOrder(nuevoOrden);
  };

  return (
    <div className="content-container">
      <h2>Registro de Pedidos</h2>
      <label htmlFor="filtroEstadoSelect">Filtrar por Estado:</label>
      <select
        id="filtroEstadoSelect"
        value={filterEstado}
        onChange={handleFilterChange}
      >
        <option value="">Todos</option>
        <option value="Activo">Nuevos</option>
        <option value="En camino">En camino</option>
        <option value="Finalizado">Entregado</option>
        {/* Add more filter options as needed */}
      </select>

      <label htmlFor="ordenSelect">Ordenar por:</label>
      <select id="ordenSelect" value={sortOrder} onChange={handleSortChange}>
        <option value="desc">Más reciente</option>
        <option value="asc">Más antiguo</option>
        {/* <option value="userName">Nombre del usuario (A-Z)</option> */}
        {/* Add more sorting options as needed */}
      </select>
      <table className="tabla-registro-de-pedidos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Detalles del Pedido</th>
            <th>Total</th>
            <th>Fecha de creación</th>
            <th>Hora de Pedido</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pedidos
            .filter(
              (pedido) =>
                filterEstado === "" || pedido.estado_pedido === filterEstado
            )
            .map((pedido) => (
              <React.Fragment key={pedido.id}>
                <tr
                  key={pedido.id}
                  className={selectedPedido === pedido ? "selected" : ""}
                >
                  <td>{pedido.id}</td>

                  <td>
                    {pedido.user_id === 0
                      ? "Sin usuario"
                      : buscarInformacionUsuario(pedido.user_id)?.email}
                  </td>

                  <td>
                    <button onClick={() => handlePedidoClick(pedido)}>
                      Detalles del pedido aquí
                    </button>
                  </td>
                  <td>
                    <b>S/. {pedido.monto_total.toFixed(2)}</b>
                  </td>
                  <td>creado el {formatDate(pedido.createdAt)}</td>
                  <td>
                    <p> {formatTime(pedido.createdAt)}</p>
                  </td>
                  <td>
                    <select
                      value={pedido.estado_pedido || ""}
                      onChange={handleEstadoChange}
                      onClick={() => handlePedidoClick(pedido)}
                    >
                      <option value="Activo">Recibido</option>
                      <option value="En camino">En camino</option>
                      <option value="Finalizado">Entregado</option>
                    </select>
                    <p> {formatTime(pedido.updatedAt)}</p>
                  </td>
                </tr>
                {selectedPedido === pedido && detallesPedido && (
                  <tr key={`${pedido.id}-details`}>
                    <td colSpan="7">
                      <div className="detalle-pedido">
                        <h3>Detalles del pedido ID {selectedPedido.id}</h3>
                        <ul>
                          <li>
                            Método de pago:{" "}
                            {transacciones[pedido.id]?.metodo_pago}
                          </li>
                          <li>
                            Estado de Pago:{" "}
                            <select
                              value={
                                transacciones[pedido.id]?.estado_transaccion
                              }
                              onChange={handleTransaccionChange}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="Pagado">Pagado</option>
                              <option value="Rechazada">Rechazada</option>
                            </select>
                          </li>
                          <li>
                            Monto total: S/.{" "}
                            {transacciones[pedido.id]?.monto_transaccion
                              ? transacciones[
                                  pedido.id
                                ].monto_transaccion.toFixed(2)
                              : "N/A"}
                          </li>
                          <li>Nombre del cliente: {selectedPedido.nombre}</li>
                          <li>Teléfono: {selectedPedido.telefono}</li>
                          <li>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`https://api.whatsapp.com/send?phone=${
                                selectedPedido.telefono
                              }&text=Estimado cliente ${
                                selectedPedido.nombre
                              }, es un placer saludarte desde webo.pe. Hemos recibido tu pedido y estamos emocionados de atenderte.%0D%0A %0D%0APedido ${
                                pedido.estado_pedido
                              }%0D%0A ID de pedido: ${
                                selectedPedido.id
                              }%0D%0ANombre: ${
                                selectedPedido.nombre
                              }%0D%0ADirección de entrega: ${
                                selectedPedido.direccion_envio
                              }%0D%0AEstado de pago: ${
                                transacciones[pedido.id]?.estado_transaccion
                              }`}
                            >
                              Enviar mensaje por WhatsApp
                            </a>
                          </li>
                          <li>Email: {selectedPedido.email}</li>
                          <li>
                            Dirección de envío: {selectedPedido.direccion_envio}
                          </li>
                        </ul>
                        <table>
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Precio unitario</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detallesPedido &&
                            detallesPedido.detalles &&
                            detallesPedido.detalles.length > 0 ? (
                              detallesPedido.detalles.map((detalle, index) => {
                                const productoDelDetalle =
                                  productosOriginales.find(
                                    (producto) =>
                                      producto.producto_id ===
                                      detalle.producto_id
                                  );
                                return (
                                  <tr key={`${detalle.producto_id}-${index}`}>
                                    <td
                                      className="flex"
                                      style={{ alignItems: "center" }}
                                    >
                                      <img
                                        src={productoDelDetalle?.img}
                                        alt="imagen del producto"
                                      />
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "flex-start",
                                          marginLeft: "8px",
                                        }}
                                      >
                                        <span className="product-name">
                                          {productoDelDetalle?.nombre}
                                        </span>
                                        <b className="product-quantity">
                                          x{detalle.cantidad}
                                        </b>
                                      </div>
                                    </td>

                                    <td>
                                      S/. {detalle.precio_unitario.toFixed(2)}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="2">
                                  No hay detalles disponibles para este pedido.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistroPedidos;
