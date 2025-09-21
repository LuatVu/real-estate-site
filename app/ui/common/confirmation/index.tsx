"use client";
import React from 'react';
import Image from 'next/image';
import styles from './index.module.css';

export type ConfirmationType = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmationProps {
    isVisible: boolean;
    title: string;
    message: string;
    type?: ConfirmationType;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    showIcon?: boolean;
    confirmButtonLoading?: boolean;
}

const Confirmation: React.FC<ConfirmationProps> = ({
    isVisible,
    title,
    message,
    type = 'warning',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    onConfirm,
    onCancel,
    showIcon = true,
    confirmButtonLoading = false
}) => {
    if (!isVisible) return null;

    const getIcon = () => {
        if (!showIcon) return null;

        switch (type) {
            case 'danger':
                return (
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className={styles.icon}>
                        <circle cx="24" cy="24" r="22" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2"/>
                        <path d="M24 14v12M24 32h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className={styles.icon}>
                        <circle cx="24" cy="24" r="22" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                        <path d="M24 14v12M24 32h.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                );
            case 'info':
                return (
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className={styles.icon}>
                        <circle cx="24" cy="24" r="22" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
                        <path d="M24 20h.01M24 24v8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                );
            case 'success':
                return (
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className={styles.icon}>
                        <circle cx="24" cy="24" r="22" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
                        <path d="M16 24l6 6 10-12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    const getConfirmButtonClass = () => {
        switch (type) {
            case 'danger':
                return styles.confirmButtonDanger;
            case 'warning':
                return styles.confirmButtonWarning;
            case 'info':
                return styles.confirmButtonInfo;
            case 'success':
                return styles.confirmButtonSuccess;
            default:
                return styles.confirmButtonWarning;
        }
    };

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.content}>
                    {showIcon && (
                        <div className={styles.iconContainer}>
                            {getIcon()}
                        </div>
                    )}
                    
                    <div className={styles.textContainer}>
                        <h3 className={styles.title}>{title}</h3>
                        <p className={styles.message}>{message}</p>
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        onClick={onCancel}
                        className={styles.cancelButton}
                        disabled={confirmButtonLoading}
                    >
                        {cancelText}
                    </button>
                    
                    <button
                        onClick={onConfirm}
                        className={`${styles.confirmButton} ${getConfirmButtonClass()}`}
                        disabled={confirmButtonLoading}
                    >
                        {confirmButtonLoading ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.spinner}></div>
                                <span>Đang xử lý...</span>
                            </div>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;