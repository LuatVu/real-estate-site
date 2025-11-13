"use client";
import styles from "./package-purchase-desktop-popup.module.css";
import Image from "next/image";
import { useState } from 'react';

interface PackagePurchaseDesktopPopupProps {
    onClose: () => void;
    packageData: {
        packageId: string;
        packageName: string;
        price: number;
        image: string;
    };
    userBalance: {
        mainBalance: number;
        promoBalance?: number;
    };
}

export default function PackagePurchaseDesktopPopup({ onClose, packageData, userBalance }: PackagePurchaseDesktopPopupProps) {
    const [selectedDuration, setSelectedDuration] = useState<number>(1);
    
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const getDurationOptions = () => {
        const basePrice = packageData.price;
        return [
            {
                duration: 1,
                label: '1 Tháng',
                price: basePrice,
                totalPrice: basePrice
            },
            {
                duration: 3,
                label: '3 Tháng',
                price: basePrice,
                discount: 0.95,
                totalPrice: basePrice * 3 * 0.95
            },
            {
                duration: 6,
                label: '6 Tháng',
                price: basePrice,
                discount: 0.9,
                totalPrice: basePrice * 6 * 0.9
            }
        ];
    };

    const durationOptions = getDurationOptions();
    const selectedOption = durationOptions.find(option => option.duration === selectedDuration);
    
    const isInsufficientBalance = userBalance.mainBalance < (selectedOption?.totalPrice || 0);

    const handlePayment = () => {
        // TODO: Implement payment logic
        console.log(`Processing payment for package: ${packageData.packageName}, Duration: ${selectedDuration} months, Total: ${selectedOption?.totalPrice}`);
        onClose();
    };

    return (
        <div className={styles.popupOverlay} onClick={onClose}>
            <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2 className={styles.title}>Đăng ký gói hội viên</h2>
                        <button 
                            onClick={onClose} 
                            className={styles.closeButton}
                            aria-label="Đóng popup"
                        >
                            <Image width={24} height={24} alt="Đóng" src="/icons/X.svg" />
                        </button>
                    </div>
                </div>

                <div className={styles.body}>
                    {/* Package Info */}
                    <div className={styles.packageInfo}>
                        <div className={styles.packageHeader}>
                            <Image
                                src={packageData.image}
                                alt={packageData.packageName}
                                width={48}
                                height={48}
                                className={styles.packageImage}
                            />
                            <div className={styles.packageDetails}>
                                <h3 className={styles.packageName}>{packageData.packageName}</h3>
                                <p className={styles.packagePrice}>
                                    {formatPrice(packageData.price)} VND/ tháng
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Duration Options */}
                    <div className={styles.durationSection}>
                        <h4 className={styles.sectionTitle}>Chọn thời hạn đăng ký:</h4>
                        <div className={styles.durationOptions}>
                            {durationOptions.map((option) => (
                                <div 
                                    key={option.duration}
                                    className={`${styles.durationOption} ${
                                        selectedDuration === option.duration ? styles.selected : ''
                                    }`}
                                    onClick={() => setSelectedDuration(option.duration)}
                                >
                                    <div className={styles.optionHeader}>
                                        <span className={styles.durationLabel}>{option.label}</span>
                                        {option.discount && (
                                            <span className={styles.discountBadge}>
                                                -{Math.round((1 - option.discount) * 100)}%
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.priceInfo}>
                                        <span className={styles.monthlyPrice}>
                                            {formatPrice(option.price)} VND/tháng
                                        </span>
                                        {option.discount && (
                                            <span className={styles.savings}>
                                                Tiết kiệm {formatPrice(option.price * option.duration - option.totalPrice)} VND
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.totalPrice}>
                                        Tổng: {formatPrice(option.totalPrice)} VND
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Cost Summary */}
                    <div className={styles.summary}>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Gói đã chọn:</span>
                            <span className={styles.summaryValue}>
                                {packageData.packageName} - {selectedOption?.label}
                            </span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Tổng tiền:</span>
                            <span className={styles.summaryTotal}>
                                {formatPrice(selectedOption?.totalPrice || 0)} VND
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    {isInsufficientBalance && (
                        <div className={styles.errorMessage}>
                            <p className={styles.errorText}>
                                Số dư tài khoản chính không đủ. Vui lòng nạp thêm tiền để tiếp tục.
                            </p>
                            <button 
                                className={styles.depositButton}
                                onClick={() => {
                                    // TODO: Navigate to deposit page
                                    console.log('Navigate to deposit page');
                                }}
                            >
                                Nạp tiền
                            </button>
                        </div>
                    )}
                    <button 
                        className={styles.paymentButton}
                        onClick={handlePayment}
                        disabled={isInsufficientBalance}
                    >
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
}