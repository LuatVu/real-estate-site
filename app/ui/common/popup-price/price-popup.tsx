"use client";
import styles from "./price-popup.module.css";
import Form from "next/form";
import Image from "next/image";
import { useState } from "react";
import RangeSlider from "../range-slider/range-slider";


export default function PricePopup({ onClose, setRangeMethod }: any) {
    const [priceRange, setPriceRange] = useState([25, 75]);
    const submit = () => {
        setRangeMethod(priceRange);
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
                        label="Giá (VNĐ)"
                        min={0}
                        max={100}
                        step={1}
                        defaultMin={priceRange[0]}
                        defaultMax={priceRange[1]}
                        onChange={setPriceRange}
                        prefix=""
                    />
                    
                
            </div>
            <div className={styles.footer}>
                <button type="submit" className={styles.btnApply}>Áp dụng</button>
            </div>

        </Form>
    )
}