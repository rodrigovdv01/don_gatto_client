import React from "react";
import { Link } from "react-router-dom";
import "./Carrito.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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

  return (
    <>
      <div className="close-cart" onClick={toggleCart}></div>
      <div className={`carrito-sidebar ${cartOpen ? "open" : ""}`}>
        <div className="carrito-close-button" onClick={toggleCart}>
          <FontAwesomeIcon icon={faTimes} className="close-icon" />
        </div>
        <div className="carrito-container">
          {carrito.length === 0 ? (
            <div className="">
              <p>No has seleccionado ningún producto.</p>
              <Link
                to="/shop"
                className="continue-shopping"
                onClick={toggleCart}
              >
                Ir a comprar
              </Link>
            </div>
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
                  <button
                    className="carrito-button carrito-button-pedido"
                    onClick={() => {
                      toggleCart();
                      navigate("/checkout");
                    }}
                  >
                    PAGAR
                  </button>
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
      </div>
    </>
  );
};

export default Carrito;
