import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { AdvancedChart } from "react-tradingview-embed";
import styled from "styled-components";

export default function TradingChart() {
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState("30m");
  const [chartKey, setChartKey] = useState(Date.now());

  const symbol = useMemo(
    () => router.query.coin ?? "BTCUSDT",
    [router.query.coin]
  );

  const timeframes = [
    { label: "1s", value: "1S" },
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "30m", value: "30m" },
    { label: "1h", value: "1h" },
    { label: "4h", value: "4h" },
    { label: "1d", value: "1D" },
    { label: "1w", value: "1W" },
    { label: "1M", value: "1M" },
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
              <span>0%</span>
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
              width="14"
              height="14"
              className="tv-self-bar__webhook-switch-img"
              viewBox="0 0 24 24"
              fill="#0ecb81"
              style={{
                width: "14px",
                height: "14px",
              }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div
              className="t-s-b__wh-swt-content"
              style={{
                color: "var(--bds-gray-t2)",
                fontSize: "12px",
                fontWeight: 400,
                whiteSpace: "nowrap",
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
              width: "28px",
              height: "28px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#71757a">
              <path d="M4 4h16v12H4V4zm2 2v8h12V6H6zm11 11v2h2v2H3v-2h2v-2h12zM7 8h10v6H7V8z" />
            </svg>
          </div>

          {/* Settings Icon */}
          <div
            className="cursor-pointer tv-self-bar--icon tv-self-bar--m-l-8"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#71757a">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
            </svg>
          </div>

          {/* Fullscreen Icon */}
          <div
            className="tv-self-bar--icon tv-self-bar--m-l-8 cursor-pointer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#71757a">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart Content Area */}
      <div className="chart-content">
        {/* Left Sidebar Tools */}
        <div className="chart-sidebar">
          {/* Cursor Tool */}
          <div className="sidebar-tool active">
            <svg viewBox="0 0 24 24">
              <path
                d="M13.64 21.97c-.21 0-.42-.07-.59-.22L7.98 17.7c-.33-.29-.37-.8-.08-1.13.29-.33.8-.37 1.13-.08l4.51 3.7c.33.29.37.8.08 1.13-.16.18-.37.28-.58.28l.52.37z"
                fill="currentColor"
              />
              <path
                d="M5.5 9.5v10l3.5-3 3.5 3.5 8-11.5-15 1z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Trend Line Tool */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path
                d="M22 6l-10 8L8 10l-6 4v1l6-4 4 4 10-8V6z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Horizontal Line Tool */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path d="M3 11h18v2H3z" fill="currentColor" />
            </svg>
          </div>

          {/* Vertical Line Tool */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path d="M11 3h2v18h-2z" fill="currentColor" />
            </svg>
          </div>

          {/* Rectangle Tool */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <rect
                x="3"
                y="6"
                width="18"
                height="12"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Text Tool */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path d="M5 5v3h3v9h2V8h3V5H5z" fill="currentColor" />
            </svg>
          </div>

          {/* Brush Tool */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path
                d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Price Alert Tool */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 2l-2 9h4l-2-9zm1 14.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Settings */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Layers */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path
                d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Hide/Show */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Lock */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path
                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Trash */}
          <div className="sidebar-tool">
            <svg viewBox="0 0 24 24">
              <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

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
              theme: "light",
              symbol: `${symbol}.P`,
              toolbar_bg: "#ffffff",
              height: "100%",
              enable_publishing: false,
              save_image: false,
              hide_top_toolbar: true,
              hide_side_toolbar: false,
              interval: selectedTimeframe,
              style: "1",
              backgroundColor: "#ffffff",
              gridColor: "#e5e7eb",
              locale: "en",
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
          padding: 12px 16px;
          border-bottom: 1px solid #2b3139;
        }

        .main-tabs {
          display: flex;
          gap: 32px;
        }

        .main-tab {
          font-size: 14px;
          color: #adb1b8;
          cursor: pointer;
          padding: 8px 0;
          position: relative;
          font-weight: 500;
        }

        .main-tab.active {
          color: #eaecef;
        }

        .main-tab.active::after {
          content: "";
          position: absolute;
          bottom: -12px;
          left: 0;
          right: 0;
          height: 2px;
          background: #f7a600;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .control-tab {
          font-size: 12px;
          color: #adb1b8;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 2px;
        }

        .control-tab.active {
          color: #f7a600;
          background: rgba(240, 185, 11, 0.1);
        }

        .header-icons {
          display: flex;
          gap: 8px;
          margin-left: 16px;
        }

        .header-icon {
          width: 16px;
          height: 16px;
          fill: #adb1b8;
          cursor: pointer;
        }

        .header-icon:hover {
          fill: #eaecef;
        }

        .chart-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          border-bottom: 1px solid #2b3139;
          background: rgb(16, 16, 20);
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .time-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .time-btn {
          font-size: 12px;
          color: #adb1b8;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 2px;
          font-weight: 400;
        }

        .time-btn.active {
          color: #f7a600;
          background: rgba(240, 185, 11, 0.1);
        }

        .time-btn:hover:not(.active) {
          color: #eaecef;
        }

        .control-buttons {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #adb1b8;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 2px;
        }

        .control-btn:hover {
          color: #eaecef;
        }

        .dropdown-arrow {
          width: 10px;
          height: 10px;
          fill: currentColor;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 12px;
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
          --bds-trans-hover: rgba(56, 68, 82, 0.06);
          --bds-gray-t2: #81858c;
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

        .tv-self-bar--m-l-8 {
          margin-left: 8px;
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
          background: #ffffff !important;
          height: 100%;
          border: none !important;
          outline: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .chart-main iframe {
          border: none !important;
          outline: none !important;
          background: #ffffff !important;
        }

        .chart-main div,
        .chart-main canvas,
        .chart-main > * {
          border: none !important;
          outline: none !important;
          background-color: #ffffff !important;
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
          background: #ffffff !important;
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
