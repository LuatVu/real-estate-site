// Example usage of the confirmation component

import { useConfirmation } from '../hook/useConfirmation';
import Confirmation from '../ui/common/confirmation';

function ExampleComponent() {
    const { confirmation, showConfirmation, hideConfirmation, setConfirmButtonLoading } = useConfirmation();

    // Delete confirmation (danger)
    const handleDelete = () => {
        showConfirmation({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.',
            type: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy',
            onConfirm: async () => {
                setConfirmButtonLoading(true);
                try {
                    // API call here
                    await deleteItem();
                    hideConfirmation();
                    // Show success message
                } catch (error) {
                    setConfirmButtonLoading(false);
                    // Show error message
                }
            }
        });
    };

    // Warning confirmation
    const handleLogout = () => {
        showConfirmation({
            title: 'Đăng xuất',
            message: 'Bạn có muốn đăng xuất khỏi ứng dụng?',
            type: 'warning',
            confirmText: 'Đăng xuất',
            onConfirm: () => {
                // Logout logic
                hideConfirmation();
            }
        });
    };

    // Info confirmation
    const handleSaveChanges = () => {
        showConfirmation({
            title: 'Lưu thay đổi',
            message: 'Bạn có muốn lưu các thay đổi đã thực hiện?',
            type: 'info',
            confirmText: 'Lưu',
            onConfirm: async () => {
                setConfirmButtonLoading(true);
                // Save logic
                hideConfirmation();
            }
        });
    };

    // Success confirmation
    const handleCompleteTask = () => {
        showConfirmation({
            title: 'Hoàn thành nhiệm vụ',
            message: 'Đánh dấu nhiệm vụ này là hoàn thành?',
            type: 'success',
            confirmText: 'Hoàn thành',
            onConfirm: () => {
                // Complete task logic
                hideConfirmation();
            }
        });
    };

    return (
        <div>
            {/* Your component content */}
            <button onClick={handleDelete}>Delete Item</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={handleCompleteTask}>Complete Task</button>

            {/* Add the confirmation component */}
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