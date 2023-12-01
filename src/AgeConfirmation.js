// AgeConfirmation.js
import React, { useState } from "react";
import "./App.css";

const AgeConfirmation = ({ onConfirm }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmation = (confirmed) => {
    setIsConfirmed(confirmed);
    onConfirm(confirmed);

    if (!confirmed) {
      // Redirige a la página de inicio de Google si la confirmación es "No"
      window.location.href = "https://www.google.com";
    }
  };

  if (isConfirmed) {
    return null; // Si ya se confirmó la edad, no mostrar nada
  }

  return (
    <div className="age-confirmation-container">
      <h1>Bienvenido a Don Gatto</h1>
      <p>¿Eres mayor de 18 años?</p>
      <button className="confirm-button yes-button" onClick={() => handleConfirmation(true)}>
        Sí
      </button>
      <button className="confirm-button no-button" onClick={() => handleConfirmation(false)}>
        No
      </button>
    </div>
  );
};

export default AgeConfirmation;
