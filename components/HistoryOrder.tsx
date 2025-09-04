import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Tabs, Tab, Table } from "react-bootstrap";
import { useMarket } from "../context/MarketContext";
import { Order, Position } from "../types/database";
import { useData } from "../context/DataContext";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { formatPrice, getPriceAtPnl } from "../util/client";
import { calculatePnl } from "../util/client";
import useSymbolTicker from "../hooks/useSymbolTicker";
import { useTheme } from "../context/ThemeContext";
import { useAtom } from "jotai";
import { maintenanceAtom, marginBalanceAtom, ratioAtom } from "./MarginRatio";
import { Button, Text, Checkbox, Dropdown } from "./ui";
import {
  calculateMargin,
  formatMarginValue,
  MarginCalculationParams,
} from "../util/marginCalculations";
import {
  calculateRealizedPnl,
  formatRealizedPnl,
  getTradingFeeRate,
  getEstimatedFundingRate,
  getPositionDurationHours,
  RealizedPnlParams,
} from "../util/realizedPnlCalculations";

export default function HistoryOrder() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const market = useMarket();
  const { orders, positions, balance, fetchOrders } = useData()!;
  const [activeTab, setActiveTab] = useState("positions");

  const {
    data: { theme },
  } = useTheme();

  return (
    <div
      style={{
        background: "rgb(16, 16, 20)",
        color: "#eaecef",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          background: "rgb(16, 16, 20)",
          minHeight: "48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span
            onClick={() => setActiveTab("open-orders")}
            style={{
              fontSize: "14px",
              color: activeTab === "open-orders" ? "#f7a600" : "#71757a",
              cursor: "pointer",
              padding: "12px 0",
              fontWeight: 500,
              borderBottom:
                activeTab === "open-orders"
                  ? "2px solid #f7a600"
                  : "2px solid transparent",
            }}
          >
            Open Orders ({orders?.length || 0})
          </span>
          <span
            onClick={() => setActiveTab("positions")}
            style={{
              fontSize: "14px",
              color: activeTab === "positions" ? "#f7a600" : "#71757a",
              cursor: "pointer",
              padding: "12px 0",
              fontWeight: 500,
              borderBottom:
                activeTab === "positions"
                  ? "2px solid #f7a600"
                  : "2px solid transparent",
            }}
          >
            Positions ({positions.length})
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#71757a",
              cursor: "pointer",
              padding: "12px 0",
              fontWeight: 500,
            }}
          >
            Order History
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#71757a",
              cursor: "pointer",
              padding: "12px 0",
              fontWeight: 500,
            }}
          >
            Trade History
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#71757a",
              cursor: "pointer",
              padding: "12px 0",
              fontWeight: 500,
            }}
          >
            Assets
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#71757a",
              cursor: "pointer",
              padding: "12px 0",
              fontWeight: 500,
            }}
          >
            Borrowings (0)
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#71757a",
              cursor: "pointer",
              padding: "12px 0",
              fontWeight: 500,
            }}
          >
            Tools (0)
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#71757a",
              cursor: "pointer",
              padding: "12px 0",
              fontWeight: 500,
            }}
          >
            P&L
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Checkbox
            checked={true}
            label="All Markets"
            color="warning"
            size="md"
          />

          {/* All Instruments Text with Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              color: "#eaecef",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            <span>All Instruments</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              style={{ fill: "#adb1b8" }}
            >
              <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
            </svg>
          </div>

          {/* Three dots menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
          >
            <svg
              style={{ width: "16px", height: "16px", fill: "#71757a" }}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      {activeTab === "positions" ? (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Full Width Table Container */}
          <div
            style={{
              display: "flex",
              width: "100%",
              minWidth: "calc(160px + 1560px + 150px)", // Fixed left + scrollable + fixed right
              flex: 1,
              height: "100%",
            }}
          >
            {/* Fixed Left Column - Contracts */}
            <div
              style={{
                position: "sticky",
                left: 0,
                zIndex: 10,
                background: "rgb(16, 16, 20)",
                minWidth: "160px",
                maxWidth: "160px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "12px 16px",
                  fontSize: "11px",
                  color: "#adb1b8",
                  fontWeight: 400,
                  background: "rgb(16, 16, 20)",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Contracts
              </div>

              {/* Data Rows */}
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                {positions.length > 0 ? (
                  positions.map((position) => (
                    <div
                      key={`contracts-${position.id}`}
                      style={{
                        padding: "10px 16px",
                        borderLeft: `3px solid ${
                          position.direction === "long" ? "#0ecb81" : "#f6465d"
                        }`,
                        background: "rgb(16, 16, 20)",
                        height: "52px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#eaecef",
                          fontWeight: 500,
                          marginBottom: "2px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span>{position.symbol}</span>
                        <div
                          className="integral__perp-tag"
                          style={{
                            display: "inline-flex",
                            height: "14px",
                            padding: "0 4px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "4px",
                            background: "#1e2023", // var(--bds-gray-ele-edge)
                            marginLeft: "2px",
                            color: "#fff", // var(--bds-gray-t1-title)
                            textAlign: "center",
                            fontSize: "10px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "14px",
                          }}
                        >
                          Perp
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color:
                            position.direction === "long"
                              ? "#0ecb81"
                              : "#f6465d",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>
                          {position.margin_mode === "cross"
                            ? "Cross"
                            : "Isolated"}
                        </span>
                        <span>{position.leverage || "75"}.00x</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "40px 16px",
                      textAlign: "center",
                      color: "#adb1b8",
                      fontSize: "12px",
                    }}
                  >
                    No positions
                  </div>
                )}
              </div>
            </div>

            {/* Middle Columns */}
            <div
              style={{
                flex: 1,
                background: "rgb(16, 16, 20)",
                minWidth: "1560px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "120px 120px 120px 120px 120px 120px 120px 120px 180px 120px 100px 120px 80px",
                  fontSize: "11px",
                  color: "#71757a",
                  fontWeight: 400,
                  background: "rgb(16, 16, 20)",
                  height: "35px",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Qty
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Value
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Entry Price
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Mark Price
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Liq. Price
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Breakeven Price
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  IM
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  MM
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Unrealized P&L(ROI)
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Realized P&L
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  TP/SL
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Trailing Stop
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  ADL
                </div>
              </div>

              {/* Scrollable Data Rows */}
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                {positions.length > 0 ? (
                  positions.map((position) => {
                    const currentPrice = parseFloat(
                      market.symbolTicker.lastPrice || "0"
                    );
                    const entryPrice = parseFloat(position.entry);
                    const positionSize =
                      position.direction === "long"
                        ? position.crypto_size
                        : -position.crypto_size;
                    const fundingRate = market.symbolTicker.fundingRate || 0;
                    const pnl =
                      isNaN(currentPrice) ||
                      isNaN(entryPrice) ||
                      isNaN(positionSize)
                        ? 0
                        : calculatePnl(
                            positionSize,
                            entryPrice,
                            currentPrice,
                            fundingRate
                          );
                    const pnlPercentage =
                      position.margin === 0 || isNaN(pnl)
                        ? 0
                        : (pnl / position.margin) * 100;
                    const liquidationPrice =
                      isNaN(positionSize) ||
                      isNaN(entryPrice) ||
                      positionSize === 0
                        ? 0
                        : getPriceAtPnl(
                            positionSize,
                            entryPrice,
                            -position.margin
                          );

                    // Calculate IM and MM using Bybit's formulas
                    const marginParams: MarginCalculationParams = {
                      positionSize: Math.abs(position.crypto_size),
                      indexPrice: currentPrice,
                      markPrice: currentPrice, // Using current price as mark price approximation
                      positionType:
                        position.direction === "long" ? "long" : "short",
                      instrumentType: "perpetual", // Assuming perpetual contracts
                      leverage: position.leverage || 75,
                    };

                    const marginCalculation = calculateMargin(marginParams);

                    // Calculate Realized P&L using Bybit's formula
                    // Estimate position age (in production, this should come from position data)
                    const positionCreatedAt = new Date(
                      Date.now() - 24 * 60 * 60 * 1000
                    ); // Default to 24h ago

                    // For unopened positions, use a simplified calculation focused on actual costs
                    const realizedPnlParams: RealizedPnlParams = {
                      positionSize: position.crypto_size,
                      entryPrice: entryPrice,
                      currentPrice: entryPrice, // Use entry price for stable calculation since no closings
                      tradingFeeRate: getTradingFeeRate("perpetual"),
                      fundingRate:
                        market.symbolTicker.fundingRate ||
                        getEstimatedFundingRate(),
                      fundingInterval: 8, // 8 hours for most perpetual contracts
                      positionDurationHours: 24, // Fixed 24h for demo (should be actual duration)
                      partialClosings: [], // No closings as specified
                    };

                    const realizedPnlResult =
                      calculateRealizedPnl(realizedPnlParams);

                    return (
                      <div
                        key={`scrollable-${position.id}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "120px 120px 120px 120px 120px 120px 120px 120px 180px 120px 100px 120px 80px",
                          background: "rgb(16, 16, 20)",
                          alignItems: "center",
                          height: "52px",
                        }}
                      >
                        {/* Qty */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              color:
                                position.direction === "long"
                                  ? "#0ecb81"
                                  : "#f6465d",
                              fontWeight: 400,
                            }}
                          >
                            {isNaN(position.crypto_size)
                              ? "0.0"
                              : position.crypto_size.toFixed(1)}{" "}
                            {position.symbol.replace("USDT", "")}
                          </div>
                        </div>

                        {/* Value */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <div style={{ fontSize: "12px", color: "#eaecef" }}>
                            {isNaN(position.usd_size)
                              ? "0.00"
                              : position.usd_size.toFixed(2)}{" "}
                            USDT
                          </div>
                        </div>

                        {/* Entry Price */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <div style={{ fontSize: "12px", color: "#eaecef" }}>
                            {isNaN(entryPrice)
                              ? "0.000"
                              : entryPrice.toFixed(3)}
                          </div>
                        </div>

                        {/* Mark Price */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <div style={{ fontSize: "12px", color: "#eaecef" }}>
                            {isNaN(currentPrice)
                              ? "0.000"
                              : currentPrice.toFixed(3)}
                          </div>
                        </div>

                        {/* Liq. Price */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <div style={{ fontSize: "12px", color: "#eaecef" }}>
                            {isNaN(liquidationPrice)
                              ? "0.000"
                              : liquidationPrice.toFixed(3)}
                          </div>
                        </div>

                        {/* Breakeven Price */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <div style={{ fontSize: "12px", color: "#eaecef" }}>
                            {isNaN(entryPrice)
                              ? "0.000"
                              : entryPrice.toFixed(3)}
                          </div>
                        </div>

                        {/* IM */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <Text size="md" color="primary">
                            {formatMarginValue(
                              marginCalculation.initialMargin,
                              "USDT",
                              2
                            )}
                          </Text>
                        </div>

                        {/* MM */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <Text size="md" color="primary">
                            {formatMarginValue(
                              marginCalculation.maintenanceMargin,
                              "USDT",
                              4
                            )}
                          </Text>
                          <Text size="xs" color="secondary">
                            ≈{marginCalculation.maintenanceMargin.toFixed(2)}{" "}
                            USD
                          </Text>
                        </div>

                        {/* Unrealized P&L(ROI) */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <Text
                            size="md"
                            color={pnl >= 0 ? "success" : "error"}
                          >
                            {isNaN(pnl) ? "0.0000" : pnl.toFixed(4)} USDT
                          </Text>
                          <Text
                            size="xs"
                            color={pnl >= 0 ? "success" : "error"}
                          >
                            (
                            {isNaN(pnlPercentage)
                              ? "+0.00"
                              : pnlPercentage >= 0
                              ? "+"
                              : ""}
                            {isNaN(pnlPercentage)
                              ? "0.00"
                              : pnlPercentage.toFixed(2)}
                            %)
                          </Text>
                          <Text size="xs" color="secondary">
                            ≈{isNaN(pnl) ? "0.00" : pnl.toFixed(2)} USD
                          </Text>
                        </div>

                        {/* Realized P&L */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <Text
                            size="md"
                            color={
                              realizedPnlResult.realizedPnl >= 0
                                ? "success"
                                : "error"
                            }
                          >
                            {formatRealizedPnl(
                              realizedPnlResult.realizedPnl,
                              "USDT",
                              4
                            )}
                          </Text>
                          <Text size="xs" color="secondary">
                            ≈{realizedPnlResult.realizedPnl.toFixed(2)} USD
                          </Text>
                        </div>

                        {/* TP/SL */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <Button variant="moly" size="xs">
                            + Add
                          </Button>
                        </div>

                        {/* Trailing Stop */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <Button variant="moly" size="xs">
                            + Add
                          </Button>
                        </div>

                        {/* ADL */}
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ display: "flex", gap: "2px" }}>
                              <div
                                style={{
                                  width: "4px",
                                  height: "12px",
                                  background: "#f6465d",
                                }}
                              ></div>
                              <div
                                style={{
                                  width: "4px",
                                  height: "12px",
                                  background: "#f6465d",
                                }}
                              ></div>
                              <div
                                style={{
                                  width: "4px",
                                  height: "12px",
                                  background: "#404347",
                                }}
                              ></div>
                              <div
                                style={{
                                  width: "4px",
                                  height: "12px",
                                  background: "#404347",
                                }}
                              ></div>
                              <div
                                style={{
                                  width: "4px",
                                  height: "12px",
                                  background: "#404347",
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "40px 16px",
                      textAlign: "center",
                      color: "#adb1b8",
                      fontSize: "12px",
                      minWidth: "1560px",
                    }}
                  >
                    No positions
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Right Column - Close By */}
            <div
              style={{
                position: "sticky",
                right: 0,
                zIndex: 10,
                background: "rgb(16, 16, 20)",
                minWidth: "150px",
                maxWidth: "150px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Sticky Left Shadow - From header to last row */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-30px",
                  width: "30px",
                  height: `${35 + positions.length * 52}px`, // Header height + data rows
                  background:
                    "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3))",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              {/* Header */}
              <div
                style={{
                  padding: "12px 16px",
                  fontSize: "11px",
                  color: "#adb1b8",
                  fontWeight: 400,
                  background: "rgb(16, 16, 20)",
                  textAlign: "end",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                Close By
              </div>

              {/* Data Rows */}
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                {positions.length > 0 ? (
                  positions.map((position) => (
                    <div
                      key={`closeby-${position.id}`}
                      style={{
                        padding: "10px 8px",
                        background: "rgb(16, 16, 20)",
                        height: "52px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Button variant="moly" size="xs">
                        Limit
                      </Button>
                      <Button variant="moly" size="xs">
                        Market
                      </Button>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "40px 16px",
                      textAlign: "center",
                      color: "#adb1b8",
                      fontSize: "12px",
                    }}
                  >
                    --
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "open-orders" ? (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {orders.length > 0 ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                minWidth: "calc(160px + 1200px + 150px)", // Fixed left + scrollable + fixed right
                flex: 1,
                height: "100%",
              }}
            >
              {/* Fixed Left Column - Contracts */}
              <div
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 10,
                  background: "rgb(16, 16, 20)",
                  minWidth: "160px",
                  maxWidth: "160px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "12px 16px",
                    fontSize: "11px",
                    color: "#adb1b8",
                    fontWeight: 400,
                    background: "rgb(16, 16, 20)",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Contracts
                </div>

                {/* Data Rows */}
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  {orders.map((order) => (
                    <div
                      key={`contracts-${order.id}`}
                      style={{
                        padding: "10px 16px",
                        borderLeft: `3px solid ${
                          order.direction === "long" ? "#0ecb81" : "#f6465d"
                        }`,
                        background: "rgb(16, 16, 20)",
                        height: "52px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#eaecef",
                          fontWeight: 500,
                          marginBottom: "2px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span>{order.symbol}</span>
                        <div
                          className="integral__perp-tag"
                          style={{
                            display: "inline-flex",
                            height: "14px",
                            padding: "0 4px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "4px",
                            background: "#1e2023",
                            marginLeft: "2px",
                            color: "#fff",
                            textAlign: "center",
                            fontSize: "10px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "14px",
                          }}
                        >
                          Perp
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color:
                            order.direction === "long" ? "#0ecb81" : "#f6465d",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>
                          {order.margin_mode === "cross" ? "Cross" : "Isolated"}
                        </span>
                        <span>{order.leverage || "75"}.00x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Columns */}
              <div
                style={{
                  flex: 1,
                  background: "rgb(16, 16, 20)",
                  minWidth: "1200px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Headers */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "120px 120px 120px 120px 120px 120px 120px 120px 120px 120px",
                    fontSize: "11px",
                    color: "#71757a",
                    fontWeight: 400,
                    background: "rgb(16, 16, 20)",
                    height: "35px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Created
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Type
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Side
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Qty
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Order Value
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Order Price
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Entry Price
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Trigger Conditions
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Reduce Only
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 8px" }}>
                    Status
                  </div>
                </div>

                {/* Scrollable Data Rows */}
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  {orders.map((order) => {
                    const orderPrice = parseFloat(order.entry || "0");
                    const orderValue = order.crypto_size * orderPrice;

                    return (
                      <div
                        key={`order-data-${order.id}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "120px 120px 120px 120px 120px 120px 120px 120px 120px 120px",
                          fontSize: "12px",
                          color: "#eaecef",
                          background: "rgb(16, 16, 20)",
                          height: "52px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          {new Date(order.created_at).toLocaleTimeString()}
                        </div>
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          {order.is_market ? "Market" : "Limit"}
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            padding: "10px 8px",
                            color:
                              order.direction === "long"
                                ? "#0ecb81"
                                : "#f6465d",
                          }}
                        >
                          {order.direction === "long"
                            ? "Buy/Long"
                            : "Sell/Short"}
                        </div>
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          {order.crypto_size.toFixed(4)}
                        </div>
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          {orderValue.toFixed(2)} USDT
                        </div>
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          {orderPrice > 0 ? orderPrice.toFixed(4) : "--"}
                        </div>
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          {orderPrice > 0 ? orderPrice.toFixed(4) : "--"}
                        </div>
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          --
                        </div>
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          --
                        </div>
                        <div
                          style={{ textAlign: "center", padding: "10px 8px" }}
                        >
                          <span
                            style={{
                              color: "#f7a600",
                              background: "rgba(247, 166, 0, 0.16)",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                            }}
                          >
                            {order.status || "pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fixed Right Column - Actions */}
              <div
                style={{
                  position: "sticky",
                  right: 0,
                  zIndex: 10,
                  background: "rgb(16, 16, 20)",
                  minWidth: "150px",
                  maxWidth: "150px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "12px 16px",
                    fontSize: "11px",
                    color: "#adb1b8",
                    fontWeight: 400,
                    background: "rgb(16, 16, 20)",
                    textAlign: "center",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Action
                </div>

                {/* Data Rows */}
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  {orders.map((order) => (
                    <div
                      key={`action-${order.id}`}
                      style={{
                        padding: "10px 8px",
                        background: "rgb(16, 16, 20)",
                        height: "52px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={async () => {
                          try {
                            const response = await fetch("/api/cancelorder", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ id: order.id }),
                            });

                            if (response.ok) {
                              console.log("Order cancelled successfully");
                              // Manual refresh as fallback if real-time doesn't work
                              setTimeout(() => {
                                fetchOrders();
                              }, 500);
                            } else {
                              console.error(
                                "Failed to cancel order:",
                                await response.text()
                              );
                            }
                          } catch (e) {
                            console.error("Failed to cancel order:", e);
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                color: "#adb1b8",
                fontSize: "14px",
              }}
            >
              No open orders
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
            color: "#adb1b8",
            fontSize: "14px",
          }}
        >
          Coming soon
        </div>
      )}
    </div>
  );
}
