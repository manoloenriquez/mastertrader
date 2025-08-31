import { useEffect, useState } from "react";
import { OrderBookTicker } from "../types";

export default function useOrderBookTicker(symbol: string) {
  const [bids, setBids] = useState<
    { price: string; qty: string; sum: string }[]
  >([]);
  const [asks, setAsks] = useState<
    { price: string; qty: string; sum: string }[]
  >([]);

  useEffect(() => {
    const binanceWsUrl = "wss://fstream.binance.com/ws";
    const streamName = `${symbol.toLowerCase()}@bookTicker`;

    const newSocket = new WebSocket(`${binanceWsUrl}/${streamName}`);

    newSocket.onmessage = (message) => {
      // @ts-ignore
      const data = JSON.parse(message.data);

      const parsed = {
        symbol: symbol,
        bidPrice: data.b,
        bidQty: data.B,
        askPrice: data.a,
        askQty: data.A,
      };

      if (bids.length === 0) {
        setBids([
          { price: parsed.bidPrice, qty: parsed.bidQty, sum: parsed.bidQty },
          { price: parsed.bidPrice, qty: parsed.bidQty, sum: parsed.bidQty },
          { price: parsed.bidPrice, qty: parsed.bidQty, sum: parsed.bidQty },
          { price: parsed.bidPrice, qty: parsed.bidQty, sum: parsed.bidQty },
          { price: parsed.bidPrice, qty: parsed.bidQty, sum: parsed.bidQty },
          { price: parsed.bidPrice, qty: parsed.bidQty, sum: parsed.bidQty },
          { price: parsed.bidPrice, qty: parsed.bidQty, sum: parsed.bidQty },
          { price: parsed.bidPrice, qty: parsed.bidQty, sum: parsed.bidQty },
        ]);
      } else {
        let sum = 0;
        let data = [...bids, { price: parsed.bidPrice, qty: parsed.bidQty }]
          .slice(-8)
          .map(({ price, qty }) => {
            let parsedPrice = parseFloat(price);
            let parsedQty = parseFloat(qty);

            sum += parsedQty;

            return {
              price,
              qty,
              sum: sum.toFixed(3),
            };
          });

        setBids(data);
      }

      if (asks.length === 0) {
        setAsks([
          { price: parsed.askPrice, qty: parsed.askQty, sum: parsed.askQty },
          { price: parsed.askPrice, qty: parsed.askQty, sum: parsed.askQty },
          { price: parsed.askPrice, qty: parsed.askQty, sum: parsed.askQty },
          { price: parsed.askPrice, qty: parsed.askQty, sum: parsed.askQty },
          { price: parsed.askPrice, qty: parsed.askQty, sum: parsed.askQty },
          { price: parsed.askPrice, qty: parsed.askQty, sum: parsed.askQty },
          { price: parsed.askPrice, qty: parsed.askQty, sum: parsed.askQty },
          { price: parsed.askPrice, qty: parsed.askQty, sum: parsed.askQty },
        ]);
      } else {
        let sum = 0;
        let data = [...bids, { price: parsed.askPrice, qty: parsed.askQty }]
          .slice(-8)
          .map(({ price, qty }) => {
            let parsedPrice = parseFloat(price);
            let parsedQty = parseFloat(qty);

            sum += parsedQty;

            return {
              price,
              qty,
              sum: sum.toFixed(3),
            };
          });

        setAsks(data);
      }
    };

    return () => {
      newSocket.close();
    };
  }, [bids, asks]);

  return { bids, asks };
}
