import { CancelOrder, CreateOrder, Order } from "./../../types/database";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

interface ReqBody {
  type: string;
  entry: number;
  stop: number;
  qty: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(500).json({ error: "Invalid request type" });
    return;
  }

  const supabase = createServerSupabaseClient({ req, res });
  console.log(req.body);
  const data = req.body.data as CancelOrder;

  try {
    const response = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", data.id);

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
