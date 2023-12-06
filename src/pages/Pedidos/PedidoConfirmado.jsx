import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";

const PedidoDetalle = () => {
  const {
    obtenerDetallesPedido,
    detallesPedido,
    obtenerProductos,
    productosOriginales,
  } = useShoppingContext();
  const { pedidoId } = useParams();
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await obtenerDetallesPedido(pedidoId);
        await obtenerProductos();
        setSelectedPedido(pedidoId); // Set selectedPedido with the ID from the route
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
      }
    };

    fetchData();
  }, [pedidoId, obtenerDetallesPedido, obtenerProductos]);

  return (
    <div className="content-container">
      <h2>¡Hemos recibido tu pedido y está siendo revisado!</h2>
      {/* <ul>
        <li>
          Nombre del cliente: {selectedPedido ? selectedPedido.nombre : "-"}
        </li>
        <li>
          Dirección de entrega: {detallesPedido?.direccion_envio || "-"}
        </li>
      </ul> */}
      <div className="pedido-card-container">
        {Array.isArray(detallesPedido) && detallesPedido.length > 0 ? (
          detallesPedido.map((detalle, index) => {
            const productoDelDetalle = productosOriginales.find(
              (producto) => producto.producto_id === detalle.producto_id
            );
            return (
              <React.Fragment key={index}>
                <ul className="pedido-card">
                  <li>
                    <img
                      alt="imagen del producto"
                      src={productoDelDetalle?.img || "-"}
                      width={200}
                    ></img>
                  </li>
                  <li>
                    <b>Cantidad:</b> {detalle.cantidad}
                  </li>
                  <li>
                    <b>Nombre del Producto:</b>{" "}
                    {productoDelDetalle?.nombre || "-"}
                  </li>
                  <li>
                    <b>Precio Unitario:</b> S/.{" "}
                    {detalle.precio_unitario.toFixed(2)}
                  </li>
                </ul>
              </React.Fragment>
            );
          })
        ) : (
          <p>No hay detalles disponibles para este pedido.</p>
        )}
      </div>
    </div>
  );
};

export default PedidoDetalle;
