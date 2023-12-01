import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import "../../styles.css";

const PedidoDetalle = () => {
  const {
    obtenerDetallesPedido,
    detallesPedido,
    obtenerProductos,
    obtenerUsuarios,
    productosOriginales,
  } = useShoppingContext();
  const { pedidoId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetallesPedido = async () => {
      try {
        await obtenerDetallesPedido(pedidoId);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
        setLoading(false);
      }
    };

    fetchDetallesPedido();
  }, [pedidoId, obtenerDetallesPedido]);

  useEffect(() => {
    obtenerProductos();
    obtenerUsuarios();
  }, [ obtenerProductos, obtenerUsuarios]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="content-container">
      <h2>Tu pedido está siendo revisado</h2>
      <table>
        <thead>
          <tr>
            <th>ID del Producto</th>
            <th>Nombre del Producto</th>
            <th>Entrada</th>
            <th>Segundo</th>
            <th>Postre</th>
            <th>Bebida</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
          {detallesPedido.map((detalle) => {
            const productoDelDetalle = productosOriginales.find(
              (producto) => producto.producto_id === detalle.producto_id
            );
            return (
              <tr key={detalle.id}>
                <td>{detalle.producto_id}</td>
                <td>{productoDelDetalle?.nombre || "-"}</td>
                <td>{detalle.selectedEntrada || "-"}</td>
                <td>{detalle.selectedSegundo || "-"}</td>
                <td>{detalle.selectedPostre || "-"}</td>
                <td>{detalle.selectedBebida || "-"}</td>
                <td>{detalle.cantidad}</td>
                <td>S/. {detalle.precio_unitario.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoDetalle;
