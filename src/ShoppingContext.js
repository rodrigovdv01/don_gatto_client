import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ShoppingContext = createContext();

const calcularSubtotal = (precio, cantidad) => {
  return precio * cantidad;
};

const calcularTotal = (carrito) => {
  return carrito.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);
};

export const ShoppingProvider = ({ children }) => {
  const [selectedItemsOriginales, setSelectedItemsOriginales] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedEntrada, setSelectedEntrada] = useState();
  const [selectedSegundo, setSelectedSegundo] = useState();
  const [selectedPostre, setSelectedPostre] = useState();
  const [selectedBebida, setSelectedBebida] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [pedidoId, setPedidoId] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [pedidosOriginales, setPedidosOriginales] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [usuariosOriginales, setUsuariosOriginales] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initialCart = JSON.parse(localStorage.getItem("carrito")) || [];
  const [carrito, setCarrito] = useState(initialCart);
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (cartOpen) {
      toggleCart();
    }
  };

  const agregarAlCarrito = (menuItem) => {
    const itemExistente = carrito.find(
      (item) => item.producto_id === menuItem.producto_id
    );

    if (itemExistente) {
      const nuevoCarrito = carrito.map((item) => {
        if (item.producto_id === menuItem.producto_id) {
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      });
      setCarrito(nuevoCarrito);
    } else {
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

  const agregarMenu = (menuItem) => {
    const nuevoCarrito = [...carrito, { ...menuItem, cantidad: 1 }];
    setCarrito(nuevoCarrito);
  };

  const modificarCantidadMenu = (index, cantidad) => {
    if (index >= 0 && index < carrito.length) {
      const item = carrito[index];

      if (item.id_categoria === 0) {
        const nuevaCantidad = item.cantidad + cantidad;

        const cantidadNoNegativa = nuevaCantidad < 0 ? 0 : nuevaCantidad;

        const nuevoCarrito = [...carrito];
        nuevoCarrito[index] = { ...item, cantidad: cantidadNoNegativa };

        const nuevoCarritoFiltrado = nuevoCarrito.filter(
          (item) => item.cantidad > 0
        );

        setCarrito(nuevoCarritoFiltrado);
      }
    }
  };

  const modificarCantidad = (itemId, cantidad) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.producto_id === itemId) {
        const nuevaCantidad = item.cantidad + cantidad;
        const cantidadNoNegativa = nuevaCantidad < 0 ? 0 : nuevaCantidad;
        if (cantidadNoNegativa === 0) {
          return null;
        }
        return { ...item, cantidad: cantidadNoNegativa };
      }
      return item;
    });

    const nuevoCarritoFiltrado = nuevoCarrito.filter((item) => item !== null);

    setCarrito(nuevoCarritoFiltrado);
  };

  const eliminarDelCarrito = (itemId) => {
    const itemIndex = carrito.findIndex((item) => item.producto_id === itemId);
    if (itemIndex !== -1) {
      const nuevoCarrito = [
        ...carrito.slice(0, itemIndex),
        ...carrito.slice(itemIndex + 1),
      ];

      setCarrito(nuevoCarrito);

      const nuevosSelectedItems = [
        ...selectedItems.slice(0, itemIndex),
        ...selectedItems.slice(itemIndex + 1),
      ];

      setSelectedItems(nuevosSelectedItems);
    }
  };

  const eliminarMenu = (indice) => {
    if (indice >= 0 && indice < carrito.length) {
      const nuevoCarrito = [
        ...carrito.slice(0, indice),
        ...carrito.slice(indice + 1),
      ];

      setCarrito(nuevoCarrito);

      const nuevosSelectedItems = [
        ...selectedItems.slice(0, indice),
        ...selectedItems.slice(indice + 1),
      ];

      setSelectedItems(nuevosSelectedItems);
    }
  };

  const handleItemSelectedChange = (index, field, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setSelectedItems(updatedItems);

    localStorage.setItem("selectedItems", JSON.stringify(updatedItems));
  };

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
      const usuarios = response.data;
      setUsuariosOriginales(usuarios);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const obtenerPedidos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/pedidos`);
      const listaPedidos = response.data;
      setPedidos(listaPedidos);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
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
        setDetallesPedido(response.data);
      } else {
        setDetallesPedido(response.data.detalles);
      }

      console.log(response.data);
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
        agregarMenu,
        eliminarMenu,
        selectedBebida,
        selectedEntrada,
        selectedSegundo,
        selectedPostre,
        selectedItems,
        pedidoId,
        usuariosOriginales,
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
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShoppingContext = () => {
  return useContext(ShoppingContext);
};
