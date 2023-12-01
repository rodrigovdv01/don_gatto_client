// Importa las librerías y componentes necesarios
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import WhatsAppButton from "./components/WhatsappButton/WhatsappButton";
import Home from "./pages/Home/Home";
import Servicios from "./pages/Servicios/Servicios";
import Contacto from "./pages/Contacto/Contacto";
import Menu from "./pages/Home/Menu/Menu";
import RegistroPedidos from "./pages/Admin/Pedidos/RegistroPedidos";
import SignUpForm from "./components/User/SignUpForm";
import SignInForm from "./components/User/SignInForm";
import Productos from "./pages/Admin/Productos/Productos";
import Usuarios from "./pages/Admin/Users/Usuarios";
import MisPedidos from "./pages/Pedidos/MisPedidos";
import CheckoutCart from "./pages/Carrito/CheckoutCart";
import CheckoutShipping from "./pages/Carrito/CheckoutShipping";
import CheckoutPayment from "./pages/Carrito/CheckoutPayment";
import PedidoConfirmado from "./pages/Pedidos/PedidoConfirmado";
import { AuthProvider } from "./AuthContext";
import { ShoppingProvider } from "./ShoppingContext";
import { useIsUserAdmin } from "./AuthContext";
import AgeConfirmation from "./AgeConfirmation";

import "./styles.css";

function App() {
  const isUserAdmin = useIsUserAdmin();
  const location = useLocation();
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  

  // Comprueba si la ubicación actual coincide con "/login" o "/registrarse"
  const shouldShowFooter = ![
    "/login",
    "/registrarse",
    "/registro-de-pedidos",
    "/administrar-productos",
    "/administrar-usuarios",
    "/checkout/cart",
    "/checkout/shipping",
    "/checkout/payment",
  ].includes(location.pathname);

 

  // if (!isAgeConfirmed) {
  // Si la edad no está confirmada, mostrar la pantalla de confirmación
  //   return (
  //     <AgeConfirmation onConfirm={(confirmed) => setIsAgeConfirmed(confirmed)} />
  //   );
  // }

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />

        <Route path="/registrarse" element={<SignUpForm />} />
        <Route path="/login" element={<SignInForm />} />

        {isUserAdmin && (
          <>
            <Route path="/administrar-productos" element={<Productos />} />
            <Route path="/administrar-usuarios" element={<Usuarios />} />
            <Route path="/registro-de-pedidos" element={<RegistroPedidos />} />
          </>
        )}

        <Route
          path="/menu"
          element={
            <div className="content-container">
              <Menu />
            </div>
          }
        />

        <Route path="/checkout/cart" element={<CheckoutCart />} />
        <Route path="/checkout/shipping" element={<CheckoutShipping />} />
        <Route path="/checkout/payment" element={<CheckoutPayment />} />
        <Route
          path="/pedido-confirmado/:pedidoId"
          element={<PedidoConfirmado />}
        />
      </Routes>
      <WhatsAppButton />
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <ShoppingProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ShoppingProvider>
    </Router>
  );
}

export default MainApp;
