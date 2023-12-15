import React from "react";
import { useAuth } from "../../AuthContext"; // Importa useAuth
import { useShoppingContext } from "../../ShoppingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import "./form.css";

const SignInForm = () => {
  const { handleLogin, loginData, setLoginData, error } = useAuth();
  const { showLoginForm, showSignUpForm, setShowLoginForm, setShowSignUpForm, setIsAuthenticated } =
    useShoppingContext();

  // const clientID =
  //   "268839054721-rfc2c4nafgmkkhcj0fefq41rsd1ojq82.apps.googleusercontent.com";

  // const onSuccess = (res) => {
  //   console.log("LOGIN SUCCESS! usuario: ", res.profileObj);
  // };

  // const onFailure = (res) => {
  //   console.log("LOGIN FAILED! res: ", res);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(loginData);
    } catch (error) {
      console.error("Error during login:", error);
    }
    if (showLoginForm) {
      setShowLoginForm(false);
    }
    if (showSignUpForm) {
      setShowSignUpForm(false);
    }
    console.log(error);
  };

  return (
    <>
      <div className="flex-login-container">
        <div className="form-container">
          <div className="close-form-container">
            <FontAwesomeIcon
              icon={faTimes}
              className="close-form"
              onClick={() => {
                setShowLoginForm(false);
                setShowSignUpForm(false);
              }}
            />
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <h1 className="form-title">Iniciar sesión</h1>
            <label className="form-label">
              Correo:
              <input
                type="email"
                name="email"
                value={loginData.email}
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
                value={loginData.password}
                onChange={handleChange}
                autoComplete="off"
                className="form-input"
              />
            </label>

            <button type="submit" className="form-button">
              Iniciar sesión
            </button>
            {/* <div>
                <GoogleLogin
                  clientId={clientID}
                  buttonText="Login"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={"single_host_origin"}
                  isSigned={true}
                />
              </div> */}
            <ul>
              <li>ó</li>
              <li>
                <p
                  onClick={() => {
                    if (showLoginForm) {
                      setShowLoginForm(false);
                    }
                    if (!showSignUpForm) {
                      setShowSignUpForm(true);
                    }
                  }}
                >
                  Registrarse
                </p>
              </li>
            </ul>
          </form>
        </div>

        {error === "null" && <div className="error-message">{error}</div>}
      </div>
    </>
  );
};

export default SignInForm;
