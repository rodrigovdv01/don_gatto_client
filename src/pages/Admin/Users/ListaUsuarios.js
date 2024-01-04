import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Usuarios.css"; // Asegúrate de ajustar el nombre del archivo CSS
import EditarUsuario from "./EditarUsuario"; // Asegúrate de importar el componente de edición de usuario si existe
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const ListaUsuarios = () => {
  const [usuariosOriginales, setUsuariosOriginales] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaId, setBusquedaId] = useState("");
  const [busquedaCorreo, setBusquedaCorreo] = useState("");
  const [busquedaRol, setBusquedaRol] = useState(""); // Nuevo estado para la búsqueda por rol
  const [busquedaApellido, setBusquedaApellido] = useState(""); // Nuevo estado para la búsqueda por apellido
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  // Define la función filtrarUsuarios utilizando useCallback
  const filtrarUsuarios = useCallback(() => {
    let usuariosFiltrados = [...usuariosOriginales];

    if (busquedaNombre) {
      usuariosFiltrados = usuariosFiltrados.filter(
        (usuario) =>
          usuario.nombre &&
          usuario.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
      );
    }

    if (busquedaId) {
      usuariosFiltrados = usuariosFiltrados.filter(
        (usuario) => usuario.id.toString() === busquedaId
      );
    }

    if (busquedaCorreo) {
      usuariosFiltrados = usuariosFiltrados.filter(
        (usuario) =>
          usuario.email &&
          usuario.email.toLowerCase().includes(busquedaCorreo.toLowerCase())
      );
    }

    if (busquedaRol) {
      usuariosFiltrados = usuariosFiltrados.filter(
        (usuario) =>
          usuario.level &&
          usuario.level.toLowerCase() === busquedaRol.toLowerCase()
      );
    }

    if (busquedaApellido) {
      usuariosFiltrados = usuariosFiltrados.filter(
        (usuario) =>
          usuario.apellido &&
          usuario.apellido
            .toLowerCase()
            .includes(busquedaApellido.toLowerCase())
      );
    }

    setUsuariosFiltrados(usuariosFiltrados);
  }, [
    busquedaNombre,
    busquedaId,
    busquedaCorreo,
    busquedaRol,
    busquedaApellido,
    usuariosOriginales,
  ]);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
  }, [
    busquedaNombre,
    busquedaId,
    busquedaCorreo,
    busquedaRol,
    busquedaApellido,
    usuariosOriginales,
    filtrarUsuarios, // Agrega filtrarUsuarios como dependencia
  ]);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users`
      );
      const usuarios = response.data;
      setUsuariosOriginales(usuarios);
      setUsuariosFiltrados(usuarios);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const handleActualizarUsuarios = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users`
      );
      const usuariosActualizados = response.data;
      setUsuariosOriginales(usuariosActualizados);
      filtrarUsuarios();
    } catch (error) {
      console.error("Error al actualizar los usuarios:", error);
    }
  };

  const handleEliminarUsuario = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`);
      handleActualizarUsuarios();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const exportToExcel = () => {
    const dataToExport = usuariosFiltrados.map((usuario) => ({
      "Id de Usuario": usuario.id,
      Nombre: usuario.nombre,
      Apellido: usuario.apellido,
      "Correo Electrónico": usuario.email,
      Teléfono: usuario.telefono,
      "Dirección de envío": usuario.direccion_envio,
      Rol: usuario.level,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport, {
      header: Object.keys(dataToExport[0]),
    });

    // Set the style for each column to be justified
    ws["!cols"] = Object.keys(dataToExport[0]).map(() => ({ wch: 20 }));

    // Set auto-filter for the entire worksheet
    ws["!autofilter"] = {
      ref: XLSX.utils.encode_range(XLSX.utils.decode_range(ws["!ref"])),
    };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");

    const arrayBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "array",
    });
    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    FileSaver.saveAs(blob, "Usuarios.xlsx");
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Nombre"
          value={busquedaNombre}
          onChange={(e) => setBusquedaNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido" // Campo de búsqueda por apellido
          value={busquedaApellido}
          onChange={(e) => setBusquedaApellido(e.target.value)}
        />

        <input
          type="text"
          placeholder="Correo Electrónico"
          value={busquedaCorreo}
          onChange={(e) => setBusquedaCorreo(e.target.value)}
        />

        <input
          type="text"
          placeholder="ID"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
        />
        <select
          value={busquedaRol}
          onChange={(e) => setBusquedaRol(e.target.value)}
        >
          <option value="">Rol</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="lista-buttons">
        <button className="lista-button" onClick={handleActualizarUsuarios}>
          Actualizar
        </button>
        <button className="lista-button" onClick={exportToExcel}>
          Exportar a Excel{" "}
          <span className="excel">
            <FontAwesomeIcon icon={faFileExcel} />
          </span>
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id de Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Dirección de envío</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.email}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.direccion_envio}</td>
              <td>{usuario.level}</td>
              <td>
                <button onClick={() => setUsuarioAEditar(usuario)}>
                  Editar
                </button>
                <button onClick={() => handleEliminarUsuario(usuario.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {usuarioAEditar && (
        <EditarUsuario
          usuario={usuarioAEditar}
          onClose={() => setUsuarioAEditar(null)}
          onUpdate={handleActualizarUsuarios}
        />
      )}
    </div>
  );
};

export default ListaUsuarios;
