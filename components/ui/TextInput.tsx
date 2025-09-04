import React from "react";

export interface TextInputProps {
  value?: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password";
  disabled?: boolean;
  error?: boolean;
  size?: "sm" | "md" | "lg";
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const TextInput: React.FC<TextInputProps> = ({
  value = "",
  placeholder = "",
  type = "text",
  disabled = false,
  error = false,
  size = "md",
  suffix,
  prefix,
  onChange,
  onFocus,
  onBlur,
  className = "",
  style = {},
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          fontSize: "11px",
          padding: "4px 8px",
          height: "24px",
        };
      case "md":
        return {
          fontSize: "12px",
          padding: "6px 12px",
          height: "28px",
        };
      case "lg":
        return {
          fontSize: "14px",
          padding: "8px 16px",
          height: "32px",
        };
      default:
        return {};
    }
  };

  const containerStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    background: "#404347",
    border: error ? "1px solid #f6465d" : "1px solid #404347",
    borderRadius: "4px",
    color: "#eaecef",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const inputStyles: React.CSSProperties = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#eaecef",
    ...getSizeStyles(),
  };

  const prefixStyles: React.CSSProperties = {
    marginRight: "8px",
    color: "#adb1b8",
    fontSize: "12px",
  };

  const suffixStyles: React.CSSProperties = {
    marginLeft: "8px",
    color: "#adb1b8",
    fontSize: "12px",
  };

  return (
    <div
      className={`bybit-input-container ${className}`}
      style={containerStyles}
    >
      {prefix && <div style={prefixStyles}>{prefix}</div>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        style={inputStyles}
        className="bybit-input"
      />
      {suffix && <div style={suffixStyles}>{suffix}</div>}
    </div>
  );
};

export default TextInput;
