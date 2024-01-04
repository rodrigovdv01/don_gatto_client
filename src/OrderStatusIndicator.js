import React from "react";
import "./OrderStatusIndicator.css";

const OrderStatusIndicator = ({ currentStatus }) => {
  const getStatusColor = (status, currentStatus) => {
    const inactiveColor = "#888888"; // Color gris para elementos no activos

    if (status === currentStatus) {
      return "#F7B801"; // Color de "Confirmado"
    } else if (currentStatus === "Confirmado" && status === "Activo") {
      return "#F7B801"; // Color de "Confirmado"
    } else if (
      currentStatus === "En camino" &&
      (status === "Activo" || status === "Confirmado")
    ) {
      return "#F7B801"; // Color de "Confirmado"
    } else if (
      currentStatus === "Finalizado" &&
      (status === "Activo" || status === "Confirmado" || status === "En camino")
    ) {
      return "#F7B801"; // Color de "Confirmado"
    } else {
      return inactiveColor;
    }
  };

  return (
    <div className="order-status-container">
      <div className="order-status-indicator">
        <svg height="50" width="200">
          <line
            x1="35"
            y1="25"
            x2="65"
            y2="25"
            // className="animated-stroke"
            stroke="#888888"
            strokeWidth="4"
          />
          <line
            x1="85"
            y1="25"
            x2="115"
            y2="25"
            // className="animated-stroke"
            stroke="#888888"
            strokeWidth="4"
          />
          <line
            x1="135"
            y1="25"
            x2="165"
            y2="25"
            // className="animated-stroke"
            stroke="#888888"
            strokeWidth="4"
          />

          <circle
            cx="25"
            cy="25"
            r="10"
            fill={getStatusColor("Activo", currentStatus)}
          />
          <line
            x1="35"
            y1="25"
            x2="85"
            y2="25"
            // className="animated-stroke"
            stroke={getStatusColor("Activo", currentStatus)}
            strokeWidth="4"
          />
          <circle
            cx="95"
            cy="25"
            r="10"
            fill={getStatusColor("Confirmado", currentStatus)}
          />
          <line
            x1="105"
            y1="25"
            x2="160"
            y2="25"
            // className="animated-stroke"
            stroke={getStatusColor("Confirmado", currentStatus)}
            strokeWidth="4"
          />

          <circle
            cx="170"
            cy="25"
            r="10"
            fill={getStatusColor("En camino", currentStatus)}
          />
          <line
            x1="180"
            y1="25"
            x2="245"
            y2="25"
            // className="animated-stroke"
            stroke={getStatusColor("En camino", currentStatus)}
            strokeWidth="4"
          />
          <circle
            cx="255"
            cy="25"
            r="10"
            fill={getStatusColor("Finalizado", currentStatus)}
          />
        </svg>
      </div>
    </div>
  );
};

export default OrderStatusIndicator;
