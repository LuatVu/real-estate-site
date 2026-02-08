"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './index.module.css';

export interface PostChargeFeeData {
    postChargeFeeId: string;
    priorityLevel: 'DIAMOND' | 'GOLD' | 'SILVER' | 'NORMAL';
    reupFee: number;
    renewFee: number;
    status: number;
}

export interface PostData {
    postId: string;
    priorityLevel: 'DIAMOND' | 'GOLD' | 'SILVER' | 'NORMAL';
}

interface VipPackagePopupProps {
    isVisible: boolean;
    postId: string;
    postTitle?: string;
    onConfirm: (selectedPackage: PostChargeFeeData) => void;
    onCancel: () => void;
    confirmButtonLoading?: boolean;
}

const VipPackagePopup: React.FC<VipPackagePopupProps> = ({
    isVisible,
    postId,
    postTitle = '',
    onConfirm,
    onCancel,
    confirmButtonLoading = false
}) => {
    const [loading, setLoading] = useState(false);
    const [allPackages, setAllPackages] = useState<PostChargeFeeData[]>([]);
    const [currentPostData, setCurrentPostData] = useState<PostData | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<PostChargeFeeData | null>(null);
    const [error, setError] = useState<string>('');

    const fetchAllChargeFees = async () => {
        try {
            const response = await fetch('/api/manage/posts/all-charge-fee', {
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
                return data.response;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error("Error fetching all charge fees:", error);
            throw error;
        }
    };

    const fetchPostChargeFee = async () => {
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
                return {
                    postId,
                    priorityLevel: data.response.priorityLevel
                };
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error("Error fetching post charge fee:", error);
            throw error;
        }
    };

    const fetchData = async () => {
        if (!postId) return;
        
        setLoading(true);
        setError('');
        
        try {
            const [allPackagesData, postData] = await Promise.all([
                fetchAllChargeFees(),
                fetchPostChargeFee()
            ]);
            
            // Sort packages in the required order: DIAMOND, GOLD, SILVER, NORMAL
            const sortedPackages = allPackagesData.sort((a: PostChargeFeeData, b: PostChargeFeeData) => {
                const priorityOrder = { 'DIAMOND': 0, 'GOLD': 1, 'SILVER': 2, 'NORMAL': 3 };
                return priorityOrder[a.priorityLevel] - priorityOrder[b.priorityLevel];
            });

            setAllPackages(sortedPackages);
            setCurrentPostData(postData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Không thể tải thông tin gói VIP. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible && postId) {
            fetchData();
            setSelectedPackage(null); // Reset selection when popup opens
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handlePackageSelect = (pkg: PostChargeFeeData) => {
        setSelectedPackage(pkg);
    };

    const handleConfirm = () => {
        if (selectedPackage) {
            onConfirm(selectedPackage);
        }
    };

    const isPackageDisabled = (pkg: PostChargeFeeData) => {
        return currentPostData?.priorityLevel === pkg.priorityLevel;
    };

    const getPackagePrice = (pkg: PostChargeFeeData) => {
        if (!currentPostData) return 0;
        
        const priorityOrder = { 'DIAMOND': 3, 'GOLD': 2, 'SILVER': 1, 'NORMAL': 0 };
        const currentPriority = priorityOrder[currentPostData.priorityLevel];
        const targetPriority = priorityOrder[pkg.priorityLevel];
        
        // Only higher priorities have price > 0, others are 0
        return targetPriority > currentPriority ? pkg.renewFee : 0;
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Nâng/Hạ gói VIP</h3>
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
                            <p>Đang tải thông tin gói VIP...</p>
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
                                onClick={fetchData}
                                className={styles.retryButton}
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : allPackages.length > 0 && currentPostData ? (
                        <div className={styles.packageInfo}>
                            {postTitle && (
                                <div className={styles.postTitle}>
                                    <strong>Tin đăng:</strong> {postTitle}
                                </div>
                            )}
                            
                            <div className={styles.currentPackage}>
                                <span className={styles.label}>Gói hiện tại:</span>
                                <span className={`${styles.priorityLevel} ${styles[`priority${currentPostData.priorityLevel}`]}`}>
                                    {getPriorityLevelLabel(currentPostData.priorityLevel)}
                                </span>
                            </div>

                            <div className={styles.packageSelectionTitle}>
                                <strong>Chọn gói VIP mới:</strong>
                            </div>

                            <div className={styles.packageOptions}>
                                {allPackages.map((pkg) => {
                                    const isDisabled = isPackageDisabled(pkg);
                                    const price = getPackagePrice(pkg);
                                    
                                    return (
                                        <div 
                                            key={pkg.postChargeFeeId}
                                            className={`${styles.packageOption} ${isDisabled ? styles.disabled : ''} ${selectedPackage?.postChargeFeeId === pkg.postChargeFeeId ? styles.selected : ''}`}
                                            onClick={() => !isDisabled && handlePackageSelect(pkg)}
                                        >
                                            <div className={styles.radioContainer}>
                                                <input
                                                    type="radio"
                                                    name="vipPackage"
                                                    value={pkg.postChargeFeeId}
                                                    checked={selectedPackage?.postChargeFeeId === pkg.postChargeFeeId}
                                                    disabled={isDisabled}
                                                    onChange={() => handlePackageSelect(pkg)}
                                                    className={styles.radioInput}
                                                />
                                                <div className={styles.radioCircle}></div>
                                            </div>
                                            <div className={styles.packageDetails}>
                                                <div className={styles.packageName}>
                                                    <span className={`${styles.priorityLevel} ${styles[`priority${pkg.priorityLevel}`]}`}>
                                                        {getPriorityLevelLabel(pkg.priorityLevel)}
                                                    </span>
                                                    {isDisabled && (
                                                        <span className={styles.currentBadge}>
                                                            (Hiện tại)
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={styles.packagePrice}>
                                                    {formatCurrency(price)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className={styles.actions}>
                    <button 
                        onClick={handleConfirm}
                        className={styles.confirmButton}
                        disabled={loading || !!error || !selectedPackage || confirmButtonLoading}
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

export default VipPackagePopup;