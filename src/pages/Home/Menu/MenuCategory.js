import React from "react";
import "../../../styles.css";

const MenuCategory = ({ category, menuItems, agregarAlCarrito, menuCount }) => {
  // Filtra los productos activos antes de mostrarlos
  const productosActivos = menuItems.filter((menuItem) => menuItem.activo === true);

  const handleAgregarClick = (menuItem) => {
    // Aquí debes llamar a la función agregarAlCarrito con un nombre personalizado
    // Puedes usar el valor de menuCount para crear el nombre único
    agregarAlCarrito(menuItem, `Menu del día ${menuCount + 1}`);
  };

  return (
    <div className="category-container">
      <div className="menu-category">
        <h2>{category}</h2>
        <ul className="menu-container">
          {productosActivos.map((menuItem) => (
            <li className="menu-item" key={menuItem.producto_id}>
              <div className="menu-item-content">
                <div className="description">
                  <h3>{menuItem.nombre}</h3>
                  <div className="details">
                    <p>{menuItem.descripcion}</p>
                    <p>Precio: S/. {menuItem.precio}</p>
                  </div>
                </div>
                <div className="image">
                  <img src={menuItem.img} alt={menuItem.nombre} />
                </div>
              </div>
              <div className="agregar-container">
                <button
                  className="agregar-button"
                  onClick={() => handleAgregarClick(menuItem)}
                >
                  Agregar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuCategory;
