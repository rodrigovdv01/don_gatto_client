import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const CountdownTimer = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      // Limpieza del intervalo cuando el componente se desmonta o cuando los segundos llegan a cero
      return () => clearInterval(intervalId);
    } else {
      // Countdown reached zero, display alert message
      alert(
        "¡Gracias por tu compra! Agradecemos que nos envíes la confirmación del pago realizado con Yape a través de nuestro WhatsApp. ¡Comunícate con nosotros!"
      );
    }
  }, [seconds]);

  // Formatear los segundos en minutos y segundos
  const formattedTime = `${Math.floor(seconds / 60)}:${(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

  return (
    <div>
      <h2 className="">
        <FontAwesomeIcon icon={faClock} /> {formattedTime}
      </h2>
      <CountdownCircleTimer
        isPlaying={seconds > 0}
        duration={initialSeconds}
        colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
        size={0}
      />
    </div>
  );
};

export default CountdownTimer;
