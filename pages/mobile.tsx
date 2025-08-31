import { height } from "@mui/system";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { calculatePnl, formatPrice } from "../util/client";
import { useMarket } from "../context/MarketContext";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface PositionProps {
  symbol: string;
  margin_mode: string;
  size: number;
  entry: string;
  direction: "long" | "short";
  price: number;
  leverage: number;
  balance: number;
  marginRatio: number;
  positionId: string;
}

const colorGreen = "rgb(48, 190, 130)";
const colorRed = "rgb(246, 70, 93)";

const TabHead = ({ positions, orders }: any) => {
  return (
    <div className="container d-flex justify-content-between border-bottom">
      <div className="d-flex py-2">
        <span className="mr-4">Open Orders ({orders.length})</span>
        <span>Positions ({positions.length})</span>
      </div>

      <style jsx>{`
        * {
          border-color: rgb(51, 58, 69) !important;
        }

        span {
          font-weight: 500;
          font-size: 1.1em;
        }
      `}</style>
    </div>
  );
};

const PositionsHead = () => {
  return (
    <div className="row container mx-auto px-0 border-bottom align-items-center py-2">
      <div className="d-flex align-items-center col-9 px-0">
        <div className="circle"></div>
        <span className="ml-3">Hide Other Symbols</span>
      </div>
      <button className="btn btn-secondary col-3 ml-3">Close All</button>

      <style jsx>{`
        * {
          border-color: rgb(51, 58, 69) !important;
        }

        .circle {
          --size: 1em;

          width: var(--size);
          height: var(--size);

          border: 1px solid rgb(51, 58, 59);
          border-radius: 100%;

          background: rgb(43, 49, 60);
        }
      `}</style>
    </div>
  );
};

