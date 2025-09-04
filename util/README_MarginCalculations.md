# Bybit Margin Calculations

This module implements Bybit's official margin calculation formulas for options and perpetual contracts.

## Overview

The margin system ensures traders have sufficient funds to cover potential losses. Bybit uses two main types of margin:

- **Initial Margin (IM)**: Required when opening a position
- **Maintenance Margin (MM)**: Minimum margin required to keep a position open

## Options Margin Calculations

### Long Options Positions

For long options (buying calls or puts), the maximum loss is limited to the premium paid:

- **IM**: Premium × Quantity
- **MM**: 0 (no maintenance margin required)

### Short Options Positions

For short options (selling calls or puts), Bybit uses this formula:

```
MM = [Max(3% × Index Price, 3% × Mark Price) + Mark Price + 0.2% × Index Price] × Quantity
IM = MM × 1.2 (typically 120% of MM)
```

**Example Calculation:**

- BTC Index Price: $30,000
- Option Mark Price: $300
- Quantity: 1 contract

```
MM = [Max(3% × 30,000, 3% × 300) + 300 + 0.2% × 30,000] × 1
MM = [900 + 300 + 60] × 1
MM = 1,260 USDT
```

## Perpetual/Futures Margin Calculations

### Initial Margin

```
IM = Position Value / Leverage
Position Value = Position Size × Index Price
```

### Maintenance Margin

MM rates vary based on leverage:

| Leverage | MM Rate |
| -------- | ------- |
| ≤ 12.5x  | 0.5%    |
| ≤ 25x    | 1.0%    |
| ≤ 50x    | 2.0%    |
| ≤ 100x   | 2.5%    |
| > 100x   | 5.0%    |

```
MM = Position Value × MM Rate
```

## Liquidation Price

### Long Positions

```
Liquidation Price = Entry Price - (Margin - MM) / Position Size
```

### Short Positions

```
Liquidation Price = Entry Price + (Margin - MM) / Position Size
```

## Margin Ratio

```
Margin Ratio = Used Margin / Total Equity
```

**Health Status:**

- **Healthy**: < 50% (Green)
- **Warning**: 50% - 80% (Orange)
- **Danger**: > 80% (Red)

## Usage Examples

### Calculate Options Margin

```typescript
import { calculateMargin } from "./marginCalculations";

const marginParams = {
  positionSize: 1,
  indexPrice: 30000,
  markPrice: 300,
  positionType: "short" as const,
  instrumentType: "option" as const,
};

const result = calculateMargin(marginParams);
console.log(`IM: ${result.initialMargin}, MM: ${result.maintenanceMargin}`);
```

### Calculate Perpetual Margin

```typescript
const marginParams = {
  positionSize: 0.1,
  indexPrice: 30000,
  positionType: "long" as const,
  instrumentType: "perpetual" as const,
  leverage: 50,
};

const result = calculateMargin(marginParams);
```

### Format Margin Values

```typescript
import { formatMarginValue } from "./marginCalculations";

const formattedIM = formatMarginValue(1260, "USDT", 2);
// Result: "1260.00 USDT"
```

## Key Features

1. **Accurate Formulas**: Based on Bybit's official documentation
2. **Type Safety**: Full TypeScript support
3. **Flexible**: Supports options, perpetuals, and futures
4. **Error Handling**: Graceful handling of edge cases
5. **Formatting**: Helper functions for display

## Important Notes

- Margin requirements can change based on market conditions
- These calculations are approximations for display purposes
- Always refer to Bybit's official documentation for the most current formulas
- Risk management should consider margin requirements when sizing positions

## References

- [Bybit Options Margin Documentation](https://www.bybit.com/en/help-center/article/Initial-Maintenance-Margin-Calculations-Options)
- [Bybit Perpetual Margin Documentation](https://www.bybit.com/en/help-center/article/Margin-Requirements)
