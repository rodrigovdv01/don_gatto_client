import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShoppingContext } from "../../ShoppingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./Checkout.css";
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
    eliminarMenu,
    modificarCantidadMenu,
    calcularSubtotal,
    calcularTotal,
  } = useShoppingContext();

  const handleCheckout = () => {
    navigate("/checkout/shipping");
  };

  useEffect(() => {
    // Cargar los datos del localStorage al estado cuando se monta el componente
    const savedSelectedItems = localStorage.getItem("selectedItems");
    if (savedSelectedItems) {
      setSelectedItems(JSON.parse(savedSelectedItems));
    }

    // Puedes agregar más lógica aquí si es necesario
  }, [setSelectedItems]);

  useEffect(() => {
    const storedSelectedItems = localStorage.getItem("selectedItems");
    if (storedSelectedItems !== null) {
      setSelectedItems(JSON.parse(storedSelectedItems));
    }
  }, [setSelectedItems]);

  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const handleModificarCantidad = (itemId, cantidad, id_categoria) => {
    if (id_categoria === 0) {
      modificarCantidadMenu(itemId, cantidad);
    } else {
      modificarCantidad(itemId, cantidad);
    }
  };

  return (
    <div className="content-container">
      <h2 className="heading">Carrito de Compras</h2>

      <p className="total">Total: S/. {calcularTotal(carrito)}</p>
      <form className="table-container">
        <table className="table">
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

                <td className="price-cell">S/. {item.precio}</td>
                <td className="quantity-cell">
                  {item.id_categoria === 0 ? (
                    <>
                      <div
                        className="quantity-button"
                        onClick={() =>
                          handleModificarCantidad(index, -1, item.id_categoria)
                        }
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </div>
                      <span className="item-quantity">{item.cantidad}</span>
                      <div
                        className="quantity-button"
                        onClick={() =>
                          handleModificarCantidad(index, 1, item.id_categoria)
                        }
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="quantity-button"
                        onClick={() =>
                          handleModificarCantidad(
                            item.producto_id,
                            -1,
                            item.id_categoria
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </div>
                      <span className="item-quantity">{item.cantidad}</span>
                      <div
                        className="quantity-button"
                        onClick={() =>
                          handleModificarCantidad(
                            item.producto_id,
                            1,
                            item.id_categoria
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </div>
                    </>
                  )}
                </td>

                <td className="subtotal">
                  S/. {calcularSubtotal(item.precio, item.cantidad)}
                  {item.id_categoria === 0 ? (
                    <span
                      className="delete"
                      onClick={() => eliminarMenu(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  ) : (
                    <span
                      className="delete"
                      onClick={() => eliminarDelCarrito(item.producto_id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      <div className="buttons">
        <Link to="/menu" className="continue-shopping">
          Seguir Comprando
        </Link>
        <input
          type="submit"
          value="Siguiente paso"
          onClick={handleCheckout}
          className="btn"
        />
      </div>
    </div>
  );
};

export default CheckoutCart;
