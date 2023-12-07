import React, { useState } from "react";
import "../../styles.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext"; // Importa useAuth
import { useNavigate } from "react-router-dom";
import "./form.css";

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { authenticatedUser, handleLogin, handleSignOut } = useAuth(); // Obtiene handleLogin desde el contexto
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Utiliza handleLogin del contexto para manejar el inicio de sesión
    handleLogin(formData);
  };

  return (
    <div className="content-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="form-title">Iniciar sesión</h1>
          <label className="form-label">
            Correo:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="on"
              className="form-input"
            />
          </label>
          <label className="form-label">
            Contraseña:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
              className="form-input"
            />
          </label>

          <button type="submit" className="form-button">
            Iniciar sesión
          </button>
          <ul>
            <li>ó</li>
            <li>
              <p>
                <Link to="/registrarse">Registrarse</Link>
              </p>
            </li>
          </ul>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {authenticatedUser && (
        <div>
          <h2 className="user-info-title">Información del usuario</h2>
          <p className="user-info">Correo: {authenticatedUser.email}</p>
          <button onClick={handleSignOut} className="logout-button">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
