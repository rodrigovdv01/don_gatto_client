import React from "react";
import { Link } from "react-router-dom";
import "./Carrito.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles.css";
import { useAuth } from "../../AuthContext"; // Importa el contexto de autenticación

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
    navigate("/checkout/shipping");
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
            <Link to="/menu" className="continue-shopping" onClick={toggleCart}>
              Ir a comprar
            </Link>
          </>
        ) : (
          <>
            <h2 className="carrito-title">MI CARRITO</h2>
            <ul className="carrito-items">
              {carrito.map((item, index) => (
                <li
                  className="carrito-item"
                  key={`${item.producto_id}-${index}`}
                >
                  <img
                    className="carrito-img"
                    alt="product image"
                    src={item.img}
                  ></img>
                  <div className="texto">
                    <h4>{item.nombre}</h4>

                    <p>Cantidad: {item.cantidad}</p>
                    <p>S/. {item.precio.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div>
              <p className="total">Total: S/. {calcularTotal(carrito)}</p>
              <div className="opciones-carrito">
                <input
                  type="submit"
                  className="carrito-button carrito-button-pedido"
                  value="PAGAR"
                />
                <Link to="/checkout/cart" onClick={toggleCart}>
                  <button className="carrito-button --pedido">
                    editar carrito
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default Carrito;
