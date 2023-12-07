import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Banner.css";

function Banner() {
  const [currentImage, setCurrentImage] = useState(1);

  const changeImage = (imageNumber) => {
    setCurrentImage(imageNumber);
  };

  return (
    <>
      <div className="banner-container">
        <Link to="/menu" className="banner-button">
          ORDENA AQUÍ
        </Link>
      </div>
      
    </>
  );
}

export default Banner;
