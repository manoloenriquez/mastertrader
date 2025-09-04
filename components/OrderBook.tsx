import React, { useMemo } from "react";
import type { Orderbook } from "../types";
import { useMarket } from "../context/MarketContext";
import { useRouter } from "next/router";
import { formatPrice } from "../util/client";

export default function OrderBook() {
  const router = useRouter();
  const asset = useMemo(
    () => (router.query.coin as string) ?? "BTCUSDT",
    [router.query.coin]
  );

  const market = useMarket();

  // Get base asset from symbol (e.g., BTC from BTCUSDT)
  const baseAsset = useMemo(() => {
    return asset.slice(0, -4);
  }, [asset]);

  // Use real order book data from market context with proper formatting
  const askData = useMemo(() => {
    if (!market?.orderBookTicker?.asks || !market?.symbolTicker?.lastPrice)
      return [];
    const lastPrice = market.symbolTicker.lastPrice;

    return market.orderBookTicker.asks.slice(0, 8).map((ask, index) => {
      const price = parseFloat(ask.price);
      const qty = parseFloat(ask.qty);
      const total = parseFloat(ask.sum || ask.qty);
      return {
        price: formatPrice(price, lastPrice),
        qty: qty.toLocaleString("en-US"),
        total: total.toLocaleString("en-US"),
        depth: (index + 1) / 8, // For depth visualization
      };
    });
  }, [market?.orderBookTicker?.asks, market?.symbolTicker?.lastPrice]);

  const bidData = useMemo(() => {
    if (!market?.orderBookTicker?.bids || !market?.symbolTicker?.lastPrice)
      return [];
    const lastPrice = market.symbolTicker.lastPrice;

    return market.orderBookTicker.bids.slice(0, 8).map((bid, index) => {
      const price = parseFloat(bid.price);
      const qty = parseFloat(bid.qty);
      const total = parseFloat(bid.sum || bid.qty);
      return {
        price: formatPrice(price, lastPrice),
        qty: qty.toLocaleString("en-US"),
        total: total.toLocaleString("en-US"),
        depth: (8 - index) / 8, // For depth visualization
      };
    });
  }, [market?.orderBookTicker?.bids, market?.symbolTicker?.lastPrice]);

  return (
    <div
      style={{
        background: "rgb(16, 16, 20)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "#eaecef",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgb(16, 16, 20)",
          padding: "8px 12px",
        }}
      >
        {/* Top Header with Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <div style={{ display: "flex", gap: "16px", paddingBottom: "12px" }}>
            <span
              style={{
                fontSize: "14px",
                color: "#eaecef",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Order Book
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#adb1b8",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Recent Trades
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg
              style={{
                width: "12px",
                height: "12px",
                fill: "#adb1b8",
                cursor: "pointer",
              }}
              viewBox="0 0 24 24"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </div>
        </div>

        {/* View Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <div style={{ display: "flex", gap: "6px" }}>
            {/* View Mode Icons - Using exact image from screenshot */}
            <img
              src="/Screenshot 2025-09-04 at 1.59.58 AM.png"
              alt="OrderBook view mode icons"
              style={{
                width: "auto",
                height: "20px",
                cursor: "pointer",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Decimal Precision Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              background: "#2b3139",
              padding: "2px 6px",
              borderRadius: "2px",
            }}
          >
            <span style={{ fontSize: "10px", color: "#eaecef" }}>0.1</span>
            <svg
              style={{ width: "8px", height: "8px", fill: "#adb1b8" }}
              viewBox="0 0 24 24"
            >
              <path d="M16 9v1.2L12 15l-4-4.8V9h8z" />
            </svg>
          </div>
        </div>

        {/* Table Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
            paddingBottom: "4px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#adb1b8",
              fontWeight: 400,
              textAlign: "left",
            }}
          >
            Price(USDT)
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#adb1b8",
              fontWeight: 400,
              textAlign: "right",
            }}
          >
            Qty({baseAsset})
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#adb1b8",
              fontWeight: 400,
              textAlign: "right",
            }}
          >
            Total({baseAsset}) ▼
          </div>
        </div>
      </div>

      {/* Order Book Data */}
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "24px", // Space for bottom percentage bar
        }}
      >
        {/* Asks (Sell Orders) - Red */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {askData.map((ask, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "1px 12px",
                  fontSize: "12px",
                  lineHeight: "18px",
                  cursor: "pointer",
                  position: "relative",
                  minHeight: "18px",
                }}
              >
                {/* Qty column background */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "33.33%", // Start after price column
                    bottom: 0,
                    width: "33.33%", // Full qty column width
                    background: "rgba(32,178,108,.16)",
                    zIndex: 1,
                  }}
                />
                {/* Total column depth visualization */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "66.66%", // Start at total column
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(to left, rgba(246, 70, 93, 0.2), rgba(246, 70, 93, 0.05))`,
                    width: `${ask.depth * 33.33}%`,
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    color: "#f6465d",
                    textAlign: "left",
                    position: "relative",
                    zIndex: 2,
                    fontWeight: 400,
                  }}
                >
                  {ask.price}
                </div>
                <div
                  style={{
                    color: "#eaecef",
                    textAlign: "right",
                    position: "relative",
                    zIndex: 2,
                    fontWeight: 400,
                  }}
                >
                  {ask.qty}
                </div>
                <div
                  style={{
                    color: "#eaecef",
                    textAlign: "right",
                    position: "relative",
                    zIndex: 2,
                    fontWeight: 400,
                  }}
                >
                  {ask.total}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Price */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 12px",
            background: "rgb(16, 16, 20)",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg
              style={{
                width: "10px",
                height: "10px",
                fill: "#f6465d",
                transform: "rotate(180deg)",
              }}
              viewBox="0 0 24 24"
            >
              <path d="M7 14l5-5 5 5z" />
            </svg>
            <span
              style={{
                fontSize: "16px",
                color: "#f6465d",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              {market?.symbolTicker?.lastPrice
                ? formatPrice(
                    parseFloat(market.symbolTicker.lastPrice),
                    market.symbolTicker.lastPrice
                  )
                : "0.2215"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg
              style={{
                width: "12px",
                height: "8px",
                fill: "#f7a600",
              }}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="2" fill="currentColor" />
            </svg>
            <span
              style={{
                fontSize: "16px",
                color: "#f7a600",
                fontWeight: 700,
                fontFamily: "monospace",
                textDecoration: "underline",
                textDecorationStyle: "dashed",
                textDecorationColor: "#f7a600",
                textUnderlineOffset: "3px",
              }}
            >
              {market?.symbolTicker?.lastPrice
                ? formatPrice(
                    parseFloat(market.symbolTicker.lastPrice),
                    market.symbolTicker.lastPrice
                  )
                : "0.2217"}
            </span>
          </div>
        </div>

        {/* Bids (Buy Orders) - Green */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {bidData.map((bid, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "1px 12px",
                  fontSize: "12px",
                  lineHeight: "18px",
                  cursor: "pointer",
                  position: "relative",
                  minHeight: "18px",
                }}
              >
                {/* Qty column background */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "33.33%", // Start after price column
                    bottom: 0,
                    width: "33.33%", // Full qty column width
                    background: "rgba(32,178,108,.16)",
                    zIndex: 1,
                  }}
                />
                {/* Total column depth visualization */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "66.66%", // Start at total column
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(to left, rgba(14, 203, 129, 0.2), rgba(14, 203, 129, 0.05))`,
                    width: `${bid.depth * 33.33}%`,
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    color: "#0ecb81",
                    textAlign: "left",
                    position: "relative",
                    zIndex: 2,
                    fontWeight: 400,
                  }}
                >
                  {bid.price}
                </div>
                <div
                  style={{
                    color: "#eaecef",
                    textAlign: "right",
                    position: "relative",
                    zIndex: 2,
                    fontWeight: 400,
                  }}
                >
                  {bid.qty}
                </div>
                <div
                  style={{
                    color: "#eaecef",
                    textAlign: "right",
                    position: "relative",
                    zIndex: 2,
                    fontWeight: 400,
                  }}
                >
                  {bid.total}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Percentage Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 12,
          right: 12,
          display: "flex",
          height: "24px",
          borderRadius: "4px",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        {/* Green section (Buy) */}
        <div
          style={{
            background: "linear-gradient(135deg, #0ecb81 0%, #1a8a5c 100%)",
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: "8px",
            fontSize: "11px",
            color: "#fff",
            fontWeight: 600,
            position: "relative",
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%)",
          }}
        >
          <span
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              padding: "2px 6px",
              borderRadius: "2px",
              fontSize: "10px",
              marginRight: "4px",
            }}
          >
            B
          </span>
          <span>50%</span>
        </div>

        {/* Diagonal separator */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "2px",
            height: "100%",
            background:
              "linear-gradient(45deg, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.6) 60%, transparent 100%)",
            transform: "translateX(-50%) skewX(-15deg)",
            zIndex: 5,
          }}
        />

        {/* Red section (Sell) */}
        <div
          style={{
            background: "linear-gradient(135deg, #f6465d 0%, #c73650 100%)",
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "8px",
            fontSize: "11px",
            color: "#fff",
            fontWeight: 600,
            position: "relative",
            clipPath: "polygon(8px 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <span>50%</span>
          <span
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              padding: "2px 6px",
              borderRadius: "2px",
              fontSize: "10px",
              marginLeft: "4px",
            }}
          >
            S
          </span>
        </div>
      </div>
    </div>
  );
}
