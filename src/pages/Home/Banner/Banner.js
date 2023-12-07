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
      <div className="image-container">
        <img
          src={`/images/banner/banner-${currentImage}.png`}
          alt={`Banner ${currentImage}`}
        />
        <Link to="/menu" className="banner-button">
          ORDENA AQUÍ
        </Link>
        
      </div>
      
    </>
  );
}

export default Banner;
