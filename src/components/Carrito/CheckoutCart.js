import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./CheckoutCart.css";
import "./Details.css";

const CheckoutCart = () => {
  const navigate = useNavigate();
  const {
    carrito,
    modificarCantidad,
    eliminarDelCarrito,
    selectedItems,
    setSelectedItems,
    handleItemSelectedChange,
    productos,
    calcularSubtotal,
    calcularTotal,
    vaciarCarrito,
  } = useShoppingContext();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    // Cargar los datos del localStorage al estado cuando se monta el componente
    const savedSelectedItems = localStorage.getItem("selectedItems");
    if (savedSelectedItems) {
      setSelectedItems(JSON.parse(savedSelectedItems));
    }

    // Puedes agregar más lógica aquí si es necesario
  }, []);

  useEffect(() => {
    const storedSelectedItems = localStorage.getItem("selectedItems");
    if (storedSelectedItems !== null) {
      setSelectedItems(JSON.parse(storedSelectedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const handleModificarCantidad = (itemId, cantidad, id_categoria) => {
    // Ensure the quantity doesn't go below 1
    const newQuantity = Math.max(
      1,
      selectedItems.find((item) => item.producto_id === itemId).cantidad +
        cantidad
    );

    modificarCantidad(itemId, newQuantity);

    // Update localStorage after modifying the quantity
    const updatedSelectedItems = selectedItems.map((item) => {
      if (item.producto_id === itemId) {
        return { ...item, cantidad: newQuantity };
      }
      return item;
    });

    setSelectedItems(updatedSelectedItems);
  };

  if (carrito.length === 0) {
    return (
      <div className="content-container">
        <h2 className="heading">Carrito de Compras</h2>
        <p>Tu carrito de compras está vacío.</p>
        <Link to="/shop" className="continue-shopping">
          Seguir comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="content-container">
      <h2 className="heading">Carrito de Compras</h2>

      <form className="table-container">
        <table className="product-table">
          <thead>
            <tr className="headers-container">
              <th className="header-cell">Producto</th>
              <th className="header-cell"></th>
              <th className="header-cell price-cell">Precio</th>
              <th className="header-cell quantity-cell">Cantidad</th>
              <th className="header-cell">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item, index) => (
              <tr
                className="item-container"
                key={`${item.producto_id}-${index}`}
              >
                <td>
                  <img
                    src={item.img}
                    alt={item.nombre}
                    className="item-image"
                  />
                </td>
                <td className="item-name">
                  <h3>{item.nombre}</h3>
                </td>
                <td className="price-cell">S/. {item.precio.toFixed(2)}</td>
                <td className="quantity-cell">
                  <div>
                    <div className="cantidad">
                      <div
                        className={`carrito-button ${
                          item.cantidad === 0 ? "carrito-button-disabled" : ""
                        }`}
                        onClick={() => modificarCantidad(item.producto_id, -1)}
                        disabled={item.cantidad === 0}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </div>
                      <span className="carrito-quantity">{item.cantidad}</span>
                      <div
                        className="carrito-button"
                        onClick={() => modificarCantidad(item.producto_id, 1)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </div>
                    </div>
                  </div>
                </td>

                <td className="subtotal">
                  S/. {calcularSubtotal(item.precio, item.cantidad).toFixed(2)}
                  <span
                    className="delete"
                    onClick={() => eliminarDelCarrito(item.producto_id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>

      <div className="buttons">
    <div>   
        <p className="total">Subotal: S/. {calcularTotal(carrito).toFixed(2)}</p>
        <button
          className="carrito-button carrito-button-pedido"
          onClick={vaciarCarrito}
        >
          Vaciar Carrito
        </button>
        </div>
        <Link to="/shop" className="continue-shopping">
          Agregar productos
        </Link>
        <input
          type="submit"
          value="CONTINUAR"
          onClick={handleCheckout}
          className="next-step-button"
        />
      </div>
    </div>
  );
};

export default CheckoutCart;
