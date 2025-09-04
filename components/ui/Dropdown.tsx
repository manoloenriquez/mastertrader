import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value = "",
  placeholder = "Select option",
  disabled = false,
  size = "md",
  onChange,
  className = "",
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          padding: "4px 8px",
          height: "28px",
        };
      case "lg":
        return {
          fontSize: "14px",
          padding: "6px 12px",
          height: "32px",
        };
      default:
        return {};
    }
  };

  const triggerStyles: React.CSSProperties = {
    background: "#2b3139",
    borderRadius: "4px",
    color: "#eaecef",
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    minWidth: "60px",
    border: "1px solid #474d57",
    opacity: disabled ? 0.6 : 1,
    ...getSizeStyles(),
    ...style,
  };

  const dropdownStyles: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#2b3139",
    border: "1px solid #474d57",
    borderRadius: "4px",
    marginTop: "4px",
    zIndex: 1000,
    maxHeight: "200px",
    overflowY: "auto",
  };

  const optionStyles: React.CSSProperties = {
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "12px",
    color: "#eaecef",
    borderBottom: "1px solid #474d57",
  };

  const selectedOption = options.find((option) => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    if (!disabled) {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`bybit-dropdown ${className}`}
      style={{ position: "relative", display: "inline-block" }}
    >
      <div style={triggerStyles} onClick={handleTriggerClick}>
        <span style={{ flex: 1 }}>{selectedOption?.label || placeholder}</span>
        <svg
          viewBox="0 0 24 24"
          style={{
            width: "8px",
            height: "8px",
            fill: "#adb1b8",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
        </svg>
      </div>

      {isOpen && (
        <div style={dropdownStyles}>
          {options.map((option) => (
            <div
              key={option.value}
              style={{
                ...optionStyles,
                opacity: option.disabled ? 0.5 : 1,
                cursor: option.disabled ? "not-allowed" : "pointer",
                backgroundColor:
                  option.value === value ? "#404347" : "transparent",
              }}
              onClick={() =>
                !option.disabled && handleOptionClick(option.value)
              }
              onMouseEnter={(e) => {
                if (!option.disabled) {
                  (e.target as HTMLElement).style.backgroundColor = "#404347";
                }
              }}
              onMouseLeave={(e) => {
                if (!option.disabled && option.value !== value) {
                  (e.target as HTMLElement).style.backgroundColor =
                    "transparent";
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
