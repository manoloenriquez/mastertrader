import React from "react";

const BottomTicker = () => {
  const tickerData = [
    { symbol: "ONDOUSDT", price: "+0.54%", positive: true },
    { symbol: "BTCUSD", price: "-0.06%", positive: false },
    { symbol: "BTCUSDT", price: "-0.07%", positive: false },
    { symbol: "ETHUSDT", price: "+2.62%", positive: true },
    { symbol: "OPUSDT", price: "+0.44%", positive: true },
    { symbol: "MITOUSDT", price: "+20.88%", positive: true },
    { symbol: "BTCUSDT-19SEP25", price: "-0.02%", positive: false },
    { symbol: "ETHUSDT-19SEP25", price: "+2.69%", positive: true },
    { symbol: "BTCUSDT", price: "-0.07%", positive: false },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "32px",
        background: "#1a1a1a",
        borderTop: "1px solid #2b3139",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 1000,
        fontSize: "11px",
        fontWeight: 400,
      }}
    >
      {/* Star icon */}
      <div
        style={{
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          borderRight: "1px solid #2b3139",
          height: "100%",
        }}
      >
        <svg
          style={{
            width: "12px",
            height: "12px",
            fill: "#f7a600",
          }}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-5.18 3.25L9 14.14l-5-4.87 5.91-.01L12 2z" />
        </svg>
      </div>

      {/* Static ticker */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {tickerData.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              minWidth: "max-content",
            }}
          >
            <span style={{ color: "#eaecef", marginRight: "8px" }}>
              {item.symbol}
            </span>
            <span
              style={{
                color: item.positive ? "#00d4aa" : "#f84960",
                fontWeight: 500,
              }}
            >
              {item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Right side icons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          borderLeft: "1px solid #2b3139",
          height: "100%",
          gap: "16px",
        }}
      >
        {/* Rewards Hub */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#f7a600",
            cursor: "pointer",
          }}
        >
          <svg
            style={{
              width: "12px",
              height: "12px",
              fill: "#f7a600",
            }}
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span style={{ fontSize: "11px" }}>Rewards Hub</span>
        </div>

        {/* Announcements */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#eaecef",
            cursor: "pointer",
          }}
        >
          <svg
            style={{
              width: "12px",
              height: "12px",
              fill: "#eaecef",
            }}
            viewBox="0 0 24 24"
          >
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <span style={{ fontSize: "11px" }}>Announcements</span>
        </div>

        {/* Customer Service */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#f7a600",
            cursor: "pointer",
          }}
        >
          <svg
            style={{
              width: "12px",
              height: "12px",
              fill: "#f7a600",
            }}
            viewBox="0 0 24 24"
          >
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 2.5c0 .83-.67 1.5-1.5 1.5S12 7.33 12 6.5 12.67 5 13.5 5s1.5.67 1.5 1.5zM16 18H8v-.57c0-.81.48-1.53 1.22-1.85a6.95 6.95 0 0 1 5.56 0A2.01 2.01 0 0 1 16 17.43V18z" />
          </svg>
          <span style={{ fontSize: "11px" }}>Customer Service</span>
        </div>

        {/* Menu dots */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "3px",
              height: "3px",
              background: "#f7a600",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              width: "3px",
              height: "3px",
              background: "#f7a600",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              width: "3px",
              height: "3px",
              background: "#f7a600",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomTicker;
