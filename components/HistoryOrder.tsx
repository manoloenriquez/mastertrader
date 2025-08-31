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

export default function HistoryOrder() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const market = useMarket();
  const { orders, positions, balance } = useData()!;
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
      }}
    >
      {/* Header Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: "1px solid #2b3139",
          background: "rgb(16, 16, 20)",
          minHeight: "48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span
            onClick={() => setActiveTab("open-orders")}
            style={{
              fontSize: "14px",
              color: activeTab === "open-orders" ? "#eaecef" : "#adb1b8",
              cursor: "pointer",
              padding: "12px 0",
              borderBottom:
                activeTab === "open-orders"
                  ? "2px solid #f7a600"
                  : "2px solid transparent",
              fontWeight: 400,
            }}
          >
            Open Orders (0)
          </span>
          <span
            onClick={() => setActiveTab("positions")}
            style={{
              fontSize: "14px",
              color: activeTab === "positions" ? "#eaecef" : "#adb1b8",
              cursor: "pointer",
              padding: "12px 0",
              borderBottom:
                activeTab === "positions"
                  ? "2px solid #f7a600"
                  : "2px solid transparent",
              fontWeight: 400,
            }}
          >
            Positions (1)
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#adb1b8",
              cursor: "pointer",
              padding: "12px 0",
            }}
          >
            Order History
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#adb1b8",
              cursor: "pointer",
              padding: "12px 0",
            }}
          >
            Trade History
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#adb1b8",
              cursor: "pointer",
              padding: "12px 0",
            }}
          >
            Other
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              style={{
                width: "16px",
                height: "16px",
                fill: "#adb1b8",
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: "12px", color: "#adb1b8" }}>
              All Markets
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#adb1b8",
                padding: "6px 12px",
                border: "1px solid #474d57",
                borderRadius: "4px",
                background: "#2b3139",
                cursor: "pointer",
              }}
            >
              1-Click Close All
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#adb1b8",
                padding: "6px 12px",
                border: "1px solid #474d57",
                borderRadius: "4px",
                background: "#2b3139",
                cursor: "pointer",
              }}
            >
              Asset Overview
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#adb1b8",
                padding: "6px 12px",
                border: "1px solid #474d57",
                borderRadius: "4px",
                background: "#2b3139",
                cursor: "pointer",
              }}
            >
              PnL Analysis
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg
              style={{
                width: "16px",
                height: "16px",
                fill: "#adb1b8",
                cursor: "pointer",
              }}
              viewBox="0 0 24 24"
            >
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
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
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      {activeTab === "positions" ? (
        <div style={{ width: "100%", overflow: "hidden" }}>
          {/* Scrollable Table Container */}
          <div style={{ position: "relative", display: "flex", width: "100%" }}>
            {/* Fixed Left Column - Contracts */}
            <div
              style={{
                position: "sticky",
                left: 0,
                zIndex: 10,
                background: "rgb(16, 16, 20)",
                borderRight: "1px solid #2b3139",
                minWidth: "200px",
                maxWidth: "200px",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #2b3139",
                  fontSize: "11px",
                  color: "#adb1b8",
                  fontWeight: 400,
                  background: "rgb(16, 16, 20)",
                }}
              >
                Contracts
              </div>

              {/* Data Rows */}
              {positions.length > 0 ? (
                positions.map((position) => (
                  <div
                    key={`contracts-${position.id}`}
                    style={{
                      padding: "10px 16px",
                      borderBottom: "1px solid rgba(43, 49, 57, 0.3)",
                      borderLeft: `3px solid ${
                        position.direction === "long" ? "#0ecb81" : "#f6465d"
                      }`,
                      background: "rgb(16, 16, 20)",
                      minHeight: "52px",
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
                        gap: "4px",
                      }}
                    >
                      {position.symbol} Perp
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#adb1b8",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {position.margin_mode === "cross" ? "Cross" : "Isolated"}{" "}
                      {position.leverage}.00x
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

            {/* Scrollable Middle Columns */}
            <div
              style={{
                flex: 1,
                overflowX: "auto",
                background: "rgb(16, 16, 20)",
              }}
            >
              {/* Scrollable Headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "120px 120px 120px 120px 120px 120px 120px 120px 120px 120px 150px 120px 120px 120px 120px",
                  borderBottom: "1px solid #2b3139",
                  fontSize: "11px",
                  color: "#adb1b8",
                  fontWeight: 400,
                  background: "rgb(16, 16, 20)",
                  minWidth: "1800px",
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
                  ADL Ranking
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Est. Liq Price
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Unrealized P&L(ROE)
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Realized P&L
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Funding
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  24h PnL
                </div>
                <div style={{ textAlign: "center", padding: "12px 8px" }}>
                  Position Age
                </div>
              </div>

              {/* Scrollable Data Rows */}
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

                  return (
                    <div
                      key={`scrollable-${position.id}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "120px 120px 120px 120px 120px 120px 120px 120px 120px 120px 150px 120px 120px 120px 120px",
                        borderBottom: "1px solid rgba(43, 49, 57, 0.3)",
                        background: "rgb(16, 16, 20)",
                        alignItems: "center",
                        minHeight: "52px",
                        minWidth: "1800px",
                      }}
                    >
                      {/* Qty */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
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
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#eaecef" }}>
                          {isNaN(position.usd_size)
                            ? "0.00"
                            : position.usd_size.toFixed(2)}{" "}
                          USDT
                        </div>
                      </div>

                      {/* Entry Price */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#eaecef" }}>
                          {isNaN(entryPrice) ? "0.000" : entryPrice.toFixed(3)}
                        </div>
                      </div>

                      {/* Mark Price */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#eaecef" }}>
                          {isNaN(currentPrice)
                            ? "0.000"
                            : currentPrice.toFixed(3)}
                        </div>
                      </div>

                      {/* Liq. Price */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#eaecef" }}>
                          {isNaN(liquidationPrice)
                            ? "0.000"
                            : liquidationPrice.toFixed(3)}
                        </div>
                      </div>

                      {/* Breakeven Price */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#eaecef" }}>
                          {isNaN(entryPrice) ? "0.000" : entryPrice.toFixed(3)}
                        </div>
                      </div>

                      {/* IM */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#eaecef" }}>
                          {isNaN(position.margin)
                            ? "0.0"
                            : position.margin.toFixed(1)}{" "}
                          USDT
                        </div>
                      </div>

                      {/* MM */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#eaecef" }}>
                          {(position.margin * 0.5).toFixed(1)} USDT
                        </div>
                      </div>

                      {/* ADL Ranking */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#f7a600" }}>
                          ●●○○○
                        </div>
                      </div>

                      {/* Est. Liq Price */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#eaecef" }}>
                          {isNaN(liquidationPrice)
                            ? "0.000"
                            : (liquidationPrice * 0.98).toFixed(3)}
                        </div>
                      </div>

                      {/* Unrealized P&L(ROE) */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: pnl >= 0 ? "#0ecb81" : "#f6465d",
                            fontWeight: 500,
                          }}
                        >
                          {isNaN(pnl) ? "0.0000" : pnl.toFixed(4)} USDT
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: pnl >= 0 ? "#0ecb81" : "#f6465d",
                          }}
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
                        </div>
                      </div>

                      {/* Realized P&L */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#eaecef" }}>
                          -0.0137 USDT
                        </div>
                      </div>

                      {/* Funding */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#0ecb81" }}>
                          +0.0524 USDT
                        </div>
                      </div>

                      {/* 24h PnL */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#f6465d" }}>
                          -1.2456 USDT
                        </div>
                      </div>

                      {/* Position Age */}
                      <div style={{ textAlign: "center", padding: "10px 8px" }}>
                        <div style={{ fontSize: "12px", color: "#adb1b8" }}>
                          2d 14h
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
                    minWidth: "1800px",
                  }}
                >
                  No positions
                </div>
              )}
            </div>

            {/* Fixed Right Column - Close By */}
            <div
              style={{
                position: "sticky",
                right: 0,
                zIndex: 10,
                background: "rgb(16, 16, 20)",
                borderLeft: "1px solid #2b3139",
                minWidth: "150px",
                maxWidth: "150px",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #2b3139",
                  fontSize: "11px",
                  color: "#adb1b8",
                  fontWeight: 400,
                  background: "rgb(16, 16, 20)",
                  textAlign: "center",
                }}
              >
                Close By
              </div>

              {/* Data Rows */}
              {positions.length > 0 ? (
                positions.map((position) => (
                  <div
                    key={`closeby-${position.id}`}
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid rgba(43, 49, 57, 0.3)",
                      background: "rgb(16, 16, 20)",
                      minHeight: "52px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <button
                      style={{
                        background: "#2b3139",
                        border: "1px solid #474d57",
                        borderRadius: "4px",
                        color: "#eaecef",
                        fontSize: "11px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontWeight: 400,
                      }}
                    >
                      + Add
                    </button>
                    <button
                      style={{
                        background: "#2b3139",
                        border: "1px solid #474d57",
                        borderRadius: "4px",
                        color: "#eaecef",
                        fontSize: "11px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontWeight: 400,
                      }}
                    >
                      Limit
                    </button>
                    <button
                      style={{
                        background: "#2b3139",
                        border: "1px solid #474d57",
                        borderRadius: "4px",
                        color: "#eaecef",
                        fontSize: "11px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontWeight: 400,
                      }}
                    >
                      Market
                    </button>
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
  );
}
