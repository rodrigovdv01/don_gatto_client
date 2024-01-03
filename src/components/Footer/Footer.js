import React from 'react';
import {Link} from "react-router-dom";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Anuncios</h3>
          
          <img  height={400} alt="anuncios" src="/images/anuncios/rescate_de_la_pandilla.jpg"></img>
        </div>
        <div className="footer-section">
          <Link to="/shop"><h3>Tienda Online</h3></Link>
            <p>Waka </p>
            <p>Relx</p>
            <p>Relx pod</p>
        </div>
        <div className="footer-section">
          <h3>Atención al cliente</h3>
          <p><FontAwesomeIcon style={{ color: "#000" }} icon={faPhone} /> +51 986734669</p>
          <p><FontAwesomeIcon style={{ color: "#000" }} icon={faEnvelope} /> dongattovs21@gmail.com</p>
          <p><FontAwesomeIcon style={{ color: "#000" }} icon={faLocationArrow} /> Fresh Solutions E.I.R.L.</p> 
          <ul className='redes-sociales'>
            <li><a style={{ color: "#000" }} href="https://instagram.com/dongatto.pe?igshid=MTNiYzNiMzkwZA=="><FontAwesomeIcon icon={faInstagram} /></a></li>
            <li><a style={{ color: "#000" }} href="https://www.facebook.com/profile.php?id=100083826669635&mibextid=LQQJ4d"><FontAwesomeIcon icon={faFacebook} /></a></li>
          </ul>
        </div>
      </div>
      <ul className="footer-bottom">
          <li>&copy; 2024 Don Gatto.</li>
          <li><a href="/">Términos y condiciones</a></li>
          <li><a href="/">Política de privacidad</a></li>
      </ul>
    </footer>
  );
}

export default Footer;
