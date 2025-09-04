import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "moly" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  style = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: "#f7a600",
          border: "1px solid #f7a600",
          color: "#000",
          "&:hover": {
            background: "#e6950d",
          },
        };
      case "secondary":
        return {
          background: "#2b3139",
          border: "1px solid #474d57",
          color: "#eaecef",
          "&:hover": {
            background: "#373e47",
          },
        };
      case "moly":
        return {
          background: "#404347",
          border: "1px solid #404347",
          color: "#eaecef",
          "&:hover": {
            background: "#4a4e52",
          },
        };
      case "outline":
        return {
          background: "transparent",
          border: "1px solid #474d57",
          color: "#eaecef",
          "&:hover": {
            background: "#2b3139",
          },
        };
      case "ghost":
        return {
          background: "transparent",
          border: "none",
          color: "#eaecef",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.1)",
          },
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return {
          fontSize: "10px",
          padding: "2px 6px",
          borderRadius: "2px",
        };
      case "sm":
        return {
          fontSize: "11px",
          padding: "4px 8px",
          borderRadius: "4px",
        };
      case "md":
        return {
          fontSize: "12px",
          padding: "6px 12px",
          borderRadius: "4px",
        };
      case "lg":
        return {
          fontSize: "14px",
          padding: "8px 16px",
          borderRadius: "6px",
        };
      default:
        return {};
    }
  };

  const baseStyles: React.CSSProperties = {
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    fontWeight: 400,
    outline: "none",
    border: "none",
    opacity: disabled ? 0.6 : 1,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button
      className={`bybit-button ${className}`}
      style={baseStyles}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
