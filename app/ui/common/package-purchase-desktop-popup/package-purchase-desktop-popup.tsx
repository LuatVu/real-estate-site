"use client";
import styles from "./package-purchase-desktop-popup.module.css";
import Image from "next/image";
import { useState } from 'react';
import Loading from "../loading";
import { useRouter } from "next/navigation";
import PortalPopup from "../portal-popup/portal-popup";

interface PackagePurchaseDesktopPopupProps {
    onClose: () => void;
    packageData: {
        packageId: string;
        packageName: string;
        price: number;
        discount: number;
        image: string;
    };
    userBalance: {
        mainBalance: number;
        promoBalance?: number;
    };
    session: any;
}

export default function PackagePurchaseDesktopPopup({ onClose, packageData, userBalance, session }: PackagePurchaseDesktopPopupProps) {
    const [selectedDuration, setSelectedDuration] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showFailurePopup, setShowFailurePopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const registerPackage = async () => {
        setIsLoading(true);
        try {
            const userId = session?.user?.id;
            const response = await fetch(`/api/packages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    packageId: packageData.packageId,
                    months: selectedDuration,
                    paymentAmount: totalPrice
                })
            });
            const res = await response.json();
            if (response.ok) {
                setShowSuccessPopup(true);
            } else {
                setErrorMessage(res.message || 'Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
                setShowFailurePopup(true);
            }
        } catch (error) {
            setErrorMessage('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
            setShowFailurePopup(true);
        } finally {
            setIsLoading(false);
        }
    };

    const getDurationOptions = () => {
        const basePrice = packageData.price;
        const discount = packageData.discount;
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
                discount: 1 - discount * 2,
                totalPrice: basePrice * 3 * (1 - discount * 2)
            },
            {
                duration: 6,
                label: '6 Tháng',
                price: basePrice,
                discount: 1.0 - discount * 5,
                totalPrice: basePrice * 6 * (1.0 - discount * 5)
            }
        ];
    };

    const durationOptions = getDurationOptions();
    const selectedOption = durationOptions.find(option => option.duration === selectedDuration);

    const isInsufficientBalance = userBalance.mainBalance < (selectedOption?.totalPrice || 0);

    const handlePayment = () => {
        registerPackage();
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
                                    onClick={() => {
                                        setSelectedDuration(option.duration);
                                        setTotalPrice(option.totalPrice);
                                    }}
                                >
                                    <div className={styles.optionHeader}>
                                        <span className={styles.durationLabel}>{option.label}</span>
                                        {option.discount && (
                                            <span className={styles.discountBadge}>
                                                -{((1 - option.discount) * 100).toFixed(1)}%
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
                                {packageData.packageName}  {selectedOption?.label}
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
                                    router.push(`/deposit/${session.user?.id}`);
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
            {isLoading && (
                <Loading
                    fullScreen
                    size="large"
                    message="Đang thanh toán..."
                />
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <PortalPopup
                    overlayColor="rgba(113, 113, 113, 0.3)"
                    placement="Centered"
                    zIndex={1100}
                >
                    <div style={{
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        padding: '24px',
                        maxWidth: '320px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ color: '#22c55e', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                                Thanh toán thành công!
                            </h3>
                            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                                Gói hội viên đã được kích hoạt thành công.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <button
                                onClick={() => {
                                    setShowSuccessPopup(false);
                                    onClose();
                                    router.push(`/account/${session.user?.id}`);
                                }}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Đi tới tài khoản
                            </button>                            
                        </div>
                    </div>
                </PortalPopup>
            )}

            {/* Failure Popup */}
            {showFailurePopup && (
                <PortalPopup
                    overlayColor="rgba(113, 113, 113, 0.3)"
                    placement="Centered"
                    zIndex={1100}
                >
                    <div style={{
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        padding: '24px',
                        maxWidth: '320px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ color: '#ef4444', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                                Thanh toán thất bại!
                            </h3>
                            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                                {errorMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowFailurePopup(false)}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </PortalPopup>
            )}
        </div>
    );
}