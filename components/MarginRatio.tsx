import { useUser } from "@supabase/auth-helpers-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Tabs, Tab, Modal, Button, InputGroup, Form } from "react-bootstrap";
import { useMarket } from "../context/MarketContext";
import { CreateOrder } from "../types/database";
import { useData } from "../context/DataContext";
import SizeSlider from "./SizeSlider";
import PrefIcon from "./PrefIcon";
import { useRouter } from "next/router";
import { calculatePnl } from "../util/client";
import { useTheme } from "../context/ThemeContext";
import { atom, useAtom } from "jotai";

export const maintenanceAtom = atom(0);
export const ratioAtom = atom(0);
export const marginBalanceAtom = atom(0);

export default function MarginRatio() {
  const data = useData()!;
  const market = useMarket()!;
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const router = useRouter();
  const symbol = useMemo(
    () => router.query.coin ?? "BTCUSDT",
    [router.query.coin]
  );

  const [pnl, setPnl] = useState(0);

  const [maintenanceMargin, setMaintenanceMargin] = useAtom(maintenanceAtom);
  const [marginRatio, setMarginRatio] = useAtom(ratioAtom);
  const [marginBalance, setMarginBalance] = useAtom(marginBalanceAtom);

  const {
    data: { theme },
  } = useTheme();

  useEffect(() => {
    const map: { [key: string]: number } = {};

    market.marketTicker.forEach((data) => {
      map[data.s] = data.c;
    });

    setPrices({ ...prices, ...map });
  }, [market.marketTicker]);

  useEffect(() => {
    let totalMM = 0;
    let pnl = 0;

    console.log(data.positions);

    data.positions.forEach((position) => {
      const value = position.crypto_size * prices[position.symbol];

      const marginRatio = 1 / 100;
      const maintAmt = 0;

      totalMM += value * marginRatio - maintAmt;

      pnl += calculatePnl(
        position.direction === "long"
          ? position.crypto_size
          : -1 * position.crypto_size,
        parseFloat(position.entry),
        prices[position.symbol],
        0.0001
      );
    });

    setMaintenanceMargin(totalMM);
    setPnl(pnl);
  }, [data.positions, prices]);

  useEffect(() => {
    setMarginRatio((maintenanceMargin / (data.balance + pnl)) * 100);
    setMarginBalance(data.balance + pnl);
  }, [maintenanceMargin, pnl, data.balance]);

  return (
    <div
      className="container h-100 py-3"
      style={{
        borderLeft:
          theme === "light" ? "1px solid #e0e3eb" : "1px solid #2a2e39",
        color: theme === "light" ? "inherit" : "rgb(234, 236, 239)",
        fontSize: 12,
        background:
          theme === "light" ? "rgb(250, 250, 250)" : "rgb(16, 16, 20)",
        width: "min(100vw, 270px)",
      }}
    >
      <div className="d-flex flex-column mb-3">
        <div style={{ fontWeight: 500, fontSize: 14 }}>Margin Ratio</div>

        <div
          className="w-100 d-flex align-items-center justify-content-center my-3 py-1"
          style={{
            backgroundColor:
              theme === "light" ? "rgb(234, 236, 239)" : "rgb(71, 77, 87)",
            borderRadius: 2,
          }}
        >
          Single-Asset Mode
        </div>

        <div
          className="w-100 pb-3"
          style={{
            borderBottom:
              theme === "light"
                ? "1px solid rgb(238, 240, 242)"
                : "1px solid #2a2e39",
          }}
        >
          <div className="d-flex justify-content-between mb-1 align-items-center">
            <div>
              {/* {symbol} Perpetual{" "} */}
              USDT Cross
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="arrow"
              >
                <path
                  d="M16.5 8.49v2.25L12 15.51l-4.5-4.77V8.49h9z"
                  fill="#adb1b8"
                ></path>
              </svg>
            </div>
            <div>
              <svg
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.05044 7.05025C8.31719 5.7835 10.0672 5 12.0002 5C13.9332 5 15.6832 5.7835 16.9499 7.05025L18.3642 5.63604C16.7355 4.00736 14.4855 3 12.0002 3C9.51491 3 7.26491 4.00736 5.63623 5.63604L7.05044 7.05025Z"
                  fill="#f7a600"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16.9497 7.05044C18.2165 8.31719 19 10.0672 19 12.0002C19 13.9332 18.2165 15.6832 16.9497 16.9499L18.364 18.3642C19.9926 16.7355 21 14.4855 21 12.0002C21 9.51491 19.9926 7.26491 18.364 5.63623L16.9497 7.05044Z"
                  fill="#F6465D"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.05025 16.9496C5.7835 15.6828 5 13.9328 5 11.9998C5 10.0668 5.7835 8.31681 7.05025 7.05006L5.63604 5.63585C4.00736 7.26453 3 9.51453 3 11.9998C3 14.4851 4.00736 16.7351 5.63604 18.3638L7.05025 16.9496Z"
                  fill="#0ECB81"
                ></path>
              </svg>
              <span
                className={`${
                  marginRatio < 0 ? "text-danger" : "text-success"
                }`}
                style={{ fontSize: 18, fontWeight: 500 }}
              >
                {marginRatio !== undefined ? marginRatio.toFixed(2) : null}%
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <div className="label">Maintenance Margin</div>
            <div>{maintenanceMargin.toFixed(4)} USDT</div>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <div className="label">Margin Balance</div>
            <div>{marginBalance.toFixed(4)} USDT</div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <div style={{ fontWeight: 500, fontSize: 14 }}>Assets</div>
          <div>
            USDT{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="arrow"
            >
              <path
                d="M16.5 8.49v2.25L12 15.51l-4.5-4.77V8.49h9z"
                fill="#adb1b8"
              ></path>
            </svg>
          </div>
        </div>
        <div className="d-flex mx-0 my-3">
          <div
            className="d-flex align-items-center justify-content-center flex-grow-1 py-1"
            style={{
              backgroundColor:
                theme === "light" ? "rgb(234, 236, 239)" : "rgb(71, 77, 87)",
              borderRadius: 2,
            }}
          >
            Buy Crypto
          </div>
          <div
            className="d-flex align-items-center justify-content-center flex-grow-1 mx-2 py-1"
            style={{
              backgroundColor:
                theme === "light" ? "rgb(234, 236, 239)" : "rgb(71, 77, 87)",
              borderRadius: 2,
            }}
          >
            Convert
          </div>
          <div
            className="d-flex align-items-center justify-content-center flex-grow-1 py-1"
            style={{
              backgroundColor:
                theme === "light" ? "rgb(234, 236, 239)" : "rgb(71, 77, 87)",
              borderRadius: 2,
            }}
          >
            Transfer
          </div>
        </div>

        <div className="w-100">
          <div className="d-flex justify-content-between mb-1">
            <div className="label">Balance</div>
            <div>{data.balance.toFixed(4)} USDT</div>
          </div>

          <div
            className="d-flex justify-content-between pb-1"
            style={{
              borderBottom:
                theme === "light"
                  ? "1px solid rgb(238, 240, 242)"
                  : "1px solid #2a2e39",
            }}
          >
            <div className="label">Unrealized PNL</div>
            <div>{pnl.toFixed(4)} USDT</div>
          </div>

          <div className="d-flex justify-content-between mb-5">
            <div className="label">
              Asset Mode{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="info"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 21a9 9 0 100-18 9 9 0 000 18zM10.75 8.5V6h2.5v2.5h-2.5zm0 9.5v-7h2.5v7h-2.5z"
                  fill="#adb1b8"
                ></path>
              </svg>
            </div>
            <div>
              Single-Asset Mode{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="arrow"
              >
                <path
                  d="M16.5 8.49v2.25L12 15.51l-4.5-4.77V8.49h9z"
                  fill="#adb1b8"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .label {
          color: rgb(132, 142, 156);
        }

        div {
          white-space: nowrap;
        }

        .info {
          box-sizing: border-box;
          margin: 0px 0px 0px 6px;
          min-width: 0px;
          color: currentcolor;
          font-size: 16px;
          fill: currentcolor;
          width: 1em;
          height: 1em;
        }

        .arrow {
          box-sizing: border-box;
          margin: 0px 0px 0px 4px;
          min-width: 0px;
          color: rgb(132, 142, 156);
          font-size: 16px;
          fill: rgb(132, 142, 156);
          width: 1em;
          height: 1em;
        }
      `}</style>
    </div>
  );
}
