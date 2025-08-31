import {
  CancelOrder,
  CreateOrder,
  CreatePosition,
  Order,
  Position,
  User,
} from "./../../types/database";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { calculatePnl } from "../../util/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  try {
    const [pricesTicker, symbolsData, orders, users] = (await Promise.all([
      fetch("https://testnet.binancefuture.com/fapi/v1/ticker/price").then(
        (result) => result.json()
      ),
      fetch("https://testnet.binancefuture.com/fapi/v1/premiumIndex").then(
        (result) => result.json()
      ),
      supabase
        .from("orders")
        .select()
        .eq("status", "pending")
        .returns<Order[]>(),
      supabase.from("users").select().returns<User[]>(),
    ])) as [
      { symbol: string; price: string }[],
      { symbol: string; markPrice: string }[],
      PostgrestSingleResponse<Order[]>,
      PostgrestSingleResponse<User[]>
    ];

    if (orders.error) {
      throw orders.error;
    }

    if (users.error) {
      throw users.error;
    }

    const dataMap: {
      [key: string]: { markPrice: number; price: number; symbol: string };
    } = {};

    for (
      let i = 0;
      i < Math.max(pricesTicker.length, symbolsData.length);
      i++
    ) {
      if (i < pricesTicker.length) {
        const ticker = pricesTicker[i];
        dataMap[ticker.symbol] = {
          ...dataMap[ticker.symbol],
          symbol: ticker.symbol,
          price: parseFloat(ticker.price),
        };
      }

      if (i < symbolsData.length) {
        const symbolData = symbolsData[i];
        dataMap[symbolData.symbol] = {
          ...dataMap[symbolData.symbol],
          symbol: symbolData.symbol,
          markPrice: parseFloat(symbolData.markPrice),
        };
      }
    }

    const balancesMap: { [key: string]: number } = {};

    users.data.forEach((user) => {
      balancesMap[user.id] = user.balance;
    });

    // const orders = await supabase
    //   .from("orders")
    //   .select()
    //   .eq("status", "pending")
    //   .returns<Order[]>();

    // const balances = await supabase.from("users").select().returns<User[]>();

    if (orders.error) {
      throw orders.error;
    }

    const updateQueue: Promise<unknown>[] = [];

    orders.data.forEach((order) => {
      if (order.entry) {
        if (
          order.direction === "long" &&
          parseFloat(order.entry) < dataMap[order.symbol].price &&
          !order.is_market
        )
          return;
        if (
          order.direction === "short" &&
          parseFloat(order.entry) > dataMap[order.symbol].price &&
          !order.is_market
        )
          return;

        // Create position
        let request: CreatePosition = {
          user_id: order.user_id,
          margin: order.margin,
          crypto_size: order.crypto_size,
          usd_size: order.usd_size,
          margin_mode: order.margin_mode,
          leverage: order.leverage,
          entry: !order.is_market
            ? dataMap[order.symbol].price.toString()
            : order.entry,
          stop: order.stop,
          profit: order.profit,
          symbol: order.symbol,
          direction: order.direction,
          stop_basis: order.stop_basis,
          profit_basis: order.profit_basis,
        };

        const execute = new Promise(async (resolve, reject) => {
          const positionResponse = await supabase
            .from("positions")
            .insert<CreatePosition>(request)
            .select()
            .returns<Position>();

          if (positionResponse.error) {
            reject(positionResponse.error);
            return;
          }

          const positionId = positionResponse.data.id;

          const orderResponse = await supabase
            .from("orders")
            .update({
              position_id: positionId,
              status: "filled",
            })
            .eq("id", order.id)
            .select()
            .returns<Order>();

          if (orderResponse.error) {
            reject(orderResponse.error);
            return;
          }

          resolve({
            order: orderResponse.data,
            position: positionResponse.data,
          });
        });

        updateQueue.push(execute);
      } else if (order.stop) {
        if (
          (order.direction === "long" &&
            order.stop > dataMap[order.symbol].markPrice) ||
          (order.direction === "short" &&
            order.stop < dataMap[order.symbol].markPrice)
        ) {
          return;
        }

        // Delete position
        const execute = new Promise(async (resolve, reject) => {
          const pnl = calculatePnl(
            order.crypto_size,
            parseFloat(order.entry),
            dataMap[order.symbol].price,
            0.0001
          );

          balancesMap[order.user_id] += pnl;

          await supabase.from("positions").delete().eq("id", order.position_id);
        });

        updateQueue.push(execute);
      } else if (order.profit) {
        if (
          (order.direction === "long" &&
            order.profit > dataMap[order.symbol].price) ||
          (order.direction === "short" &&
            order.profit < dataMap[order.symbol].price)
        ) {
          return;
        }

        // Delete position
        const execute = new Promise(async (resolve, reject) => {
          const pnl = calculatePnl(
            order.crypto_size,
            parseFloat(order.entry),
            dataMap[order.symbol].price,
            0.0001
          );

          balancesMap[order.user_id] += pnl;

          await supabase.from("positions").delete().eq("id", order.position_id);
        });

        updateQueue.push(execute);
      }
    });

    // Update balances
    // Object.keys(balancesMap).map((userId) => {
    //   updateQueue.push(
    //     new Promise(async (resolve, reject) => {
    //       const response = await supabase
    //         .from("users")
    //         .update({ balance: balancesMap[userId] })
    //         .eq("id", userId);

    //       if (response.error) {
    //         reject(response.error.message);
    //         return;
    //       }

    //       resolve(response.status);
    //     })
    //   );
    // });

    const updateResults = await Promise.all(updateQueue);

    res.status(200).json({ updateResults, dataMap });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }

  // console.log(price);
  // res.status(200).json({ data: price });
}
