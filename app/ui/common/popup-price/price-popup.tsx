"use client";
import styles from "./price-popup.module.css";
import Form from "next/form";
import Image from "next/image";
import { useState } from "react";
import RangeSlider from "../range-slider/range-slider";


export default function PricePopup({ onClose, setRangeMethod }: any) {
    const [priceRange, setPriceRange] = useState([3, 100]);
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