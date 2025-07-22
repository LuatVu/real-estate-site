# Vietnamese Phone Number Validation

## Overview
This implementation provides comprehensive validation for Vietnamese mobile phone numbers with real-time feedback, carrier detection, and proper formatting.

## Features

### 📱 Supported Phone Number Formats
- **0xxxxxxxxx** - Standard Vietnamese format (e.g., 0901 234 567)
- **+84xxxxxxxxx** - International format (e.g., +84 901 234 567)  
- **84xxxxxxxxx** - International without + (e.g., 84 901 234 567)

### 🏢 Supported Carriers
- **Viettel**: 096, 097, 098, 032, 033, 034, 035, 036, 037, 038, 039
- **VinaPhone**: 091, 094, 088, 083, 084, 085, 081, 082
- **MobiFone**: 090, 093, 070, 079, 077, 076, 078
- **Vietnamobile**: 092, 056, 058
- **Gmobile**: 099, 059
- **iTelecom**: 087, 089
- **Reddi**: 055

### ✨ Validation Features
- ✅ Real-time validation as user types
- ✅ Automatic number formatting (spaces for readability)
- ✅ Carrier detection and display
- ✅ Visual feedback (green for valid, red for invalid)
- ✅ Vietnamese error messages
- ✅ Prevents form submission with invalid numbers

## Implementation Details

### Files Created/Modified

#### 1. `/app/utils/phone-validation.ts`
Main validation utility with functions:
- `validateVietnamesePhoneNumber()` - Core validation logic
- `formatPhoneNumberInput()` - Real-time input formatting
- `formatVietnamesePhoneNumber()` - Display formatting
- `getCarrierDisplayName()` - Carrier name translation

#### 2. `/app/sign-up/page.tsx`
Updated sign-up form with:
- Phone number input with validation
- Real-time error display
- Carrier detection
- Multi-step registration process
- Both mobile and desktop responsive layouts

## Usage Examples

### Basic Validation
```typescript
import { validateVietnamesePhoneNumber } from '../utils/phone-validation';

const result = validateVietnamesePhoneNumber('0901234567');
console.log(result);
// {
//   isValid: true,
//   message: "Số điện thoại hợp lệ",
//   normalizedNumber: "0901234567",
//   carrier: "viettel"
// }
```

### Input Formatting
```typescript
import { formatPhoneNumberInput } from '../utils/phone-validation';

const formatted = formatPhoneNumberInput('0901234567');
console.log(formatted); // "0901 234 567"
```

### React Component Integration
```tsx
const [phoneNumber, setPhoneNumber] = useState("");
const [isValid, setIsValid] = useState(false);

const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumberInput(e.target.value);
    setPhoneNumber(formatted);
    
    const validation = validateVietnamesePhoneNumber(formatted);
    setIsValid(validation.isValid);
};
```

## Validation Rules

### 1. Format Requirements
- Must start with 0, +84, or 84
- Must contain exactly 10 digits (after normalization)
- Only digits and + (at start) allowed
- Spaces, dashes, dots, and parentheses are automatically removed

### 2. Prefix Validation
- Must match one of the recognized Vietnamese carrier prefixes
- Invalid prefixes will show specific error message

### 3. Length Validation
- Normalized number must be exactly 10 digits
- Input formatting allows up to 13 characters (including spaces)

## Error Messages (Vietnamese)

| Condition | Message |
|-----------|---------|
| Empty input | "Số điện thoại không được để trống" |
| Invalid characters | "Số điện thoại chỉ được chứa số và dấu +" |
| Wrong format | "Số điện thoại phải bắt đầu bằng 0, +84, hoặc 84" |
| Wrong length | "Số điện thoại phải có 10 chữ số" |
| Invalid prefix | "Đầu số không hợp lệ cho nhà mạng Việt Nam" |
| Valid number | "Số điện thoại hợp lệ" |

## User Experience Features

### Real-time Feedback
- ❌ Red border and error message for invalid input
- ✅ Green border and success message for valid input
- 📱 Carrier name displayed for valid numbers
- 🔄 Instant validation as user types

### Smart Formatting
- Automatically adds spaces for readability
- Handles multiple input formats seamlessly  
- Prevents invalid characters from being entered
- Maximum length enforcement

### Multi-step Registration
1. **Step 1**: Phone number input with validation
2. **Step 2**: SMS verification code (placeholder)
3. **Step 3**: Complete registration with password

## Testing

### Valid Test Cases
```javascript
// Viettel
validateVietnamesePhoneNumber('0961234567') // ✅
validateVietnamesePhoneNumber('+84961234567') // ✅
validateVietnamesePhoneNumber('84 96 123 4567') // ✅

// VinaPhone  
validateVietnamesePhoneNumber('0911234567') // ✅

// MobiFone
validateVietnamesePhoneNumber('0901234567') // ✅
```

### Invalid Test Cases
```javascript
validateVietnamesePhoneNumber('0123456789') // ❌ Invalid prefix
validateVietnamesePhoneNumber('096123456')  // ❌ Too short
validateVietnamesePhoneNumber('09612345678') // ❌ Too long
validateVietnamesePhoneNumber('abc0961234567') // ❌ Invalid characters
```

## Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Input type="tel" for mobile keyboards
- ✅ Responsive design for all screen sizes

## Future Enhancements
- [ ] SMS verification integration
- [ ] Phone number lookup API
- [ ] Additional carrier support
- [ ] Landline number validation
- [ ] International number support beyond Vietnam
