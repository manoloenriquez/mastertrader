import { CreateOrder, Database, Order } from "./../../types/database";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(500).json({ error: "Invalid request type" });
    return;
  }

  const supabase = createServerSupabaseClient<Database>({ req, res });
  console.log(req.body);
  const data = req.body.data as CreateOrder;
  const symbol = req.body.symbol ?? "BTCUSDT"

  if (!data.entry) {
    const symbolData = await fetch(
      `https://testnet.binancefuture.com/fapi/v1/premiumIndex?symbol=${symbol}`
    ).then((result) => result.json());

    // @ts-ignore
    data.entry = symbolData.markPrice;
  }

  try {
    const response = await supabase.from("orders").insert(data).select();

    if (response.error) {
      throw response.error;
    }

    res.status(200).json({ data: response.data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }

  // console.log(price);
  // res.status(200).json({ data: price });
}
