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
    }

    return (
        <Form action={submit} className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Mức giá</div>
                <button onClick={onClose}>
                    <Image className={styles.xIcon} width={24} height={24} alt="" src="/icons/X.svg" />
                </button>
            </div>
            <div className={styles.bodyPopup}>
                
                    
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
            <div className={styles.footer}>
                <button type="submit" className={styles.btnApply}>Áp dụng</button>
            </div>
        </Form>
    )
}