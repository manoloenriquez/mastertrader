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

  // Use real order book data from market context
  const askData = useMemo(() => {
    if (!market?.orderBookTicker?.asks) return [];
    return market.orderBookTicker.asks.slice(0, 14).map((ask) => ({
      price: parseFloat(ask.price).toFixed(2),
      qty: parseFloat(ask.qty).toFixed(3),
      total: parseFloat(ask.sum || ask.qty).toFixed(3),
    }));
  }, [market?.orderBookTicker?.asks]);

  const bidData = useMemo(() => {
    if (!market?.orderBookTicker?.bids) return [];
    return market.orderBookTicker.bids.slice(0, 14).map((bid) => ({
      price: parseFloat(bid.price).toFixed(2),
      qty: parseFloat(bid.qty).toFixed(3),
      total: parseFloat(bid.sum || bid.qty).toFixed(3),
    }));
  }, [market?.orderBookTicker?.bids]);

  return (
    <div
      style={{
        background: "rgb(16, 16, 20)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "#eaecef",
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgb(16, 16, 20)",
          padding: "8px 12px",
          borderBottom: "1px solid #2b3139",
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
          <div style={{ display: "flex", gap: "16px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#eaecef",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Order Book
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#adb1b8",
                fontWeight: 400,
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
            {/* View Mode Icons */}
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#f6465d",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#adb1b8",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#adb1b8",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#adb1b8",
                cursor: "pointer",
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
              fontSize: "9px",
              color: "#adb1b8",
              fontWeight: 400,
              textAlign: "left",
            }}
          >
            Price(USDT)
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "#adb1b8",
              fontWeight: 400,
              textAlign: "right",
            }}
          >
            Qty(BTC)
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "#adb1b8",
              fontWeight: 400,
              textAlign: "right",
            }}
          >
            Total(BTC)
          </div>
        </div>
      </div>

      {/* Order Book Data */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Asks (Sell Orders) - Red */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {askData.map((ask, index) => {
            const depth = (index + 1) / askData.length;
            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "2px 12px",
                  fontSize: "12px",
                  lineHeight: "16px",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    color: "#f6465d",
                    textAlign: "left",
                    position: "relative",
                    zIndex: 2,
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
                    background: `linear-gradient(to left, rgba(246, 70, 93, ${
                      0.15 * depth
                    }), rgba(246, 70, 93, ${0.05 * depth}))`,
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
                    background: `linear-gradient(to left, rgba(246, 70, 93, ${
                      0.2 * depth
                    }), rgba(246, 70, 93, ${0.1 * depth}))`,
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
            justifyContent: "space-between",
            padding: "8px 12px",
            background: "rgb(16, 16, 20)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
                fontWeight: 600,
              }}
            >
              {market?.symbolTicker?.lastPrice
                ? parseFloat(market.symbolTicker.lastPrice).toFixed(2)
                : "108,449.70"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg
              style={{ width: "10px", height: "10px", fill: "#f7a600" }}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="2" fill="currentColor" />
            </svg>
            <span
              style={{
                fontSize: "12px",
                color: "#f7a600",
              }}
            >
              {market?.orderBookTicker?.asks &&
              market?.orderBookTicker?.bids &&
              market.orderBookTicker.asks.length > 0 &&
              market.orderBookTicker.bids.length > 0
                ? (() => {
                    const lowestAsk = parseFloat(
                      market.orderBookTicker.asks[0].price
                    );
                    const highestBid = parseFloat(
                      market.orderBookTicker.bids[0].price
                    );
                    const spread = lowestAsk - highestBid;
                    return spread.toFixed(2);
                  })()
                : "108,456.42"}
            </span>
          </div>
        </div>

        {/* Bids (Buy Orders) - Green */}
        <div style={{ flex: 1 }}>
          {bidData.map((bid, index) => {
            const depth = (bidData.length - index) / bidData.length;
            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "2px 12px",
                  fontSize: "12px",
                  lineHeight: "16px",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    color: "#0ecb81",
                    textAlign: "left",
                    position: "relative",
                    zIndex: 2,
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
                    background: `linear-gradient(to left, rgba(14, 203, 129, ${
                      0.15 * depth
                    }), rgba(14, 203, 129, ${0.05 * depth}))`,
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
                    background: `linear-gradient(to left, rgba(14, 203, 129, ${
                      0.2 * depth
                    }), rgba(14, 203, 129, ${0.1 * depth}))`,
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
          display: "flex",
          height: "20px",
          background: "rgb(16, 16, 20)",
          borderTop: "1px solid #2b3139",
        }}
      >
        <div
          style={{
            background: "#0ecb81",
            width: "42%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "9px",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          ᗇ 42%
        </div>
        <div
          style={{
            background: "#f6465d",
            width: "58%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "9px",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          58% ᗆ
        </div>
      </div>
    </div>
  );
}
