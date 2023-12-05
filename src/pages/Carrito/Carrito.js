import React from "react";
import { Link } from "react-router-dom";
import "./Carrito.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faTrash,
  faPlus,
  faMinus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles.css";

const Carrito = ({
  carrito,
  eliminarDelCarrito,
  modificarCantidad,
  toggleCart,
  cartOpen,
  calcularTotal,
  vaciarCarrito,
}) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    toggleCart();
    navigate("/checkout/cart");
  };

  return (
    <form
      className={`carrito-sidebar ${cartOpen ? "open" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="carrito-close-button" onClick={toggleCart}>
        <FontAwesomeIcon icon={faTimes} className="close-icon" />
      </div>
      <div className="carrito-container">
        {carrito.length === 0 ? (
          <>
            <p>No has seleccionado ningún producto.</p>
            <Link to="/menu" className="ir-a-comprar" onClick={toggleCart}>
              Ir a comprar
            </Link>
          </>
        ) : (
          <>
            <h2 className="carrito-title">Mi pedido</h2>
            <ul className="carrito-items">
              {carrito.map((item, index) => (
                <li
                  className="carrito-item"
                  key={`${item.producto_id}-${index}`}
                >
                  <div className="carrito-item-details">
                    <div className="carrito-item-info">
                      <img height={100} alt="item" src={item.img}></img>
                      <h4>{item.nombre}</h4>
                      <p>{item.descripcion}</p>
                      <div>
                        <div>Precio: S/. {item.precio}</div>
                        <div className="cantidad">
                          <div
                            className={`carrito-button ${
                              item.cantidad === 0
                                ? "carrito-button-disabled"
                                : ""
                            }`}
                            onClick={() =>
                              modificarCantidad(item.producto_id, -1)
                            }
                            disabled={item.cantidad === 0}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </div>
                          <span className="carrito-quantity">
                            {item.cantidad}
                          </span>
                          <div
                            className="carrito-button"
                            onClick={() =>
                              modificarCantidad(item.producto_id, 1)
                            }
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </div>
                        </div>
                        <div
                          className="carrito-button carrito-button-eliminar"
                          onClick={() => eliminarDelCarrito(item.producto_id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div>
              <p className="total">Total: S/. {calcularTotal(carrito)}</p>
              {/* // Renderiza el botón para continuar con la compra si el usuario
              ha iniciado sesión */}
              <button
                type="submit"
                className="carrito-button carrito-button-pedido"
              >
                Continuar con mi Pedido
              </button>
              <div className="carrito-bottom-buttons">
                <button>
                  <Link to="/menu" onClick={toggleCart}>
                    Seguir comprando
                  </Link>
                </button>
                <button onClick={vaciarCarrito}>Vaciar Carrito</button>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default Carrito;
