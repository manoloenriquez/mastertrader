import { useUser } from "@supabase/auth-helpers-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Socket } from "socket.io";
import { io } from "socket.io-client";
import useMarketTicker from "../hooks/useMarketTicker";
import useSymbolTicker from "../hooks/useSymbolTicker";
import { MarketTicker, SymbolTicker } from "../types";
import { useRouter } from "next/router";
import useOrderBookTicker from "../hooks/useOrderBookTicker";
import useAggTrades from "../hooks/useAggTrades";

const Context = createContext<{
  symbolTicker: SymbolTicker;
  marketTicker: MarketTicker[];
  orderBookTicker: {
    bids: {
      price: string;
      qty: string;
      sum: string;
    }[];
    asks: {
      price: string;
      qty: string;
      sum: string;
    }[];
  };
  aggTrades: {
    trades: {
      price: string;
      amount: string;
      time: Date;
    }[];
  };
  symbol: string;
} | null>(null);

export const MarketProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const symbol: string = useMemo(
    () => (router.query.coin as string) ?? "BTCUSDT",
    [router.query.coin]
  );
  const marketTicker = useMarketTicker();
  const symbolTicker = useSymbolTicker(symbol);
  const orderBookTicker = useOrderBookTicker(symbol);
  const aggTrades = useAggTrades(symbol);

  useEffect(() => {
    console.log(symbol);
  }, []);

  return (
    <Context.Provider
      value={{ symbolTicker, marketTicker, orderBookTicker, aggTrades, symbol }}
    >
      {children}
    </Context.Provider>
  );
};

export const useMarket = () => useContext(Context);
