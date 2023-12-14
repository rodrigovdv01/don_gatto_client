// CartDiv.js

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingCart,
  } from "@fortawesome/free-solid-svg-icons";

const CartDiv = ({ toggleCart, cartItemCount, headerBlanco }) => {
  return (
    <li>
      <button
        style={{
          backgroundColor: headerBlanco ? "#fff" : "#000",
        }}
        onClick={toggleCart}
        className="cart-div"
      >
        <FontAwesomeIcon
          style={{
            color: headerBlanco ? "#000" : "#fff",
          }}
          icon={faShoppingCart}
        />{" "}
        {cartItemCount > 0 && (
          <span
            className="cart-item-count"
            style={{
              color: headerBlanco ? "#000" : "#fff",
            }}
          >
            {cartItemCount}
          </span>
        )}
      </button>
    </li>
  );
};

export default CartDiv;
