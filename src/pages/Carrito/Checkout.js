import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Details from "./Details";
import "../../styles.css";
import "./Checkout.css";
import "./Details.css";
import { useAuth } from "../../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [isRotated, setRotated] = useState(false);
  const navigate = useNavigate();

  const { authenticatedUser } = useAuth();

  useState(() => {
    if (authenticatedUser) {
      setNombre(authenticatedUser.nombre || "");
      setApellidos(authenticatedUser.apellido || "");
      setEmail(authenticatedUser.email || "");
      setTelefono(authenticatedUser.telefono || "");
      setDireccion(authenticatedUser.direccion_envio || "");
    } else {
      setNombre("");
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

    if (email && nombre && apellidos && telefono && direccion) {
      const shippingInfo = {
        email,
        nombre,
        apellidos,
        telefono,
        direccion,
      };

      navigate("/checkout/payment", { state: { shippingInfo } });
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
    setRotated(!isRotated);
  };

  return (
    <div className="content-container">
      <h1 className="title">FINALIZAR COMPRA</h1>
      <div className="content-box">
        <div className="flex-space-between">
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
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => handleInputChange(e, setEmail)}
                className="input"
                required
                disabled={email !== ""}
              />
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
