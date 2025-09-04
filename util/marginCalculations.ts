/**
 * Bybit Margin Calculations for Options and Futures
 * Based on Bybit's official documentation
 */

export interface MarginCalculationParams {
  positionSize: number; // Contract quantity
  indexPrice: number; // Index price of the underlying asset
  markPrice: number; // Mark price of the option/contract
  strikePrice?: number; // Strike price for options
  positionType: "long" | "short";
  instrumentType: "option" | "perpetual" | "future";
  optionType?: "call" | "put"; // For options only
  leverage?: number; // For perpetual/futures
}

export interface MarginResult {
  initialMargin: number;
  maintenanceMargin: number;
}

/**
 * Calculate Initial Margin (IM) and Maintenance Margin (MM) for Options
 * Based on Bybit's formula: MM = [Max(3% × Index Price, 3% × Mark Price) + Mark Price + 0.2% × Index Price] × Quantity
 */
export function calculateOptionsMargin(
  params: MarginCalculationParams
): MarginResult {
  const { positionSize, indexPrice, markPrice, positionType } = params;

  if (positionType === "long") {
    // For long options, margin is limited to premium paid
    const initialMargin = Math.abs(positionSize) * markPrice;
    const maintenanceMargin = 0; // No MM requirement for long options

    return {
      initialMargin,
      maintenanceMargin,
    };
  } else {
    // For short options, use Bybit's formula
    const baseMargin = Math.max(0.03 * indexPrice, 0.03 * markPrice);
    const riskAdjustment = 0.002 * indexPrice; // 0.2% of index price

    const maintenanceMargin =
      Math.abs(positionSize) * (baseMargin + markPrice + riskAdjustment);
    const initialMargin = maintenanceMargin * 1.2; // IM is typically 120% of MM

    return {
      initialMargin,
      maintenanceMargin,
    };
  }
}

/**
 * Calculate Initial Margin (IM) and Maintenance Margin (MM) for Perpetual/Futures
 * Based on leverage and position size
 */
export function calculatePerpetualMargin(
  params: MarginCalculationParams
): MarginResult {
  const { positionSize, indexPrice, leverage = 1 } = params;

  const positionValue = Math.abs(positionSize) * indexPrice;
  const initialMargin = positionValue / leverage;

  // MM rates based on leverage (Bybit's standard rates)
  let mmRate: number;
  if (leverage <= 12.5) {
    mmRate = 0.005; // 0.5%
  } else if (leverage <= 25) {
    mmRate = 0.01; // 1%
  } else if (leverage <= 50) {
    mmRate = 0.02; // 2%
  } else if (leverage <= 100) {
    mmRate = 0.025; // 2.5%
  } else {
    mmRate = 0.05; // 5%
  }

  const maintenanceMargin = positionValue * mmRate;

  return {
    initialMargin,
    maintenanceMargin,
  };
}

/**
 * Main function to calculate margins based on instrument type
 */
export function calculateMargin(params: MarginCalculationParams): MarginResult {
  switch (params.instrumentType) {
    case "option":
      return calculateOptionsMargin(params);
    case "perpetual":
    case "future":
      return calculatePerpetualMargin(params);
    default:
      throw new Error(`Unsupported instrument type: ${params.instrumentType}`);
  }
}

/**
 * Calculate margin ratio (used margin / available margin)
 */
export function calculateMarginRatio(
  usedMargin: number,
  totalEquity: number
): number {
  if (totalEquity <= 0) return 1; // 100% if no equity
  return Math.min(usedMargin / totalEquity, 1);
}

/**
 * Calculate liquidation price for perpetual contracts
 */
export function calculateLiquidationPrice(
  entryPrice: number,
  positionSize: number,
  margin: number,
  maintenanceMargin: number,
  isLong: boolean
): number {
  const absPositionSize = Math.abs(positionSize);

  if (absPositionSize === 0 || margin === 0) return 0;

  if (isLong) {
    // Long liquidation: Entry Price - (Margin - MM) / Position Size
    return entryPrice - (margin - maintenanceMargin) / absPositionSize;
  } else {
    // Short liquidation: Entry Price + (Margin - MM) / Position Size
    return entryPrice + (margin - maintenanceMargin) / absPositionSize;
  }
}

/**
 * Format margin values for display
 */
export function formatMarginValue(
  value: number,
  currency: string = "USDT",
  decimals: number = 4
): string {
  if (isNaN(value) || !isFinite(value)) {
    return `0.${"0".repeat(decimals)} ${currency}`;
  }

  return `${value.toFixed(decimals)} ${currency}`;
}

/**
 * Get margin health status based on margin ratio
 */
export function getMarginHealthStatus(marginRatio: number): {
  status: "healthy" | "warning" | "danger";
  color: string;
  message: string;
} {
  if (marginRatio < 0.5) {
    return {
      status: "healthy",
      color: "#0ecb81",
      message: "Healthy",
    };
  } else if (marginRatio < 0.8) {
    return {
      status: "warning",
      color: "#f7a600",
      message: "Warning",
    };
  } else {
    return {
      status: "danger",
      color: "#f6465d",
      message: "High Risk",
    };
  }
}
