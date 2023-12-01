import React, { useState, useEffect } from "react";
import { useShoppingContext } from "../../../ShoppingContext";
import axios from "axios";
import SignInForm from "../../../components/User/SignInForm";
import "./RegistroPedidos.css";
import "../../../components/Header/Header.css";

const RegistroPedidos = () => {
  const [selectedPedido, setSelectedPedido] = useState(null);
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
    
    obtenerUsuarios();
    obtenerPedidos();
    obtenerProductos();
  }, [obtenerUsuarios, obtenerPedidos, obtenerProductos]);

  const buscarInformacionUsuario = (user_id) => {
    const usuario = usuariosOriginales.find(
      (usuario) => usuario.id === user_id
    );
    return usuario || {};
  };

  const handlePedidoClick = async (pedido) => {
    setSelectedPedido(pedido);

    // Aquí puedes llamar a obtenerDetallesPedido para obtener los detalles del pedido seleccionado
    try {
      await obtenerDetallesPedido(pedido.id, "/registro-de-pedidos");
    } catch (error) {
      console.error("Error al obtener los detalles del pedido:", error);
    }
  };

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      // Realiza una solicitud PUT al servidor para actualizar el estado del pedido
      await axios.put(`${process.env.REACT_APP_API_URL}/pedidos/${pedidoId}`, {
        estado_pedido: nuevoEstado,
      });

      // Actualiza el estado del pedido en el cliente
      const nuevosPedidos = pedidos.map((pedido) => {
        if (pedido.id === pedidoId) {
          return { ...pedido, estadoPedido: nuevoEstado };
        }
        return pedido;
      });

      // Actualiza la lista de pedidos con los nuevos estados
      obtenerPedidos(nuevosPedidos);

      console.log(`Estado del pedido ${pedidoId} actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    const pedidoId = selectedPedido.id;

    // Actualiza el estado del pedido en el servidor
    actualizarEstadoPedido(pedidoId, nuevoEstado);
  };


  return (
    <div className="content-container">
      <h2>Registro de Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>

            <th>Estado</th>
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
                    <option value="Recibido">Recibido</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="En preparación">En preparación</option>
                    <option value="En camino">En camino</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                  <p>{pedido.updatedAt.slice(11, 19)}</p>
                </td>
                <td>{buscarInformacionUsuario(pedido.user_id)?.email}</td>
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
                      <h3>Detalle del Pedido {selectedPedido.id}</h3>
                      <ul>
                        <li>Nombre del cliente: {selectedPedido.nombre}</li>
                        <br />
                        <li>Teléfono: {selectedPedido.telefono}</li>
                        <br />
                        <li>Email: {selectedPedido.email}</li>
                        <br />
                        <li>
                          Dirección de envío: {selectedPedido.direccion_envio}
                        </li>
                        <br />
                      </ul>
                      <table>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Entrada</th>
                            <th>Segundo</th>
                            <th>Postre</th>
                            <th>Bebida</th>
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
                                  <td>{productoDelDetalle?.nombre}</td>
                                  <td>{detalle.selectedEntrada || "-"}</td>
                                  <td>{detalle.selectedSegundo || "-"}</td>
                                  <td>{detalle.selectedPostre || "-"}</td>
                                  <td>{detalle.selectedBebida || "-"}</td>
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
