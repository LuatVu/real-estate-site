/**
 * Vietnamese phone number validation utilities
 */

// Vietnamese mobile network prefixes
const VIETNAM_MOBILE_PREFIXES = {
  // Viettel
  viettel: ['096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'],
  // Vinaphone
  vinaphone: ['091', '094', '088', '083', '084', '085', '081', '082'],
  // MobiFone
  mobifone: ['090', '093', '070', '079', '077', '076', '078'],
  // Vietnamobile
  vietnamobile: ['092', '056', '058'],
  // Gmobile
  gmobile: ['099', '059'],
  // Itelecom
  itelecom: ['087', '089'],
  // Reddi
  reddi: ['055']
};

// Get all valid prefixes as a flat array
const ALL_PREFIXES = Object.values(VIETNAM_MOBILE_PREFIXES).flat();

/**
 * Validates Vietnamese phone numbers
 * Supports formats: 0xxxxxxxxx, +84xxxxxxxxx, 84xxxxxxxxx
 */
export function validateVietnamesePhoneNumber(phoneNumber: string): {
  isValid: boolean;
  message: string;
  normalizedNumber?: string;
  carrier?: string;
} {
  if (!phoneNumber) {
    return {
      isValid: false,
      message: "Số điện thoại không được để trống"
    };
  }

  // Remove all spaces, dashes, and dots
  const cleanNumber = phoneNumber.replace(/[\s\-\.()]/g, '');

  // Check for valid characters (only digits and + at the beginning)
  if (!/^[\+]?[0-9]+$/.test(cleanNumber)) {
    return {
      isValid: false,
      message: "Số điện thoại chỉ được chứa số và dấu +"
    };
  }

  let normalizedNumber = cleanNumber;
  
  // Handle different formats
  if (cleanNumber.startsWith('+84')) {
    // +84xxxxxxxxx format
    normalizedNumber = '0' + cleanNumber.substring(3);
  } else if (cleanNumber.startsWith('84') && cleanNumber.length === 11) {
    // 84xxxxxxxxx format
    normalizedNumber = '0' + cleanNumber.substring(2);
  } else if (cleanNumber.startsWith('0')) {
    // 0xxxxxxxxx format - already normalized
    normalizedNumber = cleanNumber;
  } else {
    return {
      isValid: false,
      message: "Số điện thoại phải bắt đầu bằng 0, +84, hoặc 84"
    };
  }

  // Check length (should be 10 digits after normalization)
  if (normalizedNumber.length !== 10) {
    return {
      isValid: false,
      message: "Số điện thoại phải có 10 chữ số"
    };
  }

  // Check if prefix is valid
  const prefix = normalizedNumber.substring(0, 3);
  if (!ALL_PREFIXES.includes(prefix)) {
    return {
      isValid: false,
      message: "Đầu số không hợp lệ cho nhà mạng Việt Nam"
    };
  }

  // Determine carrier
  let carrier = '';
  for (const [carrierName, prefixes] of Object.entries(VIETNAM_MOBILE_PREFIXES)) {
    if (prefixes.includes(prefix)) {
      carrier = carrierName;
      break;
    }
  }

  return {
    isValid: true,
    message: "Số điện thoại hợp lệ",
    normalizedNumber,
    carrier
  };
}

/**
 * Formats phone number for display
 */
export function formatVietnamesePhoneNumber(phoneNumber: string, format: 'dots' | 'spaces' | 'dashes' = 'spaces'): string {
  const validation = validateVietnamesePhoneNumber(phoneNumber);
  if (!validation.isValid || !validation.normalizedNumber) {
    return phoneNumber;
  }

  const number = validation.normalizedNumber;
  const separator = format === 'dots' ? '.' : format === 'dashes' ? '-' : ' ';
  
  // Format as: 0xxx xxx xxx
  return `${number.substring(0, 4)}${separator}${number.substring(4, 7)}${separator}${number.substring(7)}`;
}

/**
 * Get carrier name in Vietnamese
 */
export function getCarrierDisplayName(carrier: string): string {
  const carrierNames: { [key: string]: string } = {
    viettel: 'Viettel',
    vinaphone: 'VinaPhone',
    mobifone: 'MobiFone',
    vietnamobile: 'Vietnamobile',
    gmobile: 'Gmobile',
    itelecom: 'iTelecom',
    reddi: 'Reddi'
  };
  
  return carrierNames[carrier] || 'Không xác định';
}

/**
 * Real-time input formatter for phone number input
 */
export function formatPhoneNumberInput(value: string): string {
  // Remove all non-digit characters except + at the beginning
  const cleaned = value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
  
  if (cleaned.startsWith('+84')) {
    // Format +84 numbers
    const digits = cleaned.substring(3);
    if (digits.length <= 3) return `+84 ${digits}`;
    if (digits.length <= 6) return `+84 ${digits.substring(0, 3)} ${digits.substring(3)}`;
    return `+84 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)}`;
  } else if (cleaned.startsWith('0')) {
    // Format 0 numbers
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.substring(0, 4)} ${cleaned.substring(4)}`;
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 10)}`;
  }
  
  return cleaned;
}
