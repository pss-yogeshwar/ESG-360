import React from "react";
import logoPath from "@/assets/images/fulllogo_transparent_nobuffer.png";

interface LogoProps {
  className?: string;
}

const CustomLogo: React.FC<LogoProps> = ({ className = "h-12" }) => {
  return (
    <img
      src={logoPath}
      alt="ESG Accelo 360Hub Logo"
      className={className}
    />
  );
};

export default CustomLogo;