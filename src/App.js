// Importa las librerías y componentes necesarios
import React, { useState } from "react";
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
import Checkout from "./pages/Carrito/Checkout";
import CheckoutPayment from "./pages/Carrito/CheckoutPayment";
import PedidoConfirmado from "./pages/Pedidos/PedidoConfirmado";
import { AuthProvider } from "./AuthContext";
import { ShoppingProvider } from "./ShoppingContext";
import { useIsUserAdmin } from "./AuthContext";
import SolicitarTrackId from "./SolicitarTrackId";
// import AgeConfirmation from "./AgeConfirmation";

function App() {
  const isUserAdmin = useIsUserAdmin();
  const location = useLocation();
  // const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);

  // Comprueba si la ubicación actual coincide con "/login" o "/registrarse"
  const shouldShowFooter = ![
    "/login",
    "/registrarse",
    "/registro-de-pedidos",
    "/administrar-productos",
    "/administrar-usuarios",
  ].includes(location.pathname);

  const shouldShowWhatsapp = ![
    "/login",
    "/registrarse",
    "/registro-de-pedidos",
    "/administrar-productos",
    "/administrar-usuarios",
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

        <Route path="/checkout/" element={<Checkout />} />
        <Route path="/checkout/cart" element={<CheckoutCart />} />
        
        <Route path="/carrito" element={<CheckoutCart />} />
        <Route path="/checkout/payment" element={<CheckoutPayment />} />
        <Route
          path="/pedido-confirmado/:pedidoId/:trackId"
          element={<PedidoConfirmado />}
        />
        <Route
          path="/tracking"
          element={<SolicitarTrackId />}
        />
      </Routes>
      {shouldShowWhatsapp && <WhatsAppButton />}
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
