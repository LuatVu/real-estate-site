"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './index.module.css';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    type: AlertType;
    message: string;
    isVisible: boolean;
    onClose?: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
    showCloseButton?: boolean;
}

const Alert: React.FC<AlertProps> = ({
    type,
    message,
    isVisible,
    onClose,
    autoClose = true,
    autoCloseDelay = 3000,
    showCloseButton = true
}) => {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        setShow(isVisible);
        
        if (isVisible && autoClose) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoCloseDelay);
            
            return () => clearTimeout(timer);
        }
    }, [isVisible, autoClose, autoCloseDelay]);

    const handleClose = () => {
        setShow(false);
        if (onClose) {
            onClose();
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#10B981"/>
                        <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" fill="none"/>
                    </svg>
                );
            case 'error':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#EF4444"/>
                        <path d="M6 6l8 8M14 6l-8 8" stroke="white" strokeWidth="2"/>
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#F59E0B"/>
                        <path d="M10 6v4M10 14h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                );
            case 'info':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#3B82F6"/>
                        <path d="M10 6h.01M10 10v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    if (!show) return null;

    return (
        <div className={`${styles.alert} ${styles[type]} ${show ? styles.show : ''}`}>
            <div className={styles.alertContent}>
                <div className={styles.iconContainer}>
                    {getIcon()}
                </div>
                <div className={styles.message}>
                    {message}
                </div>
                {showCloseButton && (
                    <button 
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Đóng thông báo"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;