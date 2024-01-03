import React from "react";
import PropTypes from "prop-types";
import "./HomeSection.css";

function HomeSection({ title, border, padding, backgroundColor, gradientBackground, media, reverse, children, marginBottom, borderRadius }) {
  const sectionStyle = {
    border,
    background: gradientBackground,
    padding,
    backgroundColor,
    marginBottom: marginBottom || "0",
  };

  const containerClass = `home-container${reverse ? " reverse" : ""}`;
  const mediaContainerStyle = {
    borderRadius,
    height: "400px", // Establece la altura en 300px
  };

  return (
    <div className={containerClass} style={sectionStyle}>
      {media && ( // Verifica si se proporciona un medio (imagen o video)
        <div className="media-container" style={mediaContainerStyle}>
          {media.type === "image" ? (
            <img src={`images/${media.src}.jpg`} alt="Imagen" className="home-media" />
          ) : media.type === "video" ? (
            <video src={`videos/${media.src}.mp4`} autoPlay playsInline muted loop style={{ width: "100%", height: "100%" }} className="home-media"  onContextMenu={(e) => e.preventDefault()} controlsList="nodownload">
              Tu navegador no admite la reproducción de video.
            </video>
          ) : null}
        </div>
      )}
      <div className="text-container">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

HomeSection.propTypes = {
  padding: PropTypes.string,
  title: PropTypes.string.isRequired,
  gradientBackground: PropTypes.string,
  border: PropTypes.string,
  backgroundColor: PropTypes.string,
  media: PropTypes.shape({
    type: PropTypes.oneOf(["image", "video"]).isRequired,
    src: PropTypes.string.isRequired,
  }),
  reverse: PropTypes.bool,
  children: PropTypes.node,
  marginBottom: PropTypes.string,
  borderRadius: PropTypes.string,
};

export default HomeSection;
