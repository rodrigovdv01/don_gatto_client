import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Details from "./Details";
import "./Checkout.css";
import "./Details.css";
import { useAuth } from "../../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useShoppingContext } from "../../ShoppingContext";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [interior, setInterior] = useState("");
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [changeEmail, setChangeEmail] = useState(false);

  const { authenticatedUser } = useAuth();

  const {
    detailsVisible,
    setDetailsVisible,
    isRotated,
    setRotated,
    showLoginSection,
    setShowLoginSection,
    distrito,
    setDistrito,
  } = useShoppingContext();

  useEffect(() => {
    if (authenticatedUser) {
      setNombre(authenticatedUser.nombre || "");
      setApellidos(authenticatedUser.apellido || "");
      setEmail(authenticatedUser.email || "");
      setTelefono(authenticatedUser.telefono || "");
      setDireccion(authenticatedUser.direccion_envio || "");
    } else {
      setNombre(""); // Set initial state values here
      setApellidos("");
      setEmail("");
      setTelefono("");
      setDireccion("");
    }
  }, [authenticatedUser]);

  const handleInputChange = (e, setStateFunction) => {
    setStateFunction(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let shippingInfo;

    const formattedDireccion =
      direccion +
      (interior ? ", dpto./int. " + interior : "") +
      (distrito ? ", " + distrito : "");

    if (email && nombre && apellidos && telefono && formattedDireccion) {
      shippingInfo = {
        email,
        nombre,
        apellidos,
        telefono,
        direccion: formattedDireccion,
      };
    } else if (
      changeEmail &&
      nombre &&
      apellidos &&
      telefono &&
      formattedDireccion
    ) {
      shippingInfo = {
        email: newEmail,
        nombre,
        apellidos,
        telefono,
        direccion: formattedDireccion,
      };
    }

    if (shippingInfo) {
      navigate("/checkout/payment", { state: { shippingInfo } });
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
    setRotated(!isRotated);
  };

  const handleSkipLogin = () => {
    setShowLoginSection(false);
  };

  return (
    <div className="content-container">
      <h1 className="title">FINALIZAR COMPRA</h1>
      <div className="content-box">
        <div className="flex-space-between" onClick={toggleDetails}>
          <div className="buttons">
            <a className="ver-pedido" onClick={toggleDetails}>
              VER PEDIDO
            </a>
            {detailsVisible && (
              <Link to="/carrito" className="continue-shopping">
                editar Carrito
              </Link>
            )}
          </div>

          <button className="close-div" onClick={toggleDetails}>
            <FontAwesomeIcon
              icon={faPlus}
              className={`close-icon ${isRotated ? "rotate" : ""}`}
            />
          </button>
        </div>
        <div style={{ display: detailsVisible ? "block" : "none" }}>
          {" "}
          <Details />
        </div>
      </div>
      <div className="content-box">
        <h2 className="heading">INFORMACIÓN DE CONTACTO</h2>
        {/* Sección adicional para iniciar sesión si el usuario no está autenticado */}
        {showLoginSection && !authenticatedUser && (
          <div className="login-section">
            <span>
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link> o{" "}
              <Link to="/registrarse">Regístrate</Link>.
            </span>
            <span className="omitir" type="button" onClick={handleSkipLogin}>
              <FontAwesomeIcon icon={faTimes} /> Comprar sin iniciar sesión{" "}
            </span>
          </div>
        )}
        <form className="checkout-form-container" onSubmit={handleSubmit}>
          <div className="form">
            <div className="row">
              <div id="nombre-container" className="flex-form-input">
                <label htmlFor="nombre" className="label">
                  Nombre <span className="color-red-bold">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => handleInputChange(e, setNombre)}
                  className="input"
                  required
                />
              </div>
              <div id="apellidos-container" className="flex-form-input">
                <label
                  id="apellidos-label"
                  htmlFor="apellidos"
                  className="label"
                >
                  Apellidos <span className="color-red-bold">*</span>
                </label>
                <input
                  type="text"
                  id="apellidos"
                  value={apellidos}
                  onChange={(e) => handleInputChange(e, setApellidos)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="email" className="label">
                Correo Electrónico <span className="color-red-bold">*</span>
              </label>
              {authenticatedUser && !changeEmail ? (
                <div className="change-email-section">
                  <span className="email-de-usuario">
                    {authenticatedUser.email}
                  </span>
                  <span
                    className="cambiar"
                    onClick={() => setChangeEmail(true)}
                  >
                    Cambiar
                  </span>
                </div>
              ) : (
                <input
                  type="email"
                  id="email"
                  value={changeEmail ? newEmail : email}
                  onChange={(e) =>
                    changeEmail
                      ? setNewEmail(e.target.value)
                      : handleInputChange(e, setEmail)
                  }
                  className="input"
                  required
                  disabled={authenticatedUser && !changeEmail}
                />
              )}
            </div>
            <div className="input-group">
              <label htmlFor="telefono" className="label">
                Número de Teléfono <span className="color-red-bold">*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                value={telefono}
                onChange={(e) => handleInputChange(e, setTelefono)}
                className="input"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="direccion" className="label">
                Dirección <span className="color-red-bold">*</span>
              </label>
              <input
                type="text"
                id="direccion"
                value={direccion}
                onChange={(e) => handleInputChange(e, setDireccion)}
                className="input"
                required
              />
            </div>
            <div className="flex">
              <div className="input-group flex-1">
                <label htmlFor="direccion" className="label">
                  Dpto. / Interior
                </label>
                <input
                  type="text"
                  id="interior"
                  value={interior}
                  onChange={(e) => handleInputChange(e, setInterior)}
                  className="input"
                />
              </div>

              <div className="input-group flex-2">
                <label htmlFor="distrito" className="label">
                  Distrito <span className="color-red-bold">*</span>
                </label>
                <select
                  id="distrito"
                  value={distrito}
                  onChange={(e) => handleInputChange(e, setDistrito)}
                  className="input"
                  required
                >
                  <option value="">Selecciona un distrito</option>
                  <option value="Barranco">
                    Barranco (+ S/. 1.00)
                  </option>
                  <option value="Chorrillos">
                    Chorrillos (+ S/. 2.00)
                  </option>
                  <option value="La Molina">
                    La Molina (+ S/. 3.00)
                  </option>
                  <option value="Magdalena">
                    Magdalena (+ S/.4.00)
                  </option>
                  <option value="Miraflores">
                    Miraflores (+ S/. 5.00)
                  </option>
                  <option value="San Borja">
                    San Borja (+ S/. 6.00)
                  </option>
                  <option value="San Isidro">
                    San Isidro (+ S/. 7.00)
                  </option>
                  <option value="San Miguel">
                    San Miguel (+ S/. 8.00)
                  </option>
                  <option value="Santiago de Surco">
                    Santiago de Surco (+ S/. 9.00)
                  </option>
                </select>
              </div>
            </div>

            <input
              type="submit"
              value="CONTINUAR"
              className="next-step-button"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
