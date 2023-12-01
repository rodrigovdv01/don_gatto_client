import React from "react";

const DetallePedido = ({
  detallesPedido,
  productosOriginales,
  selectedPedido,
}) => {
  return (
    <tr>
      <td colSpan="7">
        <div className="detalle-pedido">
          <h3>Detalle del Pedido </h3>
          <h4>ID {selectedPedido.id}</h4>
          <ul>
            <li>Nombre del cliente: {selectedPedido.nombre}</li>
            <br />
            <li>Teléfono: {selectedPedido.telefono}</li>
            <br />
            <li>Email: {selectedPedido.email}</li>
            <br />
            <li>Dirección de envío: {selectedPedido.direccion_envio}</li>
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
                  const productoDelDetalle = productosOriginales.find(
                    (producto) => producto.producto_id === detalle.producto_id
                  );
                  return (
                    <tr key={index}>
                      <td>{productoDelDetalle?.nombre}</td>
                      <td>{detalle.selectedEntrada || "-"}</td>
                      <td>{detalle.selectedSegundo || "-"}</td>
                      <td>{detalle.selectedPostre || "-"}</td>
                      <td>{detalle.selectedBebida || "-"}</td>
                      <td>{detalle.cantidad}</td>
                      <td>S/. {detalle.precio_unitario.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">
                    No hay detalles disponibles para este pedido.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
};

export default DetallePedido;
