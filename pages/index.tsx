import Layout from "../components/Layout";
import HistoryOrder from "../components/HistoryOrder";
import MarketTrade from "../components/MarketTrade";
import OrderBook from "../components/OrderBook";
import DynamicTVSDark from "../components/DynamicTVSDark";
import PriceHeader from "../components/PriceHeader";
import MarginRatio from "../components/MarginRatio";
import Trades from "../components/Trades";
import BottomTicker from "../components/BottomTicker";
import { useTheme } from "../context/ThemeContext";
import DynamicTVS from "../components/DynamicTVS";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

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

export default function Home() {
  const theme = useTheme();

  return (
    <Layout>
      <div
        className="container-fluid no-fluid px-0 pb-4"
        style={{
          maxWidth: "100vw",
          overflowX: "hidden",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div className="d-flex" style={{ height: "100%", overflow: "hidden" }}>
          {/* Left Side: Main Content */}
          <div
            className="flex-grow-1 d-flex flex-column"
            style={{ overflow: "hidden" }}
          >
            {/* First Row: Price Header */}
            <div className="price-header-section">
              <PriceHeader />
            </div>

            {/* Second Row: Chart and Order Book */}
            <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>
              <div className="flex-grow-1 d-flex chart-section">
                {theme.data.theme === "light" ? (
                  <DynamicTVS />
                ) : (
                  <DynamicTVSDark />
                )}
              </div>
              <div
                className="h-100 d-flex flex-column orderbook-section"
                style={{
                  width: "clamp(250px, 20vw, 270px)",
                  minWidth: "250px",
                  flexShrink: 0,
                }}
              >
                <OrderBook />
                {/* <Trades /> */}
              </div>
            </div>

            {/* Third Row: History/Positions Table */}
            <div
              className="history-section"
              style={{ overflow: "auto", maxHeight: "30vh" }}
            >
              <HistoryOrder />
            </div>
          </div>

          {/* Right Side: Trade Panel (spans full height) */}
          <div
            className="trade-panel-section d-flex flex-column"
            style={{
              width: "clamp(270px, 20vw, 300px)",
              minWidth: "270px",
              flexShrink: 0,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <MarketTrade />
          </div>
        </div>
      </div>

      <style jsx>{`
        #charts-container {
          background: ${theme.data.theme === "light"
            ? "#fff"
            : "rgb(16, 16, 20)"};
        }

        .container-fluid {
          background: ${theme.data.theme === "light"
            ? "#fff"
            : "#0b0e11"} !important;
          padding: 0;
          height: 100vh;
          overflow: hidden;
        }

        .row {
          margin: 0;
          background: ${theme.data.theme === "light" ? "#fff" : "#0b0e11"};
        }

        body {
          background: ${theme.data.theme === "light"
            ? "#fff"
            : "#0b0e11"} !important;
          overflow: hidden;
          height: 100vh;
        }

        /* Responsive layout adjustments */
        @media (max-width: 1400px) {
          .orderbook-section {
            width: clamp(200px, 18vw, 250px) !important;
            min-width: 200px !important;
          }
          .trade-panel-section {
            width: clamp(260px, 18vw, 280px) !important;
            min-width: 260px !important;
          }
        }

        @media (max-width: 1200px) {
          .orderbook-section {
            width: clamp(180px, 15vw, 220px) !important;
            min-width: 180px !important;
          }
          .trade-panel-section {
            width: clamp(250px, 15vw, 270px) !important;
            min-width: 250px !important;
          }
        }

        @media (max-width: 1024px) {
          .orderbook-section {
            width: clamp(160px, 12vw, 200px) !important;
            min-width: 160px !important;
          }
          .trade-panel-section {
            width: clamp(240px, 12vw, 260px) !important;
            min-width: 240px !important;
          }
        }

        /* Section borders - matching Bybit layout */
        .price-header-section {
          border-bottom: ${theme.data.theme === "light"
            ? "1px solid rgb(238, 240, 242)"
            : "1px solid #000000"};
          background: ${theme.data.theme === "light"
            ? "#fff"
            : "rgb(16, 16, 20)"};
        }

        /* Layout structure and borders */
        .chart-section {
          border-right: ${theme.data.theme === "light"
            ? "1px solid rgb(238, 240, 242)"
            : "3px solid #000000"};
          background: ${theme.data.theme === "light"
            ? "#fff"
            : "rgb(16, 16, 20)"};
        }

        .orderbook-section {
          background: ${theme.data.theme === "light"
            ? "#fff"
            : "rgb(16, 16, 20)"};
        }

        .trade-panel-section {
          border-left: ${theme.data.theme === "light"
            ? "1px solid rgb(238, 240, 242)"
            : "3px solid #000000"};
          background: ${theme.data.theme === "light"
            ? "#fff"
            : "rgb(16, 16, 20)"};
        }

        .history-section {
          border-top: ${theme.data.theme === "light"
            ? "1px solid rgb(238, 240, 242)"
            : "2px solid #000000"};

          background: ${theme.data.theme === "light"
            ? "#fff"
            : "rgb(16, 16, 20)"};
        }
      `}</style>

      {/* Bottom Ticker */}
      <BottomTicker />
    </Layout>
  );
}
