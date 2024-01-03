import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faAngleDown,
  faAngleUp,
  faList,
  faEdit,
  faUsers,
  faHeadset,
  faStore,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { useAuth, useIsUserAdmin } from "../../AuthContext";
import { useLocation } from "react-router-dom";
import Carrito from "../../components/Carrito/Carrito";
import { useShoppingContext } from "../../ShoppingContext";
import CartDiv from "./CartDiv";
import SignInForm from "../User/SignInForm";
import SignUpForm from "../User/SignUpForm";

const Header = () => {
  const { authenticatedUser, handleLogout } = useAuth();
  const isUserAdmin = useIsUserAdmin();
  const location = useLocation();

  const { showLoginForm, showSignUpForm, setShowLoginForm, setShowSignUpForm } =
    useShoppingContext();

  const isHomePage = location.pathname === "/";
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

  const headerBlanco = isHomePage && !isScrolled && !userMenuOpen && !cartOpen;

  // Número de WhatsApp y mensaje
  const phoneNumber = "+51986734669";
  const message = "¡Hola Don Gatto! Necesito ayuda con un pedido.";

  // Crear la URL de WhatsApp
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
    message
  )}`;

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
                          Mi cuenta
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
                  <CartDiv
                    toggleCart={toggleCart}
                    cartItemCount={cartItemCount}
                    headerBlanco={headerBlanco}
                  />
                </>
              ) : (
                <>
                  {location.pathname !== "/login" &&
                    location.pathname !== "/registrarse" && (
                      <>
                        <li className="log">
                          <button
                            style={{
                              color:
                                isHomePage && !isScrolled ? "#fff" : "#000",
                            }}
                            className={`login-logout ${
                              isScrolled ? "scrolled" : ""
                            }`}
                            onClick={() => {
                              if (cartOpen) {
                                toggleCart();
                              }

                              if (showLoginForm) {
                                setShowLoginForm(false);
                              }

                              if (!showSignUpForm) {
                                setShowSignUpForm(true);
                              } else {
                                setShowSignUpForm(false);
                              }
                            }}
                          >
                            Registrarse
                          </button>
                        </li>
                        <li className="log">
                          <button
                            className={`login-logout ${
                              isScrolled ? "scrolled" : ""
                            }`}
                            style={{
                              color:
                                isHomePage && !isScrolled ? "#fff" : "#000",
                            }}
                            onClick={() => {
                              if (cartOpen) {
                                toggleCart();
                              }

                              if (!showLoginForm) {
                                setShowLoginForm(true);
                              } else {
                                setShowLoginForm(false);
                              }

                              if (showSignUpForm) {
                                setShowSignUpForm(false);
                              }
                            }}
                          >
                            Iniciar Sesión
                          </button>
                        </li>
                      </>
                    )}
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
                          to="/shop"
                        >
                          ¡Pide Online!
                        </Link>
                      </button>
                    </li>
                  )}
                  <CartDiv
                    toggleCart={toggleCart}
                    cartItemCount={cartItemCount}
                    headerBlanco={headerBlanco}
                  />
                </>
              )}
            </ul>

            {userMenuOpen && (
              <div className="user-menu">
                <ul className="user-menu-flex">
                  <li>
                    <Link
                      to="/"
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
                        icon={faHome}
                      />{" "}
                      Home
                    </Link>
                  </li>
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
                  <li>
                    <Link
                      to="/shop"
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
                        icon={faStore}
                      />{" "}
                      Tienda Online
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
                          onClick={() => {
                            toggleUserMenu();
                            setShowLoginForm(false);
                            setShowSignUpForm(false);
                          }}
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
                          onClick={() => {
                            setShowLoginForm(false);
                            setShowSignUpForm(false);
                            toggleUserMenu();
                          }}
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

                  <li className="flex circles">
                    <div className="soporte">
                      <div>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon
                            className="headset-icon"
                            icon={faHeadset}
                          />
                        </a>
                      </div>
                    </div>
                  </li>

                  <li className="datos-personales">
                    <Link to="/cuenta/datos-personales">
                      <button className="editar-dp" onClick={toggleUserMenu}>
                        editar
                      </button>
                    </Link>
                    <p>
                      {authenticatedUser.nombre} {authenticatedUser.apellido}
                    </p>
                    <p>{authenticatedUser.telefono}</p>
                    <p>{authenticatedUser.email}</p>
                    <p>
                      {authenticatedUser.direccion_envio},{" "}
                      {authenticatedUser.distrito}
                    </p>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleUserMenu();
                        vaciarCarrito();
                        setSelectedItems([...selectedItemsOriginales]);
                      }}
                      className="logout-btn"
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
      {!authenticatedUser && showLoginForm && <SignInForm />}
      {!authenticatedUser && showSignUpForm && <SignUpForm />}
    </>
  );
};

export default Header;
