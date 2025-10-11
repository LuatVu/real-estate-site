/**
 * Utility functions for price formatting in Vietnamese real estate context
 */

/**
 * Formats price to readable Vietnamese format
 * @param price - The price as string or number
 * @returns Formatted price string with Vietnamese units (tỷ, triệu, nghìn) or 'Thỏa thuận' for invalid/empty prices
 * 
 * @example
 * formatPrice(2500000000) // "2.5 tỷ"
 * formatPrice(750000000) // "750 triệu"
 * formatPrice(1500000) // "1.5 triệu"
 * formatPrice(500000) // "500 nghìn"
 * formatPrice(150000) // "150 nghìn"
 * formatPrice(999) // "999 VND"
 * formatPrice("") // "Thỏa thuận"
 * formatPrice(null) // "Thỏa thuận"
 */
export const formatPrice = (price: string | number | null | undefined): string => {
  if (!price || price === '' || price === '0') return 'Thỏa thuận';

  // Remove any non-numeric characters except decimal points
  const numericPrice = parseFloat(String(price).replace(/[^\d.]/g, ''));

  if (isNaN(numericPrice) || numericPrice <= 0) return 'Thỏa thuận';

  if (numericPrice >= 1000000000) {
    // Billions (tỷ)
    const billions = numericPrice / 1000000000;
    return `${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)} tỷ`;
  } else if (numericPrice >= 1000000) {
    // Millions (triệu)
    const millions = numericPrice / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} triệu`;
  } else if (numericPrice >= 1000) {
    // Thousands (nghìn)
    const thousands = numericPrice / 1000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)} nghìn`;
  } else {
    // Less than 1000, show as is with VND
    return `${numericPrice.toLocaleString('vi-VN')} VND`;
  }
};

/**
 * Formats price range for display
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string
 * 
 * @example
 * formatPriceRange(1000000, 5000000) // "1 triệu - 5 triệu"
 * formatPriceRange(null, 10000000) // "Dưới 10 triệu"
 * formatPriceRange(2000000, null) // "Từ 2 triệu"
 */
export const formatPriceRange = (
  minPrice: string | number | null | undefined,
  maxPrice: string | number | null | undefined
): string => {
  const formattedMin = minPrice ? formatPrice(minPrice) : null;
  const formattedMax = maxPrice ? formatPrice(maxPrice) : null;

  if (formattedMin && formattedMax) {
    return `${formattedMin} - ${formattedMax}`;
  } else if (formattedMin) {
    return `Từ ${formattedMin}`;
  } else if (formattedMax) {
    return `Dưới ${formattedMax}`;
  } else {
    return 'Thỏa thuận';
  }
};

/**
 * Parses formatted Vietnamese price back to numeric value
 * @param formattedPrice - Price string with Vietnamese units
 * @returns Numeric value or null if invalid
 * 
 * @example
 * parsePrice("2.5 tỷ") // 2500000000
 * parsePrice("750 triệu") // 750000000
 * parsePrice("500 nghìn") // 500000
 */
export const parsePrice = (formattedPrice: string): number | null => {
  if (!formattedPrice || formattedPrice === 'Thỏa thuận') return null;

  const cleanPrice = formattedPrice.toLowerCase().trim();
  
  if (cleanPrice.includes('tỷ')) {
    const value = parseFloat(cleanPrice.replace(/[^\d.]/g, ''));
    return isNaN(value) ? null : value * 1000000000;
  } else if (cleanPrice.includes('triệu')) {
    const value = parseFloat(cleanPrice.replace(/[^\d.]/g, ''));
    return isNaN(value) ? null : value * 1000000;
  } else if (cleanPrice.includes('nghìn')) {
    const value = parseFloat(cleanPrice.replace(/[^\d.]/g, ''));
    return isNaN(value) ? null : value * 1000;
  } else {
    const value = parseFloat(cleanPrice.replace(/[^\d.]/g, ''));
    return isNaN(value) ? null : value;
  }
};