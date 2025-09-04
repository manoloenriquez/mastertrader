import React from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState, useMemo, useEffect } from "react";
import { Tabs, Tab, Modal, InputGroup, Form } from "react-bootstrap";
import { useMarket } from "../context/MarketContext";
import { CreateOrder, CreatePosition, Position } from "../types/database";
import { useData } from "../context/DataContext";
import SizeSlider from "./SizeSlider";
import PrefIcon from "./PrefIcon";
import { useRouter } from "next/router";
import LeverageSlider from "./LeverageSlider";
import { useTheme } from "../context/ThemeContext";
import { Button, Text, Checkbox, Dropdown, TextInput } from "./ui";

export default function MarketTrade() {
  const [marginMode, setMarginMode] = useState<"cross" | "isolated">("cross");
  const [leverage, setLeverage] = useState(100);
  const [orderType, setOrderType] = useState<
    "limit" | "market" | "conditional"
  >("market");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState<string>("");
  const [slippageTolerance, setSlippageTolerance] = useState(false);
  const [tpSl, setTpSl] = useState(false);
  const [newAlgorithmPreview, setNewAlgorithmPreview] = useState(true);
  const [showMarginDropdown, setShowMarginDropdown] = useState(false);
  const [showLeverageDropdown, setShowLeverageDropdown] = useState(false);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);

  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const market = useMarket();
  const data = useData();
  const { fetchOrders } = data!;

  const {
    data: { theme },
  } = useTheme();

  // Set initial price to market price on load
  useEffect(() => {
    if (market.symbolTicker?.lastPrice && !price) {
      setPrice(market.symbolTicker.lastPrice);
    }
  }, [market.symbolTicker?.lastPrice, price]);

  const handleMarginModeSelect = (mode: "cross" | "isolated") => {
    setMarginMode(mode);
    setShowMarginDropdown(false);
  };

  const handleLeverageSelect = (lev: number) => {
    setLeverage(lev);
    setShowLeverageDropdown(false);
  };

  // Variables needed for createOrder function
  const isMarket = orderType === "market";
  const currentPrice = parseFloat(market.symbolTicker?.lastPrice || "0");
  const limitPrice = parseFloat(price || "0");
  const effectivePrice = isMarket ? currentPrice : limitPrice || currentPrice;
  const cryptoSize = quantity;
  const usdSize = quantity * effectivePrice;
  const margin = (quantity * effectivePrice) / leverage;
  const symbol = market.symbolTicker?.symbol || "";
  const entry = isMarket
    ? currentPrice.toString()
    : price || currentPrice.toString();

  const createOrder = async (direction: "long" | "short") => {
    if (!user) {
      return;
    }

    if (isMarket) {
      await supabaseClient
        .from("positions")
        .insert<CreatePosition>({
          user_id: user.id,
          margin: margin,
          crypto_size: cryptoSize,
          usd_size: usdSize,
          margin_mode: marginMode,
          leverage: leverage,
          symbol: symbol,
          direction: direction,
          entry: market.symbolTicker.lastPrice,
        })
        .select()
        .returns<Position>();

      return;
    }

    const data: CreateOrder = {
      user_id: user.id,
      margin: margin,
      crypto_size: cryptoSize,
      usd_size: usdSize,
      margin_mode: marginMode,
      leverage: leverage,
      symbol: symbol,
      direction: direction,
      entry: !isMarket ? entry : market.symbolTicker.lastPrice,
      is_market: isMarket,
    };

    try {
      const response = await fetch("/api/createorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, symbol }),
      }).then((res) => res.json());

      console.log(response);

      // Manual refresh orders as fallback if real-time doesn't work
      if (response.data) {
        setTimeout(() => {
          fetchOrders();
        }, 500);
      }
    } catch (e) {
      console.error(e);
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
        overflowY: "auto",
        overflowX: "hidden",
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
          position: "relative",
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
        <div
          className="order-panel__header-right"
          style={{
            display: "flex",
            gap: "12px",
            position: "absolute",
            top: "50%",
            right: "0",
            transform: "translateY(-50%)",
          }}
        >
          {/* Layout Tool Icon */}
          <span
            className="order-panel__header-tool brand-hover"
            style={{ cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.8335 3.33317C1.8335 2.68884 2.35583 2.1665 3.00016 2.1665H6.3335C6.97783 2.1665 7.50016 2.68884 7.50016 3.33317V6.6665C7.50016 7.31084 6.97783 7.83317 6.3335 7.83317H3.00016C2.35583 7.83317 1.8335 7.31084 1.8335 6.6665V3.33317ZM3.00016 3.1665C2.90812 3.1665 2.8335 3.24112 2.8335 3.33317V6.6665C2.8335 6.75855 2.90812 6.83317 3.00016 6.83317H6.3335C6.42554 6.83317 6.50016 6.75855 6.50016 6.6665V3.33317C6.50016 3.24112 6.42554 3.1665 6.3335 3.1665H3.00016ZM1.83333 10C1.83333 9.35567 2.35567 8.83333 3 8.83333H6.33333C6.97767 8.83333 7.5 9.35567 7.5 10V13.3333C7.5 13.9777 6.97767 14.5 6.33333 14.5H3C2.35567 14.5 1.83333 13.9777 1.83333 13.3333V10ZM3 9.83333C2.90795 9.83333 2.83333 9.90795 2.83333 10V13.3333C2.83333 13.4254 2.90795 13.5 3 13.5H6.33333C6.42538 13.5 6.5 13.4254 6.5 13.3333V10C6.5 9.90795 6.42538 9.83333 6.33333 9.83333H3ZM9.66667 8.83333C9.02234 8.83333 8.5 9.35567 8.5 10V13.3333C8.5 13.9777 9.02234 14.5 9.66667 14.5H13C13.6443 14.5 14.1667 13.9777 14.1667 13.3333V10C14.1667 9.35567 13.6443 8.83333 13 8.83333H9.66667ZM9.5 10C9.5 9.90795 9.57462 9.83333 9.66667 9.83333H13C13.092 9.83333 13.1667 9.90795 13.1667 10V13.3333C13.1667 13.4254 13.092 13.5 13 13.5H9.66667C9.57462 13.5 9.5 13.4254 9.5 13.3333V10Z"
                fill="#adb1b8"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5085 2.11793C10.9641 1.66232 11.7028 1.66231 12.1585 2.11793L14.0441 4.00354C14.4997 4.45916 14.4997 5.19785 14.0441 5.65346L12.1585 7.53908C11.7028 7.99469 10.9642 7.99469 10.5085 7.53908L8.62292 5.65346C8.16731 5.19785 8.16731 4.45916 8.62292 4.00354L10.5085 2.11793ZM11.4513 2.82503C11.3863 2.75995 11.2807 2.75995 11.2156 2.82503L9.33003 4.71065C9.26494 4.77574 9.26494 4.88127 9.33003 4.94635L11.2156 6.83197C11.2807 6.89706 11.3863 6.89706 11.4513 6.83197L13.337 4.94635C13.4021 4.88127 13.4021 4.77574 13.337 4.71065L11.4513 2.82503Z"
                fill="#adb1b8"
              />
            </svg>
          </span>

          {/* Calculator Icon */}
          <span
            className="f-16 order-panel__header-calculator"
            style={{ cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3.625 1.28125C3.33492 1.28125 3.05672 1.39648 2.8516 1.6016C2.64648 1.80672 2.53125 2.08492 2.53125 2.375V13.625C2.53125 14.2288 3.02125 14.7188 3.625 14.7188H12.375C12.6651 14.7188 12.9433 14.6035 13.1484 14.3984C13.3535 14.1933 13.4688 13.9151 13.4688 13.625V2.375C13.4688 2.08492 13.3535 1.80672 13.1484 1.6016C12.9433 1.39648 12.6651 1.28125 12.375 1.28125H3.625ZM3.46875 2.375C3.46875 2.33356 3.48521 2.29382 3.51451 2.26451C3.54382 2.23521 3.58356 2.21875 3.625 2.21875H12.375C12.4164 2.21875 12.4562 2.23521 12.4855 2.26451C12.5148 2.29382 12.5313 2.33356 12.5313 2.375V13.625C12.5313 13.6664 12.5148 13.7062 12.4855 13.7355C12.4562 13.7648 12.4164 13.7813 12.375 13.7813H3.625C3.58356 13.7813 3.54382 13.7648 3.51451 13.7355C3.48521 13.7062 3.46875 13.6664 3.46875 13.625V2.375V2.375ZM5.1875 3.625C5.14646 3.625 5.10583 3.63308 5.06791 3.64879C5.03 3.66449 4.99555 3.68751 4.96653 3.71653C4.93751 3.74555 4.91449 3.78 4.89879 3.81791C4.88308 3.85583 4.875 3.89646 4.875 3.9375V5.1875C4.875 5.27038 4.90792 5.34987 4.96653 5.40847C5.02513 5.46708 5.10462 5.5 5.1875 5.5H10.8125C10.8954 5.5 10.9749 5.46708 11.0335 5.40847C11.0921 5.34987 11.125 5.27038 11.125 5.1875V3.9375C11.125 3.89646 11.1169 3.85583 11.1012 3.81791C11.0855 3.78 11.0625 3.74555 11.0335 3.71653C11.0045 3.68751 10.97 3.66449 10.9321 3.64879C10.8942 3.63308 10.8535 3.625 10.8125 3.625H5.1875ZM4.875 7.0625C4.875 6.97962 4.90792 6.90013 4.96653 6.84153C5.02513 6.78292 5.10462 6.75 5.1875 6.75H5.8125C5.89538 6.75 5.97487 6.78292 6.03347 6.84153C6.09208 6.90013 6.125 6.97962 6.125 7.0625V7.6875C6.125 7.77038 6.09208 7.84987 6.03347 7.90847C5.97487 7.96708 5.89538 8 5.8125 8H5.1875C5.10462 8 5.02513 7.96708 4.96653 7.90847C4.90792 7.84987 4.875 7.77038 4.875 7.6875V7.0625ZM5.1875 9.25C5.14646 9.25 5.10583 9.25808 5.06791 9.27379C5.03 9.28949 4.99555 9.31251 4.96653 9.34153C4.93751 9.37055 4.91449 9.405 4.89879 9.44291C4.88308 9.48083 4.875 9.52146 4.875 9.5625V10.1875C4.875 10.2285 4.88308 10.2692 4.89879 10.3071C4.91449 10.345 4.93751 10.3795 4.96653 10.4085C4.99555 10.4375 5.03 10.4605 5.06791 10.4762C5.10583 10.4919 5.14646 10.5 5.1875 10.5H5.8125C5.85354 10.5 5.89417 10.4919 5.93209 10.4762C5.97 10.4605 6.00445 10.4375 6.03347 10.4085C6.06249 10.3795 6.08551 10.345 6.10121 10.3071C6.11692 10.2692 6.125 10.2285 6.125 10.1875V9.5625C6.125 9.52146 6.11692 9.48083 6.10121 9.44291C6.08551 9.405 6.06249 9.37055 6.03347 9.34153C6.00445 9.31251 5.97 9.28949 5.93209 9.27379C5.89417 9.25808 5.85354 9.25 5.8125 9.25H5.1875ZM4.875 12.0625C4.875 11.9796 4.90792 11.9001 4.96653 11.8415C5.02513 11.7829 5.10462 11.75 5.1875 11.75H5.8125C5.89538 11.75 5.97487 11.7829 6.03347 11.8415C6.09208 11.9001 6.125 11.9796 6.125 12.0625V12.6875C6.125 12.7704 6.09208 12.8499 6.03347 12.9085C5.97487 12.9671 5.89538 13 5.8125 13H5.1875C5.10462 13 5.02513 12.9671 4.96653 12.9085C4.90792 12.8499 4.875 12.7704 4.875 12.6875V12.0625ZM7.6875 6.75C7.64646 6.75 7.60583 6.75808 7.56791 6.77379C7.53 6.78949 7.49555 6.81251 7.46653 6.84153C7.43751 6.87055 7.41449 6.905 7.39879 6.94291C7.38308 6.98083 7.375 7.02146 7.375 7.0625V7.6875C7.375 7.72854 7.38308 7.76917 7.39879 7.80709C7.41449 7.845 7.43751 7.87945 7.46653 7.90847C7.49555 7.93749 7.53 7.96051 7.56791 7.97621C7.60583 7.99192 7.64646 8 7.6875 8H8.3125C8.35354 8 8.39417 7.99192 8.43209 7.97621C8.47 7.96051 8.50445 7.93749 8.53347 7.90847C8.56249 7.87945 8.58551 7.845 8.60121 7.80709C8.61692 7.76917 8.625 7.72854 8.625 7.6875V7.0625C8.625 7.02146 8.61692 6.98083 8.60121 6.94291C8.58551 6.905 8.56249 6.87055 8.53347 6.84153C8.50445 6.81251 8.47 6.78949 8.43209 6.77379C8.39417 6.75808 8.35354 6.75 8.3125 6.75H7.6875V6.75ZM7.375 9.5625C7.375 9.52146 7.38308 9.48083 7.39879 9.44291C7.41449 9.405 7.43751 9.37055 7.46653 9.34153C7.49555 9.31251 7.53 9.28949 7.56791 9.27379C7.60583 9.25808 7.64646 9.25 7.6875 9.25H8.3125C8.35354 9.25 8.39417 9.25808 8.43209 9.27379C8.47 9.28949 8.50445 9.31251 8.53347 9.34153C8.56249 9.37055 8.58551 9.405 8.60121 9.44291C8.61692 9.48083 8.625 9.52146 8.625 9.5625V10.1875C8.625 10.2285 8.61692 10.2692 8.60121 10.3071C8.58551 10.345 8.56249 10.3795 8.53347 10.4085C8.50445 10.4375 8.47 10.4605 8.43209 10.4762C8.39417 10.4919 8.35354 10.5 8.3125 10.5H7.6875C7.64646 10.5 7.60583 10.4919 7.56791 10.4762C7.53 10.4605 7.49555 10.4375 7.46653 10.4085C7.43751 10.3795 7.41449 10.345 7.39879 10.3071C7.38308 10.2692 7.375 10.2285 7.375 10.1875V9.5625V9.5625ZM7.6875 11.75C7.64646 11.75 7.60583 11.7581 7.56791 11.7738C7.53 11.7895 7.49555 11.8125 7.46653 11.8415C7.43751 11.8705 7.41449 11.905 7.39879 11.9429C7.38308 11.9808 7.375 12.0215 7.375 12.0625V12.6875C7.375 12.7285 7.38308 12.7692 7.39879 12.8071C7.41449 12.845 7.43751 12.8795 7.46653 12.9085C7.49555 12.9375 7.53 12.9605 7.56791 12.9762C7.60583 12.9919 7.64646 13 7.6875 13H8.3125C8.35354 13 8.39417 12.9919 8.43209 12.9762C8.47 12.9605 8.50445 12.9375 8.53347 12.9085C8.56249 12.8795 8.58551 12.845 8.60121 12.8071C8.61692 12.7692 8.625 12.7285 8.625 12.6875V12.0625C8.625 12.0215 8.61692 11.9808 8.60121 11.9429C8.58551 11.905 8.56249 11.8705 8.53347 11.8415C8.50445 11.8125 8.47 11.7895 8.43209 11.7738C8.39417 11.7581 8.35354 11.75 8.3125 11.75H7.6875V11.75ZM9.875 7.0625C9.875 6.97962 9.90792 6.90013 9.96653 6.84153C10.0251 6.78292 10.1046 6.75 10.1875 6.75H10.8125C10.8954 6.75 10.9749 6.78292 11.0335 6.84153C11.0921 6.90013 11.125 6.97962 11.125 7.0625V7.6875C11.125 7.77038 11.0921 7.84987 11.0335 7.90847C10.9749 7.96708 10.8954 8 10.8125 8H10.1875C10.1046 8 10.0251 7.96708 9.96653 7.90847C9.90792 7.84987 9.875 7.77038 9.875 7.6875V7.0625ZM10.1875 9.25C10.1465 9.25 10.1058 9.25808 10.0679 9.27379C10.03 9.28949 9.99555 9.31251 9.96653 9.34153C9.93751 9.37055 9.91449 9.405 9.89879 9.44291C9.88308 9.48083 9.875 9.52146 9.875 9.5625V12.6875C9.875 12.7704 9.90792 12.8499 9.96653 12.9085C10.0251 12.9671 10.1046 13 10.1875 13H10.8125C10.8954 13 10.9749 12.9671 11.0335 12.9085C11.0921 12.8499 11.125 12.7704 11.125 12.6875V9.5625C11.125 9.52146 11.1169 9.48083 11.1012 9.44291C11.0855 9.405 11.0625 9.37055 11.0335 9.34153C11.0045 9.31251 10.97 9.28949 10.9321 9.27379C10.8942 9.25808 10.8535 9.25 10.8125 9.25H10.1875Z"
                fill="#adb1b8"
              />
            </svg>
          </span>

          {/* More Menu Icon */}
          <span className="oc-head__more-btn" style={{ cursor: "pointer" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              className="oc-head__more-icon"
              viewBox="0 0 1024 1024"
            >
              <path
                fill="#adb1b8"
                d="M213.333 426.667a85.333 85.333 0 1 0 0 170.666 85.333 85.333 0 0 0 0-170.666zM426.667 512a85.333 85.333 0 1 1 170.666 0 85.333 85.333 0 0 1-170.666 0zm298.666 0A85.333 85.333 0 1 1 896 512a85.333 85.333 0 0 1-170.667 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Margin Mode and Leverage */}
      <div
        style={{
          padding: "8px 12px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="dropdown" style={{ position: "relative", flex: 1 }}>
          <div
            onClick={() => setShowMarginDropdown(!showMarginDropdown)}
            style={{
              background: "#25282c",
              borderRadius: "4px",
              color: "rgb(234, 236, 239)",
              fontSize: "12px",
              fontWeight: 400,
              height: "28px",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              width: "100%",
              border: "none",
              fontFamily:
                "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
              lineHeight: 1.5,
              textAlign: "left",
              boxSizing: "border-box",
            }}
          >
            {marginMode.charAt(0).toUpperCase() + marginMode.slice(1)}
            <svg
              viewBox="0 0 24 24"
              style={{
                width: "8px",
                height: "8px",
                fill: "rgb(173, 177, 184)",
              }}
            >
              <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
            </svg>
          </div>
          {showMarginDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                zIndex: 1000,
                background: "#25282c",
                border: "1px solid #474d57",
                borderRadius: "4px",
                minWidth: "100px",
                padding: "4px 0",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                marginTop: "2px",
              }}
            >
              <div
                onClick={() => handleMarginModeSelect("cross")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  color: marginMode === "cross" ? "#f7a600" : "#eaecef",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (marginMode !== "cross") {
                    (e.target as HTMLElement).style.background =
                      "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (marginMode !== "cross") {
                    (e.target as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                Cross
              </div>
              <div
                onClick={() => handleMarginModeSelect("isolated")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  color: marginMode === "isolated" ? "#f7a600" : "#eaecef",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (marginMode !== "isolated") {
                    (e.target as HTMLElement).style.background =
                      "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (marginMode !== "isolated") {
                    (e.target as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                Isolated
              </div>
            </div>
          )}
        </div>

        <div className="dropdown" style={{ position: "relative", flex: 1 }}>
          <div
            onClick={() => setShowLeverageDropdown(!showLeverageDropdown)}
            style={{
              background: "#25282c",
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
              width: "100%",
              border: "none",
              fontFamily:
                "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
              lineHeight: 1.5,
              textAlign: "left",
              boxSizing: "border-box",
            }}
          >
            {leverage}.00x
            <svg
              viewBox="0 0 24 24"
              style={{
                width: "8px",
                height: "8px",
                fill: "rgb(173, 177, 184)",
              }}
            >
              <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
            </svg>
          </div>
          {showLeverageDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                zIndex: 1000,
                background: "#363a45",
                border: "1px solid #474d57",
                borderRadius: "4px",
                minWidth: "100px",
                padding: "4px 0",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                marginTop: "2px",
              }}
            >
              {[1, 3, 5, 10, 25, 50, 100].map((lev) => (
                <div
                  key={lev}
                  onClick={() => handleLeverageSelect(lev)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    color: leverage === lev ? "#f7a600" : "#eaecef",
                    background:
                      leverage === lev
                        ? "rgba(247, 166, 0, 0.1)"
                        : "transparent",
                    cursor: "pointer",
                    fontFamily:
                      "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
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
                      (e.target as HTMLElement).style.background =
                        "transparent";
                    }
                  }}
                >
                  {lev}x
                </div>
              ))}
              <div
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  color: "#eaecef",
                  background: "transparent",
                  borderTop: "1px solid #474d57",
                  marginTop: "4px",
                  paddingTop: "8px",
                  cursor: "pointer",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
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
              </div>
            </div>
          )}
        </div>
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
              fontSize: "14px",
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
              fontSize: "14px",
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
              fontSize: "14px",
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
        {/* Price Section - Only for Limit Orders */}
        {orderType === "limit" && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ marginBottom: "8px" }}>
              <span
                style={{ fontSize: "12px", color: "#adb1b8", fontWeight: 400 }}
              >
                Price
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#25282c",
                border: "1px solid #25282c",
                borderRadius: "4px",
                backgroundClip: "padding-box",
                transition:
                  "border-color 0.15s linear, background-color 0.15s linear",
              }}
              className="price-input-wrapper"
            >
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={market.symbolTicker?.lastPrice || "0.0000"}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#eaecef",
                    fontSize: "14px",
                    padding: "12px 16px",
                    outline: "none",
                    width: "100%",
                    fontFamily:
                      "IBM Plex Sans, -apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, Roboto, Arial, sans-serif",
                  }}
                  onFocus={(e) => {
                    const wrapper = e.target.closest(
                      ".price-input-wrapper"
                    ) as HTMLElement;
                    if (wrapper) {
                      wrapper.style.borderColor = "#f7a600";
                      wrapper.style.backgroundColor = "#404347";
                    }
                  }}
                  onBlur={(e) => {
                    const wrapper = e.target.closest(
                      ".price-input-wrapper"
                    ) as HTMLElement;
                    if (wrapper) {
                      wrapper.style.borderColor = "#404347";
                      wrapper.style.backgroundColor = "#404347";
                    }
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  borderLeft: "1px solid #404347",
                  color: "#adb1b8",
                  fontSize: "12px",
                  fontWeight: 400,
                }}
              >
                USDT
              </div>
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#adb1b8",
                marginTop: "4px",
                textAlign: "right",
              }}
            >
              ≈ {currentPrice.toFixed(4)} (Mark Price)
            </div>
          </div>
        )}

        {/* Quantity Section */}
        <div style={{ marginBottom: "16px" }}>
          {/* Quantity Input with Integrated Dropdown - Bybit Style */}
          <div
            style={{
              marginBottom: "12px",
              position: "relative",
            }}
          >
            {/* Input Number Wrapper */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#25282c",
                border: "1px solid #25282c",
                borderRadius: "4px",
                backgroundClip: "padding-box",
                transition:
                  "border-color 0.15s linear, background-color 0.15s linear",
              }}
              className="quantity-input-wrapper"
            >
              {/* Input Container */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      value={quantity || ""}
                      onChange={(e) =>
                        setQuantity(parseFloat(e.target.value) || 0)
                      }
                      placeholder="Quantity"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#adb1b8",
                        fontSize: "14px",
                        padding: "12px 16px",
                        outline: "none",
                        width: "100%",
                        fontFamily:
                          "IBM Plex Sans, -apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, Roboto, Arial, sans-serif",
                      }}
                      onFocus={(e) => {
                        const wrapper = e.target.closest(
                          ".quantity-input-wrapper"
                        ) as HTMLElement;
                        if (wrapper) {
                          wrapper.style.borderColor = "#f7a600";
                          wrapper.style.backgroundColor = "#404347";
                        }
                      }}
                      onBlur={(e) => {
                        const wrapper = e.target.closest(
                          ".quantity-input-wrapper"
                        ) as HTMLElement;
                        if (wrapper) {
                          wrapper.style.borderColor = "#404347";
                          wrapper.style.backgroundColor = "#404347";
                        }
                      }}
                    />
                  </span>
                </div>
              </div>

              {/* Right Icon - Coin Selector */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  cursor: "pointer",
                  borderLeft: "1px solid #404347",
                }}
                onClick={() => setShowCoinDropdown(!showCoinDropdown)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#adb1b8",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  BTC
                  <svg
                    style={{
                      width: "14px",
                      height: "14px",
                      fill: "currentColor",
                    }}
                    viewBox="0 0 1024 1024"
                  >
                    <path d="m561.707 657.75 194.389-262.23a60.416 60.416 0 0 0-13.312-85.077 62.165 62.165 0 0 0-36.437-11.776H317.653c-34.048 0-61.653 27.264-61.653 60.885 0 12.928 4.181 25.515 11.904 35.968l194.347 262.23a62.123 62.123 0 0 0 99.498 0z" />
                  </svg>
                </div>
              </div>
            </div>
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

          {/* Bybit CSS Variables */}
          <style jsx global>{`
            :root {
              --size-20: 20px;
              --bds-font-family: "IBM Plex Sans", -apple-system,
                BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", Roboto,
                Arial, sans-serif;
              --bds-font-size-12: 12px;
              --bds-font-weight-regular: 400;
              --bds-font-weight-medium: 500;
              --bds-font-weight-semibold: 600;
              --bds-gray-t1-title: #fff;
              --bds-gray-t2: #adb1b8;
              --bds-gray-t3: #71757a;
              --bds-gray-ele-border: #404347;
              --bds-gray-ele-line: #25282c;
              --bds-green-700-normal: #20b26c;
              --bds-green-800-pressed: #00944f;
              --bds-red-700-normal: #ef454a;
              --bds-red-800-pressed: #cc3939;
              --bds-brand-100-bg: rgba(247, 166, 0, 0.16);
              --long: #20b26c;
              --short: #ef454a;
              --bds-border-radius-4: 4px;
              --bds-transition-fast: 150ms;
            }

            .oc__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
            }

            .oc__row-bottom--20 {
              margin-bottom: var(--size-20);
            }

            .QtyCostValueShowRender {
              border: 0;
              box-sizing: border-box;
              font: inherit;
              vertical-align: baseline;
          margin: 0;
              padding: 0;
            }

            .qty-cost-value-show-render-line {
              pointer-events: initial;
              color: var(--bds-gray-t2);
              border: 0;
              box-sizing: border-box;
              font: inherit;
              vertical-align: baseline;
              margin: 0;
              padding: 0;
            }

            .qty-cost-value-show-render-line_span {
              font-size: var(--bds-font-size-12);
              color: var(--bds-gray-t2);
              font-family: var(--bds-font-family);
              font-weight: var(--bds-font-weight-regular);
            }

            .qty-cost-value-underline {
              text-decoration: underline;
              text-decoration-style: dashed;
              text-underline-offset: 2px;
            }

            .qty-cost-value-no-wrap {
              white-space: nowrap;
            }

            .qty-cost-value-calc-btn {
              cursor: pointer;
            }

            .qty-cost-value-calc-btn span {
              text-decoration: underline;
              text-decoration-style: solid;
              text-underline-offset: 2px;
            }
            
            .moly-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              user-select: none;
              transition: all var(--bds-transition-fast) cubic-bezier(0.4, 0, 0.2, 1);
              font-family: var(--bds-font-family);
              font-weight: var(--bds-font-weight-semibold);
          cursor: pointer;
              outline: 2px solid transparent;
              outline-offset: 2px;
              border-top-width: 1px;
              border-bottom-width: 1px;
              border-style: solid;
              border-color: transparent;
              border-radius: var(--bds-border-radius-4);
              font-size: 12px;
              line-height: 18px;
              padding: 6px 12px;
              background-color: var(--bds-gray-ele-border);
              color: var(--bds-gray-t1-title);
              disabled: cursor: not-allowed;
            }
            
            .moly-btn:focus-visible {
              ring: 5px solid var(--bds-brand-100-bg);
            }
            
            .moly-btn:disabled {
              cursor: not-allowed;
              background-color: var(--bds-gray-ele-line);
              color: var(--bds-gray-t3);
              opacity: 1;
        }
      `}</style>
        </div>

        {/* Value, Cost, Liq Price - Bybit Style */}
        <div
          className="oc__row oc__row-bottom--20"
          style={{ marginBottom: "20px" }}
        >
          <div
            className="QtyCostValueShowRender"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #474d57",
              borderRadius: "4px",
            }}
          >
            {/* Value Row */}
            <div
              className="qty-cost-value-show-render-line"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span
                className="qty-cost-value-show-render-line_span"
                style={{
                  fontSize: "12px",
                  color: "#adb1b8",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
                  fontWeight: 400,
                }}
              >
                Value
              </span>
              <div className="qty-cost-value-show-render-line-right">
                <div
                  className="qty-cost-value-show-render-line-right-content"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    fontFamily:
                      "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
                  }}
                >
                  <span className="long" style={{ color: "#20b26c" }}>
                    {quantity > 0
                      ? (effectivePrice * quantity).toFixed(2)
                      : "--"}
                    &nbsp;
                  </span>
                  <span
                    className="qty-cost-value-show-render-line-right-middle"
                    style={{
                      color: "#71757a",
                    }}
                  >
                    /
                  </span>
                  <span
                    className="qty-cost-value-show-render-line-right-middle-short short"
                    style={{
                      color: "#ef454a",
                    }}
                  >
                    &nbsp;--
                  </span>
                  <span
                    className="qty-cost-value-show-render-line-right-coin"
                    style={{
                      color: "#adb1b8",
                      marginLeft: "2px",
                    }}
                  >
                    USDT
                  </span>
                </div>
              </div>
            </div>

            {/* Cost Row */}
            <div
              className="qty-cost-value-show-render-line"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span
                className="qty-cost-value-show-render-line_span"
                style={{
                  fontSize: "12px",
                  color: "#adb1b8",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
                  fontWeight: 400,
                }}
              >
                Cost
              </span>
              <div className="qty-cost-value-show-render-line-right">
                <div
                  className="qty-cost-value-show-render-line-right-content"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    fontFamily:
                      "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
                  }}
                >
                  <span className="long" style={{ color: "#20b26c" }}>
                    {quantity > 0
                      ? (effectivePrice * quantity).toFixed(2)
                      : "--"}
                    &nbsp;
                  </span>
                  <span
                    className="qty-cost-value-show-render-line-right-middle"
                    style={{
                      color: "#71757a",
                    }}
                  >
                    /
                  </span>
                  <span
                    className="qty-cost-value-show-render-line-right-middle-short short"
                    style={{
                      color: "#ef454a",
                    }}
                  >
                    &nbsp;--
                  </span>
                  <span
                    className="qty-cost-value-show-render-line-right-coin"
                    style={{
                      color: "#adb1b8",
                      marginLeft: "2px",
                    }}
                  >
                    USDT
                  </span>
                </div>
              </div>
            </div>

            {/* Liq Price Row */}
            <div
              className="qty-cost-value-show-render-line qty-cost-value-liq-price"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                className="qty-cost-value-show-render-line_span qty-cost-value-underline qty-cost-value-no-wrap"
                style={{
                  fontSize: "12px",
                  color: "#adb1b8",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
                  fontWeight: 400,
                  textDecoration: "underline",
                  textDecorationStyle: "dashed",
                  textUnderlineOffset: "2px",
                  whiteSpace: "nowrap",
                }}
              >
                Liq. Price
              </span>
              <div className="qty-cost-value-show-render-line-right">
                <div className="qty-cost-value-calc-container">
                  <div
                    className="qty-cost-value-calc-btn qty-cost-value-calc-btn-disabled"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#adb1b8",
                        fontFamily:
                          "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
                        textDecoration: "underline",
                        textDecorationStyle: "solid",
                        textUnderlineOffset: "2px",
                      }}
                    >
                      Calculate&nbsp;
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
            onClick={() => createOrder("long")}
            className="moly-btn"
            style={{
              flex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: "var(--bds-font-family)",
              fontWeight: "var(--bds-font-weight-semibold)",
              cursor: "pointer",
              outline: "2px solid transparent",
              outlineOffset: "2px",
              borderTopWidth: "1px",
              borderBottomWidth: "1px",
              borderStyle: "solid",
              borderColor: "transparent",
              color: "#fff",
              backgroundColor: "#20b26c",
              fontSize: "12px",
              lineHeight: "18px",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "6px",
              paddingBottom: "6px",
              borderRadius: "4px",
              width: "100%",
              height: "40px",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#00944f";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#20b26c";
            }}
          >
            Long
          </button>
          <button
            onClick={() => createOrder("short")}
            className="moly-btn"
            style={{
              flex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: "var(--bds-font-family)",
              fontWeight: "var(--bds-font-weight-semibold)",
              cursor: "pointer",
              outline: "2px solid transparent",
              outlineOffset: "2px",
              borderTopWidth: "1px",
              borderBottomWidth: "1px",
              borderStyle: "solid",
              borderColor: "transparent",
              color: "#fff",
              backgroundColor: "#ef454a",
              fontSize: "12px",
              lineHeight: "18px",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "6px",
              paddingBottom: "6px",
              borderRadius: "4px",
              width: "100%",
              height: "40px",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#cc3939";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#ef454a";
            }}
          >
            Short
          </button>
        </div>

        {/* Unified Trading Account */}
        <div
          style={{
            marginBottom: "16px",
            borderTop: "1px solid rgb(43, 49, 57)",
            paddingTop: "16px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <h5
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#eaecef",
                  margin: 0,
                }}
              >
                Unified Trading Account
              </h5>
              <svg
                style={{ width: "12px", height: "12px", fill: "#71757a" }}
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <div>
              <a
                href="/user/assets/home/accountpnl"
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#71757a",
                  fontSize: "12px",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "#eaecef")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "#71757a")
                }
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                </svg>
                P&L
              </a>
            </div>
          </div>

          {/* Body */}
          <div>
            {/* Margin Mode */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span
                style={{ fontSize: "12px", color: "#eaecef", fontWeight: 400 }}
              >
                Margin Mode
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#eaecef",
                    fontWeight: 500,
                  }}
                >
                  Cross Margin
                </span>
                <svg
                  style={{ width: "8px", height: "8px", fill: "#71757a" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
                </svg>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "rgb(43, 49, 57)",
                marginBottom: "12px",
              }}
            />

            {/* New Algorithm Preview */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <h5
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#eaecef",
                    margin: 0,
                  }}
                >
                  New Algorithm Preview
                </h5>
                <svg
                  style={{ width: "12px", height: "12px", fill: "#71757a" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <div
                style={{
                  width: "42px",
                  height: "20px",
                  background: "#71757a",
                  borderRadius: "10px",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    background: "#fff",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                    left: "2px",
                    transition: "left 0.2s ease",
                  }}
                />
              </div>
            </div>

            {/* Progress Bars */}
            <div style={{ marginBottom: "12px" }}>
              {/* Initial Margin */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div style={{ width: "120px" }}>
                  <span style={{ fontSize: "12px", color: "#eaecef" }}>
                    Initial Margin
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "4px",
                    background: "rgb(43, 49, 57)",
                    borderRadius: "2px",
                    margin: "0 12px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "4px",
                      background: "#0ecb81",
                      borderRadius: "2px",
                      width: "0%",
                    }}
                  />
                </div>
                <div style={{ width: "60px", textAlign: "right" }}>
                  <span style={{ fontSize: "12px", color: "#0ecb81" }}>
                    0.00%
                  </span>
                </div>
              </div>

              {/* Maintenance Margin */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div style={{ width: "120px" }}>
                  <span style={{ fontSize: "12px", color: "#eaecef" }}>
                    Maintenance Margin
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "4px",
                    background: "rgb(43, 49, 57)",
                    borderRadius: "2px",
                    margin: "0 12px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "4px",
                      background: "#0ecb81",
                      borderRadius: "2px",
                      width: "0%",
                    }}
                  />
                </div>
                <div style={{ width: "60px", textAlign: "right" }}>
                  <span style={{ fontSize: "12px", color: "#0ecb81" }}>
                    0.00%
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "rgb(43, 49, 57)",
                marginBottom: "16px",
              }}
            />

            {/* Balance Information */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#eaecef" }}>
                    Margin Balance
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#eaecef" }}>
                  ********
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#eaecef" }}>
                    Available Balance
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#eaecef" }}>
                  ********
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                style={{
                  flex: 1,
                  background: "#404347",
                  border: "1px solid #404347",
                  borderRadius: "4px",
                  color: "#eaecef",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "#4a4f54";
                  (e.target as HTMLElement).style.borderColor = "#4a4f54";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "#404347";
                  (e.target as HTMLElement).style.borderColor = "#404347";
                }}
              >
                Deposit
              </button>
              <button
                style={{
                  flex: 1,
                  background: "#404347",
                  border: "1px solid #404347",
                  borderRadius: "4px",
                  color: "#eaecef",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "#4a4f54";
                  (e.target as HTMLElement).style.borderColor = "#4a4f54";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "#404347";
                  (e.target as HTMLElement).style.borderColor = "#404347";
                }}
              >
                Convert
              </button>
              <button
                style={{
                  flex: 1,
                  background: "#404347",
                  border: "1px solid #404347",
                  borderRadius: "4px",
                  color: "#eaecef",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "#4a4f54";
                  (e.target as HTMLElement).style.borderColor = "#4a4f54";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "#404347";
                  (e.target as HTMLElement).style.borderColor = "#404347";
                }}
              >
                Transfer
              </button>
            </div>
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
