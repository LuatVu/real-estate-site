"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './index.module.css';

export interface ChargeFeeData {
    postId: string;
    priorityLevel: 'DIAMOND' | 'GOLD' | 'SILVER' | 'NORMAL';
    reupFee: number;
    renewFee: number;
    status: number;
}

interface ChargeFeePopupProps {
    isVisible: boolean;
    postId: string;
    type: 'new' | 'up' | 'renew'; // 'new' for renewFee, 'up' for reupFee, 'renew' for renewFee
    postTitle?: string;
    onConfirm: (feeData: ChargeFeeData) => void;
    onCancel: () => void;
    confirmButtonLoading?: boolean;
}

const ChargeFeePopup: React.FC<ChargeFeePopupProps> = ({
    isVisible,
    postId,
    type,
    postTitle = '',
    onConfirm,
    onCancel,
    confirmButtonLoading = false
}) => {
    const [loading, setLoading] = useState(false);
    const [feeData, setFeeData] = useState<ChargeFeeData | null>(null);
    const [error, setError] = useState<string>('');

    const fetchChargeFee = async () => {
        if (!postId) return;
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`/api/manage/posts/charge-fee/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.status === "200 OK" && data.response) {
                setFeeData(data.response);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error("Error fetching charge fee:", error);
            setError("Không thể tải thông tin phí. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible && postId) {
            fetchChargeFee();
        }
    }, [isVisible, postId]);

    const getPriorityLevelLabel = (level: string) => {
        switch (level) {
            case 'DIAMOND':
                return 'Vip Kim Cương';
            case 'GOLD':
                return 'Vip Vàng';
            case 'SILVER':
                return 'Vip Bạc';
            case 'NORMAL':
                return 'Tin thường';
            default:
                return 'Tin thường';
        }
    };

    const getFee = () => {
        if (!feeData) return 0;
        return type === 'new' ? feeData.renewFee : feeData.reupFee;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleConfirm = () => {
        if (feeData) {
            onConfirm(feeData);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h3 className={styles.title}>                        
                        Thanh toán phí {type === 'renew' ? 'gia hạn' : type === 'up' ? 'đẩy tin' : 'đăng tin'}
                    </h3>
                    <button 
                        onClick={onCancel}
                        className={styles.closeButton}
                        disabled={confirmButtonLoading}
                    >
                        <Image 
                            src="/icons/X.svg" 
                            alt="Close" 
                            width={20} 
                            height={20} 
                        />
                    </button>
                </div>

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Đang tải thông tin phí...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.error}>
                            <Image 
                                src="/icons/AlertCircle.svg" 
                                alt="Error" 
                                width={24} 
                                height={24} 
                            />
                            <p>{error}</p>
                            <button 
                                onClick={fetchChargeFee}
                                className={styles.retryButton}
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : feeData ? (
                        <div className={styles.feeInfo}>
                            {postTitle && (
                                <div className={styles.postTitle}>
                                    <strong>Tin đăng:</strong> {postTitle}
                                </div>
                            )}
                            
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Loại tin:</span>
                                <span className={`${styles.priorityLevel} ${styles[`priority${feeData.priorityLevel}`]}`}>
                                    {getPriorityLevelLabel(feeData.priorityLevel)}
                                </span>
                            </div>
                            
                            <div className={styles.infoRow}>
                                <span className={styles.label}>
                                    {type === 'new' ? 'Phí đăng tin:' :  type === 'up' ? 'Phí đẩy tin:' : 'Phí gia hạn tin:'}
                                </span>
                                <span className={styles.fee}>
                                    {formatCurrency(getFee())}
                                </span>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className={styles.actions}>                    
                    <button 
                        onClick={handleConfirm}
                        className={styles.confirmButton}
                        disabled={loading || !!error || !feeData || confirmButtonLoading}
                    >
                        {confirmButtonLoading ? (
                            <>
                                <div className={styles.buttonSpinner}></div>
                                Đang xử lý...
                            </>
                        ) : (
                            'Thanh toán'
                        )}
                    </button>
                    <button 
                        onClick={onCancel}
                        className={styles.cancelButton}
                        disabled={confirmButtonLoading}
                    >
                        Huỷ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChargeFeePopup;