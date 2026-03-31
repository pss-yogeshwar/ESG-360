import React from "react";
import logoImage from "./images/fulllogo_transparent_nobuffer.png";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12" }) => {
  return (
    <img
      src={logoImage}
      alt="ESG Accelo 360Hub Logo"
      className={className}
    />
  );
};

export default Logo;
