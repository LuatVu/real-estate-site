# Confirmation Component

A reusable confirmation dialog component for user confirmations like delete actions, form submissions, etc.

## Features

- ✅ **4 Types**: `danger`, `warning`, `info`, `success`
- ✅ **Custom Icons**: Different icons for each type
- ✅ **Loading State**: Shows spinner during async operations
- ✅ **Mobile Responsive**: Optimized for mobile devices
- ✅ **Keyboard Accessible**: Proper focus management
- ✅ **Smooth Animations**: Fade in/slide in effects
- ✅ **Vietnamese Localization**: Default Vietnamese text

## Usage

### 1. Import the hook and component

```tsx
import { useConfirmation } from '../../hook/useConfirmation';
import Confirmation from '../../ui/common/confirmation';
```

### 2. Use in your component

```tsx
function YourComponent() {
    const { confirmation, showConfirmation, hideConfirmation, setConfirmButtonLoading } = useConfirmation();

    const handleDelete = () => {
        showConfirmation({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa mục này?',
            type: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy',
            onConfirm: async () => {
                setConfirmButtonLoading(true);
                try {
                    await deleteAPI();
                    hideConfirmation();
                    // Show success message
                } catch (error) {
                    setConfirmButtonLoading(false);
                    // Show error message
                }
            }
        });
    };

    return (
        <div>
            <button onClick={handleDelete}>Delete</button>
            
            <Confirmation
                isVisible={confirmation.isVisible}
                title={confirmation.title}
                message={confirmation.message}
                type={confirmation.type}
                confirmText={confirmation.confirmText}
                cancelText={confirmation.cancelText}
                onConfirm={confirmation.onConfirm}
                onCancel={confirmation.onCancel}
                confirmButtonLoading={confirmation.confirmButtonLoading}
            />
        </div>
    );
}
```

## Types

### `danger` (Red)
- For destructive actions like delete, remove
- Red color scheme with warning icon
- Use for irreversible actions

### `warning` (Yellow)  
- For potentially harmful actions like logout, reset
- Yellow color scheme with exclamation icon
- Use for actions that might cause data loss

### `info` (Blue)
- For informational confirmations like save, update
- Blue color scheme with info icon
- Use for general confirmations

### `success` (Green)
- For positive actions like complete, approve
- Green color scheme with checkmark icon
- Use for completing tasks

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | boolean | false | Show/hide the confirmation dialog |
| `title` | string | - | Title of the confirmation |
| `message` | string | - | Message body |
| `type` | ConfirmationType | 'warning' | Visual style type |
| `confirmText` | string | 'Xác nhận' | Confirm button text |
| `cancelText` | string | 'Hủy' | Cancel button text |
| `onConfirm` | function | - | Confirm button click handler |
| `onCancel` | function | - | Cancel button click handler |
| `showIcon` | boolean | true | Show/hide the icon |
| `confirmButtonLoading` | boolean | false | Loading state for confirm button |

## Hook Methods

| Method | Description |
|--------|-------------|
| `showConfirmation(options)` | Show the confirmation dialog |
| `hideConfirmation()` | Hide the confirmation dialog |
| `setConfirmButtonLoading(loading)` | Set loading state for confirm button |

## Integration Examples

The component is already integrated in the posts management page with examples for:
- ❌ **Delete confirmation**: When deleting a post
- ⚠️ **Filter reset confirmation**: When resetting active filters
- 🔄 **Loading states**: During API calls

## Styling

The component uses CSS modules with responsive design:
- Desktop: Modal in center with overlay
- Mobile: Full-width modal with stacked buttons
- Smooth animations and transitions
- Proper color schemes for each type