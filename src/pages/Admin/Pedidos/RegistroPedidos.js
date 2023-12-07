import React, { useState, useEffect } from "react";
import { useShoppingContext } from "../../../ShoppingContext";
import axios from "axios";
import "./RegistroPedidos.css";
import "../../../components/Header/Header.css";

const RegistroPedidos = () => {
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [transacciones, setTransacciones] = useState({});
  const {
    obtenerUsuarios,
    usuariosOriginales,
    obtenerPedidos,
    pedidos,
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
    obtenerPedidos();
    obtenerProductos();
  }, [isAuthenticated]);

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

  return (
    <div className="content-container">
      <h2>Registro de Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Estado de envío</th>
            <th>usuario</th>
            <th>Detalles del Pedido</th>
            <th>Total</th>
            <th>Fecha de Pedido</th>
            <th>Hora de Pedido</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <React.Fragment key={pedido.id}>
              <tr className={selectedPedido === pedido ? "selected" : ""}>
                <td>{pedido.id}</td>
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
                  <p>{pedido.updatedAt.slice(11, 19)}</p>
                </td>
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
                <td>creado el: {pedido.createdAt.slice(0, 10)}</td>
                <td>{pedido.createdAt.slice(11, 19)}</td>
              </tr>
              {selectedPedido === pedido && (
                <tr>
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
                            value={transacciones[pedido.id]?.estado_transaccion}
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
                            href={`https://api.whatsapp.com/send?phone=${selectedPedido.telefono}&text=Estimado cliente ${selectedPedido.nombre}, es un placer saludarte desde webo.pe. Hemos recibido tu pedido y estamos emocionados de atenderte.%0D%0A %0D%0APedido ${pedido.estado_pedido}%0D%0A ID de pedido: ${selectedPedido.id}%0D%0ANombre: ${selectedPedido.nombre}%0D%0ADirección de entrega: ${selectedPedido.direccion_envio}%0D%0AEstado de pago: ${transacciones[pedido.id]?.estado_transaccion}`}
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
                            
                          <th>Producto</th><th></th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
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
                                    producto.producto_id === detalle.producto_id
                                );
                              return (
                                <tr key={index}>
                                  <td><img alt="imagen del producto" src={productoDelDetalle?.img}></img></td>
                                  <td>{productoDelDetalle?.nombre}</td>
                                  <td>{detalle.cantidad}</td>
                                  <td>
                                    S/. {detalle.precio_unitario.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="5">
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
