import { useEffect, useState } from "react";
import { SymbolTicker } from "../types";

export default function useSymbolTicker(symbol: string) {
  const [symbolTicker, setSymbolTicker] = useState<SymbolTicker>({
    symbol: symbol,
    markPrice: "0",
  });
  const [lastPrice, setLastPrice] = useState<string>("0");
  const [high, setHigh] = useState<string>("0");
  const [low, setLow] = useState<string>("0");
  const [change, setChange] = useState<number>(0);
  const [changePercentage, setChangePercentage] = useState<number>(0);
  const [prevPrice, setPrevPrice] = useState<string>("0");

  useEffect(() => {
    const binanceWsUrl = "wss://fstream.binance.com/ws";
    const streamName = `${symbol.toLowerCase()}@ticker`;

    const newSocket = new WebSocket(`${binanceWsUrl}/${streamName}`);

    newSocket.onmessage = (message) => {
      // @ts-ignore
      const data = JSON.parse(message.data);
      // console.log(lastPrice);
      // setPrevPrice(parseFloat(data.c));

      setPrevPrice(lastPrice);
      setLastPrice(data.c);
      setHigh(data.h);
      setLow(data.l);
      setChange(parseFloat(data.p));
      setChangePercentage(parseFloat(data.P));
    };

    const newSocket2 = new WebSocket(
      `${binanceWsUrl}/${symbol.toLowerCase()}@markPrice@1s`
    );

    newSocket2.onmessage = (message) => {
      // @ts-ignore
      const data = JSON.parse(message.data);
      setSymbolTicker({
        symbol: symbol,
        markPrice: data.p,
        indexPrice: data.i,
        fundingRate: parseFloat(data.r),
        fundingTime: data.T,
      });
    };

    return () => {
      newSocket.close();
      newSocket2.close();
    };
  }, [lastPrice]);

  return {
    ...symbolTicker,
    lastPrice,
    high,
    low,
    change,
    changePercentage,
    prevPrice,
  };
}
