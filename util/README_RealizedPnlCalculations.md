# Bybit Realized P&L Calculations

This module implements Bybit's official Realized P&L calculation formula for derivatives trading.

## Overview

**Realized P&L = Sum of realized position P&L - Trading fees - Funding fees over the period of position opening**

The Realized P&L includes all actual profits and losses that have been "realized" through:

1. **Trading fees** paid when opening/closing positions
2. **Funding fees** paid/received during the position's lifetime
3. **P&L from partial closings** (if any portions of the position were closed)

## Formula Components

### 1. Trading Fees

- **Opening Fee**: `Position Value × Trading Fee Rate`
- **Closing Fees**: Sum of fees from any partial closings
- **Standard Rates**:
  - Perpetual Contracts: 0.055% (0.00055)
  - Options: 0.03% (0.0003)
  - Spot: 0.1% (0.001)

### 2. Funding Fees

- **Calculation**: `Position Value × Funding Rate × Number of Funding Periods`
- **Frequency**: Every 8 hours for most perpetual contracts
- **Direction**:
  - **Long positions**: Pay funding when rate is positive, receive when negative
  - **Short positions**: Pay funding when rate is negative, receive when positive

### 3. Partial Closing P&L

- **Formula**: `(Exit Price - Entry Price) × Quantity Closed`
- **Direction**: Positive for long if exit > entry, negative if exit < entry
- **For unopened positions**: This component is 0

## Example Calculation

### Scenario: 24-hour BTC Short Position (No Closings)

**Position Details:**

- Position Size: -0.4 BTC (short)
- Entry Price: $6,000
- Current Price: $5,800
- Position Duration: 24 hours
- Trading Fee Rate: 0.055%
- Funding Rate: 0.01% (positive)

**Calculations:**

1. **Opening Fee:**

   ```
   Opening Fee = 0.4 × 6,000 × 0.00055 = $1.32
   ```

2. **Funding Fees (3 periods in 24h):**

   ```
   Position Value = 0.4 × 5,800 = $2,320
   Funding Fee per Period = 2,320 × 0.0001 = $0.232
   Total Funding Fees = 0.232 × 3 = $0.696

   Short position with positive funding rate = Receive funding
   Net Funding = -$0.696 (received)
   ```

3. **Partial Closing P&L:**

   ```
   Partial Closing P&L = $0 (no closings)
   ```

4. **Realized P&L:**
   ```
   Realized P&L = $0 - $1.32 - $0.696 = -$2.016
   ```

## Implementation

### Basic Usage

```typescript
import {
  calculateRealizedPnl,
  getPositionDurationHours,
} from "./realizedPnlCalculations";

const params = {
  positionSize: -0.4, // Short 0.4 BTC
  entryPrice: 6000,
  currentPrice: 5800,
  tradingFeeRate: 0.00055, // 0.055%
  fundingRate: 0.0001, // 0.01%
  fundingInterval: 8, // 8 hours
  positionDurationHours: 24,
  partialClosings: [], // No closings yet
};

const result = calculateRealizedPnl(params);
console.log(`Realized P&L: ${result.realizedPnl}`);
```

### With Partial Closings

```typescript
const paramsWithClosings = {
  positionSize: -0.4,
  entryPrice: 6000,
  currentPrice: 5800,
  tradingFeeRate: 0.00055,
  fundingRate: 0.0001,
  fundingInterval: 8,
  positionDurationHours: 24,
  partialClosings: [
    {
      quantity: 0.1, // Closed 0.1 BTC
      exitPrice: 5500,
      timestamp: new Date("2024-01-01T12:00:00Z"),
    },
  ],
};
```

### Helper Functions

```typescript
// Get position duration from timestamp
const durationHours = getPositionDurationHours(
  new Date("2024-01-01T00:00:00Z")
);

// Format for display
const formatted = formatRealizedPnl(-2.016, "USDT", 4);
// Result: "-2.0160 USDT"

// Get standard fee rates
const perpetualFeeRate = getTradingFeeRate("perpetual"); // 0.00055
const optionFeeRate = getTradingFeeRate("option"); // 0.0003
```

## Key Features

1. **Accurate Formula**: Based on Bybit's official documentation
2. **Real-time Updates**: Funding fees calculated based on position duration
3. **Flexible**: Supports partial closings and different instruments
4. **Type Safety**: Full TypeScript support
5. **Breakdown**: Detailed breakdown of all components

## Important Notes

- **Funding Rates**: Should be fetched from API for accuracy
- **Position Duration**: Should be calculated from actual position creation time
- **Partial Closings**: Real implementation should track actual closing history
- **Fee Rates**: May vary based on VIP level and market conditions
- **Time Zones**: All calculations assume UTC timestamps

## Difference from Unrealized P&L

| Metric         | Realized P&L              | Unrealized P&L        |
| -------------- | ------------------------- | --------------------- |
| **Scope**      | Actual costs incurred     | Potential profit/loss |
| **Components** | Fees + Funding + Closings | Mark-to-market value  |
| **Timing**     | Historical/actual         | Real-time             |
| **Purpose**    | Track actual costs        | Position valuation    |

## References

- [Bybit Realized P&L Documentation](https://www.bybit.com/en/help-center/article/Realized-PnL)
- [Funding Rate Mechanism](https://www.bybit.com/en/help-center/article/Funding-Rate)
- [Trading Fees Structure](https://www.bybit.com/en/help-center/article/Trading-Fees)
