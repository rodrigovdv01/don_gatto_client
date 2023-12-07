// Home.js
import React, { useState } from "react";
import "./Home.css";
import Banner from "./Banner/Banner";
import HomeSection from "./HomeSection";

function Home() {
  // Agrega un estado para controlar si se muestra la descripción completa
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleFullDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  // Define el texto del botón basado en el estado
  const buttonText = showFullDescription ? "Ver menos" : "Ver más";

  return (
    <div className="home-content">
      <div id="banner">
        <Banner />
      </div>
      <HomeSection
        Padding="40px"
        title="Sobre nosotros"
        reverse={false} // No invertir posición
        marginBottom="20px"
      >
        <h3>¡Bienvenido a Don Gatto Vape Store!</h3>
        <p>
          En Don Gatto, nos enorgullece ofrecer una experiencia excepcional en
          el mundo del vapeo. Somos apasionados por proporcionar productos de
          calidad y un servicio personalizado para satisfacer las necesidades de
          nuestros clientes.
        </p>
        {showFullDescription && (
          <>
            <h3>Nuestra Historia</h3>
            <p>
              Fundada con la idea de ofrecer alternativas de vapeo premium, Don
              Gatto Vape Store ha evolucionado para convertirse en aliado
              confiable para los entusiastas del vapeo. Desde nuestros modestos
              comienzos, hemos crecido gracias a la lealtad y el apoyo de
              nuestra comunidad.
            </p>
            <h3>Nuestra Misión</h3>
            <p>
              En el corazón de nuestra misión está el compromiso de proporcionar
              productos de alta calidad y un servicio excepcional. Nos
              esforzamos por ofrecer una amplia variedad de dispositivos y
              líquidos para vapear, asegurándonos de que encuentres exactamente
              lo que necesitas para satisfacer tu estilo y preferencias
              individuales.
            </p>
            <h3>Compromiso con la Calidad y la Seguridad</h3>
            <p>
              En Don Gatto, priorizamos la calidad y la seguridad. Trabajamos
              con marcas confiables y verificamos cada producto para garantizar
              que cumpla con los más altos estándares.
            </p>
          </>
        )}
        <h3>Únete a la Comunidad Don Gatto</h3>
        <p>
          Estamos encantados de ser parte de la vibrante comunidad del vapeo.
          Sigue explorando nuestro sitio web para descubrir nuestras últimas
          ofertas, nuevos productos y consejos útiles sobre el mundo del vapeo.
          En Don Gatto Vape Store, no solo vendemos productos; construimos
          conexiones y compartimos la pasión por el vapeo.
        </p>
        
        <h3>¡Gracias por elegir Don Gatto Vape Store!</h3>
        <button className="ver-mas" onClick={toggleFullDescription}>
          {buttonText}
        </button>
      </HomeSection>
      <div className="servicios">
        <div id="buffet-y-banquetes">
          <HomeSection
            title="Relx"
            media={{ type: "video", src: "relx" }}
            padding="100px" // Asegúrate de que el nombre de la propiedad sea "padding" en lugar de "imgH"
            backgroundColor="rgb(0 0 0 / 100%)"
            reverse={true} // Invertir posición
          >
            <p>
              Los Relx Pods Pro son pequeñas cápsulas de sabores que incorporan
              la avanzada tecnología patentada Super Smooth que nos ofrece un
              vapor más denso con un sabor más suave y depurado que cualquier
              otro cigarro electrónico, gracias a sus bobinas de cerámica con
              tecnología FEELM, tecnología de atomización de alta gama.
            </p>
          </HomeSection>
        </div>
        <div id="cafeterias">
          <HomeSection
            title="Waka"
            media={{ type: "video", src: "waka" }}
            padding="100px" // Asegúrate de que el nombre de la propiedad sea "padding" en lugar de "imgH"
            backgroundColor="rgb(21 21 21)"
            reverse={false} // No invertir posición
          >
            <p>
              WAKA Solo es un vaporizador todo en uno que cuenta con una batería
              de larga duración y 1800 inhalaciones con un 5% de fuerza de
              nicotina diseñado para un solo uso. WAKA Solo utiliza la
              tecnología de bobina de malla para proporcionar una mayor
              experiencia de vapeo.
            </p>
          </HomeSection>
        </div>
      </div>
    </div>
  );
}

export default Home;
