# Price Formatter Utility

## Overview
This utility provides consistent price formatting across the entire real estate application, following Vietnamese currency conventions.

## Files
- `app/utils/price-formatter.ts` - Main utility functions
- Used in: 
  - `app/posts/page.tsx` - Posts listing page
  - `app/post/[id]/post-client.tsx` - Individual post details
  - Future features can import and use these functions

## Functions

### `formatPrice(price: string | number | null | undefined): string`
Formats raw price values into readable Vietnamese format.

**Examples:**
- `formatPrice(2500000000)` → `"2.5 tỷ"`
- `formatPrice(750000000)` → `"750 triệu"`
- `formatPrice(1500000)` → `"1.5 triệu"`
- `formatPrice(500000)` → `"500 nghìn"`
- `formatPrice("")` → `"Thỏa thuận"`

### `formatPriceRange(minPrice, maxPrice): string`
Formats price ranges for search filters and displays.

**Examples:**
- `formatPriceRange(1000000, 5000000)` → `"1 triệu - 5 triệu"`
- `formatPriceRange(null, 10000000)` → `"Dưới 10 triệu"`
- `formatPriceRange(2000000, null)` → `"Từ 2 triệu"`

### `parsePrice(formattedPrice: string): number | null`
Converts formatted price strings back to numeric values for calculations.

**Examples:**
- `parsePrice("2.5 tỷ")` → `2500000000`
- `parsePrice("750 triệu")` → `750000000`
- `parsePrice("Thỏa thuận")` → `null`

## Usage

```typescript
import { formatPrice, formatPriceRange, parsePrice } from '../utils/price-formatter';

// In your component
const displayPrice = formatPrice(element.price);
const priceRange = formatPriceRange(minPrice, maxPrice);
const numericPrice = parsePrice("2.5 tỷ");
```

## Benefits
- ✅ **Consistency**: Same formatting across all features
- ✅ **Maintainability**: Single source of truth for price formatting logic
- ✅ **Reusability**: Easy to import and use in new features
- ✅ **Type Safety**: Full TypeScript support with proper typing
- ✅ **Documentation**: Well-documented with examples
- ✅ **Error Handling**: Graceful handling of invalid/empty values
- ✅ **Vietnamese Standards**: Follows local currency conventions