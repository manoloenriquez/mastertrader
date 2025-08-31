export interface Orderbook {
  lastUpdateId: number;
  E: number;
  T: number;
  bids: string[][];
  asks: string[][];
}

export interface SymbolTicker {
  symbol: string;
  lastPrice?: string;
  markPrice?: string;
  indexPrice?: string;
  fundingRate?: number;
  change?: number;
  high?: string;
  low?: string;
  fundingTime?: number;
  changePercentage?: number;
  prevPrice?: string;
}

export interface MarketTicker {
  s: string;
  c: number;
}

export interface OrderBookTicker {
  symbol: string;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
}
