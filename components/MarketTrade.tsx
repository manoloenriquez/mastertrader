import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState, useMemo } from "react";
import {
  Tabs,
  Tab,
  Modal,
  Button,
  InputGroup,
  Form,
  Dropdown,
} from "react-bootstrap";
import { useMarket } from "../context/MarketContext";
import { CreateOrder, CreatePosition, Position } from "../types/database";
import { useData } from "../context/DataContext";
import SizeSlider from "./SizeSlider";
import PrefIcon from "./PrefIcon";
import { useRouter } from "next/router";
import LeverageSlider from "./LeverageSlider";
import { useTheme } from "../context/ThemeContext";

export default function MarketTrade() {
  const [marginMode, setMarginMode] = useState<"cross" | "isolated">("cross");
  const [leverage, setLeverage] = useState(100);
  const [orderType, setOrderType] = useState<
    "limit" | "market" | "conditional"
  >("market");
  const [quantity, setQuantity] = useState(0);
  const [slippageTolerance, setSlippageTolerance] = useState(false);
  const [tpSl, setTpSl] = useState(false);
  const [newAlgorithmPreview, setNewAlgorithmPreview] = useState(true);
  const [showMarginDropdown, setShowMarginDropdown] = useState(false);
  const [showLeverageDropdown, setShowLeverageDropdown] = useState(false);

  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const market = useMarket();
  const data = useData();

  const {
    data: { theme },
  } = useTheme();

  const handleMarginModeSelect = (mode: "cross" | "isolated") => {
    setMarginMode(mode);
    setShowMarginDropdown(false);
  };

  const handleLeverageSelect = (lev: number) => {
    setLeverage(lev);
    setShowLeverageDropdown(false);
  };

  const handleCreateOrder = async (direction: "long" | "short") => {
    if (!user || !market.symbolTicker || quantity <= 0) return;

    try {
      const currentPrice = parseFloat(market.symbolTicker.lastPrice || "0");
      const marginRequired = (quantity * currentPrice) / leverage;

      const order: CreateOrder = {
        user_id: user.id,
        symbol: market.symbolTicker.symbol,
        direction,
        crypto_size: quantity,
        usd_size: quantity * currentPrice,
        leverage,
        margin_mode: marginMode,
        margin: marginRequired,
        is_market: orderType === "market",
        entry: orderType === "limit" ? currentPrice.toString() : undefined,
      };

      const { data: orderData, error } = await supabaseClient
        .from("orders")
        .insert([order])
        .select();

      if (error) {
        console.error("Error creating order:", error);
        return;
      }

      // Reset form
      setQuantity(0);

      console.log("Order created successfully:", orderData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      style={{
        background: "rgb(16, 16, 20)",
        color: "#eaecef",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontSize: "12px",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #2b3139",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            margin: 0,
            color: "#eaecef",
          }}
        >
          Trade
        </h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <svg
            style={{
              width: "16px",
              height: "16px",
              fill: "#adb1b8",
              cursor: "pointer",
            }}
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="7" height="7" fill="currentColor" />
            <rect x="14" y="3" width="7" height="7" fill="currentColor" />
            <rect x="3" y="14" width="7" height="7" fill="currentColor" />
            <rect x="14" y="14" width="7" height="7" fill="currentColor" />
          </svg>
          <svg
            style={{
              width: "16px",
              height: "16px",
              fill: "#adb1b8",
              cursor: "pointer",
            }}
            viewBox="0 0 24 24"
          >
            <rect
              x="6"
              y="6"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            style={{
              width: "16px",
              height: "16px",
              fill: "#f6465d",
              cursor: "pointer",
            }}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="8" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Margin Mode and Leverage */}
      <div
        style={{
          padding: "8px 12px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <Dropdown show={showMarginDropdown} onToggle={setShowMarginDropdown}>
          <div
            onClick={() => setShowMarginDropdown(!showMarginDropdown)}
            style={{
              background: "#2b3139",
              borderRadius: "4px",
              color: "#eaecef",
              fontSize: "12px",
              fontWeight: 400,
              height: "28px",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              minWidth: "60px",
            }}
          >
            {marginMode.charAt(0).toUpperCase() + marginMode.slice(1)}
            <svg
              style={{
                width: "8px",
                height: "8px",
                fill: "#adb1b8",
              }}
              viewBox="0 0 24 24"
            >
              <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
            </svg>
          </div>
          <Dropdown.Menu
            style={{
              background: "#363a45",
              border: "1px solid #474d57",
              borderRadius: "4px",
              minWidth: "100px",
              padding: "8px 0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              position: "absolute",
              top: "100%",
              left: "0",
              zIndex: 1000,
              transform: "translateY(2px)",
            }}
          >
            <Dropdown.Item
              onClick={() => handleMarginModeSelect("cross")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                color: marginMode === "cross" ? "#f7a600" : "#eaecef",
                background: "transparent",
                border: "none",
              }}
            >
              Cross
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleMarginModeSelect("isolated")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                color: marginMode === "isolated" ? "#f7a600" : "#eaecef",
                background: "transparent",
                border: "none",
              }}
            >
              Isolated
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown
          show={showLeverageDropdown}
          onToggle={setShowLeverageDropdown}
        >
          <div
            onClick={() => setShowLeverageDropdown(!showLeverageDropdown)}
            style={{
              background: "#2b3139",
              borderRadius: "4px",
              color: "#f7a600",
              fontSize: "12px",
              fontWeight: 400,
              height: "28px",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              minWidth: "60px",
            }}
          >
            {leverage}.00x
            <svg
              style={{
                width: "8px",
                height: "8px",
                fill: "#adb1b8",
              }}
              viewBox="0 0 24 24"
            >
              <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
            </svg>
          </div>
          <Dropdown.Menu
            style={{
              background: "#363a45",
              border: "1px solid #474d57",
              borderRadius: "4px",
              minWidth: "100px",
              padding: "8px 0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              position: "absolute",
              top: "100%",
              left: "0",
              zIndex: 1000,
              transform: "translateY(2px)",
            }}
          >
            {[1, 3, 5, 10, 25, 50, 100].map((lev) => (
              <Dropdown.Item
                key={lev}
                onClick={() => handleLeverageSelect(lev)}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  color: leverage === lev ? "#f7a600" : "#eaecef",
                  background:
                    leverage === lev
                      ? "rgba(240, 185, 11, 0.1)"
                      : "transparent",
                  border: "none",
                  fontWeight: leverage === lev ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (leverage !== lev) {
                    (e.target as HTMLElement).style.background =
                      "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (leverage !== lev) {
                    (e.target as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {lev}x
              </Dropdown.Item>
            ))}
            <Dropdown.Item
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                color: "#eaecef",
                background: "transparent",
                border: "none",
                borderTop: "1px solid #474d57",
                marginTop: "4px",
                paddingTop: "12px",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background =
                  "rgba(255, 255, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              Customize
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Order Type Tabs */}
      <div
        style={{
          padding: "8px 12px 12px 12px",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <span
            onClick={() => setOrderType("limit")}
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: orderType === "limit" ? "#f7a600" : "#adb1b8",
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            Limit
          </span>
          <span
            onClick={() => setOrderType("market")}
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: orderType === "market" ? "#f7a600" : "#adb1b8",
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            Market
          </span>
          <span
            onClick={() => setOrderType("conditional")}
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: orderType === "conditional" ? "#f7a600" : "#adb1b8",
              cursor: "pointer",
              padding: "4px 0",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Conditional
            <svg
              style={{ width: "10px", height: "10px", fill: "currentColor" }}
              viewBox="0 0 24 24"
            >
              <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Order Form */}
      <div style={{ padding: "12px", flex: 1 }}>
        {/* Quantity Section */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "#adb1b8" }}>Quantity</span>
          </div>

          {/* Quantity Input with Integrated Dropdown */}
          <div
            style={{
              marginBottom: "12px",
              position: "relative",
              background: "#181a20",
              border: "1px solid #474d57",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="number"
              value={quantity || ""}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              placeholder="0"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "#eaecef",
                fontSize: "14px",
                padding: "10px 12px",
                outline: "none",
              }}
              onFocus={(e) => {
                (e.target.parentElement as HTMLElement).style.borderColor =
                  "#f7a600";
              }}
              onBlur={(e) => {
                (e.target.parentElement as HTMLElement).style.borderColor =
                  "#474d57";
              }}
            />
            <Dropdown style={{ position: "relative" }}>
              <Dropdown.Toggle
                variant="custom"
                style={{
                  background: "transparent",
                  border: "none",
                  borderLeft: "1px solid #474d57",
                  color: "#eaecef",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  borderRadius: "0",
                }}
              >
                BTC
                <svg
                  style={{
                    width: "8px",
                    height: "8px",
                    fill: "currentColor",
                  }}
                  viewBox="0 0 24 24"
                >
                  <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
                </svg>
              </Dropdown.Toggle>
            </Dropdown>
          </div>

          {/* Quantity Slider */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ position: "relative", marginBottom: "8px" }}>
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  height: "4px",
                  background: "#2b3139",
                  outline: "none",
                  borderRadius: "2px",
                  appearance: "none",
                }}
                className="quantity-slider"
              />

              {/* Step indicators on track */}
              {[0, 25, 50, 75, 100].map((step, index) => (
                <div
                  key={step}
                  onClick={() => setQuantity(step)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${step}%`,
                    transform: "translate(-50%, -50%)",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: quantity >= step ? "#f7a600" : "#6b7280",
                    cursor: "pointer",
                    border: "1px solid #374151",
                    zIndex: 2,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "#adb1b8" }}>0</span>
              <span style={{ fontSize: "10px", color: "#eaecef" }}>100%</span>
            </div>
          </div>

          <style jsx>{`
            .quantity-slider::-webkit-slider-thumb {
              appearance: none;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #f7a600;
              cursor: pointer;
            }
            .quantity-slider::-moz-range-thumb {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #f7a600;
              cursor: pointer;
              border: none;
            }
            .quantity-slider::-webkit-slider-track {
              height: 4px;
              background: linear-gradient(
                to right,
                #f7a600 0%,
                #f7a600 ${quantity}%,
                #2b3139 ${quantity}%,
                #2b3139 100%
              );
              border-radius: 2px;
            }
          `}</style>
        </div>

        {/* Value Fields */}
        <div
          style={{
            marginBottom: "16px",
            background: "#181a20",
            border: "1px solid #474d57",
            borderRadius: "4px",
            padding: "8px 12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#adb1b8" }}>Value</span>
            <span style={{ fontSize: "11px", color: "#adb1b8" }}>
              -- / USDT
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#adb1b8" }}>Cost</span>
            <span style={{ fontSize: "11px", color: "#adb1b8" }}>
              -- / USDT
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "11px", color: "#adb1b8" }}>
              Liq. Price
            </span>
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#f7a600",
                fontSize: "11px",
                cursor: "pointer",
                padding: "0",
                fontWeight: 400,
                textDecoration: "underline",
              }}
            >
              Calculate
            </button>
          </div>
        </div>

        {/* Checkboxes */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <div
              onClick={() => setSlippageTolerance(!slippageTolerance)}
              style={{
                width: "12px",
                height: "12px",
                marginRight: "8px",
                cursor: "pointer",
                background: "#000",
                border: `1px solid ${
                  slippageTolerance ? "#f7a600" : "#adb1b8"
                }`,
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: "#f7a600",
                fontWeight: "bold",
              }}
            >
              {slippageTolerance ? "✓" : ""}
            </div>
            <span
              style={{ fontSize: "11px", color: "#eaecef", fontWeight: 400 }}
            >
              Slippage Tolerance
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              onClick={() => setTpSl(!tpSl)}
              style={{
                width: "12px",
                height: "12px",
                marginRight: "8px",
                cursor: "pointer",
                background: "#000",
                border: `1px solid ${tpSl ? "#f7a600" : "#adb1b8"}`,
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: "#f7a600",
                fontWeight: "bold",
              }}
            >
              {tpSl ? "✓" : ""}
            </div>
            <span
              style={{ fontSize: "11px", color: "#eaecef", fontWeight: 400 }}
            >
              TP/SL
            </span>
          </div>
        </div>

        {/* Long/Short Buttons */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button
            onClick={() => handleCreateOrder("long")}
            style={{
              flex: 1,
              background: "#0ecb81",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 16px",
              cursor: "pointer",
              height: "40px",
            }}
          >
            Long
          </button>
          <button
            onClick={() => handleCreateOrder("short")}
            style={{
              flex: 1,
              background: "#f6465d",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 16px",
              cursor: "pointer",
              height: "40px",
            }}
          >
            Short
          </button>
        </div>

        {/* Unified Trading Account */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{ fontSize: "14px", color: "#eaecef", fontWeight: 500 }}
              >
                Unified Trading Account
              </span>
              <svg
                style={{ width: "12px", height: "12px", fill: "#adb1b8" }}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="2" />
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg
                style={{ width: "14px", height: "14px", fill: "#f7a600" }}
                viewBox="0 0 24 24"
              >
                <path d="M13 3l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L13 17.77l-5.18 3.25L9 14.14l-5-4.87 5.91-.01L13 3z" />
              </svg>
              <span
                style={{ fontSize: "11px", color: "#f7a600", fontWeight: 500 }}
              >
                P&L
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#adb1b8" }}>
              Margin Mode
            </span>
            <span style={{ fontSize: "12px", color: "#eaecef" }}>
              Cross Margin
              <svg
                style={{
                  width: "10px",
                  height: "10px",
                  fill: "#adb1b8",
                  marginLeft: "4px",
                }}
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#adb1b8" }}>
                New algorithm preview
              </span>
              <svg
                style={{ width: "12px", height: "12px", fill: "#adb1b8" }}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="2" />
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div
              style={{
                width: "32px",
                height: "18px",
                background: newAlgorithmPreview ? "#f7a600" : "#2b3139",
                borderRadius: "9px",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => setNewAlgorithmPreview(!newAlgorithmPreview)}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  background: "#fff",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: newAlgorithmPreview ? "16px" : "2px",
                  transition: "left 0.2s",
                }}
              />
            </div>
          </div>

          {/* Margin Progress Bars */}
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#adb1b8" }}>
                Initial Margin
              </span>
              <span
                style={{ fontSize: "11px", color: "#0ecb81", fontWeight: 500 }}
              >
                22.08%
              </span>
            </div>
            <div
              style={{
                height: "4px",
                background: "#2b3139",
                borderRadius: "2px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  height: "4px",
                  background: "#0ecb81",
                  borderRadius: "2px",
                  width: "22%",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#adb1b8" }}>
                Maintenance Margin
              </span>
              <span
                style={{ fontSize: "11px", color: "#0ecb81", fontWeight: 500 }}
              >
                8.82%
              </span>
            </div>
            <div
              style={{
                height: "4px",
                background: "#2b3139",
                borderRadius: "2px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  height: "4px",
                  background: "#0ecb81",
                  borderRadius: "2px",
                  width: "9%",
                }}
              />
            </div>
          </div>

          {/* Balance Information */}
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#adb1b8" }}>
                Margin Balance
              </span>
              <span
                style={{ fontSize: "12px", color: "#eaecef", fontWeight: 500 }}
              >
                1.3323 USDT
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#adb1b8" }}>
                Available Balance
              </span>
              <span
                style={{ fontSize: "12px", color: "#eaecef", fontWeight: 500 }}
              >
                1.0380 USDT
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            <button
              style={{
                flex: 1,
                background: "#2b3139",
                border: "1px solid #363a45",
                borderRadius: "2px",
                color: "#eaecef",
                fontSize: "12px",
                fontWeight: 500,
                padding: "8px",
                cursor: "pointer",
              }}
            >
              Deposit
            </button>
            <button
              style={{
                flex: 1,
                background: "#2b3139",
                border: "1px solid #363a45",
                borderRadius: "2px",
                color: "#eaecef",
                fontSize: "12px",
                fontWeight: 500,
                padding: "8px",
                cursor: "pointer",
              }}
            >
              Convert
            </button>
            <button
              style={{
                flex: 1,
                background: "#2b3139",
                border: "1px solid #363a45",
                borderRadius: "2px",
                color: "#eaecef",
                fontSize: "12px",
                fontWeight: 500,
                padding: "8px",
                cursor: "pointer",
              }}
            >
              Transfer
            </button>
          </div>
        </div>

        {/* Contract Details */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span
              style={{ fontSize: "14px", color: "#eaecef", fontWeight: 500 }}
            >
              Contract Details BTCUSDT
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#adb1b8" }}>
              Expiration Date
            </span>
            <span style={{ fontSize: "12px", color: "#eaecef" }}>
              Perpetual
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#adb1b8" }}>
              Index Price
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#eaecef",
              }}
            >
              113,328.61
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#adb1b8" }}>
              Mark Price
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#eaecef",
              }}
            >
              113,286.04
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "12px", color: "#adb1b8" }}>Show</span>
            <svg
              style={{ width: "10px", height: "10px", fill: "#adb1b8" }}
              viewBox="0 0 24 24"
            >
              <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
