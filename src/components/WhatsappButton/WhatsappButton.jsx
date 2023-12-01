import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import "./WhatsappButton.css";

const WhatsAppButton = () => {
  // Número de WhatsApp y mensaje
  const phoneNumber = "+51986734669";
  const message = "¡Hola Don Gatto! Quiero pedir un vape";

  // Crear la URL de WhatsApp
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  return (
    <a href={whatsappUrl} id="wa" className="wa" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon id="wa-icon" icon={faWhatsapp} /> {/* Agregar el ícono de WhatsApp */}
    </a>
  );
};

export default WhatsAppButton;
