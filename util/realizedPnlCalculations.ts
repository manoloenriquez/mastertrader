/**
 * Bybit Realized P&L Calculations
 * Based on Bybit's official documentation
 */

export interface RealizedPnlParams {
  positionSize: number; // Contract quantity
  entryPrice: number; // Entry price of the position
  currentPrice: number; // Current market price
  tradingFeeRate: number; // Trading fee rate (e.g., 0.055% = 0.00055)
  fundingRate: number; // Current funding rate
  fundingInterval: number; // Funding interval in hours (usually 8 hours)
  positionDurationHours: number; // How long the position has been open in hours
  partialClosings?: PartialClosing[]; // Any partial closings (empty for unopened positions)
}

export interface PartialClosing {
  quantity: number; // Amount closed
  exitPrice: number; // Price at which it was closed
  timestamp: Date; // When it was closed
}

export interface RealizedPnlResult {
  realizedPnl: number; // Total realized P&L
  tradingFees: number; // Total trading fees paid
  fundingFees: number; // Total funding fees paid/received
  partialClosingPnl: number; // P&L from partial closings
  breakdown: {
    openingFee: number;
    closingFees: number;
    netFundingFees: number;
    partialPnl: number;
  };
}

/**
 * Calculate trading fees for opening a position
 */
function calculateOpeningFee(
  positionSize: number,
  entryPrice: number,
  feeRate: number
): number {
  const positionValue = Math.abs(positionSize) * entryPrice;
  return positionValue * feeRate;
}

/**
 * Calculate trading fees for closing positions
 */
function calculateClosingFees(
  partialClosings: PartialClosing[],
  feeRate: number
): number {
  return partialClosings.reduce((total, closing) => {
    const closingValue = Math.abs(closing.quantity) * closing.exitPrice;
    return total + closingValue * feeRate;
  }, 0);
}

/**
 * Calculate P&L from partial closings
 */
function calculatePartialClosingPnl(
  partialClosings: PartialClosing[],
  entryPrice: number,
  isLong: boolean
): number {
  return partialClosings.reduce((total, closing) => {
    const quantity = Math.abs(closing.quantity);
    const priceDiff = closing.exitPrice - entryPrice;
    const pnl = isLong ? priceDiff * quantity : -priceDiff * quantity;
    return total + pnl;
  }, 0);
}

/**
 * Calculate funding fees over the position's lifetime
 * Funding fees are paid every 8 hours (or specified interval)
 */
function calculateFundingFees(
  positionSize: number,
  currentPrice: number,
  fundingRate: number,
  fundingInterval: number,
  positionDurationHours: number
): number {
  // Number of funding periods that have occurred
  const fundingPeriods = Math.floor(positionDurationHours / fundingInterval);

  if (fundingPeriods === 0) {
    return 0; // No funding fees if position is less than one funding period old
  }

  // Position value for funding calculation
  const positionValue = Math.abs(positionSize) * currentPrice;

  // Funding fee per period = Position Value × Funding Rate
  const fundingFeePerPeriod = positionValue * fundingRate;

  // Total funding fees = Fee per period × Number of periods
  // Positive means fees paid, negative means fees received
  const totalFundingFees = fundingFeePerPeriod * fundingPeriods;

  // For long positions, you pay funding when rate is positive
  // For short positions, you pay funding when rate is negative
  const isLong = positionSize > 0;
  return isLong ? totalFundingFees : -totalFundingFees;
}

/**
 * Calculate total realized P&L for a position
 */
export function calculateRealizedPnl(
  params: RealizedPnlParams
): RealizedPnlResult {
  const {
    positionSize,
    entryPrice,
    currentPrice,
    tradingFeeRate,
    fundingRate,
    fundingInterval,
    positionDurationHours,
    partialClosings = [],
  } = params;

  const isLong = positionSize > 0;

  // 1. Calculate trading fees
  const openingFee = calculateOpeningFee(
    positionSize,
    entryPrice,
    tradingFeeRate
  );
  const closingFees = calculateClosingFees(partialClosings, tradingFeeRate);
  const totalTradingFees = openingFee + closingFees;

  // 2. Calculate funding fees
  const netFundingFees = calculateFundingFees(
    positionSize,
    currentPrice,
    fundingRate,
    fundingInterval,
    positionDurationHours
  );

  // 3. Calculate P&L from partial closings
  const partialClosingPnl = calculatePartialClosingPnl(
    partialClosings,
    entryPrice,
    isLong
  );

  // 4. Calculate total realized P&L
  // Realized P&L = Partial Closing P&L - Trading Fees - Funding Fees
  const realizedPnl =
    partialClosingPnl - totalTradingFees - Math.abs(netFundingFees);

  return {
    realizedPnl,
    tradingFees: totalTradingFees,
    fundingFees: netFundingFees,
    partialClosingPnl,
    breakdown: {
      openingFee,
      closingFees,
      netFundingFees,
      partialPnl: partialClosingPnl,
    },
  };
}

/**
 * Get position duration in hours from creation timestamp
 */
export function getPositionDurationHours(createdAt: Date): number {
  const now = new Date();
  const durationMs = now.getTime() - createdAt.getTime();
  return durationMs / (1000 * 60 * 60); // Convert to hours
}

/**
 * Format realized P&L value for display
 */
export function formatRealizedPnl(
  value: number,
  currency: string = "USDT",
  decimals: number = 2
): string {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${value.toFixed(decimals)} ${currency}`;
}

/**
 * Get typical trading fee rates for different instruments
 */
export function getTradingFeeRate(instrumentType: string): number {
  switch (instrumentType) {
    case "perpetual":
      return 0.00055; // 0.055% for perpetual contracts (maker/taker average)
    case "option":
      return 0.0003; // 0.03% for options
    case "spot":
      return 0.001; // 0.1% for spot trading
    default:
      return 0.00055; // Default to perpetual rate
  }
}

/**
 * Estimate funding rate (if not available from API)
 */
export function getEstimatedFundingRate(): number {
  // Typical funding rate range is -0.1% to +0.1%
  // For estimation, we can use a small positive rate
  return 0.0001; // 0.01% (1 basis point)
}
