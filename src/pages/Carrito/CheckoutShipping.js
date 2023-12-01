import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Details from "./Details";
import "../../styles.css";
import "./Checkout.css";
import "./Details.css";
const CheckoutShipping = () => {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e, setStateFunction) => {
    setStateFunction(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar y procesar la información de envío
    if (email && nombre && apellidos && telefono && direccion) {
      const shippingInfo = {
        email,
        nombre,
        apellidos,
        telefono,
        direccion,
      };

      // Navegar a la página de pago y pasar los datos de envío como estado
      navigate("/checkout/payment", { state: { shippingInfo } });
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <div className="content-container">
      <h2 className="heading">Información de Envío</h2>
      <form className="checkout-form-container" onSubmit={handleSubmit}>
        <div className="form">
          <div className="input-group">
            <label htmlFor="email" className="label">
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
              className="input"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="nombre" className="label">
              Nombre:
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
          <div className="input-group">
            <label htmlFor="apellidos" className="label">
              Apellidos:
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
          <div className="input-group">
            <label htmlFor="telefono" className="label">
              Número de Teléfono:
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
              Dirección:
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
        </div>
        <Details className="details" />
      </form>
    </div>
  );
};

export default CheckoutShipping;
