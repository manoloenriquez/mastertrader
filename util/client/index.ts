export function formatPrice(price: number, lastPrice: string): string {
  const idx = lastPrice.indexOf(".");
  const decimalPlaces = lastPrice.substring(idx + 1).length;
  return price.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
  // .replace(",", "");
}

/**
 * This function computes for the PNL of a position
 * @param size size of position in crypto value. positive values represent longs while negative represents shorts
 * @param entry entry price of position in usdt
 * @param price exit price of position in usdt
 * @param fundingRate funding rate of the current asset
 * @returns profit and loss amount
 */
export function calculatePnl(
  size: number,
  entry: number,
  price: number,
  fundingRate: number
) {
  return (price - entry) * size;
}

export function getPriceAtPnl(size: number, entry: number, pnl: number) {
  return pnl / size + entry;
}
