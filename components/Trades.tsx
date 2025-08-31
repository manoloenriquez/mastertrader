import React, { useMemo } from "react";
import type { Orderbook } from "../types";
import { useMarket } from "../context/MarketContext";
import { useRouter } from "next/router";
import { formatPrice } from "../util/client";
import { useTheme } from "../context/ThemeContext";

interface Props {
  orderbook: Orderbook;
}

export default function Trades() {
  const router = useRouter();
  const asset = useMemo(
    () => (router.query.coin as string) ?? "BTCUSDT",
    [router.query.coin]
  );

  const market = useMarket();
  const {
    data: { theme },
  } = useTheme();

  return (
    <div className="order-book trades">
      <div className="trades-header">
        <h2 className="heading" style={{ fontWeight: 500 }}>
          Trades
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th>Price(USDT)</th>
              <th>Amount({asset.slice(0, -4)})</th>
              <th className="text-right">Time</th>
            </tr>
          </thead>
        </table>
      </div>
      <table className="table">
        <tbody>
          {market.aggTrades.trades.reverse().map((trade, idx) => (
            <tr key={idx}>
              <td className="text-danger">
                {/* {formatPrice(parseFloat(trade.price))} */}
                {trade.price}
              </td>
              <td>{trade.amount}</td>
              <td>
                {trade.time.getHours().toString().padStart(2, "0")}:
                {trade.time.getMinutes().toString().padStart(2, "0")}:
                {trade.time.getSeconds().toString().padStart(2, "0")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .css-3kwgah {
          color: rgb(132, 142, 156);
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          font-size: 24px;
          fill: currentcolor;
          width: 1em;
          height: 1em;
        }

        .css-1tjoogw {
          box-sizing: border-box;
          margin: 0px 0px 0px 5px px;
          min-width: 0px;
          font-size: 16px;
          fill: currentcolor;
          color: rgb(132, 142, 156);
          width: 1em;
          height: 1em;
        }

        .trades {
          overflow-y: auto;
          height: 235.79px;
          position: relative;
          background-color: transparent;
        }

        .trades-header {
          position: sticky;
          top: 0;
          background: ${theme === "light"
            ? "rgb(255, 255, 255)"
            : "rgb(16, 16, 20)"};
        }

        tr {
          display: flex;
          padding: 0 0.8rem;
          border-bottom: none !important;
        }

        td,
        th {
          width: initial !important;
          table-layout: fixed;

          padding: 0 !important;
          flex: 1;
        }

        thead > tr {
          padding-bottom: 0.5rem;
          border-bottom: none !important;
        }

        td:not(:nth-child(1)) {
          text-align: right;
        }
      `}</style>
    </div>
  );
}
