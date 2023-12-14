import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Crear el contexto
const ShoppingContext = createContext();

// Función para calcular el subtotal de un producto en el carrito
const calcularSubtotal = (precio, cantidad) => {
  return precio * cantidad;
};

// Función para calcular el total del carrito
const calcularTotal = (carrito) => {
  return carrito.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);
};

// Proveedor del contexto que contendrá el estado del carrito
export const ShoppingProvider = ({ children }) => {
  // Guarda una copia de los selectedItems originales
  const [selectedItemsOriginales, setSelectedItemsOriginales] = useState([]);
  const [productos, setProductos] = useState([]); // Estado para los productos obtenidos de la API
  const [selectedEntrada, setSelectedEntrada] = useState();
  const [selectedSegundo, setSelectedSegundo] = useState();
  const [selectedPostre, setSelectedPostre] = useState();
  const [selectedBebida, setSelectedBebida] = useState();
  const [selectedHijo, setSelectedHijo] = useState();
  const [montoTotal, setMontoTotal] = useState();
  const [costoEnvio, setCostoEnvio] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [pedidoId, setPedidoId] = useState(null); // Estado para almacenar el ID del pedido
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [pedidosOriginales, setPedidosOriginales] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [hijosOriginales, setHijosOriginales] = useState([]);
  const [usuariosOriginales, setUsuariosOriginales] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [filteredPedidos, setFilteredPedidos] = useState();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isRotated, setRotated] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  
  const [distrito, setDistrito] = useState("");
  
  const [showLoginSection, setShowLoginSection] = useState(true);

  // Cargar el carrito desde localStorage al inicio o crear un carrito vacío si no existe
  const initialCart = JSON.parse(localStorage.getItem("carrito")) || [];
  const [carrito, setCarrito] = useState(initialCart);
  const vaciarCarrito = () => {
    setCarrito([]); // Establece el carrito como un arreglo vacío
  };

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (cartOpen) {
      toggleCart();
    }
  };

  // Funciones para agregar, eliminar y modificar elementos en el carrito
  const agregarAlCarrito = (menuItem) => {
    // Comprobar si el elemento ya está en el carrito
    const itemExistente = carrito.find(
      (item) => item.producto_id === menuItem.producto_id
    );

    if (itemExistente) {
      // Si ya existe, actualiza la cantidad
      const nuevoCarrito = carrito.map((item) => {
        if (item.producto_id === menuItem.producto_id) {
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      });
      setCarrito(nuevoCarrito);
    } else {
      // Si no existe, agrégalo con cantidad 1
      setCarrito([...carrito, { ...menuItem, cantidad: 1 }]);
    }
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
    if (userMenuOpen) {
      toggleUserMenu();
    }
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  const modificarCantidadMenu = (index, cantidad) => {
    // Verifica que el índice sea válido
    if (index >= 0 && index < carrito.length) {
      const item = carrito[index];

      if (item.id_categoria === 0) {
        // Si el elemento tiene id_categoria === 0, actualiza la cantidad
        const nuevaCantidad = item.cantidad + cantidad;

        // Asegúrate de que la cantidad no sea menor que 0
        const cantidadNoNegativa = nuevaCantidad < 0 ? 0 : nuevaCantidad;

        // Copia el carrito original y actualiza el elemento en el índice dado
        const nuevoCarrito = [...carrito];
        nuevoCarrito[index] = { ...item, cantidad: cantidadNoNegativa };

        // Filtra los elementos con cantidad 0 del nuevo carrito
        const nuevoCarritoFiltrado = nuevoCarrito.filter(
          (item) => item.cantidad > 0
        );

        setCarrito(nuevoCarritoFiltrado);
      }
    }
  };

  const modificarCantidad = (itemId, cantidad) => {
    // Actualiza la cantidad del elemento en el carrito
    const nuevoCarrito = carrito.map((item) => {
      if (item.producto_id === itemId) {
        const nuevaCantidad = item.cantidad + cantidad;
        // Asegúrate de que la cantidad no sea menor que 0
        const cantidadNoNegativa = nuevaCantidad < 0 ? 0 : nuevaCantidad;
        if (cantidadNoNegativa === 0) {
          // Elimina el elemento si la cantidad llega a 0
          return null;
        }
        return { ...item, cantidad: cantidadNoNegativa };
      }
      return item;
    });

    // Filtra los elementos nulos (productos con cantidad 0) del nuevo carrito
    const nuevoCarritoFiltrado = nuevoCarrito.filter((item) => item !== null);

    setCarrito(nuevoCarritoFiltrado);
  };

  const eliminarDelCarrito = (itemId) => {
    // Verificar si el itemId es válido
    const itemIndex = carrito.findIndex((item) => item.producto_id === itemId);
    if (itemIndex !== -1) {
      // Crear una copia del carrito actual excluyendo el elemento con el itemId especificado
      const nuevoCarrito = [
        ...carrito.slice(0, itemIndex),
        ...carrito.slice(itemIndex + 1),
      ];

      // Actualizar el carrito con el nuevo arreglo que excluye el producto eliminado
      setCarrito(nuevoCarrito);

      // En este punto, también debes eliminar el elemento correspondiente en selectedItems
      // Para hacerlo, puedes usar el mismo itemIndex para mantener sincronizados los arreglos
      const nuevosSelectedItems = [
        ...selectedItems.slice(0, itemIndex),
        ...selectedItems.slice(itemIndex + 1),
      ];

      // Actualizar selectedItems con los nuevos valores
      setSelectedItems(nuevosSelectedItems);
    }
  };

  const handleItemSelectedChange = (index, field, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setSelectedItems(updatedItems);

    // Llamar a las funciones setSelected correspondientes
    switch (field) {
      case "selectedEntrada":
        setSelectedEntrada(value);
        break;
      case "selectedSegundo":
        setSelectedSegundo(value);
        break;
      case "selectedPostre":
        setSelectedPostre(value);
        break;
      case "selectedBebida":
        setSelectedBebida(value);
        break;
      case "selectedHijo":
        setSelectedHijo(value); // Agrega el manejo de selectedHijo
        break;
      default:
        break;
    }

    // Guarda los datos en el localStorage
    localStorage.setItem("selectedItems", JSON.stringify(updatedItems));
  };

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users`
      );
      const usuarios = response.data;
      setUsuariosOriginales(usuarios);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const obtenerPedidos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/pedidos`
      );
      const listaPedidos = response.data;
      setPedidos(listaPedidos);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  const obtenerHijos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/hijos/get-all`
      );

      const { hijos } = response.data;

      if (Array.isArray(hijos)) {
        setHijosOriginales(hijos);
      } else {
        console.error("La respuesta no es un array:", hijos);
      }
    } catch (error) {
      console.error("Error al obtener los hijos:", error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products`
      );
      const productos = response.data;
      setProductosOriginales(productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const obtenerDetallesPedido = async (pedidoId, ruta) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/pedidos/${pedidoId}/detalles`
      );

      if (ruta === "/registro-de-pedidos") {
        // Establece la respuesta completa en detallesPedido
        setDetallesPedido(response.data);
      } else {
        // Establece solo la propiedad 'detalles' de la respuesta en detallesPedido
        setDetallesPedido(response.data.detalles);
      }
    } catch (error) {
      console.error("Error al obtener los detalles del pedido:", error);
    }
  };

  const obtenerMisPedidos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/pedidos/mis-pedidos`,
        {
          withCredentials: true,
          credentials: "include", // Agrega este encabezado
        }
      );

      const listaPedidos = response.data;

      if (Array.isArray(listaPedidos)) {
        setPedidosOriginales(listaPedidos);
        setPedidosFiltrados(listaPedidos);
      } else {
        console.error("La respuesta no es un array:", listaPedidos);
      }
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  return (
    <ShoppingContext.Provider
      value={{
        carrito,
        vaciarCarrito,
        agregarAlCarrito,
        modificarCantidad,
        modificarCantidadMenu,
        eliminarDelCarrito,
        calcularSubtotal,
        calcularTotal,
        selectedBebida,
        selectedEntrada,
        selectedSegundo,
        selectedPostre,
        selectedHijo,
        selectedItems,
        pedidoId,
        usuariosOriginales,
        hijosOriginales,
        productosOriginales,
        pedidosOriginales,
        pedidosFiltrados,
        pedidos,
        setSelectedBebida,
        setSelectedItems,
        setSelectedEntrada,
        setSelectedSegundo,
        setSelectedPostre,
        setPedidoId,
        setHijosOriginales,
        setUsuariosOriginales,
        setProductosOriginales,
        setPedidosOriginales,
        setPedidos,
        setPedidosFiltrados,
        handleItemSelectedChange,
        productos,
        setProductos,
        detallesPedido,
        setDetallesPedido,
        obtenerDetallesPedido,
        obtenerUsuarios,
        obtenerHijos,
        obtenerProductos,
        obtenerPedidos,
        obtenerMisPedidos,
        selectedItemsOriginales,
        setSelectedItemsOriginales,
        toggleCart,
        closeCart,
        cartOpen,
        setCartOpen,
        toggleUserMenu,
        userMenuOpen,
        setUserMenuOpen,
        filteredPedidos,
        setFilteredPedidos,
        cartItemCount,
        setCartItemCount,
        isRotated,
        setRotated,
        detailsVisible,
        setDetailsVisible,
        showLoginSection,
        setShowLoginSection,
        costoEnvio, 
        setCostoEnvio,
        montoTotal,
        setMontoTotal,
        distrito,
        setDistrito,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useShoppingContext = () => {
  return useContext(ShoppingContext);
};
