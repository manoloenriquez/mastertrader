import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { AdvancedChart } from "react-tradingview-embed";
import styled from "styled-components";
import { useMarket } from "../context/MarketContext";

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
              <span>0%</span>
              <svg className="dropdown-arrow" viewBox="0 0 24 24">
                <path d="M16 9v1.2L12 15l-4-4.8V9h8z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        <div className="controls-right">
          <div className="tradingview-alert-btn">
            <svg className="tv-icon" viewBox="0 0 24 24">
              <path d="M12 2l10 18H2L12 2z" fill="#0ECB81" />
            </svg>
            <span>TradingView Alert</span>
          </div>
          <svg className="control-icon" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 6l-7 7-3-3 1.41-1.41L10 12.17l5.59-5.59L17 8z"
              fill="currentColor"
            />
          </svg>
          <svg className="control-icon" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"
              fill="currentColor"
            />
          </svg>
          <svg className="control-icon" viewBox="0 0 24 24">
            <path
              d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"
              fill="currentColor"
            />
          </svg>
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
          padding: 6px 12px 4px;
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

        .tradingview-alert-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(14, 203, 129, 0.08);
          color: #0ecb81;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 10px;
          cursor: pointer;
          font-weight: 400;
        }

        .tv-icon {
          width: 10px;
          height: 10px;
          fill: currentColor;
        }

        .control-icon {
          width: 14px;
          height: 14px;
          fill: #adb1b8;
          cursor: pointer;
        }

        .control-icon:hover {
          fill: #b7bdc6;
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
