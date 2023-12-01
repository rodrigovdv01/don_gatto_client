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
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { AuthProvider } from "../../AuthContext";


const Header = () => {
  const {
    authenticatedUser,
    setAuthenticatedUser,
    handleLogout,
    checkAuthentication,
  } = useAuth();
  const isUserAdmin = useIsUserAdmin();
  const {
    carrito,
    vaciarCarrito,
    eliminarDelCarrito,
    modificarCantidad,
    modificarCantidadMenu,
    agregarMenu,
    eliminarMenu,
    setSelectedItems,
    selectedItems,
    selectedItemsOriginales,
    handleItemSelectedChange,
    productos,
    setProductos,
    calcularTotal,
    calcularSubtotal,
    toggleCart,
    closeCart,
    cartOpen,
    userMenuOpen,
    toggleUserMenu,
  } = useShoppingContext();

  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [opcionesVisible, setOpcionesVisible] = useState(false);

  useEffect(() => {
    // Verificar la autenticación al cargar el componente Header
    checkAuthentication();
  }, [checkAuthentication]);

  useEffect(() => {
    const tokenCookie = Cookies.get('authToken');
  
    if (tokenCookie) {
      try {
        const decodedToken = jwt_decode(tokenCookie);
        const currentTime = Date.now() / 1000;
  
        if (decodedToken.exp > currentTime) {
          // Establecer el usuario autenticado solo si no hay un usuario autenticado actualmente
          if (!setAuthenticatedUser) {
            setAuthenticatedUser(decodedToken);
          }
        } else {
          console.log("La cookie ha expirado");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error.message);
        // Puedes manejar el error de decodificación aquí, por ejemplo, limpiando la cookie
      }
    } else {
      console.log("La cookie authToken no está presente");
    }
  }, [setAuthenticatedUser]);
  
  // Verificar si la ubicación actual es "/login" o "/registrarse"
  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/registrarse";

  const toggleOpciones = () => {
    setOpcionesVisible(!opcionesVisible);
  };

  const hideOpciones = () => {
    setOpcionesVisible(false);
  };

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      window.scrollTo({
        top: section.offsetTop - 60,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY !== 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
  }, [setProductos]);

  useEffect(() => {
    const totalItems = carrito.reduce(
      (total, item) => total + item.cantidad,
      0
    );
    setCartItemCount(totalItems);
  }, [carrito]);

  const [isTablet] = useState(window.innerWidth <= 768);

  return (
    <AuthProvider>
      {!(isLoginPage || isSignUpPage) && (
        <header className={`header-container ${isScrolled ? "scrolled" : ""}`}>
          <ul className="header-ul">
            <li>
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
                  hideOpciones();
                }}
              >
                <img
                  className={`banner-img ${isScrolled ? "visible" : ""}`}
                  src="/images/logos/dongatto.png"
                  alt="Logo"
                />
              </Link>
            </li>

            <div className="servicios">
              <li>
                <Link
                  onClick={() => {
                    toggleOpciones();
                    if (cartOpen) {
                      toggleCart();
                    }
                  }}
                >
                  Nuestros Productos
                </Link>
              </li>

              <div className={`opciones ${opcionesVisible ? "" : "hidden"}`}>
                <a
                  href="#buffet-y-banquetes"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("buffet-y-banquetes");
                    hideOpciones();
                  }}
                >
                  Relx
                </a>
                <a
                  href="#cafeterias"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("cafeterias");
                    hideOpciones();
                  }}
                >
                  Waka
                </a>
              </div>
            </div>

            {authenticatedUser ? (
              <>
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
                    <FontAwesomeIcon icon={faHistory} /> Mis Pedidos
                  </Link>
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
                      Bienvenido, {authenticatedUser.nombre}{" "}
                      <FontAwesomeIcon
                        icon={userMenuOpen ? faAngleUp : faAngleDown}
                      />
                    </span>
                  )}
                  <button
                    className="cart-div"
                    onClick={() => {
                      toggleCart();
                      if (userMenuOpen) {
                        toggleUserMenu();
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                    {cartItemCount > 0 && (
                      <span className="cart-item-count">{cartItemCount}</span>
                    )}
                  </button>
                </li>
              </>
            ) : (
              <>
                {location.pathname !== "/login" &&
                  location.pathname !== "/registrarse" && (
                    <>
                      <li>
                        <Link
                          to="/login"
                          onClick={() => {
                            if (cartOpen) {
                              toggleCart();
                            }
                            hideOpciones();
                          }}
                        >
                          Iniciar Sesión
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/registrarse"
                          onClick={() => {
                            if (cartOpen) {
                              toggleCart();
                            }
                            hideOpciones();
                          }}
                        >
                          Registrarse
                        </Link>
                      </li>
                    </>
                  )}
                <li>
                  <button
                    onClick={() => {
                      toggleCart();
                      hideOpciones();
                    }}
                    className="cart-div"
                  >
                    <FontAwesomeIcon
                      style={{ color: "#fff" }}
                      icon={faShoppingCart}
                    />
                    {cartItemCount > 0 && (
                      <span className="cart-item-count">{cartItemCount}</span>
                    )}
                  </button>
                </li>
              </>
            )}
          </ul>

          {userMenuOpen && (
            <div className="user-menu">
              <ul>
                {isTablet && (
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
                      <FontAwesomeIcon icon={faHistory} /> Mis Pedidos
                    </Link>
                  </li>
                )}

                {isUserAdmin && (
                  <>
                    <li>
                      <Link to="/registro-de-pedidos" onClick={toggleUserMenu}>
                        <FontAwesomeIcon icon={faList} /> Registro de Pedidos
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/administrar-productos"
                        onClick={toggleUserMenu}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Administrar Productos
                      </Link>
                    </li>
                    <li>
                      <Link to="/administrar-usuarios" onClick={toggleUserMenu}>
                        <FontAwesomeIcon icon={faUsers} /> Administrar Usuarios
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
              // Eliminados los props relacionados con postres, bebidas, segundos, entradas
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
    </AuthProvider>
  );
};

export default Header;
