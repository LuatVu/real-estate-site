"use client";
import styles from "./price-popup.module.css";
import Form from "next/form";
import Image from "next/image";
import { useState } from "react";
import RangeSlider from "../range-slider/range-slider";


export default function PricePopup({ onClose, setRangeMethod, currentMinPrice, currentMaxPrice }: any) {
    // Initialize with current values if they exist, otherwise use default [3, 100]
    const initializePriceRange = () => {
        if (currentMinPrice !== undefined && currentMaxPrice !== undefined) {
            // Convert from actual values back to billions for display
            return [currentMinPrice / 1000000000, currentMaxPrice / 1000000000];
        }
        if (currentMinPrice !== undefined) {
            return [currentMinPrice / 1000000000, 100]; // Default max if only min is set
        }
        if (currentMaxPrice !== undefined) {
            return [3, currentMaxPrice / 1000000000]; // Default min if only max is set
        }
        return [3, 100]; // Default range
    };

    const [priceRange, setPriceRange] = useState(initializePriceRange());
    const submit = () => {
        // Multiply by 1,000,000,000 when applying the filter
        const filterRange = [priceRange[0] * 1000000000, priceRange[1] * 1000000000];
        setRangeMethod(filterRange);
        onClose();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    const formatPrice = (value: number) => {
        return `${value} tỷ`;
    };

    const resetPriceRange = () => {
        setPriceRange([3, 100]);
    };

    return (
        <Form 
            action={submit} 
            className={styles.container}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-labelledby="price-popup-title"
            aria-modal="true"
        >
            <div className={styles.header}>
                <h2 id="price-popup-title" className={styles.title}>Mức giá</h2>
                <button 
                    type="button"
                    onClick={onClose}
                    aria-label="Đóng popup"
                    title="Đóng popup"
                    className={styles.closeButton}
                >
                    <Image className={styles.xIcon} width={24} height={24} alt="Đóng" src="/icons/X.svg" />
                </button>
            </div>
            
            <div className={styles.bodyPopup}>
                {/* Price Range Display */}
                <div className={styles.priceDisplay}>
                    <div className={styles.priceInfo}>
                        <span className={styles.priceLabel}>Khoảng giá đã chọn:</span>
                        <span className={styles.priceValue}>
                            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                        </span>
                    </div>
                    <button 
                        type="button"
                        onClick={resetPriceRange}
                        className={styles.resetButton}
                        title="Đặt lại về mặc định"
                    >
                        Đặt lại
                    </button>
                </div>

                {/* Range Slider */}
                <div className={styles.sliderSection}>
                    <RangeSlider
                        label="Giá (Tỷ)"
                        min={0}
                        max={500}
                        step={1}
                        defaultMin={priceRange[0]}
                        defaultMax={priceRange[1]}
                        onChange={setPriceRange}
                        prefix=""
                        suffix="Tỷ"
                        minLabel="Giá tối thiểu"
                        maxLabel="Giá tối đa"
                    />
                </div>

                {/* Quick Price Options */}
                <div className={styles.quickOptions}>
                    <div className={styles.quickOptionsTitle}>Lựa chọn nhanh:</div>
                    <div className={styles.quickButtons}>
                        <button 
                            type="button"
                            onClick={() => setPriceRange([0, 5])}
                            className={styles.quickButton}
                        >
                            Dưới 5 tỷ
                        </button>
                        <button 
                            type="button"
                            onClick={() => setPriceRange([5, 10])}
                            className={styles.quickButton}
                        >
                            5 - 10 tỷ
                        </button>
                        <button 
                            type="button"
                            onClick={() => setPriceRange([10, 20])}
                            className={styles.quickButton}
                        >
                            10 - 20 tỷ
                        </button>
                        <button 
                            type="button"
                            onClick={() => setPriceRange([20, 50])}
                            className={styles.quickButton}
                        >
                            20 - 50 tỷ
                        </button>
                        <button 
                            type="button"
                            onClick={() => setPriceRange([50, 500])}
                            className={styles.quickButton}
                        >
                            Trên 50 tỷ
                        </button>
                    </div>
                </div>
            </div>
            
            <div className={styles.footer}>
                <button 
                    type="submit" 
                    className={styles.btnApply}
                    aria-label={`Áp dụng khoảng giá từ ${formatPrice(priceRange[0])} đến ${formatPrice(priceRange[1])}`}
                >
                    Áp dụng ({formatPrice(priceRange[0])} - {formatPrice(priceRange[1])})
                </button>
            </div>
        </Form>
    )
}