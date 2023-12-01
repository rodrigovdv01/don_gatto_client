import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Banner.css";

function Banner() {
  const [currentImage, setCurrentImage] = useState(1);

  const changeImage = (imageNumber) => {
    setCurrentImage(imageNumber);
  };



  return (
    <div className="banner-container">
      <div className="image-container">
        <img
          src={`/images/banner/banner-${currentImage}.jpg`}
          alt={`Banner ${currentImage}`}
        />
        <Link to="/menu" className="banner-button">
          ORDENA AQUÍ
        </Link>
      </div>
      <div className="image-selector">
        <div
          className={`circle ${currentImage === 1 ? "selected" : ""}`}
          onClick={() => changeImage(1)}
        ></div>
        <div
          className={`circle ${currentImage === 2 ? "selected" : ""}`}
          onClick={() => changeImage(2)}
        ></div>
        <div
          className={`circle ${currentImage === 3 ? "selected" : ""}`}
          onClick={() => changeImage(3)}
        ></div>
      </div>
    </div>
  );
}

export default Banner;
