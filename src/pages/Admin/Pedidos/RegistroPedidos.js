import React, { useState, useEffect } from "react";
import { useShoppingContext } from "../../../ShoppingContext";
import axios from "axios";
import "./RegistroPedidos.css";
import "../../../components/Header/Header.css";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faTimes,
  faExclamationTriangle,
  faFileExcel,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { faWaze, faGoogle } from "@fortawesome/free-brands-svg-icons";

const RegistroPedidos = () => {
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [transacciones, setTransacciones] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mostrarDetallesPedido, setMostrarDetallesPedido] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedPedidoIndex, setSelectedPedidoIndex] = useState(null);

  const {
    obtenerUsuarios,
    usuariosOriginales,
    obtenerPedidos,
    pedidos,
    obtenerProductos,
    productosOriginales,
    obtenerDetallesPedido,
    detallesPedido,
    obtenerTransacciones,
  } = useShoppingContext();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Actualiza la hora cada segundo

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []); // Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/verify-auth`, {
        withCredentials: true,
      })
      .then((response) => {
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error al verificar la autenticación:", error);
        setIsAuthenticated(false);
      });

    const fetchData = async () => {
      try {
        await Promise.all([
          obtenerUsuarios(),
          obtenerPedidos(),
          obtenerProductos(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    // Solo incluir isAuthenticated en el array de dependencias
  }, [isAuthenticated]);

  const formattedTime = currentDateTime.toLocaleTimeString("es-PE", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedDate = currentDateTime.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const formatTime = (createdAt) => {
    return new Date(createdAt).toLocaleTimeString("es-PE", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (createdAt) => {
    return new Date(createdAt).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const obtenerTransaccion = async (pedidoId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/transacciones_pago/${pedidoId}`
      );
      const transaccionData = response.data;

      setTransacciones((prevTransacciones) => ({
        ...prevTransacciones,
        [pedidoId]: transaccionData,
      }));
    } catch (error) {
      console.error("Error al obtener la transacción:", error);
    }
  };

  const buscarInformacionUsuario = (user_id) => {
    const usuario = usuariosOriginales.find(
      (usuario) => usuario.id === user_id
    );
    return usuario || {};
  };

  const handlePedidoClick = async (pedido) => {
    if (selectedPedido && selectedPedido.id === pedido.id) {
      setSelectedPedido(null);
      setSelectedPedidoIndex(sortedPedidos.indexOf(pedido));
    } else {
      setSelectedPedido(pedido);
      setMostrarDetallesPedido(true);

      try {
        await obtenerTransaccion(pedido.id); // Wait for the transaction to be fetched
        await obtenerDetallesPedido(pedido.id, "/registro-de-pedidos");
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
      }
    }
  };

  const handleTransaccionChange = async (e) => {
    const nuevoEstadoTransaccion = e.target.value;
    const pedidoId = selectedPedido.id;

    try {
      console.log(
        `Actualizando estado de transacción para el pedido ${pedidoId} a ${nuevoEstadoTransaccion}`
      );
      await axios.put(
        `${process.env.REACT_APP_API_URL}/transacciones_pago/${pedidoId}`,
        {
          estado_transaccion: nuevoEstadoTransaccion,
        }
      );

      console.log("Obteniendo información actualizada de la transacción");
      await obtenerTransaccion(pedidoId);

      console.log("Actualizando información de usuarios");
      await obtenerUsuarios();

      console.log("Actualizando información de pedidos");
      await obtenerPedidos();

      console.log(
        `Estado de la transacción del pedido ${pedidoId} actualizado a ${nuevoEstadoTransaccion}`
      );

      setTransacciones((prevTransacciones) => ({
        ...prevTransacciones,
        [pedidoId]: {
          ...prevTransacciones[pedidoId],
          estado_transaccion: nuevoEstadoTransaccion,
        },
      }));

      setSelectedPedido((prevSelectedPedido) => ({
        ...prevSelectedPedido,
        estado_transaccion: nuevoEstadoTransaccion,
      }));
    } catch (error) {
      console.error("Error al actualizar el estado de la transacción:", error);
    }
  };

  const getPedidoEstadoClass = (estadoPedido) => {
    switch (estadoPedido) {
      case "Activo":
        return "pedido-recibido";
      case "Confirmado":
        return "pedido-confirmado";
      case "En camino":
        return "pedido-en-camino";
      case "Finalizado":
        return "pedido-entregado";
      default:
        return "";
    }
  };

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      if (
        selectedPedido &&
        typeof selectedPedido === "object" &&
        selectedPedido.id
      ) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/pedidos/${pedidoId}`,
          {
            estado_pedido: nuevoEstado,
          }
        );

        const nuevosPedidos = pedidos.map((pedido) => {
          if (pedido.id === pedidoId) {
            return { ...pedido, estado_pedido: nuevoEstado };
          }
          return pedido;
        });

        obtenerPedidos(nuevosPedidos);

        console.log(
          `Estado del pedido ${pedidoId} actualizado a ${nuevoEstado}`
        );
      }
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  const handleEstadoChange = (e, pedido) => {
    const nuevoEstado = e.target.value;
    setSelectedPedido((prevSelectedPedido) => {
      const updatedSelectedPedido = { ...prevSelectedPedido, ...pedido };
      setMostrarDetallesPedido(false);
      return updatedSelectedPedido;
    });

    const pedidoId = pedido.id;
    actualizarEstadoPedido(pedidoId, nuevoEstado);
  };

  const sortedPedidos = pedidos.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  const exportToExcel = () => {
    const dataToExport = sortedPedidos.map((pedido) => {
      const detallesProductos = detallesPedido[pedido.id]?.detalles || [];
      const productosComprados = detallesProductos.map((detalle) => {
        const productoDelDetalle = productosOriginales.find(
          (producto) => producto.producto_id === detalle.producto_id
        );
        return {
          Producto: productoDelDetalle?.nombre || "Producto Desconocido",
          Cantidad: detalle.cantidad,
          "Precio Unitario": `S/. ${detalle.precio_unitario.toFixed(2)}`,
        };
      });

      return {
        ID: pedido.id,
        "Fecha de Realización": formatDate(pedido.createdAt),
        "Hora de Realización": formatTime(pedido.createdAt),
        Usuario:
          pedido.user_id === 0
            ? "Cliente sin usuario"
            : buscarInformacionUsuario(pedido.user_id)?.email,
        Distrito: pedido.distrito,
        "Total del Pedido": `S/. ${pedido.monto_total.toFixed(2)}`,
        "Estado del Pedido": pedido.estado_pedido || "Desconocido",
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport, {
      header: Object.keys(dataToExport[0]),
    });

    ws["!cols"] = Object.keys(dataToExport[0]).map(() => ({ wch: 20 }));
    ws["!autofilter"] = {
      ref: XLSX.utils.encode_range(XLSX.utils.decode_range(ws["!ref"])),
    };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registro_de_Pedidos_Webo");

    const arrayBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "array",
    });

    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    FileSaver.saveAs(blob, "Registro_de_Pedidos_Webo.xlsx");
  };

  const abrirEnWaze = (direccion) => {
    const direccionEncoded = encodeURIComponent(direccion);
    const wazeURL = `https://waze.com/ul?q=${direccionEncoded}`;
    window.open(wazeURL, "_blank");
  };

  const abrirEnGoogleMaps = (direccion) => {
    const direccionEncoded = encodeURIComponent(direccion);
    const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${direccionEncoded}`;
    window.open(googleMapsURL, "_blank");
  };

  return (
    <div className="content-container">
      <h2 className="registro-pedidos-heading">Registro de Pedidos</h2>

      <div className="leyenda">
        <div class="legend-item ">
          <span>Pedido Nuevo</span>
          <div class="color-box " style={{ background: "#4caf50" }}></div>
        </div>

        <div class="legend-item ">
          <span>Confirmado</span>
          <div class="color-box" style={{ background: "#6161ff" }}></div>
        </div>

        <div class="legend-item ">
          <span>En Camino</span>
          <div class="color-box" style={{ background: "#ffff55" }}></div>
        </div>

        <div class="legend-item">
          <span>Entregado</span>
          <div class="color-box" style={{ background: "grey" }}></div>
        </div>
      </div>

      <div className="clock flex-space-around">
        <div>
          <FontAwesomeIcon icon={faClock} /> <span>{formattedTime}</span>{" "}
        </div>

        <div>
          <FontAwesomeIcon icon={faCalendar} /> <span>{formattedDate}</span>{" "}
        </div>

        <button className="lista-button" onClick={exportToExcel}>
          Exportar a Excel{" "}
          <span className="excel">
            <FontAwesomeIcon icon={faFileExcel} />
          </span>
        </button>
      </div>

      <table className="tabla-registro-de-pedidos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha de Realización</th>
            <th>Hora de Realización</th>
            <th>Usuario</th>
            <th>Distrito</th>
            <th>Total del Pedido</th>
            <th>Detalles del Pedido</th>
            <th>Estado del Pedido</th>
          </tr>
        </thead>
        <tbody>
          {sortedPedidos.map((pedido) => (
            <React.Fragment key={pedido.id}>
              <tr
                key={pedido.id}
                className={`${getPedidoEstadoClass(pedido.estado_pedido)} ${
                  selectedPedido === pedido ? "selected" : ""
                }`}
              >
                <td>{pedido.id}</td>

                <td>Realizado el {formatDate(pedido.createdAt)}</td>

                <td>
                  <p>a las {formatTime(pedido.createdAt)}</p>
                </td>
                <td>
                  {pedido.user_id === 0
                    ? "Cliente sin usuario"
                    : buscarInformacionUsuario(pedido.user_id)?.email}
                </td>
                <td>{pedido.distrito}</td>
                <td>
                  <b>S/. {pedido.monto_total.toFixed(2)}</b>
                </td>
                <td>
                  <button
                    className={`registro-pedidos-button ${(() => {
                      switch (pedido.estado_pedido) {
                        case "Finalizado":
                          return "entregado";
                        case "En camino":
                          return "en-camino";
                        case "Confirmado":
                          return "confirmado";
                        default:
                          return "";
                      }
                    })()}`}
                    onClick={() => handlePedidoClick(pedido)}
                  >
                    Detalles del pedido{" "}
                    {transacciones[pedido.id] &&
                      (transacciones[pedido.id].estado_transaccion ===
                        "Pendiente" ||
                        transacciones[pedido.id].estado_transaccion ===
                          "Rechazada") && (
                        <FontAwesomeIcon
                          className="advertencia-icon"
                          icon={faExclamationTriangle}
                        />
                      )}
                  </button>
                </td>
                <td>
                  <div className="flex">
                    <select
                      value={pedido.estado_pedido || ""}
                      onChange={(e) => {
                        if (pedido && pedido.estado_pedido !== undefined) {
                          handleEstadoChange(e, pedido);
                        }
                      }}
                    >
                      <option value="Activo">Nuevo</option>
                      <option value="Confirmado">Confirmado</option>
                      <option value="En camino">En camino</option>
                      <option value="Finalizado">Entregado</option>
                    </select>
                    <div className="icons">
                      <Link
                        to={`/pedido-confirmado/${pedido.id}/${pedido.trackId}}`}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                    </div>
                  </div>

                  <p>a las {formatTime(pedido.updatedAt)}</p>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {mostrarDetallesPedido && selectedPedido && (
        <div className="detalles-pedido-overlay">
          <div className="detalles-pedido-container">
            <button
              className="detalles-card-close-btn"
              onClick={() => {
                setMostrarDetallesPedido(false);
                setSelectedPedido(null);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="detalle-pedido"></div>
            <div className=" mg-bottom-20">
              <div className="details-title">
                <h3>
                  Detalles del pedido{" "}
                  {transacciones[selectedPedido.id]?.estado_transaccion ===
                    "Pendiente" && (
                    <span>
                      <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
                    </span>
                  )}
                </h3>
              </div>
              <div>
                <Link
                  to={`/pedido-confirmado/${selectedPedido.id}/${selectedPedido.trackId}`}
                  target="_blank"
                >
                  <div className="id-number">
                    <span className="id">ID </span>
                    <span className="number">{selectedPedido.id}</span>
                  </div>
                </Link>
              </div>
              <div>
                <div>
                  <select
                    value={transacciones[selectedPedido.id]?.estado_transaccion}
                    onChange={handleTransaccionChange}
                    style={{
                      backgroundColor:
                        transacciones[selectedPedido.id]?.estado_transaccion ===
                        "Pendiente"
                          ? ""
                          : transacciones[selectedPedido.id]
                              ?.estado_transaccion === "Pagado"
                          ? "green"
                          : "red",
                    }}
                  >
                    <option value="Pendiente">Pago Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Rechazada">Pago Rechazado</option>
                  </select>
                </div>

                <select
                  value={selectedPedido.estado_pedido || ""}
                  onChange={(e) => {
                    if (
                      selectedPedido &&
                      selectedPedido.estado_pedido !== undefined
                    ) {
                      handleEstadoChange(e, selectedPedido);
                    }
                  }}
                >
                  <option value="Activo">Nuevo Pedido</option>
                  <option value="Confirmado">Pedido Confirmado</option>
                  <option value="En camino">En camino</option>
                  <option value="Finalizado">Pedido Entregado</option>
                </select>
              </div>
            </div>

            {/* Resto del contenido de detalles del pedido */}
            <ul>
              <li className="metodo">
                Paga con {transacciones[selectedPedido.id]?.metodo_pago}
              </li>

              <li className="nombre">{selectedPedido.nombre}</li>
              <li className="telefono">{selectedPedido.telefono}</li>
              <li className="email">{selectedPedido.email}</li>
              <li className="direccion">{selectedPedido.direccion_envio}</li>
              <li>
                <button
                  onClick={() => abrirEnWaze(selectedPedido.direccion_envio)}
                >
                  Abrir en Waze
                  <FontAwesomeIcon icon={faWaze} className="waze-icon" />
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    abrirEnGoogleMaps(selectedPedido.direccion_envio)
                  }
                >
                  Abrir en Google Maps
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className="google-maps-icon"
                  />
                </button>
              </li>

              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://api.whatsapp.com/send?phone=${
                    selectedPedido.telefono
                  }&text=Estimado cliente ${
                    selectedPedido.nombre
                  }, es un placer saludarte desde webo.pe. Hemos recibido tu pedido y estamos emocionados de atenderte.%0D%0A %0D%0APedido ${
                    selectedPedido.estado_pedido
                  }%0D%0A ID de pedido: ${selectedPedido.id}%0D%0ANombre: ${
                    selectedPedido.nombre
                  }%0D%0ADirección de entrega: ${
                    selectedPedido.direccion_envio
                  }%0D%0AEstado de pago: ${
                    transacciones[selectedPedido.id]?.estado_transaccion
                  }`}
                >
                  Enviar mensaje por WhatsApp
                </a>
              </li>
              <li className="direccion">
                Productos: S/.{" "}
                {selectedPedido.monto_total - selectedPedido.costo_envio}
              </li>
              <li className="direccion">
                Costo de envío: S/. {selectedPedido.costo_envio.toFixed(2)}
              </li>
              <li className="monto_total">
                <b>Total S/. {selectedPedido.monto_total.toFixed(2)}</b>
              </li>
              <li>
                <button className="seguimiento">
                  <Link
                    target="_blank"
                    to={`/pedido-confirmado/${selectedPedido.id}/${selectedPedido.trackId}}`}
                  >
                    Seguimiento
                  </Link>
                </button>
              </li>
            </ul>

            <table className="details-card-table">
              <thead>
                <tr>
                  <th colSpan={2}>Producto</th>
                  <th>Precio unitario</th>
                </tr>
              </thead>
              <tbody>
                {/* Detalles de productos */}
                {detallesPedido &&
                detallesPedido.detalles &&
                detallesPedido.detalles.length > 0 ? (
                  detallesPedido.detalles.map((detalle, index) => {
                    const productoDelDetalle = productosOriginales.find(
                      (producto) => producto.producto_id === detalle.producto_id
                    );
                    return (
                      <tr key={`${detalle.producto_id}-${index}`}>
                        <td className="flex" style={{ alignItems: "center" }}>
                          <img
                            src={productoDelDetalle?.img}
                            alt="imagen del producto"
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              marginLeft: "8px",
                            }}
                          >
                            <span className="product-name">
                              {productoDelDetalle?.nombre}
                            </span>
                            <b className="product-quantity">
                              x{detalle.cantidad}
                            </b>
                          </div>
                        </td>
                        <td>
                          <input type="checkbox"></input>
                        </td>
                        <td>S/. {detalle.precio_unitario.toFixed(2)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="2">
                      No hay detalles disponibles para este pedido.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroPedidos;
