import React from "react";

export interface TextProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "body" | "caption" | "label";
  color?:
    | "primary"
    | "secondary"
    | "muted"
    | "success"
    | "error"
    | "warning"
    | "white";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
}

const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  color = "primary",
  size,
  weight,
  align = "left",
  className = "",
  style = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "h1":
        return { fontSize: "24px", fontWeight: 600, lineHeight: "32px" };
      case "h2":
        return { fontSize: "20px", fontWeight: 600, lineHeight: "28px" };
      case "h3":
        return { fontSize: "18px", fontWeight: 600, lineHeight: "24px" };
      case "h4":
        return { fontSize: "16px", fontWeight: 500, lineHeight: "22px" };
      case "h5":
        return { fontSize: "14px", fontWeight: 500, lineHeight: "20px" };
      case "body":
        return { fontSize: "12px", fontWeight: 400, lineHeight: "18px" };
      case "caption":
        return { fontSize: "10px", fontWeight: 400, lineHeight: "14px" };
      case "label":
        return { fontSize: "11px", fontWeight: 400, lineHeight: "16px" };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    if (!size) return {};
    switch (size) {
      case "xs":
        return { fontSize: "10px" };
      case "sm":
        return { fontSize: "11px" };
      case "md":
        return { fontSize: "12px" };
      case "lg":
        return { fontSize: "14px" };
      case "xl":
        return { fontSize: "16px" };
      case "xxl":
        return { fontSize: "18px" };
      default:
        return {};
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case "primary":
        return { color: "#eaecef" };
      case "secondary":
        return { color: "#adb1b8" };
      case "muted":
        return { color: "#71757a" };
      case "success":
        return { color: "#0ecb81" };
      case "error":
        return { color: "#f6465d" };
      case "warning":
        return { color: "#f7a600" };
      case "white":
        return { color: "#ffffff" };
      default:
        return {};
    }
  };

  const getWeightStyles = () => {
    if (!weight) return {};
    switch (weight) {
      case "normal":
        return { fontWeight: 400 };
      case "medium":
        return { fontWeight: 500 };
      case "semibold":
        return { fontWeight: 600 };
      case "bold":
        return { fontWeight: 700 };
      default:
        return {};
    }
  };

  const baseStyles: React.CSSProperties = {
    textAlign: align,
    margin: 0,
    padding: 0,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...getColorStyles(),
    ...getWeightStyles(),
    ...style,
  };

  const Tag = variant.startsWith("h")
    ? (variant as "h1" | "h2" | "h3" | "h4" | "h5")
    : "div";

  return (
    <Tag className={`bybit-text ${className}`} style={baseStyles}>
      {children}
    </Tag>
  );
};

export default Text;
