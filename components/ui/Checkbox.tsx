import React from "react";

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "warning" | "success" | "error";
  onChange?: (checked: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  disabled = false,
  label,
  size = "md",
  color = "warning",
  onChange,
  className = "",
  style = {},
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          width: "12px",
          height: "12px",
          fontSize: "10px",
        };
      case "md":
        return {
          width: "16px",
          height: "16px",
          fontSize: "12px",
        };
      case "lg":
        return {
          width: "20px",
          height: "20px",
          fontSize: "14px",
        };
      default:
        return {};
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case "primary":
        return {
          backgroundColor: checked ? "#eaecef" : "transparent",
          borderColor: checked ? "#eaecef" : "#adb1b8",
        };
      case "warning":
        return {
          backgroundColor: checked ? "#f7a600" : "transparent",
          borderColor: checked ? "#f7a600" : "#adb1b8",
        };
      case "success":
        return {
          backgroundColor: checked ? "#0ecb81" : "transparent",
          borderColor: checked ? "#0ecb81" : "#adb1b8",
        };
      case "error":
        return {
          backgroundColor: checked ? "#f6465d" : "transparent",
          borderColor: checked ? "#f6465d" : "#adb1b8",
        };
      default:
        return {};
    }
  };

  const checkboxStyles: React.CSSProperties = {
    position: "relative",
    border: "1px solid",
    borderRadius: "2px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.6 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...getSizeStyles(),
    ...getColorStyles(),
  };

  const containerStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    ...style,
  };

  const labelStyles: React.CSSProperties = {
    color: "#eaecef",
    fontSize: "12px",
    userSelect: "none",
  };

  const checkmarkStyles: React.CSSProperties = {
    color: checked && color === "primary" ? "#000" : "#fff",
    fontSize: size === "sm" ? "8px" : size === "lg" ? "12px" : "10px",
    fontWeight: "bold",
  };

  const handleClick = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <div
      className={`bybit-checkbox-container ${className}`}
      style={containerStyles}
      onClick={handleClick}
    >
      <div className="bybit-checkbox" style={checkboxStyles}>
        {checked && <span style={checkmarkStyles}>✓</span>}
      </div>
      {label && <span style={labelStyles}>{label}</span>}
    </div>
  );
};

export default Checkbox;
