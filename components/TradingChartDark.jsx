import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { AdvancedChart } from "react-tradingview-embed";
import styled from "styled-components";
import { useMarket } from "../context/MarketContext";
import { CiCamera } from "react-icons/ci";
import { RiFullscreenLine } from "react-icons/ri";

export default function TradingChartDark() {
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState("30m");
  const [chartKey, setChartKey] = useState(Date.now());

  const symbol = useMemo(
    () => router.query.coin ?? "BTCUSDT",
    [router.query.coin]
  );

  const timeframes = [
    { label: "1s", value: "1S" },
    { label: "1m", value: "1" },
    { label: "5m", value: "5" },
    { label: "15m", value: "15" },
    { label: "30m", value: "30" },
    { label: "1h", value: "60" },
    { label: "4h", value: "240" },
    { label: "1d", value: "D" },
    { label: "1w", value: "W" },
    { label: "1M", value: "M" },
  ];

  const handleTimeframeChange = (timeframe) => {
    console.log("Changing timeframe from", selectedTimeframe, "to:", timeframe);
    setSelectedTimeframe(timeframe);
    // Use timestamp to ensure unique keys for complete re-render
    setChartKey(Date.now());
  };

  return (
    <div className="chart-container">
      {/* Top Navigation */}
      <div className="chart-header">
        <div className="main-tabs">
          <span className="main-tab active">Chart</span>
          <span className="main-tab">Overview</span>
          <span className="main-tab">Data</span>
          <span className="main-tab">Feed</span>
        </div>
        <div className="header-controls">
          <span className="control-tab">Standard</span>
          <span className="control-tab active">TradingView</span>
          <span className="control-tab">Depth</span>
          <div className="header-icons">
            <svg className="header-icon" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" fill="currentColor" />
              <rect x="14" y="3" width="7" height="7" fill="currentColor" />
              <rect x="3" y="14" width="7" height="7" fill="currentColor" />
              <rect x="14" y="14" width="7" height="7" fill="currentColor" />
            </svg>
            <svg className="header-icon" viewBox="0 0 24 24">
              <path
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart Controls Row */}
      <div className="chart-controls">
        <div className="controls-left">
          {/* Time Intervals */}
          <div className="time-controls">
            {timeframes.map((tf) => (
              <span
                key={tf.value}
                className={`time-btn ${
                  selectedTimeframe === tf.value ? "active" : ""
                }`}
                onClick={() => handleTimeframeChange(tf.value)}
              >
                {tf.label}
              </span>
            ))}
            <svg className="dropdown-arrow" viewBox="0 0 24 24">
              <path d="M16 9v1.2L12 15l-4-4.8V9h8z" fill="currentColor" />
            </svg>
          </div>

          {/* Control Buttons */}
          <div className="control-buttons">
            <div className="control-btn">
              <span>Indicators</span>
              <svg className="dropdown-arrow" viewBox="0 0 24 24">
                <path d="M16 9v1.2L12 15l-4-4.8V9h8z" fill="currentColor" />
              </svg>
            </div>
            <div className="control-btn">
              <span>Display</span>
              <svg className="dropdown-arrow" viewBox="0 0 24 24">
                <path d="M16 9v1.2L12 15l-4-4.8V9h8z" fill="currentColor" />
              </svg>
            </div>
            <div className="control-btn">
              <span>Last Traded Price</span>
              <svg className="dropdown-arrow" viewBox="0 0 24 24">
                <path d="M16 9v1.2L12 15l-4-4.8V9h8z" fill="currentColor" />
              </svg>
            </div>
            <div className="control-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                class="ktv_candles_icon_svg__icon"
                viewBox="0 0 1024 1024"
              >
                <path
                  fill="currentColor"
                  d="M362.667 128a42.667 42.667 0 0 0-85.334 0v87.083a128 128 0 0 0-106.666 126.25v341.334a128 128 0 0 0 106.666 126.25V896a42.667 42.667 0 1 0 85.334 0v-87.083a128 128 0 0 0 106.666-126.25V341.333a128 128 0 0 0-106.666-126.25V128zm-21.334 597.333h-42.666A42.667 42.667 0 0 1 256 682.667V341.333a42.667 42.667 0 0 1 42.667-42.666h42.666A42.667 42.667 0 0 1 384 341.333v341.334a42.667 42.667 0 0 1-42.667 42.666zm405.334-512a42.667 42.667 0 1 0-85.334 0v87.083a128 128 0 0 0-106.666 126.25V640a128 128 0 0 0 106.666 126.25v87.083a42.667 42.667 0 1 0 85.334 0v-87.082A128 128 0 0 0 853.333 640V426.667a128 128 0 0 0-106.666-126.251v-87.083zm-21.334 469.334h-42.666A42.667 42.667 0 0 1 640 640V426.667A42.667 42.667 0 0 1 682.667 384h42.666A42.667 42.667 0 0 1 768 426.667V640a42.667 42.667 0 0 1-42.667 42.667z"
                ></path>
              </svg>
              <svg className="dropdown-arrow" viewBox="0 0 24 24">
                <path d="M16 9v1.2L12 15l-4-4.8V9h8z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        <div className="controls-right flex-align-center no-shrink">
          {/* TradingView Alert Button */}
          <div
            className="t-s-b__wh-swt-btn-wrap"
            style={{
              border: 0,
              boxSizing: "border-box",
              font: "inherit",
              verticalAlign: "baseline",
              margin: 0,
              padding: "0 var(--size-6)",
              color: "var(--bds-gray-t2)",
              cursor: "pointer",
              pointerEvents: "initial",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
            >
              <path
                d="M0 2C0 0.895431 0.895431 0 2 0H16V16H2C0.895431 16 0 15.1046 0 14V2Z"
                fill="#2862FF"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.7798 4C4.94589 4 5.09925 4.0537 5.22375 4.14536C4.82087 4.43604 4.46538 4.78832 4.1711 5.18841C4.08196 5.0649 4.0298 4.91347 4.0298 4.75C4.0298 4.33579 4.36558 4 4.7798 4ZM4.7798 3C5.32214 3 5.8071 3.24728 6.12733 3.63341C6.70193 3.38665 7.33501 3.25 8 3.25C8.67334 3.25 9.31395 3.3901 9.89428 3.64275C10.2144 3.25128 10.7028 3 11.2495 3C12.216 3 12.9995 3.7835 12.9995 4.75C12.9995 5.29678 12.7485 5.78465 12.3569 6.10502C12.6098 6.68554 12.75 7.32639 12.75 8C12.75 9.13157 12.3543 10.1707 11.6938 10.9867L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L10.9867 11.6938C10.1707 12.3543 9.13157 12.75 8 12.75C6.86843 12.75 5.82927 12.3543 5.01334 11.6938L3.85355 12.8536C3.65829 13.0488 3.34171 13.0488 3.14645 12.8536C2.95118 12.6583 2.95118 12.3417 3.14645 12.1464L4.30624 10.9867C3.64568 10.1707 3.25 9.13157 3.25 8C3.25 7.31948 3.39311 6.67238 3.65087 6.08716C3.27168 5.76667 3.0298 5.28672 3.0298 4.75C3.0298 3.7835 3.8133 3 4.7798 3ZM11.75 8C11.75 9.00647 11.3535 9.92034 10.7082 10.5939C10.6866 10.6095 10.6659 10.627 10.6464 10.6464C10.627 10.6659 10.6095 10.6866 10.5939 10.7082C9.92033 11.3535 9.00647 11.75 8 11.75C6.99353 11.75 6.07966 11.3535 5.40609 10.7082C5.39052 10.6866 5.373 10.6659 5.35355 10.6464C5.3341 10.627 5.31345 10.6095 5.29183 10.5939C4.6465 9.92034 4.25 9.00647 4.25 8C4.25 5.92893 5.92893 4.25 8 4.25C10.0711 4.25 11.75 5.92893 11.75 8ZM10.7912 4.15619C10.9182 4.05794 11.077 4 11.2495 4C11.6637 4 11.9995 4.33579 11.9995 4.75C11.9995 4.92232 11.9415 5.08126 11.8434 5.20822C11.5499 4.80492 11.1945 4.44958 10.7912 4.15619ZM8.5 5.75C8.5 5.47386 8.27614 5.25 8 5.25C7.72386 5.25 7.5 5.47386 7.5 5.75V8C7.5 8.18939 7.607 8.36252 7.77639 8.44721L9.77639 9.44721C10.0234 9.57071 10.3237 9.4706 10.4472 9.22361C10.5707 8.97662 10.4706 8.67628 10.2236 8.55279L8.5 7.69098V5.75Z"
                fill="#fff"
              />
            </svg>
            <div
              className="t-s-b__wh-swt-content"
              style={{
                color: "var(--bds-gray-t2)",
                fontSize: "12px",
                fontWeight: 400,
                whiteSpace: "nowrap",
                backgroundColor: "rgba(192,210,231,.12)",
                padding: "0 6px",
                borderRadius: "2px",
              }}
            >
              TradingView Alert
            </div>
          </div>

          {/* Screenshot Icon */}
          <div
            className="tv-self-bar--icon tv-self-bar--m-l-8 cursor-pointer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <CiCamera size={16} />
          </div>

          {/* Settings Icon */}
          <div
            className="cursor-pointer tv-self-bar--icon tv-self-bar--m-l-8"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.864 4.525a1.002 1.002 0 0 0-.868-.505H8.004c-.358 0-.69.192-.868.505l-3.996 6.97c-.18.313-.18.698 0 1.01l3.996 6.97c.179.313.51.505.868.505h7.992c.358 0 .69-.192.868-.505l3.996-6.97c.18-.313.18-.698 0-1.01l-3.996-6.97ZM5.4 3.515A3.005 3.005 0 0 1 8.004 2h7.992c1.075 0 2.068.577 2.605 1.515l3.996 6.97a3.048 3.048 0 0 1 0 3.03l-3.996 6.97A3.005 3.005 0 0 1 15.996 22H8.004A3.005 3.005 0 0 1 5.4 20.485l-3.996-6.97a3.048 3.048 0 0 1 0-3.03l3.996-6.97Zm4.576 8.465c0-1.115.898-2.02 2.005-2.02 1.108 0 2.006.905 2.006 2.02 0 1.116-.898 2.02-2.006 2.02a2.013 2.013 0 0 1-2.005-2.02Zm2.005-4.04c-2.215 0-4.011 1.809-4.011 4.04s1.796 4.04 4.011 4.04 4.011-1.809 4.011-4.04-1.796-4.04-4.01-4.04Z"
                fill="#71757a"
              ></path>
            </svg>
          </div>

          {/* Fullscreen Icon */}
          <div
            className="tv-self-bar--icon tv-self-bar--m-l-8 cursor-pointer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <RiFullscreenLine size={16} />
          </div>
        </div>
      </div>

      {/* Chart Content Area */}
      <div className="chart-content">
        {/* Main Chart Area */}
        <div className="chart-main">
          {console.log(
            "Rendering chart with interval:",
            selectedTimeframe,
            "and key:",
            chartKey
          )}
          <AdvancedChart
            key={chartKey}
            widgetProps={{
              theme: "dark",
              symbol: `${symbol}.P`,
              toolbar_bg: "rgb(16, 16, 20)",
              height: "100%",
              enable_publishing: false,
              save_image: false,
              hide_top_toolbar: true,
              hide_side_toolbar: false,
              interval: selectedTimeframe,
              style: "1",
              locale: "en",
              backgroundColor: "rgb(16, 16, 20)",
              studies: [],
              autosize: true,
              timezone: "Etc/UTC",
              allow_symbol_change: false,
              withdateranges: false,
              hide_symbol_search: true,
              hide_volume: false,
              disabled_features: [
                "header_intervals",
                "header_chart_type",
                "header_settings",
                "header_indicators",
                "header_compare",
                "header_undo_redo",
                "header_screenshot",
                "header_fullscreen_button",
                "timeframes_toolbar",
                "header_widget_dom_node",
                "header_widget",
              ],
              enabled_features: [],
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .chart-container {
          background: rgb(16, 16, 20);
          color: #eaecef;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0px 12px;
        }

        .main-tabs {
          display: flex;
          gap: 16px;
        }

        .main-tab {
          font-size: 14px;
          color: #adb1b8;
          cursor: pointer;
          padding: 6px 0;
          position: relative;
          font-weight: 500;
          border-bottom: 2px solid transparent;
        }

        .main-tab:hover:not(.active) {
          color: #b7bdc6;
        }

        .main-tab.active {
          color: #eaecef;
          border-bottom-color: #f7a600;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .control-tab {
          font-size: 11px;
          color: #adb1b8;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 2px;
          font-weight: 400;
        }

        .control-tab:hover:not(.active) {
          color: #b7bdc6;
        }

        .control-tab.active {
          color: #f7a600;
          background: rgba(240, 185, 11, 0.08);
        }

        .header-icons {
          display: flex;
          gap: 6px;
          margin-left: 8px;
        }

        .header-icon {
          width: 14px;
          height: 14px;
          fill: #adb1b8;
          cursor: pointer;
        }

        .header-icon:hover {
          fill: #b7bdc6;
        }

        .chart-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 12px;
          border-bottom: 1px solid #2b3139;
          background: rgb(16, 16, 20);
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .time-controls {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .time-btn {
          font-size: 11px;
          color: #adb1b8;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 2px;
          font-weight: 400;
          min-width: 20px;
          text-align: center;
        }

        .time-btn:hover:not(.active) {
          color: #b7bdc6;
          background: rgba(183, 189, 198, 0.05);
        }

        .time-btn.active {
          color: #f7a600;
          background: rgba(240, 185, 11, 0.08);
        }

        .control-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 11px;
          color: #adb1b8;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 2px;
          font-weight: 400;
        }

        .control-btn:hover {
          color: #b7bdc6;
          background: rgba(183, 189, 198, 0.05);
        }

        .dropdown-arrow {
          width: 8px;
          height: 8px;
          fill: currentColor;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Bybit CSS Variables */
        :root {
          --size-2: 2px;
          --size-12: 12px;
          --bds-trans-hover: rgba(192, 210, 231, 0.12);
        }

        .flex-align-center {
          display: flex;
          align-items: center;
        }

        .no-shrink {
          flex-shrink: 0;
        }

        :root {
          --size-12: 12px;
          --size-2: 2px;
          --size-6: 6px;
          --bds-trans-hover: rgba(192, 210, 231, 0.12);
          --bds-gray-t2: #adb1b8;
        }

        .t-s-b__wh-swt-btn-wrap {
          display: flex;
          align-items: center;
          font-size: var(--size-12);
          background-color: var(--bds-trans-hover);
          border: none;
          border-radius: var(--size-2);
          cursor: pointer;
          box-sizing: border-box;
          font: inherit;
          vertical-align: baseline;
          margin: 0;
          padding: 0 var(--size-6);
          color: var(--bds-gray-t2);
          pointer-events: initial;
        }

        .tv-self-bar__webhook-switch-img {
          width: 14px;
          height: 14px;
        }

        .t-s-b__wh-swt-content {
          color: var(--bds-gray-t2);
          font-size: 12px;
          font-weight: 400;
          white-space: nowrap;
        }

        .tv-self-bar--icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .tv-self-bar--icon:hover {
          background-color: rgba(173, 177, 184, 0.1);
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .tv-icon-iconfont {
          color: #adb1b8;
          font-size: 14px;
        }

        .tv-icon-iconfont:hover {
          color: #b7bdc6;
        }

        /* Icon font classes for Bybit icons */
        .iconicon_screenshot:before {
          content: "📷";
        }

        .iconicon_setting:before {
          content: "⚙️";
        }

        .iconicon_fullscreen_on:before {
          content: "⛶";
        }

        .chart-content {
          display: flex;
          flex: 1;
        }

        .chart-sidebar {
          width: 48px;
          background: rgb(16, 16, 20);
          border-right: 1px solid #2b3139;
          display: flex;
          flex-direction: column;
          padding: 8px 0;
          gap: 4px;
        }

        .sidebar-tool {
          width: 32px;
          height: 32px;
          margin: 0 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 2px;
          color: #adb1b8;
        }

        .sidebar-tool:hover {
          background: #2b3139;
          color: #eaecef;
        }

        .sidebar-tool.active {
          background: #2b3139;
          color: #f7a600;
        }

        .sidebar-tool svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .chart-main {
          flex: 1;
          background: rgb(16, 16, 20) !important;
          height: 100%;
          border: none !important;
          outline: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .chart-main iframe {
          border: none !important;
          outline: none !important;
          background: rgb(16, 16, 20) !important;
        }

        .chart-main div,
        .chart-main canvas,
        .chart-main > * {
          border: none !important;
          outline: none !important;
          background-color: rgb(16, 16, 20) !important;
        }

        /* Target TradingView specific elements */
        .chart-main [data-name="legend"],
        .chart-main [class*="border"],
        .chart-main [class*="frame"],
        .chart-main [class*="container"],
        .chart-main [class*="chart-widget"],
        .chart-main [class*="tv-"],
        .chart-main table,
        .chart-main td,
        .chart-main tr {
          border: none !important;
          background: rgb(16, 16, 20) !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }

        /* Force override any remaining borders */
        .chart-main * {
          border-top: none !important;
          border-bottom: none !important;
          border-left: none !important;
          border-right: none !important;
          border-width: 0 !important;
        }
      `}</style>
    </div>
  );
}
