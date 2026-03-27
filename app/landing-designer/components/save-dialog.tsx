"use client";
import { useState } from 'react';
import Button from '../../ui/common/button/button';
import btnStyle from '../../ui/common/button/btn.module.css';
import styles from './save-dialog.module.css';

interface SaveDialogProps {
    currentTitle: string;
    currentAddress: string;
    onSave: (title: string, address: string, isPublic: boolean) => void;
    onCancel: () => void;
    saving: boolean;
}

export default function SaveDialog({ currentTitle, currentAddress, onSave, onCancel, saving }: SaveDialogProps) {
    const [title, setTitle] = useState(currentTitle || '');
    const [address, setAddress] = useState(currentAddress || '');
    const [isPublic, setIsPublic] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const validateForm = () => {
        const newErrors: string[] = [];
        
        if (!title.trim()) {
            newErrors.push('Vui lòng nhập tiêu đề trang');
        }
        
        if (!address.trim()) {
            newErrors.push('Vui lòng nhập địa chỉ dự án');
        }

        if (title.trim().length < 3) {
            newErrors.push('Tiêu đề phải có ít nhất 3 ký tự');
        }
        
        if (title.trim().length > 100) {
            newErrors.push('Tiêu đề không được vượt quá 100 ký tự');
        }

        if (address.trim().length < 3) {
            newErrors.push('Địa chỉ dự án phải có ít nhất 3 ký tự');
        }

        if (address.trim().length > 100) {
            newErrors.push('Địa chỉ dự án không được vượt quá 100 ký tự');
        }
        
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(title.trim(), address.trim(), isPublic);
        }
    };

    const handleCancel = () => {
        if (!saving) {
            onCancel();
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <div className={styles.header}>
                    <h3>Lưu trang landing</h3>
                    {!saving && (
                        <button 
                            className={styles.closeButton}
                            onClick={handleCancel}
                            type="button"
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className={styles.content}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Tiêu đề trang *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ví dụ: Chào mừng đến với dự án XYZ"
                            className={styles.input}
                            disabled={saving}
                            maxLength={100}
                        />
                        <div className={styles.characterCount}>
                            {title.length}/100 ký tự
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="address">Địa chỉ dự án *</label>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Ví dụ: 123 Đường ABC, Quận XYZ"
                            className={styles.input}
                            disabled={saving}
                            maxLength={100}
                        />
                        <div className={styles.characterCount}>
                            {address.length}/100 ký tự
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.checkboxGroup}>
                            <input
                                id="isPublic"
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className={styles.checkbox}
                                disabled={saving}
                            />
                            <label htmlFor="isPublic" className={styles.checkboxLabel}>
                                Công khai trang này
                            </label>
                        </div>
                        <div className={styles.helpText}>
                            {isPublic ? (
                                <span className={styles.publicHelp}>
                                    🌐 Trang sẽ được công khai và ai cũng có thể truy cập qua URL
                                </span>
                            ) : (
                                <span className={styles.privateHelp}>
                                    🔒 Trang chỉ bạn mới có thể xem và chỉnh sửa
                                </span>
                            )}
                        </div>
                    </div>

                    {errors.length > 0 && (
                        <div className={styles.errorList}>
                            {errors.map((error, index) => (
                                <div key={index} className={styles.error}>
                                    ⚠️ {error}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.infoBox}>
                        <h4>Thông tin lưu trữ:</h4>
                        <ul>
                            <li>Trang sẽ được lưu vào tài khoản của bạn</li>
                            <li>Bạn có thể chỉnh sửa hoặc xóa trang bất kỳ lúc nào</li>
                            <li>Nếu công khai, trang sẽ có URL riêng để chia sẻ</li>
                            <li>Tất cả hình ảnh và nội dung sẽ được lưu trữ an toàn</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button
                        text="Hủy"
                        onClick={handleCancel}
                        cssClass={[btnStyle.buttonSecondary]}
                        disabled={saving}
                    />
                    <Button
                        text={saving ? "Đang lưu..." : "Lưu trang"}
                        onClick={handleSave}
                        cssClass={[btnStyle.buttonprimary]}
                        disabled={saving}
                    />
                </div>

                {saving && (
                    <div className={styles.savingOverlay}>
                        <div className={styles.spinner}></div>
                        <span>Đang lưu trang của bạn...</span>
                    </div>
                )}
            </div>
        </div>
    );
}