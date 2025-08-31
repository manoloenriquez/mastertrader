export interface User {
  id: string;
  username: string;
  balance: number;
}

export interface CreateOrder {
  user_id: string;
  margin: number;
  crypto_size: number;
  usd_size: number;
  margin_mode: "cross" | "isolated";
  leverage: number;
  entry?: string;
  stop?: number;
  profit?: number;
  symbol: string;
  direction: "long" | "short";
  stop_basis?: "last" | "mark";
  profit_basis?: "last" | "mark";
  is_market: boolean;
}

export interface Order extends CreateOrder {
  id: string;
  created_at: Date;
  status: "pending" | "filled" | "cancelled";
  realized_pnl: number;
  position_id: string | null;
}

export interface CancelOrder {
  id: string;
}

export interface CreatePosition {
  user_id: string;
  margin: number;
  crypto_size: number;
  usd_size: number;
  margin_mode: "cross" | "isolated";
  leverage: number;
  entry: string;
  stop?: number;
  profit?: number;
  symbol: string;
  direction: "long" | "short";
  stop_basis?: "last" | "mark";
  profit_basis?: "last" | "mark";
}

export interface Position extends CreatePosition {
  id: string;
}

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: Order;
        Insert: CreateOrder;
      };
    };
  };
}
