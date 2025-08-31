import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (req.method !== "POST") {
  //   res.status(500).json({ error: "Invalid request type" });
  //   return;
  // }

  const price = await fetch(
    "https://testnet.binancefuture.com/fapi/v1/premiumIndex?symbol=BTCUSDT"
  ).then((result) => result.json());

  console.log(price);
  res.status(200).json({ data: price });
}