const Position = ({
  symbol,
  margin_mode,
  entry,
  size,
  direction,
  price,
  leverage,
  balance,
  marginRatio,
  positionId,
}: PositionProps) => {
  const margin = (size * price) / leverage;
  const pnl = calculatePnl(
    direction === "long" ? size : -1 * size,
    parseFloat(entry),
    price,
    0
  );
  const roe = (pnl / margin) * 100;
  const supabase = useSupabaseClient();
  const user = useUser();

  function calculateLiq(
    size: number,
    entry: number,
    leverage: number,
    direction: "long" | "short"
  ) {
    return direction === "short"
      ? entry * (1 + 0.8 / leverage)
      : entry * (1 - 0.8 / leverage);
  }

  function calculateCrossLiq() {
    return direction === "short"
      ? parseFloat(entry) * (1 + (0.8 * balance) / (parseFloat(entry) * size))
      : parseFloat(entry) * (1 - (0.8 * balance) / (parseFloat(entry) * size));
  }

  async function closePosition(positionId: string) {
    console.log(balance + pnl);
    try {
      const [result1, result2] = (await Promise.all([
        supabase.from("positions").delete().eq("id", positionId),
        supabase
          .from("users")
          .update({ balance: balance + pnl })
          .eq("id", user.id)
          .select(),
      ])) as [PostgrestSingleResponse<any[]>, PostgrestSingleResponse<any[]>];

      if (result1.error) {
        throw result1.error;
      }

      if (result2.error) {
        throw result2.error;
      }

      console.log(result2);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="d-flex flex-column border-bottom py-2">
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <span className="direction">{direction === "long" ? "B" : "S"}</span>
          <span className="symbol">{symbol} Perpetual</span>
          <span className="label mx-1">
            {margin_mode.charAt(0).toUpperCase() + margin_mode.slice(1)}{" "}
            {leverage}x
          </span>
          <span className="ml-2">
            <img src="/mobile/idk.PNG" alt="" />
          </span>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            id="share"
            className="mr-1"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.5 10a3.5 3.5 0 10-3.476-3.09L8.62 9.216a3.5 3.5 0 100 5.568l4.403 2.306a3.5 3.5 0 101.16-2.214L9.94 12.652a3.52 3.52 0 000-1.304l4.245-2.224A3.487 3.487 0 0016.5 10z"
              fill="#adb1b8"
            ></path>
          </svg>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <span className="label pnl-label">PNL (USDT)</span>
          <span className="pnl">
            {pnl.toLocaleString("en-us", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="d-flex flex-column">
          <span className="text-right label pnl-label">ROE</span>
          <span className="roe">
            {roe > 0 ? "+" : null}
            {roe.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="my-3 row">
        <div className="d-flex flex-column col-4">
          <span className="label pnl-label">Size ({symbol.slice(0, -4)})</span>
          <span>{size.toLocaleString("en-us")}</span>
        </div>

        <div className="d-flex flex-column col-4">
          <span className="label">Margin (USDT)</span>
          <span>
            {margin.toLocaleString("en-us", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="d-flex flex-column col-4">
          <span className="text-right label">Risk</span>
          <span className="text-right text-success">
            {marginRatio.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="row">
        <div className="d-flex flex-column col-4">
          <span className="label entry-label">Entry Price (USDT)</span>
          <span>{formatPrice(parseFloat(entry), entry)}</span>
        </div>

        <div className="d-flex flex-column col-4">
          <span className="label">Mark Price (USDT)</span>
          <span>
            {price && formatPrice(parseFloat(price.toString()), entry)}
          </span>
        </div>
        <div className="d-flex flex-column text-right col-4">
          <span className="label">Liq. Price (USDT)</span>
          <span>
            {price &&
              formatPrice(
                margin_mode === "isolated"
                  ? calculateLiq(size, parseFloat(entry), leverage, direction)
                  : calculateCrossLiq(),
                price.toString()
              )}
          </span>
        </div>
      </div>

      {/* <div className="d-flex">
        <span>TP/SL</span>
        <span className="mx-3"> / 4.950</span>
        <span>X</span>
      </div> */}

      <div className="d-flex justify-content-between mx-1 my-3">
        <div className="btn-container">
          <button className="btn btn-secondary m-0">Adjust Leverage</button>
        </div>
        <div className="btn-container">
          <button className="btn btn-secondary m-0">Stop Profit & Loss</button>
        </div>
        <div className="btn-container">
          <button className="btn btn-secondary m-0">Close Position</button>
        </div>
      </div>

      <style jsx>{`
        .pnl {
          color: ${pnl > 0 ? colorGreen : colorRed};
        }

        .roe {
          color: ${roe > 0 ? colorGreen : colorRed};
        }

        .entry-label,
        .pnl-label {
          text-decoration: underline rgb(132, 142, 156) dashed;
        }

        .my-3 {
          margin-top: 1em !important;
          margin-bottom: 1em !important;
        }

        .mb-3 {
          margin-bottom: 1em !important;
        }

        .direction {
          background-color: ${direction === "long" ? colorGreen : colorRed};

          --size: 1.5em;
          display: inline-block;
          width: var(--size);
          height: var(--size);
          text-align: center;
        }

        .symbol {
          font-weight: 500;
          font-size: 1.2em;
          margin: 0 0.5em;
        }

        .pnl,
        .roe {
          font-size: 1.4em;
          font-weight: 500;
        }

        .label {
          color: rgb(132, 142, 156) !important;
        }

        #share {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          color: rgb(132, 142, 156);
          font-size: 16px;
          fill: rgb(132, 142, 156);
          cursor: pointer;
          width: 1em;
          height: 1em;
        }

        img {
          width: auto;
          height: 1.5em;
        }

        * {
          border-color: rgb(51, 58, 69) !important;
        }

        .btn-secondary {
          font-size: 0.95em !important;
          width: 100%;
          letter-spacing: 0.2px;
          background: rgb(51, 58, 72);
          border-radius: 4px;
          height: 2.5em;
        }

        .btn-container {
          width: 30%;
        }
      `}</style>
    </div>
  );
};

const Nav = () => {
  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <span>
          <img src="/mobile/homeicon.PNG" alt="" />
        </span>
        <span>Home</span>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <span>
          <img src="/mobile/marketsicon.PNG" alt="" />
        </span>
        <span>Markets</span>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <span>
          <img src="/mobile/tradeicon.PNG" alt="" />
        </span>
        <span>Trade</span>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <span>
          <img src="/mobile/futuresicon.PNG" alt="" />
        </span>
        <span>Futures</span>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <span>
          <img src="/mobile/walletsicon.PNG" alt="" />
        </span>
        <span>Wallets</span>
      </div>

      <style jsx>{`
        img {
          --size: 28px;

          height: var(--size);
          width: var(--size);

          object-fit: cover;
        }

        * {
          border-color: rgb(51, 58, 69) !important;
        }
      `}</style>
    </div>
  );
};

export default function Mobile() {
  const user = useUser();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const market = useMarket();

  // useEffect(() => {
  //   // if (!user) {
  //   //   router.push("/login");
  //   // }
  //   console.log(user);
  // }, [user]);

  const { orders, positions, balance, avblBalance } = useData()!;
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  async function closeAllPositions() {
    try {
      const result = await supabase
        .from("positions")
        .delete()
        .eq("user_id", user.id);

      if (result.error) {
        throw result.error;
      }

      let pnl = 0;

      positions.forEach((position) => {
        pnl += calculatePnl(
          position.direction === "long"
            ? position.crypto_size
            : -1 * position.crypto_size,
          parseFloat(position.entry),
          prices[position.symbol],
          0.0001
        );
      });

      console.log(pnl);

      const [result1, result2] = (await Promise.all([
        supabase.from("positions").delete().eq("user_id", user.id),
        supabase
          .from("users")
          .update({ balance: balance + pnl })
          .eq("id", user.id),
      ])) as [PostgrestSingleResponse<any[]>, PostgrestSingleResponse<any[]>];
      console.log(result2);
      if (result1.error) {
        throw result1.error;
      }

      if (result2.error) {
        throw result2.error;
      }
    } catch (e) {
      console.error(e);
    }
  }

  function calculateMarginRatio() {
    // const pnl = calculatePnl(size, entry, price);

    // const margin = (size * entry) / leverage;

    // const equity = size * entry + pnl;
    // const used = (size * (size * entry) * entry) / leverage;

    // return (equity / used) * 100;
    // const ratio = (size * entry) / (size * price * leverage);
    // const ratio = margin / balance;

    const ratio = (balance - avblBalance) / balance;

    return (ratio / 8) * 100;
  }

  useEffect(() => {
    const map: { [key: string]: number } = {};

    market.marketTicker.forEach((data) => {
      map[data.s] = data.c;
    });

    setPrices({ ...prices, ...map });
  }, [market.marketTicker]);

  if (!user) {
    return <div></div>;
  }

  return (
    <div id="mobile" className="vw-100 d-flex flex-column">
      <div
        className="container flex-grow-1 px-0 d-flex flex-column position-relative mb-5"
        style={{ maxWidth: 390 }}
      >
        <TabHead orders={orders} positions={positions} />
        <div className="container">
          <PositionsHead />
          {/* {[...Array(15)].map((_, idx) => (
            <Position symbol="LINKUSDT" margin_mode="Cross" key={idx} />
          ))} */}

          {positions.map((position, idx) => (
            <Position
              key={position.id}
              size={position.crypto_size}
              price={prices[position.symbol]}
              balance={balance}
              marginRatio={calculateMarginRatio()}
              positionId={position.id}
              {...position}
            />
          ))}
        </div>

        <div id="nav" className="container mt-auto">
          <Nav />
        </div>
      </div>

      <style jsx>{`
        #mobile {
          background-color: rgb(31, 38, 48);

          font-size: 12px;
          min-height: 100vh;
          position: relative;
        }

        #nav {
          position: fixed;
          bottom: 0;
          max-width: 390px;
          background-color: rgb(31, 38, 48);
        }

        * {
          border-color: rgb(51, 58, 69) !important;
        }
      `}</style>

      <style jsx global>{`
        .btn {
          font-size: 1em !important;
          font-weight: 400 !important;
        }

        .text-success {
          color: rgb(94, 186, 137) !important;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
