import { useEffect, useState } from "react";

export default function useAggTrades(symbol: string) {
  const [trades, setTrades] = useState<
    { price: string; amount: string; time: Date }[]
  >([]);

  useEffect(() => {
    const binanceWsUrl = "wss://fstream.binance.com/ws";
    const streamName = `${symbol.toLowerCase()}@aggTrade`;

    const newSocket = new WebSocket(`${binanceWsUrl}/${streamName}`);

    newSocket.onmessage = (message) => {
      // @ts-ignore
      const data = JSON.parse(message.data);

      if (trades.length === 0) {
        setTrades([
          {
            price: data.p,
            amount: data.q,
            time: new Date(data.T),
          },
          {
            price: data.p,
            amount: data.q,
            time: new Date(data.T),
          },
          {
            price: data.p,
            amount: data.q,
            time: new Date(data.T),
          },
          {
            price: data.p,
            amount: data.q,
            time: new Date(data.T),
          },
          {
            price: data.p,
            amount: data.q,
            time: new Date(data.T),
          },
          {
            price: data.p,
            amount: data.q,
            time: new Date(data.T),
          },
          {
            price: data.p,
            amount: data.q,
            time: new Date(data.T),
          },
          {
            price: data.p,
            amount: data.q,
            time: new Date(data.T),
          },
        ]);
      } else {
        setTrades([
          ...trades,
          { price: data.p, amount: data.q, time: new Date(data.T) },
        ]);
      }
    };

    return () => {
      newSocket.close();
    };
  }, [trades]);

  return { trades };
}
