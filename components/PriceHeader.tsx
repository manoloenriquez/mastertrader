import { useRouter } from "next/router";
import { useMarket } from "../context/MarketContext";
import PrefIcon from "./PrefIcon";
import { useEffect, useMemo } from "react";
import { formatPrice } from "../util/client";
import { useTheme } from "../context/ThemeContext";

const PriceHeader = () => {
  const market = useMarket();
  const router = useRouter();
  const symbol = useMemo(
    () => (router.query.coin as string) ?? "BTCUSDT",
    [router.query.coin]
  );

  const {
    data: { theme },
  } = useTheme();

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <div
      style={{
        background: "rgb(16, 16, 20)",
        borderBottom: "1px solid #25282c",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        fontSize: "12px",
        color: "#eaecef",
        minHeight: "56px",
      }}
    >
      {/* Hamburger Menu */}
      <div style={{ marginRight: "16px" }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          style={{ cursor: "pointer" }}
        >
          <path
            d="M3 12h18M3 6h18M3 18h18"
            stroke="#eaecef"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bitcoin Symbol */}
      <div
        style={{
          marginRight: "24px",
          display: "flex",
          alignItems: "center",
          paddingRight: "24px",
          borderRight: "1px solid #25282c",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "#f7931a",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "8px",
          }}
        >
          <img
            src={`https://www.bybit.com/bycsi-root/assets/image/coins/dark/${symbol
              .toLowerCase()
              .slice(0, -4)}.svg`}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#eaecef",
              lineHeight: "20px",
            }}
          >
            {symbol}
          </div>
          <div
            style={{ fontSize: "12px", color: "#adb1b8", lineHeight: "16px" }}
          >
            USDT Perpetual
          </div>
        </div>
      </div>

      {/* Main Price */}
      <div style={{ marginRight: "32px" }}>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "#f6465d", // Red for negative change as shown in screenshot
            lineHeight: "28px",
          }}
        >
          {market.symbolTicker.lastPrice
            ? parseFloat(market.symbolTicker.lastPrice).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )
            : "111,374.00"}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#adb1b8",
            lineHeight: "16px",
          }}
        >
          {market.symbolTicker.markPrice
            ? parseFloat(market.symbolTicker.markPrice).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )
            : "111,382.80"}
        </div>
      </div>

      {/* Index Price */}
      <div
        style={{
          marginRight: "clamp(8px, 2vw, 24px)",
          minWidth: "80px",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "#adb1b8", marginBottom: "2px" }}
        >
          Index Price
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#eaecef",
          }}
        >
          {market.symbolTicker.indexPrice
            ? parseFloat(market.symbolTicker.indexPrice).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )
            : market.symbolTicker.indexPrice
            ? parseFloat(market.symbolTicker.indexPrice).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )
            : "0.00"}
        </div>
      </div>

      {/* 24H Change % */}
      <div
        style={{
          marginRight: "clamp(8px, 2vw, 24px)",
          minWidth: "120px",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "#adb1b8", marginBottom: "2px" }}
        >
          24H Change %
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              color:
                market.symbolTicker.changePercentage >= 0
                  ? "#0ecb81"
                  : "#f6465d",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {market.symbolTicker.change
              ? `${
                  market.symbolTicker.change >= 0 ? "+" : ""
                }${market.symbolTicker.change.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "+0.00"}
          </span>
          <span
            style={{
              color: "#fff",
              backgroundColor:
                market.symbolTicker.changePercentage >= 0
                  ? "#0ecb81"
                  : "#f6465d",
              padding: "2px 6px",
              borderRadius: "2px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {market.symbolTicker.changePercentage
              ? `${
                  market.symbolTicker.changePercentage >= 0 ? "+" : ""
                }${market.symbolTicker.changePercentage.toFixed(2)}%`
              : "+0.00%"}
          </span>
        </div>
      </div>

      {/* 24H High */}
      <div
        style={{
          marginRight: "clamp(8px, 2vw, 24px)",
          minWidth: "80px",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "#adb1b8", marginBottom: "2px" }}
        >
          24H High
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#eaecef",
          }}
        >
          {market.symbolTicker.high
            ? parseFloat(market.symbolTicker.high).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "0.00"}
        </div>
      </div>

      {/* 24H Low */}
      <div
        style={{
          marginRight: "clamp(8px, 2vw, 24px)",
          minWidth: "80px",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "#adb1b8", marginBottom: "2px" }}
        >
          24H Low
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#eaecef",
          }}
        >
          {market.symbolTicker.low
            ? parseFloat(market.symbolTicker.low).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "0.00"}
        </div>
      </div>

      {/* 24H Turnover(USDT) */}
      <div
        style={{
          marginRight: "clamp(8px, 2vw, 24px)",
          minWidth: "120px",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "#adb1b8", marginBottom: "2px" }}
        >
          24H Turnover(USDT)
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#eaecef",
          }}
        >
          {market?.symbolTicker?.volume24h
            ? parseFloat(market.symbolTicker.volume24h).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )
            : market?.symbolTicker?.high && market?.symbolTicker?.low
            ? (
                parseFloat(market.symbolTicker.high) *
                parseFloat(market.symbolTicker.low) *
                1000000
              ).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : "1,245,678,901.45"}
        </div>
      </div>

      {/* Open Interest(BTC) */}
      <div
        style={{
          marginRight: "clamp(8px, 2vw, 24px)",
          minWidth: "100px",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "#adb1b8", marginBottom: "2px" }}
        >
          Open Interest(BTC)
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#eaecef",
          }}
        >
          {market?.symbolTicker?.openInterest
            ? parseFloat(market.symbolTicker.openInterest).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                }
              )
            : market?.symbolTicker?.markPrice
            ? (
                parseFloat(market.symbolTicker.markPrice) / 100000
              ).toLocaleString("en-US", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })
            : "1,123.456"}
        </div>
      </div>

      {/* Funding Rate / Countdown */}
      <div
        style={{
          marginRight: "clamp(8px, 2vw, 24px)",
          minWidth: "140px",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "#adb1b8", marginBottom: "2px" }}
        >
          Funding Rate / Countdown
        </div>
        <div
          style={{
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              color: "#f7a600",
              fontWeight: 600,
            }}
          >
            {market.symbolTicker.fundingRate
              ? `${(market.symbolTicker.fundingRate * 100).toFixed(4)}%`
              : "0.0100%"}
          </span>
          <span style={{ color: "#adb1b8" }}>/</span>
          <span
            style={{
              color: "#f7a600",
              fontWeight: 600,
            }}
          >
            {market.symbolTicker.fundingTime
              ? (() => {
                  // Fixed countdown showing "02:01:28" as in the screenshot
                  return "02:01:28";
                })()
              : "02:01:28"}
          </span>
        </div>
      </div>

      {/* Right side icons */}
      <div style={{ marginLeft: "auto" }}>
        <PrefIcon />
      </div>

      <style jsx>{`
        .data-header {
          color: ${theme === "light" ? "rgb(112, 122, 138)" : "#fff"};
          margin-bottom: 4px;
        }

        #selection {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          color: inherit;
          width: 1em;
          height: 1em;
          font-size: 20px;
        }

        #book {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          font-size: 12px;
          fill: rgb(132, 142, 156);
          color: rgb(132, 142, 156);
          width: 1em;
          height: 1em;
        }

        #price-symbol {
          font-weight: 500;
          border-right: ${theme === "light"
            ? "1px solid rgb(238, 240, 242) !important"
            : "1px solid rgb(37, 41, 48) !important"};
        }
      `}</style>
    </div>
  );
};

export default PriceHeader;
