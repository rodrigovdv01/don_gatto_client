import React, { useState, useEffect } from "react";
import { useShoppingContext } from "../../ShoppingContext";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "./MisPedidos.css";

const MisPedidos = () => {
  const {
    obtenerUsuarios,
    obtenerPedidos,
    pedidos,
    obtenerProductos,
    obtenerDetallesPedido,
  } = useShoppingContext();

  const { authenticatedUser, authToken } = useAuth();
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    obtenerUsuarios();
    obtenerPedidos();
    obtenerProductos();
  }, [obtenerUsuarios, obtenerPedidos, obtenerProductos]);

 

  const handlePedidoClick = async (pedido) => {
    setSelectedPedido(pedido);

    try {
      await obtenerDetallesPedido(pedido.id, "/registro-de-pedidos");
    } catch (error) {
      console.error("Error al obtener los detalles del pedido:", error);
    }
  };

  const handleEstadoChange = async (e) => {
    const nuevoEstado = e.target.value;
    const pedidoId = selectedPedido.id;

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/pedidos/${pedidoId}`, {
        estado_pedido: nuevoEstado,
      });

      const updatedPedido = { ...selectedPedido, estado_pedido: nuevoEstado };
      setSelectedPedido(updatedPedido);

      console.log(`Estado del pedido ${pedidoId} actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  const decodedAuthToken = authToken ? jwt_decode(authToken) : null;

  const pedidosDelUsuarioAutenticado = authenticatedUser && authenticatedUser.id
    ? pedidos.filter((pedido) => pedido.user_id === decodedAuthToken?.id)
    : [];

  // Verificar si el usuario autenticado tiene algún pedido
  const tienePedidos = pedidosDelUsuarioAutenticado.length > 0;

  return (
    <div className="content-container">
      <h2>Mis Pedidos</h2>
      {tienePedidos ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Usuario</th>
              <th>Detalles del Pedido</th>
              <th>Total</th>
              <th>Fecha de Pedido</th>
              <th>Hora de Pedido</th>
            </tr>
          </thead>
          <tbody>
            {pedidosDelUsuarioAutenticado.map((pedido) => (
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
                  <td>{pedido.user_id}</td>
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
                            Dirección de envío:{" "}
                            {selectedPedido.direccion_envio}
                          </li>
                          <br />
                        </ul>
                        <p>Detalles adicionales aquí...</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes pedidos aún.</p>
      )}
    </div>
  );
};

export default MisPedidos;
