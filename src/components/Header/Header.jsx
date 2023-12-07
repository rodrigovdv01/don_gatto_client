import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHistory,
  faAngleDown,
  faAngleUp,
  faList,
  faEdit,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { useAuth, useIsUserAdmin } from "../../AuthContext";
import { useLocation } from "react-router-dom";
import Carrito from "../../pages/Carrito/Carrito";
import { useShoppingContext } from "../../ShoppingContext";

const Header = () => {
  const { authenticatedUser, handleLogout } = useAuth();
  const isUserAdmin = useIsUserAdmin();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const {
    carrito,
    vaciarCarrito,
    eliminarDelCarrito,
    modificarCantidad,
    modificarCantidadMenu,
    agregarMenu,
    eliminarMenu,
    selectedItems,
    setSelectedItems,
    handleItemSelectedChange,
    productos,
    setProductos,
    calcularTotal,
    calcularSubtotal,
    selectedItemsOriginales,
    toggleCart,
    closeCart,
    cartOpen,
    userMenuOpen,
    toggleUserMenu,
  } = useShoppingContext();

  // Verificar si la ubicación actual es "/login" o "/registrarse"
  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/registrarse";

  const [isTablet, setIsTablet] = useState(window.innerWidth <= 768);
  const handleResize = () => {
    setIsTablet(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/`, {
        params: {
          activo: true,
        },
      })
      .then((response) => {
        const productosData = response.data;
        if (Array.isArray(productosData)) {
          setProductos(productosData);
        } else {
          console.error("No hay productos agregados.");
        }
      })
      .catch((error) => {
        console.error("Error al obtener productos activos:", error);
      });
  }, []);

  useEffect(() => {
    const totalItems = carrito.reduce(
      (total, item) => total + item.cantidad,
      0
    );
    setCartItemCount(totalItems);
  }, [carrito]);

  const [cartItemCount, setCartItemCount] = useState(0);

  const [isHovered, setIsHovered] = useState(false);
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!(isLoginPage || isSignUpPage) && (
        <header className={`header-container ${isScrolled ? "scrolled" : ""}`}>
          <nav>
            <ul className="header-ul">
              <li className="header-logo">
                <Link
                  className="links-principales"
                  to="/"
                  onClick={() => {
                    if (cartOpen) {
                      toggleCart();
                    }
                    if (userMenuOpen) {
                      toggleUserMenu();
                    }
                  }}
                >
                  {(location.pathname === "/" && isScrolled) ||
                  location.pathname !== "/" ? (
                    <img
                      className="banner-img"
                      src={
                        isScrolled
                          ? isHovered
                            ? "/images/logos/logo1.png"
                            : "/images/logos/logo1.png"
                          : isHovered
                          ? "/images/logos/logo1.png"
                          : location.pathname === "/"
                          ? "/images/logos/logo1.png" // Cambiado a "logo1.png" cuando la ruta es "/"
                          : "/images/logos/logo1.png" // Otras rutas mostrarán "logo3.png"
                      }
                      alt="Logo"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    />
                  ) : (
                    ""
                  )}
                </Link>
              </li>
              {authenticatedUser ? (
                <>
                  <li>
                    {!isTablet && (
                      <Link
                        to="/mis-pedidos"
                        className={`links-principales ${
                          isScrolled ? "scrolled" : ""
                        }`}
                        onClick={() => {
                          if (cartOpen) {
                            toggleCart();
                          }
                          if (userMenuOpen) {
                            toggleUserMenu();
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          style={{
                            color: isHomePage && !isScrolled ? "#fff" : "#000",
                          }}
                          icon={faHistory}
                        />{" "}
                        <b
                          style={{
                            color: isHomePage && !isScrolled ? "#fff" : "#000",
                          }}
                        >
                          Mis Pedidos
                        </b>{" "}
                      </Link>
                    )}
                  </li>
                  <li>
                    {authenticatedUser.nombre && (
                      <span
                        className="nombre-usuario"
                        onClick={() => {
                          toggleUserMenu();
                          if (cartOpen) {
                            toggleCart();
                          }
                        }}
                      >
                        <b
                          style={{
                            color: isHomePage && !isScrolled ? "#fff" : "#000",
                          }}
                        >
                          Bienvenido, {authenticatedUser.nombre}{" "}
                        </b>
                        <FontAwesomeIcon
                          style={{
                            color: isHomePage && !isScrolled ? "#fff" : "#000",
                          }}
                          icon={userMenuOpen ? faAngleUp : faAngleDown}
                        />
                      </span>
                    )}
                  </li>
                  <button
                    style={{
                      backgroundColor:
                        isHomePage && !isScrolled ? "#fff" : "#000",
                    }}
                    className="cart-div"
                    onClick={() => {
                      toggleCart();
                      if (userMenuOpen) {
                        toggleUserMenu();
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      style={{
                        color: isHomePage && !isScrolled ? "#000" : "#fff",
                      }}
                      icon={faShoppingCart}
                    />
                    {cartItemCount > 0 && (
                      <span
                        style={{
                          color: isHomePage && !isScrolled ? "#fff" : "#fff",
                        }}
                        className="cart-item-count"
                      >
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                  {!isTablet && (
                    <li>
                      <button
                        className="pide-online"
                        style={{
                          backgroundColor:
                            isHomePage && !isScrolled ? "#fff" : "#000",
                        }}
                      >
                        <Link
                          style={{
                            color: isHomePage && !isScrolled ? "#000" : "#fff",
                          }}
                          to="/menu"
                        >
                          ¡Pide Online!
                        </Link>
                      </button>
                    </li>
                  )}
                </>
              ) : (
                <>
                  {location.pathname !== "/login" &&
                    location.pathname !== "/registrarse" && (
                      <>
                        <li className="log">
                          <Link
                            style={{
                              color:
                                isHomePage && !isScrolled ? "#fff" : "#000",
                            }}
                            className={`login-logout ${
                              isScrolled ? "scrolled" : ""
                            }`}
                            to="/registrarse"
                            onClick={() => {
                              if (cartOpen) {
                                toggleCart();
                              }
                            }}
                          >
                            Registrarse
                          </Link>
                        </li>
                        <li className="log">
                          <Link
                            className={`login-logout ${
                              isScrolled ? "scrolled" : ""
                            }`}
                            style={{
                              color:
                                isHomePage && !isScrolled ? "#fff" : "#000",
                            }}
                            to="/login"
                            onClick={() => {
                              if (cartOpen) {
                                toggleCart();
                              }
                            }}
                          >
                            Iniciar Sesión
                          </Link>
                        </li>
                      </>
                    )}
                  <li>
                    <button
                      style={{
                        backgroundColor:
                          isHomePage && !isScrolled ? "#fff" : "#000",
                      }}
                      onClick={toggleCart}
                      className="cart-div"
                    >
                      <FontAwesomeIcon
                        style={{
                          color: isHomePage && !isScrolled ? "#000" : "#fff",
                        }}
                        icon={faShoppingCart}
                      />
                      {cartItemCount > 0 && (
                        <span
                          className="cart-item-count"
                          style={{
                            color: isHomePage && !isScrolled ? "#fff" : "#fff",
                          }}
                        >
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                  </li>
                </>
              )}
            </ul>

            {userMenuOpen && (
              <div className="user-menu">
                <ul>
                  <li>
                    <Link
                      to="/mis-pedidos"
                      className="links-principales"
                      onClick={() => {
                        if (cartOpen) {
                          toggleCart();
                        }
                        if (userMenuOpen) {
                          toggleUserMenu();
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        style={{ color: "#000" }}
                        icon={faHistory}
                      />{" "}
                      Mis Pedidos
                    </Link>
                  </li>
                  {isUserAdmin && (
                    <>
                      <li>
                        <Link
                          to="/registro-de-pedidos"
                          onClick={toggleUserMenu}
                        >
                          <FontAwesomeIcon
                            style={{ color: "#000" }}
                            icon={faList}
                          />{" "}
                          Todos los Pedidos
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/administrar-productos"
                          onClick={toggleUserMenu}
                        >
                          <FontAwesomeIcon
                            style={{ color: "#000" }}
                            icon={faEdit}
                          />{" "}
                          Productos
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/administrar-usuarios"
                          onClick={toggleUserMenu}
                        >
                          <FontAwesomeIcon
                            style={{ color: "#000" }}
                            icon={faUsers}
                          />{" "}
                          Usuarios
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleUserMenu();
                        vaciarCarrito();
                        setSelectedItems([...selectedItemsOriginales]);
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </nav>
          {cartOpen && (
            <Carrito
              carrito={carrito}
              eliminarDelCarrito={eliminarDelCarrito}
              modificarCantidad={modificarCantidad}
              modificarCantidadMenu={modificarCantidadMenu}
              cartOpen={cartOpen}
              toggleCart={toggleCart}
              menuItems={productos}
              eliminarMenu={eliminarMenu}
              agregarMenu={agregarMenu}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              handleItemSelectedChange={handleItemSelectedChange}
              calcularSubtotal={calcularSubtotal}
              calcularTotal={calcularTotal}
              vaciarCarrito={vaciarCarrito}
            />
          )}
          {cartOpen && <div className="overlay" onClick={closeCart}></div>}
        </header>
      )}
    </>
  );
};

export default Header;
