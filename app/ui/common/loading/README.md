# Loading Component

A reusable loading component for the Nhà đẹp quá real estate website that uses the brand logo as the central loading element.

## Features

- **Brand Integration**: Uses the nhadepqua_logo.svg as the main loading element
- **Multiple Sizes**: Small, medium (default), and large sizes
- **Flexible Usage**: Can be used inline or as full-screen overlay
- **Customizable**: Supports custom messages and styling
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Proper alt text and semantic HTML

## Usage

### Basic Usage

```tsx
import Loading from '@/app/ui/common/loading';

// Simple loading
<Loading />

// With message
<Loading message="Đang tải dữ liệu..." />

// Different sizes
<Loading size="small" />
<Loading size="medium" /> // default
<Loading size="large" />
```

### Full Screen Loading

```tsx
// Full screen overlay
<Loading 
  fullScreen={true} 
  message="Đang tải danh sách bất động sản..." 
/>
```

### Custom Styling

```tsx
// With custom CSS classes
<Loading 
  size="medium"
  message="Loading properties..."
  className="my-custom-styles"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the loading component |
| `message` | `string` | `undefined` | Optional loading message to display |
| `fullScreen` | `boolean` | `false` | Whether to show as full-screen overlay |
| `className` | `string` | `''` | Additional CSS classes to apply |

## Sizes

- **Small**: 60x14px logo with thin border (ideal for buttons, small cards)
- **Medium**: 80x19px logo with standard border (default, good for most use cases)
- **Large**: 96x23px logo with thick border (ideal for page-level loading)

## Examples

### In a Page Component

```tsx
'use client';
import { useState, useEffect } from 'react';
import Loading from '@/app/ui/common/loading';

export default function PropertiesPage() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties().then(data => {
      setProperties(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading fullScreen message="Đang tải danh sách bất động sản..." />;
  }

  return (
    <div>
      {/* Your properties content */}
    </div>
  );
}
```

### In a Button

```tsx
import Loading from '@/app/ui/common/loading';

function SubmitButton({ isSubmitting, onClick }) {
  return (
    <button onClick={onClick} disabled={isSubmitting}>
      {isSubmitting ? (
        <Loading size="small" />
      ) : (
        'Đăng tin'
      )}
    </button>
  );
}
```

### With React Suspense

```tsx
import { Suspense } from 'react';
import Loading from '@/app/ui/common/loading';

export default function Layout({ children }) {
  return (
    <Suspense 
      fallback={<Loading fullScreen message="Đang tải trang..." />}
    >
      {children}
    </Suspense>
  );
}
```

## Animation Details

- **Logo Animation**: Gentle pulse effect (2s duration)
- **Spinner Animation**: Continuous rotation (1.5s duration)
- **Smooth Transitions**: Uses CSS animations for smooth visual feedback

## Accessibility

- Uses proper `alt` text for the logo image
- Semantic HTML structure
- Respects `prefers-reduced-motion` for users with motion sensitivity
- Proper color contrast ratios

## Design System Integration

The component uses the project's CSS custom properties:
- `--color-primary-p300` for spinner colors
- `--color-text-t200` and `--color-text-t50` for text colors
- Matches the overall design language of the Nhà đẹp quá brand

## Browser Support

- All modern browsers
- Progressive enhancement for older browsers
- Fallback styles for browsers that don't support backdrop-filter