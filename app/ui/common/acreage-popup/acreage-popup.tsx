"use client";
import styles from "./acreage-popup.module.css";
import Form from "next/form";
import Image from "next/image";
import { useState } from "react";
import RangeSlider from "../range-slider/range-slider";

export default function AcreagePopup({onClose, setRangeMethod, currentMinAcreage, currentMaxAcreage}: any){
    // Initialize with current values if they exist, otherwise use default [30, 100]
    const initializeAcreageRange = () => {
        if (currentMinAcreage !== undefined && currentMaxAcreage !== undefined) {
            return [currentMinAcreage, currentMaxAcreage];
        }
        if (currentMinAcreage !== undefined) {
            return [currentMinAcreage, 1000]; // Default max if only min is set
        }
        if (currentMaxAcreage !== undefined) {
            return [0, currentMaxAcreage]; // Default min if only max is set
        }
        return [30, 100]; // Default range
    };

    const [acreageRange, setAcreageRange] = useState(initializeAcreageRange());
    
    const submit = () => {
        setRangeMethod(acreageRange);
        onClose();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    const formatAcreage = (value: number) => {
        return `${value} m²`;
    };

    const resetAcreageRange = () => {
        setAcreageRange([30, 100]);
    };

    return(
        <Form 
            action={submit} 
            className={styles.container}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-labelledby="acreage-popup-title"
            aria-modal="true"
        >
            <div className={styles.header}>
                <h2 id="acreage-popup-title" className={styles.title}>Diện tích</h2>
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
                {/* Acreage Range Display */}
                <div className={styles.acreageDisplay}>
                    <div className={styles.acreageInfo}>
                        <span className={styles.acreageLabel}>Khoảng diện tích đã chọn:</span>
                        <span className={styles.acreageValue}>
                            {formatAcreage(acreageRange[0])} - {formatAcreage(acreageRange[1])}
                        </span>
                    </div>
                    <button 
                        type="button"
                        onClick={resetAcreageRange}
                        className={styles.resetButton}
                        title="Đặt lại về mặc định"
                    >
                        Đặt lại
                    </button>
                </div>

                {/* Range Slider */}
                <div className={styles.sliderSection}>
                    <RangeSlider
                        key={`${acreageRange[0]}-${acreageRange[1]}`}
                        label="Diện tích (m²)"
                        min={0}
                        max={1000}
                        step={10}
                        defaultMin={acreageRange[0]}
                        defaultMax={acreageRange[1]}
                        onChange={setAcreageRange}
                        prefix=""
                        suffix="m²"
                        minLabel="Diện tích tối thiểu"
                        maxLabel="Diện tích tối đa"
                    />
                </div>

                {/* Quick Acreage Options */}
                <div className={styles.quickOptions}>
                    <div className={styles.quickOptionsTitle}>Lựa chọn nhanh:</div>
                    <div className={styles.quickButtons}>
                        <button 
                            type="button"
                            onClick={() => setAcreageRange([0, 30])}
                            className={styles.quickButton}
                        >
                            Dưới 30 m²
                        </button>
                        <button 
                            type="button"
                            onClick={() => setAcreageRange([30, 50])}
                            className={styles.quickButton}
                        >
                            30 - 50 m²
                        </button>
                        <button 
                            type="button"
                            onClick={() => setAcreageRange([50, 80])}
                            className={styles.quickButton}
                        >
                            50 - 80 m²
                        </button>
                        <button 
                            type="button"
                            onClick={() => setAcreageRange([80, 120])}
                            className={styles.quickButton}
                        >
                            80 - 120 m²
                        </button>
                        <button 
                            type="button"
                            onClick={() => setAcreageRange([120, 200])}
                            className={styles.quickButton}
                        >
                            120 - 200 m²
                        </button>
                        <button 
                            type="button"
                            onClick={() => setAcreageRange([200, 1000])}
                            className={styles.quickButton}
                        >
                            Trên 200 m²
                        </button>
                    </div>
                </div>
            </div>
            
            <div className={styles.footer}>
                <button 
                    type="submit" 
                    className={styles.btnApply}
                    aria-label={`Áp dụng khoảng diện tích từ ${formatAcreage(acreageRange[0])} đến ${formatAcreage(acreageRange[1])}`}
                >
                    Áp dụng ({formatAcreage(acreageRange[0])} - {formatAcreage(acreageRange[1])})
                </button>
            </div>
        </Form>
    );
}