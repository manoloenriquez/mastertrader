import { useEffect, useState } from "react";
import { MarketTicker } from "../types";

export default function useMarketTicker() {
  const [marketTicker, setMarketTicker] = useState<MarketTicker[]>([]);

  useEffect(() => {
    const binanceWsUrl = "wss://fstream.binance.com/ws";
    const streamName = "!ticker@arr";

    const newSocket = new WebSocket(`${binanceWsUrl}/${streamName}`);

    newSocket.onmessage = (message) => {
      // @ts-ignore
      const data = JSON.parse(message.data);
      // setPriceData(data);
      setMarketTicker(data);
    };

    return () => {
      newSocket.close();
    };
  }, []);

  return marketTicker;
}
