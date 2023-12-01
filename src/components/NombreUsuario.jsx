import React, { useEffect, useState } from "react";
import axios from "axios";

const obtenerNombreUsuario = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3001/users/${userId}`); // Ajusta la URL según tu API
    return `${response.data.nombre} ${response.data.apellido}`; // Supongo que el nombre del usuario se encuentra en response.data
  } catch (error) {
    console.error("Error al obtener el nombre del usuario:", error);
    return ""; // Manejo de errores, puedes decidir qué hacer si no se puede obtener el nombre
  }
};

const NombreUsuario = ({ userId }) => {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const obtenerNombre = async () => {
      const nombreUsuario = await obtenerNombreUsuario(userId);
      setNombre(nombreUsuario);
    };

    obtenerNombre();
  }, [userId]);

  return <>{nombre}</>;
};

export default NombreUsuario;
