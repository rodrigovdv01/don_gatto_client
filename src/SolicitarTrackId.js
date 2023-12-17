import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SolicitarTrackId = () => {
  const [trackIdInput, setTrackIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setTrackIdInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el trackId es válido (puedes agregar más lógica de validación si es necesario)
    if (trackIdInput.trim() === "") {
      // Muestra un mensaje de error o realiza la lógica que prefieras para manejar un trackId no válido
      return;
    }

    setLoading(true);

    try {
      // Realizar una solicitud para obtener el pedido correspondiente al trackId
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/pedidos/obtener-pedido-por-trackId/${trackIdInput}`
      );

      const pedido = response.data;

      if (pedido) {
        // Redirige al componente PedidoConfirmado con el nuevo trackId y el pedidoId
        navigate(`/pedido-confirmado/${pedido.id}/${trackIdInput}`);
      } else {
        setError("No se encontró un pedido con el trackId proporcionado");
      }
    } catch (error) {
      console.error("Error al obtener el pedido:", error);
      setError("Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-container">
      <h2>Solicitar TrackId</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Ingrese el TrackId:
          <input
            type="text"
            value={trackIdInput}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit" disabled={loading}>
          Enviar
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SolicitarTrackId;
